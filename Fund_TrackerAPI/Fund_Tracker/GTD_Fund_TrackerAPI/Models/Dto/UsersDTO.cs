using GTD_Fund_TrackerAPI.RepositoryLayer.Context.Entity;

namespace GTD_Fund_TrackerAPI.Models.Dto
{
    public class UsersDTO
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public DateTime JoiningDate { get; set; }
        public decimal PendingAmount { get; set; }
        public IEnumerable<RoleDTO> Roles { get; set; } = null!;
    }
}
