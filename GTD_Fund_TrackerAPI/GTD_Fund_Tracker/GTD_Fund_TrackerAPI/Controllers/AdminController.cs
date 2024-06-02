using GTD_Fund_TrackerAPI.Contract_Layer;
using GTD_Fund_TrackerAPI.Filter;
using GTD_Fund_TrackerAPI.Models;
using GTD_Fund_TrackerAPI.Models.Dto;
using GTD_Fund_TrackerAPI.Wrappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GTD_Fund_TrackerAPI.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminManager _adminManager;
        private readonly ICommonManager _commonManager;

        public AdminController(IAdminManager adminManager, ICommonManager commonManager)
        {
            _adminManager = adminManager;
            _commonManager = commonManager;
        }

        [Authorize]
        [HttpGet("verified-usernames")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetVerifiedUsernames()
        {
            var verifiedUsernames = await _adminManager.GetVerifiedUsernames();
            return Ok(verifiedUsernames);
        }

        [Authorize]
        [HttpGet("users/{name}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllUsers([FromRoute] string name, [FromQuery] PagingDTO filter)
        {
            var validFilter = new PaginationFilter(filter.Page, filter.PageSize, "none", "none", "none");
            var users = (await _adminManager.GetAllUsers(name))
                        .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                        .Take(validFilter.PageSize).ToList();
            var totalRecords = (await _adminManager.GetAllUsers(name)).Count();
            var totalPages = Convert.ToInt32(Math.Ceiling((double)totalRecords / validFilter.PageSize));
            return Ok(new PagedResponse<List<UsersDTO>>(users, validFilter.PageNumber, validFilter.PageSize, totalPages, totalRecords)); ;
        }

        [Authorize]
        [HttpGet("pending-contributions/{name}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPendingContributions([FromRoute] string name, [FromQuery] PagingDTO filter)
        {
            var validFilter = new PaginationFilter(filter.Page, filter.PageSize, filter.SortBy, filter.SortOrder, "Pending");
            var pendingContributions = (await _adminManager.GetPendingContributions(name, validFilter))
                                      .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                                      .Take(validFilter.PageSize).ToList();
            var totalRecords = (await _adminManager.GetPendingContributions(name, validFilter)).Count();
            var totalPages = Convert.ToInt32(Math.Ceiling((double)totalRecords / validFilter.PageSize));
            return Ok(new PagedResponse<List<ContributionModel>>(pendingContributions, validFilter.PageNumber, validFilter.PageSize, totalPages, totalRecords));
        }

        [Authorize]
        [HttpGet("total-fund")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetRemainingFund()
        {
            return Ok(await _adminManager.GetAvailableFund());
        }

        [Authorize]
        [HttpGet("month-fund-details")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> MonthFundDetails([FromQuery] DateTime date)
        {
            return Ok(await _adminManager.MonthFundDetails(date));
        }

        [Authorize]
        [HttpGet("fund-statement")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> FundStatement([FromQuery] PagingDTO filter)
        {
            var validFilter = new PaginationFilter(filter.Page, filter.PageSize, filter.SortBy, filter.SortOrder, "none");
            var fundStatement = (await _adminManager.FundStatement(validFilter))
                                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                                .Take(validFilter.PageSize).ToList();
            PaginationFilter emptyFilter = new()
            {
                PageNumber = validFilter.PageNumber,
                SortBy = "none",
                SortOrder = "none",
                Category = "none"
            };
            var totalRecords = (await _adminManager.FundStatement(emptyFilter)).Count();
            var totalPages = Convert.ToInt32(Math.Ceiling((double)totalRecords / validFilter.PageSize));
            return Ok(new PagedResponse<List<MonthFundDTO>>(fundStatement, validFilter.PageNumber, validFilter.PageSize, totalPages, totalRecords));
        }

        [Authorize]
        [HttpPost("contributions")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetContributions([FromBody] MonthContributionDTO monthFilter, [FromQuery] PagingDTO filter)
        {
            var validFilter = new PaginationFilter(filter.Page, filter.PageSize, filter.SortBy, filter.SortOrder, filter.Category);
            var contributions = (await _commonManager.GetContributions(monthFilter, validFilter))
                               .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                               .Take(validFilter.PageSize).ToList();

            PaginationFilter emptyFilter = new ()
            {
                PageNumber = validFilter.PageNumber,
                SortBy = "none",
                SortOrder = "none",
                Category = validFilter.Category
            };
            var totalRecords = (await _commonManager.GetContributions(monthFilter, emptyFilter)).Count();
            var totalPages = Convert.ToInt32(Math.Ceiling((double)totalRecords / validFilter.PageSize));
            return Ok(new PagedResponse<List<ContributionModel>>(contributions, validFilter.PageNumber, validFilter.PageSize, totalPages, totalRecords));
        }

        [Authorize]
        [HttpPost("spendings")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSpendings([FromBody] MonthContributionDTO monthFilter, [FromQuery] PagingDTO filter)
        {
            var validFilter = new PaginationFilter(filter.Page, filter.PageSize, filter.SortBy, filter.SortOrder, "none");
            var spendings = (await _adminManager.GetSpendings(monthFilter, validFilter))
                               .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                               .Take(validFilter.PageSize).ToList();

            PaginationFilter emptyFilter = new()
            {
                PageNumber = validFilter.PageNumber,
                SortBy = "none",
                SortOrder = "none",
                Category = "none"
            };
            var totalRecords = (await _adminManager.GetSpendings(monthFilter, emptyFilter)).Count();
            var totalPages = Convert.ToInt32(Math.Ceiling((double)totalRecords / validFilter.PageSize));
            return Ok(new PagedResponse<List<SpendingModel>>(spendings, validFilter.PageNumber, validFilter.PageSize, totalPages, totalRecords));
        }

        [Authorize]
        [HttpPost("add-spending")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AddSpending([FromBody] SpendingModel spending)
        {
            return Ok(await _adminManager.AddSpending(spending));
        }

        [Authorize]
        [HttpPatch("update-status/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateStatus([FromRoute] int id, [FromBody] ChangeStatusDTO statusDTO)
        {
            return Ok(await _adminManager.UpdateStatus(id, statusDTO));
        }

        [Authorize]
        [HttpPut("update-roles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> AddRole([FromBody] UserRoleDTO userRole)
        {
            return Ok(await _adminManager.UpdateRoles(userRole));
        }
    }
}
