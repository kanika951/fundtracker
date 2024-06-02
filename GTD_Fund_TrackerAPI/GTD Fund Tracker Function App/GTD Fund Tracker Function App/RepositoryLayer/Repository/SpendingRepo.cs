using GTD_Fund_Tracker_Function_App.RepositoryLayer.Context;
using GTD_Fund_Tracker_Function_App.RepositoryLayer.IRepository;

namespace GTD_Fund_Tracker_Function_App.RepositoryLayer.Repository
{
    public class SpendingRepo : ISpendingRepo
    {
        private readonly GtdFundDbContext _db;

        public SpendingRepo(GtdFundDbContext db)
        {
            _db = db;
        }
    }
}
