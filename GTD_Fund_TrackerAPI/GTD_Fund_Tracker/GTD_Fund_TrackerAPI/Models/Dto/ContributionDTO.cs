namespace GTD_Fund_TrackerAPI.Models.Dto
{
    public class ContributionDTO
    {
        public string UserName { get; set; } = null!;
        public decimal Amount { get; set; }
        public DateTime ContributionDate { get; set; }
    }
}
