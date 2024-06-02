namespace GTD_Fund_TrackerAPI.Models
{
    public class ContributionModel
    { 
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public decimal Amount { get; set; }
        public DateTime ContributionDate { get; set; }
        public string Status { get; set; } = null!;
    }
}
