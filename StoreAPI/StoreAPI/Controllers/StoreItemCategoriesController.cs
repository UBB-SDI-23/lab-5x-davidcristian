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
    [Route("api/StoreItemCategories")]
    [ApiController]
    public class StoreItemCategoriesController : ControllerBase
    {
        private readonly StoreContext _context;

        public StoreItemCategoriesController(StoreContext context)
        {
            _context = context;
        }

        // GET: api/StoreItemCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreItemCategoryDTO>>> GetStoreItemCategories()
        {
            if (_context.StoreItemCategories == null)
                return NotFound();

            return await _context.StoreItemCategories
                .Select(x => ItemCategoryToDTO(x))
                .ToListAsync();
        }

        // GET: api/StoreItemCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StoreItemCategory>> GetStoreItemCategory(long id)
        {
            if (_context.StoreItemCategories == null)
                return NotFound();
           
            var itemCategory = await _context.StoreItemCategories
                .Include(x => x.StoreItems)
                .FirstOrDefaultAsync(x => x.Id == id);
                //.FindAsync(id);
            if (itemCategory == null)
                return NotFound();

            return itemCategory;
        }

        // PUT: api/StoreItemCategories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStoreItemCategory(long id, StoreItemCategoryDTO itemCategoryDTO)
        {
            if (id != itemCategoryDTO.Id)
                return BadRequest();

            var itemCategory = await _context.StoreItemCategories.FindAsync(id);
            if (itemCategory == null)
                return NotFound();

            itemCategory.Name = itemCategoryDTO.Name;
            itemCategory.Description = itemCategoryDTO.Description;
            // The store items are not updated here, because
            // the relationship remains unaffected

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!StoreItemCategoryExists(id))
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/StoreItemCategories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<StoreItemCategoryDTO>> PostStoreItemCategory(StoreItemCategoryDTO itemCategoryDTO)
        {
            if (_context.StoreItemCategories == null)
                return Problem("Entity set 'StoreContext.StoreItemCategories' is null.");

            var itemCategory = new StoreItemCategory
            {
                Name = itemCategoryDTO.Name,
                Description = itemCategoryDTO.Description,
                StoreItems = null!
            };

            _context.StoreItemCategories.Add(itemCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetStoreItemCategory),
                new { id = itemCategory.Id },
                ItemCategoryToDTO(itemCategory));
        }

        // DELETE: api/StoreItemCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStoreItemCategory(long id)
        {
            if (_context.StoreItemCategories == null)
                return NotFound();

            var itemCategory = await _context.StoreItemCategories.FindAsync(id);
            if (itemCategory == null)
                return NotFound();

            _context.StoreItemCategories.Remove(itemCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/StoreItemCategories/5/StoreItems
        [HttpPost("{id}/StoreItems")]
        public async Task<IActionResult> PostStoreItemsToCategory(long id, List<StoreItemDTO> storeItemsDTO)
        {
            if (_context.StoreItemCategories == null)
                return NotFound();

            var itemCategory = await _context.StoreItemCategories.FindAsync(id);
            if (itemCategory == null)
                return NotFound();
            
            foreach (var itemDTO in storeItemsDTO)
            {
                var storeItem = new StoreItem
                {
                    Name = itemDTO.Name,
                    Description = itemDTO.Description,
                    Image = itemDTO.Image,

                    Price = itemDTO.Price,
                    Stock = itemDTO.Stock,
                    FavoriteCount = itemDTO.FavoriteCount,

                    StoreItemCategoryId = id,
                };

                _context.StoreItems.Add(storeItem);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: api/StoreItemCategories/5/StoreItems
        [HttpPut("{id}/StoreItems")]
        public async Task<IActionResult> PutStoreItemsToCategory(long id, [FromBody]List<long> storeItemIds)
        {
            if (_context.StoreItemCategories == null)
                return NotFound();

            if (storeItemIds.Distinct().Count() != storeItemIds.Count())
                return BadRequest();

            var itemCategory = await _context.StoreItemCategories
                .Include(x => x.StoreItems)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (itemCategory == null)
                return NotFound();
            
            var storeItems = await _context.StoreItems
                .Where(x => storeItemIds.Contains(x.Id))
                .ToListAsync();
            if (storeItems.Count != storeItemIds.Count)
                return BadRequest();
            
            itemCategory.StoreItems.Clear();
            itemCategory.StoreItems = storeItems;
            
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool StoreItemCategoryExists(long id)
        {
            return _context.StoreItemCategories.Any(e => e.Id == id);
        }

        private static StoreItemCategoryDTO ItemCategoryToDTO(StoreItemCategory itemCategory)
        {
            return new StoreItemCategoryDTO
            {
                Id = itemCategory.Id,
                Name = itemCategory.Name,
                Description = itemCategory.Description,
            };
        }
    }
}
