namespace GTD_Fund_TrackerAPI.Models.Dto
{
    public class ValidationInfoDTO
    {
        public IEnumerable<string> UserNames { get; set; } = null!;
        public IEnumerable<string> Emails { get; set; } = null!;
        public IEnumerable<string> PhoneNumbers { get; set; } = null!;
    }
}
