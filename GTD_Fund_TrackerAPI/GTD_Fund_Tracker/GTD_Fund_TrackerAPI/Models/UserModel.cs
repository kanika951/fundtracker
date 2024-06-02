using GTD_Fund_TrackerAPI.RepositoryLayer.Context.Entity;

namespace GTD_Fund_TrackerAPI.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public DateTime JoiningDate { get; set; }
        public decimal PendingAmount { get; set; }
        public ICollection<Role> Roles { get; set; } = null!;
    }
}
