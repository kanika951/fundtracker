namespace GTD_Fund_TrackerAPI.Models.Dto
{
    public class MonthContributionDTO
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Name { get; set; } = null!;
    }
}
