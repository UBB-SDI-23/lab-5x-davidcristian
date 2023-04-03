namespace StoreAPI.Models
{
    public class StoreItem
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }

        public double Price { get; set; }
        public long Stock { get; set; }
        public long FavoriteCount { get; set; }

        public long? StoreItemCategoryId { get; set; }

        // Hidden from the API because it's not in the DTO
        public virtual StoreItemCategory StoreItemCategory { get; set; } = null!;
    }
}
