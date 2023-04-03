﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreAPI.Models;
using StoreAPI.Validators;

namespace StoreAPI.Controllers
{
    [Route("api/StoreEmployees")]
    [ApiController]
    public class StoreEmployeesController : ControllerBase
    {
        private readonly StoreContext _context;
        private readonly StoreEmployeeValidator _validator;

        public StoreEmployeesController(StoreContext context)
        {
            _context = context;
            _validator = new StoreEmployeeValidator();
        }

        // GET: api/StoreEmployees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreEmployee>>> GetStoreEmployee()
        {
            if (_context.StoreEmployees == null)
                return NotFound();

            return await _context.StoreEmployees
                .Include(x => x.StoreEmployeeRole)
                .ToListAsync();
        }

        // GET: api/StoreEmployees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StoreEmployee>> GetStoreEmployee(long id)
        {
            if (_context.StoreEmployees == null)
                return NotFound();
            
            var storeEmployee = await _context.StoreEmployees
                .Include(x => x.StoreEmployeeRole)
                .Include(x => x.StoreShifts)
                .ThenInclude(x => x.Store)
                .FirstOrDefaultAsync(x => x.Id == id);
                //.FindAsync(id);
            if (storeEmployee == null)
                return NotFound();

            return storeEmployee;
        }

        // PUT: api/StoreEmployees/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStoreEmployee(long id, StoreEmployeeDTO employeeDTO)
        {
            if (id != employeeDTO.Id)
                return BadRequest();

            var storeEmployee = await _context.StoreEmployees.FindAsync(id);
            if (storeEmployee == null)
                return NotFound();

            // validate the store employee
            string validationResult = _validator.Validate(employeeDTO);
            if (validationResult != string.Empty)
                return BadRequest(validationResult);

            // search for the role id and return BadRequest if it is invalid
            var storeEmployeeRole = await _context.StoreEmployeeRoles.FindAsync(employeeDTO.StoreEmployeeRoleId);
            if (storeEmployeeRole == null)
                return BadRequest();

            storeEmployee.FirstName = employeeDTO.FirstName;
            storeEmployee.LastName = employeeDTO.LastName;

            storeEmployee.Gender = employeeDTO.Gender;

            storeEmployee.EmploymentDate = employeeDTO.EmploymentDate;
            storeEmployee.TerminationDate = employeeDTO.TerminationDate;
            storeEmployee.Salary = employeeDTO.Salary;

            storeEmployee.StoreEmployeeRoleId = employeeDTO.StoreEmployeeRoleId;
            storeEmployee.StoreEmployeeRole = storeEmployeeRole;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!StoreEmployeeExists(id))
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/StoreEmployees
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<StoreEmployeeDTO>> PostStoreEmployee(StoreEmployeeDTO employeeDTO)
        {
            if (_context.StoreEmployees == null)
                return Problem("Entity set 'StoreContext.StoreEmployees' is null.");

            // validate the store employee
            string validationResult = _validator.Validate(employeeDTO);
            if (validationResult != string.Empty)
                return BadRequest(validationResult);

            // search for the role id and return BadRequest if it is invalid
            var storeEmployeeRole = await _context.StoreEmployeeRoles.FindAsync(employeeDTO.StoreEmployeeRoleId);
            if (storeEmployeeRole == null)
                return BadRequest();

            var storeEmployee = new StoreEmployee
            {
                FirstName = employeeDTO.FirstName,
                LastName = employeeDTO.LastName,

                Gender = employeeDTO.Gender,

                EmploymentDate = employeeDTO.EmploymentDate,
                TerminationDate = employeeDTO.TerminationDate,
                Salary = employeeDTO.Salary,

                StoreEmployeeRoleId = employeeDTO.StoreEmployeeRoleId,
                StoreEmployeeRole = storeEmployeeRole,
            };

            _context.StoreEmployees.Add(storeEmployee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetStoreEmployee),
                new { id = employeeDTO.Id },
                EmployeeToDTO(storeEmployee));
        }

        // DELETE: api/StoreEmployees/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStoreEmployee(long id)
        {
            if (_context.StoreEmployees == null)
                return NotFound();
            
            var storeEmployee = await _context.StoreEmployees.FindAsync(id);
            if (storeEmployee == null)
                return NotFound();

            _context.StoreEmployees.Remove(storeEmployee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // FILTER: api/StoreItems/Filter?minSalary=3000
        [HttpGet("Filter")]
        public async Task<ActionResult<IEnumerable<StoreEmployeeDTO>>> FilterStoreEmployees(double minSalary)
        {
            if (_context.StoreEmployees == null)
                return NotFound();

            return await _context.StoreEmployees
                .Where(x => x.Salary >= minSalary)
                .Select(x => EmployeeToDTO(x))
                .ToListAsync();
        }

        private bool StoreEmployeeExists(long id)
        {
            return _context.StoreEmployees.Any(e => e.Id == id);
        }

        private static StoreEmployeeDTO EmployeeToDTO(StoreEmployee employee)
        {
            return new StoreEmployeeDTO
            {
                Id = employee.Id,
                FirstName = employee.FirstName,
                LastName = employee.LastName,

                Gender = employee.Gender,

                EmploymentDate = employee.EmploymentDate,
                TerminationDate = employee.TerminationDate,
                Salary = employee.Salary,

                StoreEmployeeRoleId = employee.StoreEmployeeRoleId,
            };
        }
    }
}
