using GTD_Fund_TrackerAPI.RepositoryLayer.Context;
using GTD_Fund_TrackerAPI.RepositoryLayer.Context.Entity;
using GTD_Fund_TrackerAPI.RepositoryLayer.IRepository;
using Microsoft.EntityFrameworkCore;

namespace GTD_Fund_TrackerAPI.Repository_Layer
{
    public class UserRepo : IUserRepo
    {
        private readonly GtdFundDbContext _db;

        public UserRepo(GtdFundDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<User>> GetUsers(string name)
        {
            return await _db.Users.Include(u => u.Roles)
                         .Where(u => (u.UserName.StartsWith(name) || u.FullName.StartsWith(name)) && u.Status == "Active")
                         .ToListAsync();
        }

        public async Task<User> GetUser(string username)
        {
            return await _db.Users.Include(u => u.Contributions).Include(u => u.Roles)
                         .FirstOrDefaultAsync(u => (u.UserName == username || u.Email == username) && u.Status == "Active");
        }

        public async Task<User> GetInActiveUser(string username)
        {
            return await _db.Users.Include(u => u.Contributions).Include(u => u.Roles)
                         .FirstOrDefaultAsync(u => u.UserName == username && u.Status == "In-Active");
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _db.Users.Include(u => u.Roles).Where(u => u.Status == "Active").ToListAsync();
        }

        public async Task<IEnumerable<string>> GetAllUsernames()
        {
            return await _db.Users.Select(u => u.UserName).ToListAsync();
        }

        public async Task<IEnumerable<string>> GetVerifiedEmails()
        {
            return await _db.Users.Where(u => u.Verified == true).Select(u => u.Email).ToListAsync();
        }

        public async Task<IEnumerable<string>> GetVerifiedNumbers()
        {
            return await _db.Users.Where(u => u.Verified == true).Select(u => u.PhoneNumber).ToListAsync();
        }

        public async Task<bool> RegisterUser(User user)
        {
            var role = await _db.Roles.FirstOrDefaultAsync(u => u.Name == "User");
            try
            {
                await _db.Users.AddAsync(user);
                user.Roles.Add(role);
                await _db.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                throw ex;
            }          
            return true;
        }

        public async Task<bool> UpdateUser(User user)
        {
            try
            {
                await _db.SaveChangesAsync();
                return true;
            }
            catch(Exception ex) 
            { 
                throw ex; 
            }
        }

        public async Task<bool> AddRole(User user, string role)
        {
            try
            {
                var newRole = await _db.Roles.FirstOrDefaultAsync(u => u.Name == role);
                user.Roles.Add(newRole);
                await _db.SaveChangesAsync();
                return true;
            }
            catch(Exception ex)
            {
                throw ex;
            }            
        }

        public async Task<bool> RemoveRole(User user, string role)
        {
            try
            {
                var selectedRole = user.Roles.FirstOrDefault(u => u.Name == role);
                user.Roles.Remove(selectedRole);
                await _db.SaveChangesAsync();
                return true;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<decimal> GetPendingContribution(string username)
        {
            return (await _db.Users.Where(u => u.UserName == username).ToListAsync()).Select(u => u.PendingAmount).Sum();
        }
    }
}
