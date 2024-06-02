using GTD_Fund_TrackerAPI.Contract_Layer;
using GTD_Fund_TrackerAPI.Filter;
using GTD_Fund_TrackerAPI.Models;
using GTD_Fund_TrackerAPI.Models.Dto;
using GTD_Fund_TrackerAPI.RepositoryLayer;
using System.Data;

namespace GTD_Fund_TrackerAPI.Concrete_Layer
{
    public class CommonManager : ICommonManager
    {
        private readonly IUnitOfWork _unitOfWork;

        public CommonManager(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ValidationInfoDTO> GetValidationInfo()
        {
            var users = new ValidationInfoDTO()
            {
                UserNames = await _unitOfWork.UserRepo.GetAllUsernames(),
                Emails = await _unitOfWork.UserRepo.GetVerifiedEmails(),
                PhoneNumbers = await _unitOfWork.UserRepo.GetVerifiedNumbers()
            };
            return users;
        }

        public async Task<IEnumerable<ContributionModel>> GetContributions(MonthContributionDTO monthFilter, PaginationFilter validFilter)
        {
            var contributions = new List<ContributionModel>();
            if(validFilter.Category.ToLower() == "accepted")
            {
                contributions = (List<ContributionModel>) await _unitOfWork.ContributionRepo.GetContributions(monthFilter.StartDate, monthFilter.EndDate, monthFilter.Name, "Accepted");
            }
            else if(validFilter.Category.ToLower() == "pending")
            {
                contributions = (List<ContributionModel>) await _unitOfWork.ContributionRepo.GetContributions(monthFilter.StartDate, monthFilter.EndDate, monthFilter.Name, "Pending");
            }
            else if(validFilter.Category.ToLower() == "denied")
            {
                contributions = (List<ContributionModel>) await _unitOfWork.ContributionRepo.GetContributions(monthFilter.StartDate, monthFilter.EndDate, monthFilter.Name, "Denied");
            }
            else
            {
                contributions = (List<ContributionModel>) await _unitOfWork.ContributionRepo.GetContributions(monthFilter.StartDate, monthFilter.EndDate, monthFilter.Name, "");
            }

            if (validFilter.SortOrder.ToLower() == "desc")
            {
                if (validFilter.SortBy.ToLower() == "amount")
                {
                    contributions = contributions.OrderByDescending(u => u.Amount).ToList();
                }
                else if (validFilter.SortBy.ToLower() == "date")
                {
                    contributions = contributions.OrderByDescending(u => u.ContributionDate).ToList();
                }
            }
            else if (validFilter.SortOrder.ToLower() == "asc")
            {
                if (validFilter.SortBy.ToLower() == "amount")
                {
                    contributions = contributions.OrderBy(u => u.Amount).ToList();
                }
                else if (validFilter.SortBy.ToLower() == "date")
                {
                    contributions = contributions.OrderBy(u => u.ContributionDate).ToList();
                }
            }
            return contributions;
        }        
    }
}