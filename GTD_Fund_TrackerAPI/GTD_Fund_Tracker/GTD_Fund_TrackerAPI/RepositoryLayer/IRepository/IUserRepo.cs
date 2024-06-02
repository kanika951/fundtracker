using GTD_Fund_TrackerAPI.RepositoryLayer.Context.Entity;

namespace GTD_Fund_TrackerAPI.RepositoryLayer.IRepository
{
    public interface IUserRepo
    {
        Task<IEnumerable<User>> GetUsers(string searchName);
        Task<User> GetUser(string username);
        Task<User> GetInActiveUser(string username);
        Task<IEnumerable<User>> GetAllUsers();
        Task<IEnumerable<string>> GetAllUsernames();
        Task<IEnumerable<string>> GetVerifiedEmails();
        Task<IEnumerable<string>> GetVerifiedNumbers();
        Task<bool> RegisterUser(User user);
        Task<decimal> GetPendingContribution(string username);
        Task<bool> AddRole(User user, string role);
        Task<bool> RemoveRole(User user, string role);
        Task<bool> UpdateUser(User user);
    }
}
