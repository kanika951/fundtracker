namespace GTD_Fund_TrackerAPI.Models.Dto
{
    public class MonthFundDTO
    {
        public DateTime Date { get; set; }
        public decimal TotalContribution { get; set; }
        public decimal TotalSpending { get; set; }
        public decimal RemainingFund { get; set; }
    }
}
