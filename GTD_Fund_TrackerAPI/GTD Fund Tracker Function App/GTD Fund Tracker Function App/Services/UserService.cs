using GTD_Fund_Tracker_Function_App.IServices;
using GTD_Fund_Tracker_Function_App.RepositoryLayer;

namespace GTD_Fund_Tracker_Function_App.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;   
        }

        public async Task UpdatePendingAmount()
        {
            var users = await _unitOfWork.UserRepo.GetAllUsers();
            foreach (var user in users)
            {
                user.PendingAmount += 200;
            }
            await _unitOfWork.UserRepo.UpdateUsers(users);
        }
    }
}
