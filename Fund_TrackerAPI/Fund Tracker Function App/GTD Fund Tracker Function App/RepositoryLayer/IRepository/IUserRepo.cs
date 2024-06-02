using GTD_Fund_Tracker_Function_App.RepositoryLayer.Context.Entity;

namespace GTD_Fund_Tracker_Function_App.RepositoryLayer.IRepository
{
    public interface IUserRepo
    {
        Task<IEnumerable<User>> GetAllUsers();
        Task UpdateUsers(IEnumerable<User> users);
    }
}
