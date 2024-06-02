using GTD_Fund_TrackerAPI.Contract_Layer;
using GTD_Fund_TrackerAPI.Filter;
using GTD_Fund_TrackerAPI.Wrappers;
using GTD_Fund_TrackerAPI.Models;
using GTD_Fund_TrackerAPI.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GTD_Fund_TrackerAPI.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserManager _userManager;
        private readonly ICommonManager _commonManager;

        public UserController(IUserManager userManager, ICommonManager commonManager)
        {
            _userManager = userManager;
            _commonManager = commonManager;
        }

        [Authorize]
        [HttpGet("pending-contribution/{username}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPendingContribution([FromRoute] string username)
        {
            return Ok(await _userManager.GetPendingContribution(username));
        }

        [Authorize]
        [HttpPost("contributions")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetContributions([FromBody] MonthContributionDTO monthFilter, [FromQuery] PagingDTO filter)
        {
            var validFilter = new PaginationFilter(filter.Page, filter.PageSize, filter.SortBy, filter.SortOrder, filter.Category);
            var contributions = (await _commonManager.GetContributions(monthFilter, validFilter))
                               .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                               .Take(validFilter.PageSize).ToList();

            PaginationFilter emptyFilter = new()
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
        [HttpPost("contribute")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AddContribution([FromBody] ContributionDTO contribution)
        {
            return Ok(await _userManager.AddContribution(contribution));
        }
    }
}
