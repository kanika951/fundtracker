using GTD_Fund_TrackerAPI.Models;
using GTD_Fund_TrackerAPI.Models.Dto;

namespace GTD_Fund_TrackerAPI.Contract_Layer
{
    public interface IUserManager
    {
        Task<ValidUserDTO> ValidateUser(UserDTO login);
        Task<bool> RegisterUser(RegisterUserDTO user);
        Task<bool> SendVerificationMail(RegisterUserDTO user);
        Task<bool> ConfirmMail(string username);
        Task<bool> ResetPassword(ResetPasswordDTO resetPasswordDTO);
        Task<bool> SetForgotPassword(SetPasswordDTO forgotPasswordDTO);
        Task<bool> SendForgotPasswordMail(string username);
        Task<decimal> GetPendingContribution(string username);
        Task<bool> AddContribution(ContributionDTO contribution);
    }
}
