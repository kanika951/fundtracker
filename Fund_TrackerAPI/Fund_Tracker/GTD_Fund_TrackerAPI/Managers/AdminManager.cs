using GTD_Fund_TrackerAPI.Contract_Layer;
using GTD_Fund_TrackerAPI.Exceptions;
using GTD_Fund_TrackerAPI.ExtensionMethods;
using GTD_Fund_TrackerAPI.Filter;
using GTD_Fund_TrackerAPI.Models;
using GTD_Fund_TrackerAPI.Models.Dto;
using GTD_Fund_TrackerAPI.RepositoryLayer;
using GTD_Fund_TrackerAPI.RepositoryLayer.Context.Entity;
using Microsoft.IdentityModel.Tokens;

namespace GTD_Fund_TrackerAPI.Concrete_Layer
{
    public class AdminManager : IAdminManager
    {
        private readonly IUnitOfWork _unitOfWork;

        public AdminManager(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<string>> GetVerifiedUsernames()
        {
            var usernames = (await _unitOfWork.UserRepo.GetAllUsers()).Select(u => u.UserName);
            return usernames;
        }

        public async Task<IEnumerable<UsersDTO>> GetAllUsers(string name)
        {
            var usersList = new List<User>();
            if(name.ToLower() == "all")
            {
                usersList = (List<User>) await _unitOfWork.UserRepo.GetAllUsers();
            }
            else
            {
                usersList = (List<User>) await _unitOfWork.UserRepo.GetUsers(name);
            }
            var users = usersList.Select(u => new UsersDTO()
            {
                Id = u.Id,
                UserName = u.UserName,
                FullName = u.FullName,
                JoiningDate = u.JoiningDate,
                PendingAmount = u.PendingAmount,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                Roles = u.Roles.Select(r => new RoleDTO()
                {
                    Id = r.Id,
                    Name = r.Name
                }).ToList()
            }).ToList();

            return users;
        }

        public async Task<decimal> GetAvailableFund()
        {
            return await _unitOfWork.ContributionRepo.GetAvailableFund();
        }

        public async Task<IEnumerable<ContributionModel>> GetPendingContributions(string username, PaginationFilter validFilter)
        {
            var contributions = await _unitOfWork.ContributionRepo.GetContributions(DateTime.ParseExact("2023-01-01","yyyy-mm-dd",null), DateTime.Now, username, "Pending");
            if (validFilter.SortOrder.ToLower() == "desc")
            {
                switch (validFilter.SortBy.ToLower())
                {
                    case "amount": contributions = contributions.OrderByDescending(u => u.Amount).ToList();
                        break;

                    case "contributiondate": contributions = contributions.OrderByDescending(u => u.ContributionDate).ToList();
                        break;
                }
            }
            else if (validFilter.SortOrder.ToLower() == "asc")
            {
                switch (validFilter.SortBy.ToLower())
                {
                    case "amount": contributions = contributions.OrderBy(u => u.Amount).ToList();
                        break;

                    case "contributiondate": contributions = contributions.OrderBy(u => u.ContributionDate).ToList();
                        break;
                }
            }
            return contributions;
        }

        public async Task<IEnumerable<SpendingModel>> GetSpendings(MonthContributionDTO monthFilter, PaginationFilter validFilter)
        {
            var spendings = await _unitOfWork.SpendingRepo.GetSpendings(monthFilter.StartDate, monthFilter.EndDate, monthFilter.Name);
            if (validFilter.SortOrder.ToLower() == "desc")
            {
                switch (validFilter.SortBy.ToLower())
                {
                    case "amount":
                        spendings = spendings.OrderByDescending(u => u.Amount).ToList();
                        break;

                    case "date":
                        spendings = spendings.OrderByDescending(u => u.SpendDate).ToList();
                        break;
                }
            }
            else if (validFilter.SortOrder.ToLower() == "asc")
            {
                switch (validFilter.SortBy.ToLower())
                {
                    case "amount": spendings = spendings.OrderBy(u => u.Amount).ToList();
                        break;

                    case "date": spendings = spendings.OrderBy(u => u.SpendDate).ToList();
                        break;
                }
            }
            return spendings;
        }

        public async Task<bool> UpdateStatus(int id, ChangeStatusDTO statusDTO)
        {
            if (statusDTO == null || id <= 0)
            {
                throw new BadRequestException("Invalid Input");
            }
            var transaction = await _unitOfWork.ContributionRepo.GetContribution(id);
            if (transaction == null)
            {
                return false;
            }
            if (transaction.Status == "Pending")
            {
                transaction.Status = statusDTO.Status;
                if (transaction.Status == "Accepted")
                {
                    transaction.Remarks = "-";
                    var user = await _unitOfWork.UserRepo.GetUser(transaction.User.UserName);
                    user.PendingAmount -= transaction.Amount;
                }
                else
                {
                    transaction.Remarks = statusDTO.Remarks;
                }
            }
            else
            {
                return false;
            }
            var isUpdated = await _unitOfWork.ContributionRepo.UpdateContribution(transaction);
            return isUpdated;
        }

        public async Task<bool> UpdateRoles(UserRoleDTO userRole)
        {
            try
            {
                if (userRole.Roles.IsNullOrEmpty())
                {
                    return false;
                }
                var user = await _unitOfWork.UserRepo.GetUser(userRole.UserName);
                if (user == null)
                {
                    return false;
                }
                var existingRoles = user.Roles.ToList();
                Func<Task> operation = async () =>
                {
                    foreach (var role in existingRoles)
                    {
                        var result = await _unitOfWork.UserRepo.RemoveRole(user, role.Name);
                    }
                    foreach (var role in userRole.Roles)
                    {
                        var result = await _unitOfWork.UserRepo.AddRole(user, role);
                    }
                };
                await _unitOfWork.DoTransactionAsync(operation);
                return true;
            }
            catch(Exception ex)
            {
                return false;
            }
        }

        public async Task<MonthFundDTO> MonthFundDetails(DateTime date)
        {
            if (date == null)
            {
                throw new BadRequestException("Date not specified");
            }
            var totalContribution = await _unitOfWork.ContributionRepo.GetTotalContribution(date);
            var totalSpending = await _unitOfWork.SpendingRepo.GetTotalSpending(date);

            MonthFundDTO fundDetails = new ()
            {
                Date = date,
                TotalContribution = totalContribution,
                TotalSpending = totalSpending,
                RemainingFund = totalContribution - totalSpending
            };
            return fundDetails;
        }

        public async Task<IEnumerable<MonthFundDTO>> FundStatement(PaginationFilter validFilter)
        {
            var statement = new List<MonthFundDTO>();
            var date = DateTime.Today;
            while(date >= DateTime.Today.AddYears(-1))
            {
                var monthDetails = await MonthFundDetails(date);
                statement.Add(monthDetails);
                date = date.AddMonths(-1);
            }
            if (validFilter.SortOrder.ToLower() == "desc")
            {
                switch (validFilter.SortBy.ToLower())
                {
                    case "collected":
                        statement = statement.OrderByDescending(u => u.TotalContribution).ToList();
                        break;

                    case "spent":
                        statement = statement.OrderByDescending(u => u.TotalSpending).ToList();
                        break;

                    case "left":
                        statement = statement.OrderByDescending(u => u.RemainingFund).ToList();
                        break;

                    case "date":
                        statement = statement.OrderByDescending(u => u.Date).ToList();
                        break;
                }
            }
            else if (validFilter.SortOrder.ToLower() == "asc")
            {
                switch (validFilter.SortBy.ToLower())
                {
                    case "collected": statement = statement.OrderBy(u => u.TotalContribution).ToList();
                        break;

                    case "spent": statement = statement.OrderBy(u => u.TotalSpending).ToList();
                        break;

                    case "left": statement = statement.OrderBy(u => u.RemainingFund).ToList();
                        break;

                    case "date": statement = statement.OrderBy(u => u.Date).ToList();
                        break;
                }
            }
            return statement;
        }

        public async Task<bool> AddSpending(SpendingModel spending)
        {
            var spendAdded = false;
            var user = await _unitOfWork.UserRepo.GetUser(spending.UserName);
            if (user == null)
            {
                throw new NotFoundException("User does not exist");
            }   

            if(spending.SpendDate.Date > DateTime.UtcNow.Date)
            {
                return spendAdded;
            }            

            if (!spending.UserName.IsNullOrEmpty() && spending.Amount.IsGreaterThan(0) && !spending.Amount.IsGreaterThan(10000000))
            {
                var roles = user.Roles.Select(u => u.Name);
                if (roles.Contains("Admin"))
                {
                    spendAdded = await _unitOfWork.SpendingRepo.AddSpending(spending, user.Id);
                }
            }
            else
            {
                throw new BadRequestException("Invalid Username or Amount");
            }
            return spendAdded;
        }

        public async Task<bool> DeactivateAccount(string username)
        {
            var user = await _unitOfWork.UserRepo.GetUser(username);
            if(user == null)
            {
                throw new BadRequestException("User not found");
            }
            user.Status = "In-Active";
            var isDeactivated = await _unitOfWork.UserRepo.UpdateUser(user);
            return isDeactivated;
        }
    }
}
