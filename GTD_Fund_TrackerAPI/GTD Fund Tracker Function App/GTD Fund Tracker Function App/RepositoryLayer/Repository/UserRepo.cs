using GTD_Fund_Tracker_Function_App.RepositoryLayer.Context;
using GTD_Fund_Tracker_Function_App.RepositoryLayer.Context.Entity;
using GTD_Fund_Tracker_Function_App.RepositoryLayer.IRepository;
using Microsoft.EntityFrameworkCore;

namespace GTD_Fund_Tracker_Function_App.RepositoryLayer.Repository
{
    public class UserRepo : IUserRepo
    {
        private readonly GtdFundDbContext _db;
        public UserRepo(GtdFundDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            try
            {
                var users = await _db.Users.Where(u => u.Status == "Active").ToListAsync();
                return users;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
        public async Task UpdateUsers(IEnumerable<User> users)
        {
            try
            {
               await _db.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}
