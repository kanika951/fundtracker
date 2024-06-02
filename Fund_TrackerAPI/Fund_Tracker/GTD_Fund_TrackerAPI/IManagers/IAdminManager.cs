using GTD_Fund_TrackerAPI.Filter;
using GTD_Fund_TrackerAPI.Models;
using GTD_Fund_TrackerAPI.Models.Dto;

namespace GTD_Fund_TrackerAPI.Contract_Layer
{
    public interface IAdminManager
    {
        Task<IEnumerable<string>> GetVerifiedUsernames();
        public Task<IEnumerable<UsersDTO>> GetAllUsers(string searchName);
        public Task<decimal> GetAvailableFund();
        public Task<IEnumerable<SpendingModel>> GetSpendings(MonthContributionDTO monthFilter, PaginationFilter validFilter);
        public Task<bool> UpdateStatus(int id, ChangeStatusDTO statusDTO);
        public Task<MonthFundDTO> MonthFundDetails(DateTime date);
        public Task<IEnumerable<MonthFundDTO>> FundStatement(PaginationFilter validFilter);
        public Task<bool> AddSpending (SpendingModel spending);
        public Task<bool> UpdateRoles(UserRoleDTO userRole);
        public Task<IEnumerable<ContributionModel>> GetPendingContributions(string username, PaginationFilter validFilter);
        public Task<bool> DeactivateAccount(string username);
    }
}
