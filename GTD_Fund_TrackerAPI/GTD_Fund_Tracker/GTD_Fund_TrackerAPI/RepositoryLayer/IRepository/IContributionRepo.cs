using GTD_Fund_TrackerAPI.Models;
using GTD_Fund_TrackerAPI.Models.Dto;
using GTD_Fund_TrackerAPI.RepositoryLayer.Context.Entity;

namespace GTD_Fund_TrackerAPI.RepositoryLayer.IRepository
{
    public interface IContributionRepo
    {
        Task<bool> AddContribution(ContributionDTO contribution,int userId, string status);
        Task<IEnumerable<ContributionModel>> GetContributions(DateTime startDate, DateTime endDate, string name, string Category);
        Task<decimal> GetTotalContribution(DateTime date);
        Task<decimal> GetAvailableFund();
        Task<bool> UpdateContribution(Contribution contribution);
        Task<Contribution> GetContribution(int contributionId);
    }
}
