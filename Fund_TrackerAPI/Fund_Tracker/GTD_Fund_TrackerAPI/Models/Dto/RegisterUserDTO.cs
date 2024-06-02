namespace GTD_Fund_TrackerAPI.Models.Dto
{
    public class RegisterUserDTO
    {
        public string Email { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string Designation { get; set; } = null!;
        public string Gender { get; set; } = null!;
    }
}
