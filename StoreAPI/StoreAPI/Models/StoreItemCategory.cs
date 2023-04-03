using Newtonsoft.Json;

namespace StoreAPI.Models
{
    public class StoreItemCategory
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }

        // Hidden from the API because it's not in the DTO
        public virtual ICollection<StoreItem> StoreItems { get; set; } = null!;
    }
}
