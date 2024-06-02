namespace GTD_Fund_TrackerAPI.Models.Dto
{
    public class PagingDTO
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string SortBy { get; set; } = null!;
        public string SortOrder { get; set; } = null!;
        public string Category { get; set; } = null!;
    }
}
