using GTD_Fund_TrackerAPI.Contract_Layer;
using GTD_Fund_TrackerAPI.Exceptions;
using GTD_Fund_TrackerAPI.ExtensionMethods;
using GTD_Fund_TrackerAPI.Models.Dto;
using GTD_Fund_TrackerAPI.RepositoryLayer;
using GTD_Fund_TrackerAPI.RepositoryLayer.Context.Entity;
using Microsoft.IdentityModel.Tokens;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace GTD_Fund_TrackerAPI.Concrete_Layer
{
    public class UserManager : IUserManager
    {
        private readonly IConfiguration _configuration;
        private readonly IUnitOfWork _unitOfWork;

        public UserManager(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        private async Task<bool> SendMail(string email, string username, string fullname, bool verification)
        {
            try
            {
                var apiKey = _configuration.GetSection(Constants.EmailConfig).GetSection(Constants.SENDGRID_API_KEY).Value;
                var client = new SendGridClient(apiKey);
                var from_email = new EmailAddress(_configuration.GetSection(Constants.EmailConfig).GetSection(Constants.MailFrom).Value, "GrapeSEED");
                var to_email = new EmailAddress(email, fullname);
                var subject = "";
                var plainTextContent = "";
                var pageLink = "";
                var FilePath = "";
                if (verification == true)
                {
                    subject = _configuration.GetSection(Constants.EmailConfig).GetSection(Constants.VerificationMailSubject).Value;
                    plainTextContent = _configuration.GetSection(Constants.EmailConfig).GetSection(Constants.VerificationPlainText).Value;
                    pageLink = $"http://localhost:3000/confirmed/{username}";
                    FilePath = ".\\MailTemplates\\EmailVerificationMail.html";
                }
                else if (verification == false)
                {
                    subject = _configuration.GetSection(Constants.EmailConfig).GetSection(Constants.ForgotPasswordMailSubject).Value;
                    plainTextContent = _configuration.GetSection(Constants.EmailConfig).GetSection(Constants.ForgotPasswordPlainText).Value;
                    pageLink = $"http://localhost:3000/set-password/{username}";
                    FilePath = ".\\MailTemplates\\ForgotPasswordMail.html";
                }
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();
                MailText = MailText.Replace("{fullname}", fullname);
                MailText = MailText.Replace("{link}", pageLink);
                var htmlContent = MailText;
                var msg = MailHelper.CreateSingleEmail(from_email, to_email, subject, plainTextContent, htmlContent);
                var response = await client.SendEmailAsync(msg).ConfigureAwait(false);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> RegisterUser(RegisterUserDTO user)
        {
            if (user == null)
            {
                throw new BadRequestException("Cannot add user");
            }

            Regex regex = new Regex(@"^[\w!#$%&'*+\-/=?\^_`{|}~]+(\.[\w!#$%&'*+\-/=?\^_`{|}~]+)*"
                                    + "@"
                                    + @"((([\-\w]+\.)+[a-zA-Z]{2,4})|(([0-9]{1,3}\.){3}[0-9]{1,3}))$");
            Match match = regex.Match(user.Email);
            if (!match.Success)
            {
                throw new BadRequestException("Invalid Email");
            }

            if ((await _unitOfWork.UserRepo.GetAllUsernames()).Contains(user.UserName))
            {
                throw new BadRequestException("Cannot use Username");
            }
            if ((await _unitOfWork.UserRepo.GetVerifiedEmails()).Contains(user.Email))
            {
                throw new BadRequestException("Invalid Email");
            }
            if ((await _unitOfWork.UserRepo.GetVerifiedNumbers()).Contains(user.PhoneNumber))
            {
                throw new BadRequestException("Invalid Phone Number");
            }
            CreatePasswordHash(user.Password, out byte[] passwordHash, out byte[] passwordSalt);
            User newUser = new()
            {
                UserName = user.UserName,
                FullName = user.FullName,
                Email = user.Email,
                Gender = user.Gender,
                Designation = user.Designation,
                PhoneNumber = user.PhoneNumber,
                Verified = false,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                JoiningDate = DateTime.Now,
                PendingAmount = DateTime.Today.Day < 15 ? 200 : 0,
                Status = "In-Active"
            };
            var isAdded = await _unitOfWork.UserRepo.RegisterUser(newUser);
            if (isAdded)
            {
                _ = SendVerificationMail(user);
            }
            return isAdded;
        }

        public async Task<ValidUserDTO> ValidateUser(UserDTO login)
        {
            if (login.UserName.IsNullOrEmpty() || login.Password.IsNullOrEmpty())
            {
                throw new BadRequestException("Please enter your Username and Password");
            }
            var user = await _unitOfWork.UserRepo.GetUser(login.UserName);
            if (user == null)
            {
                return null;
            }
            if (user.Status == "In-Active")
            {
                return null;
            }
            if (!user.Verified)
            {
                return null;
            }
            if (!VerifyPasswordHash(login.Password, user.PasswordHash, user.PasswordSalt))
            {
                return null;
            }
            var Roles = user.Roles.Select(u => u.Name).ToList();

            ValidUserDTO validUser = new()
            {
                UserName = user.UserName,
                FullName = user.FullName,
                UserRoles = Roles
            };
            return validUser;
        }

        public async  Task<decimal> GetPendingContribution(string username)
        {
            var user = await _unitOfWork.UserRepo.GetUser(username);
            if (user == null)
            {
                throw new NotFoundException("User does not exist");
            }
            return await _unitOfWork.UserRepo.GetPendingContribution(username);
        }

        public async Task<bool> AddContribution(ContributionDTO contribution)
        {
            var user = await _unitOfWork.UserRepo.GetUser(contribution.UserName);
            if (user == null)
            {
                throw new NotFoundException("User does not exist");
            }
            var isAdded = false;
            if (user.Status == "In-Active")
            {
                return isAdded;
            }
            var userRoles = user.Roles.Select(u => u.Name).ToList();
            if (contribution.ContributionDate.Year >= 2023)
            {
                if (!contribution.UserName.IsNullOrEmpty() && contribution.Amount.IsGreaterThan(0) && !contribution.Amount.IsGreaterThan(1000))
                {
                    isAdded = await _unitOfWork.ContributionRepo.AddContribution(contribution, user.Id, userRoles.Contains("Admin") ? "Accepted" : "Pending");
                    if (userRoles.Contains("Admin"))
                    {
                        user.PendingAmount -= contribution.Amount;
                        var pending = await _unitOfWork.UserRepo.UpdateUser(user);
                    }
                }
            }           
            return isAdded;
        }

        public async Task<bool> ResetPassword(ResetPasswordDTO resetPasswordDTO)
        {
            if (resetPasswordDTO == null)
            {
                throw new BadRequestException("Null object passed");
            }
            if (resetPasswordDTO.UserName.IsNullOrEmpty() || resetPasswordDTO.OldPassword.IsNullOrEmpty() || resetPasswordDTO.NewPassword.IsNullOrEmpty())
            {
                return false;
            }
            var isReseted = false;
            var user = await _unitOfWork.UserRepo.GetUser(resetPasswordDTO.UserName);
            if (user == null)
            {
                return isReseted;
            }
            if (!VerifyPasswordHash(resetPasswordDTO.OldPassword, user.PasswordHash, user.PasswordSalt))
            {
                return isReseted;
            }
            CreatePasswordHash(resetPasswordDTO.NewPassword, out byte[] passwordHash, out byte[] passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            isReseted = await _unitOfWork.UserRepo.UpdateUser(user);
            return isReseted;
        }

        public async Task<bool> SetForgotPassword(SetPasswordDTO setPasswordDTO)
        {
            if (setPasswordDTO == null)
            {
                throw new BadRequestException("Null object passed");
            }
            if (setPasswordDTO.UserName.IsNullOrEmpty() || setPasswordDTO.NewPassword.IsNullOrEmpty())
            {
                return false;
            }
            var isReseted = false;
            var user = await _unitOfWork.UserRepo.GetUser(setPasswordDTO.UserName);
            if (user == null)
            {
                return isReseted;
            }
            CreatePasswordHash(setPasswordDTO.NewPassword, out byte[] passwordHash, out byte[] passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            isReseted = await _unitOfWork.UserRepo.UpdateUser(user);
            return isReseted;
        }

        public async Task<bool> SendForgotPasswordMail(string username)
        {
            var user = await _unitOfWork.UserRepo.GetUser(username);
            if (user == null)
            {
                throw new NotFoundException("User does not exist");
            }
            return await SendMail(user.Email, user.UserName, user.FullName, false);
        }

        public async Task<bool> SendVerificationMail(RegisterUserDTO user)
        {
            return await SendMail(user.Email, user.UserName, user.FullName, true);
        }

        public async Task<bool> ConfirmMail(string username)
        {
            bool isVerified;
            var user = await _unitOfWork.UserRepo.GetInActiveUser(username);
            if (user.Verified == true)
            {
                throw new BadRequestException("Cannot verify mail");
            }

            if (user != null)
            {
                user.Verified = true;
                user.Status = "Active";
                isVerified = await _unitOfWork.UserRepo.UpdateUser(user);
            }
            else
            {
                throw new BadRequestException("User not found");
            }
            return isVerified;
        }
    }
}
