namespace GTD_Fund_TrackerAPI.Models.Dto
{
    public class ValidUserDTO
    {
        public string UserName { get; set; } = null!;
        public string FullName { get; set; }   
        public List<string> UserRoles { get; set; } = null!;
    }
}
