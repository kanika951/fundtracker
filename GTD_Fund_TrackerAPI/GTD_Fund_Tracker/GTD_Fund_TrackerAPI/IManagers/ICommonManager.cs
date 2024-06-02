using GTD_Fund_TrackerAPI.Filter;
using GTD_Fund_TrackerAPI.Models;
using GTD_Fund_TrackerAPI.Models.Dto;

namespace GTD_Fund_TrackerAPI.Contract_Layer
{
    public interface ICommonManager
    {
        Task<ValidationInfoDTO> GetValidationInfo();
        Task<IEnumerable<ContributionModel>> GetContributions(MonthContributionDTO monthFilter, PaginationFilter validFilter);
    }
}
