﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreAPI.Models;

namespace StoreAPI.Controllers
{
    [Route("api/StoreEmployeeRoles")]
    [ApiController]
    public class StoreEmployeeRolesController : ControllerBase
    {
        private readonly StoreContext _context;

        public StoreEmployeeRolesController(StoreContext context)
        {
            _context = context;
        }

        // GET: api/StoreEmployeeRoles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreEmployeeRoleDTO>>> GetStoreEmployeeRoles()
        {
            if (_context.StoreEmployeeRoles == null)
                return NotFound();

            return await _context.StoreEmployeeRoles
                .Select(x => EmployeeRoleToDTO(x))
                .ToListAsync();
        }

        // GET: api/StoreEmployeeRoles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StoreEmployeeRole>> GetStoreEmployeeRole(long id)
        {
            if (_context.StoreEmployeeRoles == null)
                return NotFound();

            var employeeRole = await _context.StoreEmployeeRoles
                .Include(x => x.StoreEmployees)
                .FirstOrDefaultAsync(x => x.Id == id);
                //.FindAsync(id);
            if (employeeRole == null)
                return NotFound();

            return employeeRole;
        }

        // PUT: api/StoreEmployeeRoles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStoreEmployeeRole(long id, StoreEmployeeRoleDTO employeeRoleDTO)
        {
            if (id != employeeRoleDTO.Id)
                return BadRequest();

            var employeeRole = await _context.StoreEmployeeRoles.FindAsync(id);
            if (employeeRole == null)
                return NotFound();

            employeeRole.Name = employeeRoleDTO.Name;
            employeeRole.Description = employeeRoleDTO.Description;
            employeeRole.RoleLevel = employeeRoleDTO.RoleLevel;
            // The employees are not updated here, because
            // the relationship remains unaffected

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!StoreEmployeeRoleExists(id))
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/StoreEmployeeRoles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<StoreEmployeeRoleDTO>> PostStoreEmployeeRole(StoreEmployeeRoleDTO employeeRoleDTO)
        {
            if (_context.StoreEmployeeRoles == null)
                return Problem("Entity set 'StoreContext.StoreEmployeeRoles' is null.");

            var employeeRole = new StoreEmployeeRole
            {
                Name = employeeRoleDTO.Name,
                Description = employeeRoleDTO.Description,

                RoleLevel = employeeRoleDTO.RoleLevel,
                StoreEmployees = null!,
            };

            _context.StoreEmployeeRoles.Add(employeeRole);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetStoreEmployeeRole),
                new { id = employeeRole.Id },
                EmployeeRoleToDTO(employeeRole));
        }

        // DELETE: api/StoreEmployeeRoles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStoreEmployeeRole(long id)
        {
            if (_context.StoreEmployeeRoles == null)
                return NotFound();

            var employeeRole = await _context.StoreEmployeeRoles.FindAsync(id);
            if (employeeRole == null)
                return NotFound();

            _context.StoreEmployeeRoles.Remove(employeeRole);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/StoreEmployeeRoles/5/StoreEmployees
        [HttpPost("{id}/StoreEmployees")]
        public async Task<IActionResult> PostStoreEmployeesToRole(long id, List<StoreEmployeeDTO> storeEmployeesDTO)
        {
            if (_context.StoreEmployeeRoles == null)
                return NotFound();

            var employeeRole = await _context.StoreEmployeeRoles.FindAsync(id);
            if (employeeRole == null)
                return NotFound();

            foreach (var employeeDTO in storeEmployeesDTO)
            {
                var storeEmployee = new StoreEmployee
                {
                    FirstName = employeeDTO.FirstName,
                    LastName = employeeDTO.LastName,

                    Gender = employeeDTO.Gender,

                    EmploymentDate = employeeDTO.EmploymentDate,
                    TerminationDate = employeeDTO.TerminationDate,
                    Salary = employeeDTO.Salary,

                    StoreEmployeeRoleId = id,
                };

                _context.StoreEmployees.Add(storeEmployee);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: api/StoreEmployeeRoles/5/StoreEmployees
        [HttpPut("{id}/StoreEmployees")]
        public async Task<IActionResult> PutStoreItemsToCategory(long id, [FromBody] List<long> storeEmployeeIds)
        {
            if (_context.StoreEmployeeRoles == null)
                return NotFound();

            if (storeEmployeeIds.Distinct().Count() != storeEmployeeIds.Count())
                return BadRequest();

            var employeeRole = await _context.StoreEmployeeRoles
                .Include(x => x.StoreEmployees)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (employeeRole == null)
                return NotFound();

            var storeEmployees = await _context.StoreEmployees
                .Where(x => storeEmployeeIds.Contains(x.Id))
                .ToListAsync();
            if (storeEmployees.Count != storeEmployeeIds.Count)
                return BadRequest();

            employeeRole.StoreEmployees.Clear();
            employeeRole.StoreEmployees = storeEmployees;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool StoreEmployeeRoleExists(long id)
        {
            return _context.StoreEmployeeRoles.Any(e => e.Id == id);
        }

        private static StoreEmployeeRoleDTO EmployeeRoleToDTO(StoreEmployeeRole employeeRole)
        {
            return new StoreEmployeeRoleDTO
            {
                Id = employeeRole.Id,
                Name = employeeRole.Name,
                Description = employeeRole.Description,

                RoleLevel = employeeRole.RoleLevel,
            };
        }
    }
}
