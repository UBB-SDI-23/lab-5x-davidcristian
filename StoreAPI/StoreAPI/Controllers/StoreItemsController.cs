using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreAPI.Models;

namespace StoreAPI.Controllers
{
    [Route("api/StoreItems")]
    [ApiController]
    public class StoreItemsController : ControllerBase
    {
        private readonly StoreContext _context;

        public StoreItemsController(StoreContext context)
        {
            _context = context;
        }

        // GET: api/StoreItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreItemDTO>>> GetStoreItems()
        {
            if (_context.StoreItems == null)
                return NotFound();

            return await _context.StoreItems
                .Select(x => ItemToDTO(x))
                .ToListAsync();
        }

        // GET: api/StoreItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StoreItem>> GetStoreItem(long id)
        {
            if (_context.StoreItems == null)
                return NotFound();
            
            var storeItem = await _context.StoreItems
                .Include(x => x.StoreItemCategory)
                .FirstOrDefaultAsync(x => x.Id == id);
                //.FindAsync(id);
            if (storeItem == null)
                return NotFound();

            return storeItem;
        }

        // PUT: api/StoreItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStoreItem(long id, StoreItemDTO itemDTO)
        {
            if (id != itemDTO.Id)
                return BadRequest();

            var storeItem = await _context.StoreItems.FindAsync(id);
            if (storeItem == null)
                return NotFound();

            // search for the category id and return BadRequest if it is invalid
            var storeItemCategory = await _context.StoreItemCategories.FindAsync(itemDTO.StoreItemCategoryId);
            if (storeItemCategory == null)
                return BadRequest();

            storeItem.Name = itemDTO.Name;
            storeItem.Description = itemDTO.Description;
            storeItem.Image = itemDTO.Image;

            storeItem.Price = itemDTO.Price;
            storeItem.Stock = itemDTO.Stock;
            storeItem.FavoriteCount = itemDTO.FavoriteCount;

            storeItem.StoreItemCategoryId = itemDTO.StoreItemCategoryId;
            storeItem.StoreItemCategory = storeItemCategory;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!StoreItemExists(id))
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/StoreItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<StoreItemDTO>> PostStoreItem(StoreItemDTO itemDTO)
        {
            if (_context.StoreItems == null)
                return Problem("Entity set 'StoreContext.StoreItems' is null.");

            // search for the category id and return BadRequest if it is invalid
            var storeItemCategory = await _context.StoreItemCategories.FindAsync(itemDTO.StoreItemCategoryId);
            if (storeItemCategory == null)
                return BadRequest();

            var storeItem = new StoreItem
            {
                Name = itemDTO.Name,
                Description = itemDTO.Description,
                Image = itemDTO.Image,

                Price = itemDTO.Price,
                Stock = itemDTO.Stock,
                FavoriteCount = itemDTO.FavoriteCount,

                StoreItemCategoryId = itemDTO.StoreItemCategoryId,
                StoreItemCategory = storeItemCategory,
            };

            _context.StoreItems.Add(storeItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetStoreItem),
                new { id = storeItem.Id },
                ItemToDTO(storeItem));
        }

        // DELETE: api/StoreItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStoreItem(long id)
        {
            if (_context.StoreItems == null)
                return NotFound();
            
            var storeItem = await _context.StoreItems.FindAsync(id);
            if (storeItem == null)
                return NotFound();

            _context.StoreItems.Remove(storeItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // FILTER: api/StoreItems/Filter?minPrice=5
        [HttpGet("Filter")]
        public async Task<ActionResult<IEnumerable<StoreItemDTO>>> FilterStoreItems(double minPrice)
        {
            if (_context.StoreItems == null)
                return NotFound();

            return await _context.StoreItems
                .Where(x => x.Price >= minPrice)
                .Select(x => ItemToDTO(x))
                .ToListAsync();
        }

        private bool StoreItemExists(long id) 
        {
            return _context.StoreItems.Any(e => e.Id == id);
        }

        private static StoreItemDTO ItemToDTO(StoreItem storeItem)
        {
            return new StoreItemDTO
            {
                Id = storeItem.Id,
                Name = storeItem.Name,
                Description = storeItem.Description,
                Image = storeItem.Image,

                Price = storeItem.Price,
                Stock = storeItem.Stock,
                FavoriteCount = storeItem.FavoriteCount,

                StoreItemCategoryId = storeItem.StoreItemCategoryId,
            };
        }
    }
}
