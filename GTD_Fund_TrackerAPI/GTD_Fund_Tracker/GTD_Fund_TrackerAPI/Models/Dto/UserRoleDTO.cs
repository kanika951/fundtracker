using GTD_Fund_TrackerAPI.RepositoryLayer.Context.Entity;

namespace GTD_Fund_TrackerAPI.Models.Dto
{
    public class UserRoleDTO
    {
        public string UserName { get; set; } = null!;
        public List<string> Roles { get; set; } = null!;
    }
}
