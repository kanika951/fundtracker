namespace GTD_Fund_TrackerAPI.Models
{
    public class SpendingModel
    {
        public DateTime SpendDate { get; set; }
        public decimal Amount { get; set; }
        public string UserName { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string UsedFor { get; set; } = null!;
    }
}
