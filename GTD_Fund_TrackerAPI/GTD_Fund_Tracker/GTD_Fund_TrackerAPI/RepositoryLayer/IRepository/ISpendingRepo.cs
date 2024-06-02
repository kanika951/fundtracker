using GTD_Fund_TrackerAPI.Models;

namespace GTD_Fund_TrackerAPI.RepositoryLayer.IRepository
{
    public interface ISpendingRepo
    {
        public Task<decimal> GetTotalSpending(DateTime date);
        public Task<IEnumerable<SpendingModel>> GetSpendings(DateTime startDate, DateTime endDate, string name);
        public Task<bool> AddSpending (SpendingModel spending,int userId);
    }
}
