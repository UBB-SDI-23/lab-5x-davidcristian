﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NuGet.Common;
using StoreAPI.Models;
using StoreAPI.Validators;

namespace StoreAPI.Controllers
{
    [Route("api/Users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly StoreContext _context;
        private readonly JwtSettings _jwtSettings;
        private readonly UserValidator _validator;

        public UsersController(StoreContext context, IOptions<JwtSettings> jwtSettings)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;
            _validator = new UserValidator();
        }

        // POST: api/Users/register
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<dynamic>> Register(UserRegisterDTO userRegisterDTO)
        {
            // Validate the employee role
            var validationResult = _validator.ValidateRegister(userRegisterDTO);
            if (validationResult != string.Empty)
                return BadRequest(validationResult);

            if (await _context.Users.AnyAsync(u => u.Name == userRegisterDTO.Name))
                return BadRequest("Username already exists");

            var user = new User
            {
                Name = userRegisterDTO.Name,
                Password = HashPassword(userRegisterDTO.Password!),

                UserProfile = new UserProfile
                {
                    Bio = userRegisterDTO.Bio,
                    Location = userRegisterDTO.Location,
                    Birthday = userRegisterDTO.Birthday,
                    Gender = userRegisterDTO.Gender,
                    MaritalStatus = userRegisterDTO.MaritalStatus
                }
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userDTO = UserToDTO(user);
            userDTO.Password = null;

            var token = GenerateConfirmationToken(user);

            return new
            {
                user = userDTO,
                token
            };
        }

        // POST: api/Users/register/confirm
        [HttpPost("register/confirm/{token}")]
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmAccount(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);

            try
            {
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                SecurityToken validatedToken;
                var claimsPrincipal = tokenHandler.ValidateToken(token, tokenValidationParameters, out validatedToken);

                if (claimsPrincipal.HasClaim(c => c.Type == ClaimTypes.Role && c.Value == "Confirm"))
                {
                    var userId = long.Parse(claimsPrincipal.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty);
                    var user = await _context.Users.FindAsync(userId);

                    if (user != null && user.AccessLevel == 0)
                    {
                        user.AccessLevel = 1;
                        await _context.SaveChangesAsync();

                        return Ok("Account successfully confirmed.");
                    }
                }
            }
            catch (SecurityTokenException)
            {
                return BadRequest("Invalid confirmation token.");
            }

            return BadRequest("Unable to confirm the account.");
        }

        // POST: api/Users/login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<dynamic>> Login(UserDTO userDTO)
        {
            if (userDTO.Name == null || userDTO.Password == null)
                return BadRequest();

            var hashedPassword = HashPassword(userDTO.Password);
            List<string> possiblePasswords = new()
            {
                hashedPassword,
                hashedPassword + "\r" // TODO: Fix this happening when generating the data
            };

            var user = await _context.Users
                .SingleOrDefaultAsync(u => u.Name == userDTO.Name && u.Password != null && possiblePasswords.Contains(u.Password));
            if (user == null)
                return Unauthorized("Invalid username or password");

            // Check if user is confirmed
            if (user.AccessLevel == 0)
                return Unauthorized("User is not confirmed");

            var token = GenerateJwtToken(user);
            userDTO.Id = user.Id;
            userDTO.Password = null;

            return new
            {
                user = userDTO,
                token
            };
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateConfirmationToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, "Confirm")
                }),
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // GET: api/Users/count/10
        [HttpGet("count/{pageSize}")]
        public async Task<int> GetTotalNumberOfPages(int pageSize = 10)
        {
            int total = await _context.Users.CountAsync();
            int totalPages = total / pageSize;
            if (total % pageSize > 0)
                totalPages++;

            return totalPages;
        }

        // GET: api/Users/0/10
        [HttpGet("{page}/{pageSize}")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers(int page = 0, int pageSize = 10)
        {
            if (_context.StoreEmployeeRoles == null)
                return NotFound();

            return await _context.Users
                .Include(x => x.UserProfile)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            if (_context.Users == null)
                return NotFound();

            return await _context.Users
                .Select(x => UserToDTO(x))
                .ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserProfileDTO>> GetUser(long id)
        {
            if (_context.Users == null)
                return NotFound();

            var user = await _context.Users
                .Include(x => x.UserProfile)
                .FirstOrDefaultAsync(x => x.Id == id);
                //.FindAsync(id);
            if (user == null)
                return NotFound();

            int roleCount = await _context.StoreEmployeeRoles
                .Where(x => x.UserId == id)
                .CountAsync();

            int employeeCount = await _context.StoreEmployees
                .Where(x => x.UserId == id)
                .CountAsync();

            int storeCount = await _context.Stores
                .Where(x => x.UserId == id)
                .CountAsync();

            int shiftCount = await _context.StoreShifts
                .Where(x => x.UserId == id)
                .CountAsync();

            var userProfileDTO = new UserProfileDTO
            {
                Id = user.Id,
                Name = user.Name,
                Password = null,

                UserProfile = user.UserProfile,

                RoleCount = roleCount,
                EmployeeCount = employeeCount,
                StoreCount = storeCount,
                ShiftCount = shiftCount
            };

            return userProfileDTO;
        }

        // GET: api/Users/search?query=johndoe
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> SearchUsers(string query)
        {
            if (_context.Users == null)
                return NotFound();

            if (query.Length < 3)
                return NotFound();

            return await _context.Users
                .Where(x => x.Name != null && x.Name.ToLower().Contains(query.ToLower()))
                .Select(x => UserToDTO(x))
                .Take(100)
                .ToListAsync();
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(long id, UserDTO userDTO)
        {
            if (id != userDTO.Id)
                return BadRequest();

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            user.Name = userDTO.Name;
            user.Password = userDTO.Password;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!UserExists(id))
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserDTO>> PostUser(UserDTO userDTO)
        {
            if (_context.Users == null)
                return Problem("Entity set 'StoreContext.Users' is null.");
            
            var user = new User
            {
                Name = userDTO.Name,
                Password = userDTO.Password,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser),
                new { id = user.Id },
                UserToDTO(user));
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(long id)
        {
            if (_context.Users == null)
                return NotFound();

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(long id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        private static UserDTO UserToDTO(User user)
        {
            return new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Password = user.Password,
            };
        }
    }
}
