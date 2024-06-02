using GTD_Fund_TrackerAPI.Contract_Layer;
using GTD_Fund_TrackerAPI.IManagers;
using GTD_Fund_TrackerAPI.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GTD_Fund_TrackerAPI.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ICommonManager _commonManager;
        private readonly IUserManager _userManager;
        private readonly IAdminManager _adminManager;
        private readonly IJWTAuthenticationManager _jwtAuthenticationManager;

        public AccountController(ICommonManager commonManager, IUserManager userManager, IAdminManager adminManager, IJWTAuthenticationManager jwtAuthenticationManager)
        {
            _commonManager = commonManager;
            _userManager = userManager;
            _adminManager = adminManager;
            _jwtAuthenticationManager = jwtAuthenticationManager;
        }

        [HttpGet("validation-info")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetValidationInfo()
        {
            return Ok(await _commonManager.GetValidationInfo());
        }

        [HttpGet("forgot-password/{username}")]
        public async Task<IActionResult> ForgotPassword([FromRoute] string username)
        {
            return Ok(await _userManager.SendForgotPasswordMail(username));
        }

        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDTO user)
        {
            return Ok(await _userManager.RegisterUser(user));
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> AuthUser([FromBody] UserDTO login)
        {
            var user = await _userManager.ValidateUser(login);
            var token = await _jwtAuthenticationManager.Authenticate(user);
            if (token == null)
            {
                return Unauthorized();
            }
            return Ok(token);
        }


        [HttpPatch("verify-mail/{username}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ConfirmMail([FromRoute] string username)
        {
            return Ok(await _userManager.ConfirmMail(username));
        }

        [Authorize]
        [HttpPatch("reset-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO resetpasswordDTO)
        {
            return Ok(await _userManager.ResetPassword(resetpasswordDTO));
        }

        [HttpPatch("set-password")]
        public async Task<IActionResult> SetForgotPassword([FromBody] SetPasswordDTO setPasswordDTO)
        {
            return Ok(await _userManager.SetForgotPassword(setPasswordDTO));
        }

        [Authorize]
        [HttpPatch("deactivate/{username}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeactivateAccount([FromRoute] string username)
        {
            return Ok(await _adminManager.DeactivateAccount(username));
        }
    }
}
