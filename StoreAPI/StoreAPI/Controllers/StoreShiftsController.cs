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
    [Route("api/StoreShifts")]
    [ApiController]
    public class StoreShiftsController : ControllerBase
    {
        private readonly StoreContext _context;

        public StoreShiftsController(StoreContext context)
        {
            _context = context;
        }

        // GET: api/StoreShifts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreShiftDTO>>> GetStoreShift()
        {
            if (_context.StoreShifts == null)
                return NotFound();
            
            return await _context.StoreShifts
                .Select(x => ShiftToDTO(x))
                .ToListAsync();
        }

        // GET: api/StoreShifts/5/6
        [HttpGet("{sid}/{eid}")]
        public async Task<ActionResult<StoreShift>> GetStoreShift(long sid, long eid)
        {
            if (_context.StoreShifts == null)
                return NotFound();
            
            var storeShift = await _context.StoreShifts
                .Include(x => x.Store)
                .Include(x => x.StoreEmployee)
                .FirstOrDefaultAsync(x => x.StoreId == sid && x.StoreEmployeeId == eid);

            if (storeShift == null)
                return NotFound();

            return storeShift;
        }

        // PUT: api/StoreShifts/5/6
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{sid}/{eid}")]
        public async Task<IActionResult> PutStoreShift(long sid, long eid, StoreShiftDTO shiftDTO)
        {
            if (sid != shiftDTO.StoreId || eid != shiftDTO.StoreEmployeeId)
                return BadRequest();

            var storeShift = await _context.StoreShifts.FindAsync(sid, eid);
            if (storeShift == null)
                return NotFound();

            // search for the store and employee
            var store = await _context.Stores.FindAsync(sid);
            if (store == null)
                return BadRequest();

            var employee = await _context.StoreEmployees.FindAsync(eid);
            if (employee == null)
                return BadRequest();

            storeShift.StartDate = shiftDTO.StartDate;
            storeShift.EndDate = shiftDTO.EndDate;

            storeShift.StoreId = shiftDTO.StoreId;
            storeShift.Store = store;

            storeShift.StoreEmployeeId = shiftDTO.StoreEmployeeId;
            storeShift.StoreEmployee = employee;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!StoreShiftExists(sid, eid))
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/StoreShifts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<StoreShiftDTO>> PostStoreShift(StoreShiftDTO shiftDTO)
        {
            if (_context.StoreShifts == null)
                return Problem("Entity set 'StoreContext.StoreShift' is null.");

            // search for the store and employee
            var store = await _context.Stores.FindAsync(shiftDTO.StoreId);
            if (store == null)
                return BadRequest();

            var employee = await _context.StoreEmployees.FindAsync(shiftDTO.StoreEmployeeId);
            if (employee == null)
                return BadRequest();

            var storeShift = new StoreShift
            {
                StartDate = shiftDTO.StartDate,
                EndDate = shiftDTO.EndDate,

                StoreId = shiftDTO.StoreId,
                Store = store,
                
                StoreEmployeeId = shiftDTO.StoreEmployeeId,
                StoreEmployee = employee,
            };

            _context.StoreShifts.Add(storeShift);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException) when (StoreShiftExists(storeShift.StoreId, storeShift.StoreEmployeeId))
            {
                return Conflict();
            }

            return CreatedAtAction(
                nameof(GetStoreShift),
                new { StoreId = store.Id, StoreEmployeeId = employee.Id },
                storeShift);
        }

        // DELETE: api/StoreShifts/5/6
        [HttpDelete("{sid}/{eid}")]
        public async Task<IActionResult> DeleteStoreShift(long sid, long eid)
        {
            if (_context.StoreShifts == null)
                return NotFound();
            
            var storeShift = await _context.StoreShifts
                .Include(x => x.Store)
                .Include(x => x.StoreEmployee)
                .FirstOrDefaultAsync(x => x.StoreId == sid && x.StoreEmployeeId == eid);

            if (storeShift == null)
                return NotFound();

            _context.StoreShifts.Remove(storeShift);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StoreShiftExists(long sid, long eid)
        {
            return _context.StoreShifts.Any(e => e.StoreId == sid && e.StoreEmployeeId == eid);
        }

        private static StoreShiftDTO ShiftToDTO(StoreShift shift)
        {
            return new StoreShiftDTO
            {
                StartDate = shift.StartDate,
                EndDate = shift.EndDate,
                StoreId = shift.StoreId,
                StoreEmployeeId = shift.StoreEmployeeId,
            };
        }
    }
}
