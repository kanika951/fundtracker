namespace GTD_Fund_TrackerAPI.Models.Dto
{
    public class ResetPasswordDTO
    {
        public string UserName { get; set; } = string.Empty;
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
