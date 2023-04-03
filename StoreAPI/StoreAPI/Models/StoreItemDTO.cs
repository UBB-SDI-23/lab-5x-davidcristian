namespace StoreAPI.Models
{
    public class StoreItemDTO
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }

        public double Price { get; set; }
        public long Stock { get; set; }
        public long FavoriteCount { get; set; }

        public long? StoreItemCategoryId { get; set; }
    }
}
