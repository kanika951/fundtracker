namespace GTD_Fund_TrackerAPI.Filter
{
    public class PaginationFilter
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string SortBy { get; set; }
        public string SortOrder { get; set; }
        public string Category { get; set; }


        public PaginationFilter()
        {
            PageNumber = 1;
            PageSize = 10;
            SortBy = "Amount";
            SortOrder = "desc";
            Category = "All";
        }

        public PaginationFilter(int pageNumber, int pageSize, string sortBy, string sortOrder, string category)
        {
            PageNumber = pageNumber < 1 ? 1 : pageNumber;
            PageSize = pageSize;
            SortBy = sortBy;
            SortOrder = sortOrder;
            Category = category;
        }
    }
}
