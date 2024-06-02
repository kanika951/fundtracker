using GTD_Fund_Tracker_Function_App.RepositoryLayer.Context;
using GTD_Fund_Tracker_Function_App.RepositoryLayer.IRepository;

namespace GTD_Fund_Tracker_Function_App.RepositoryLayer.Repository
{
    public class ContributionRepo :  IContributionRepo
    {
        private readonly GtdFundDbContext _db;

        public ContributionRepo(GtdFundDbContext db)
        {
            _db = db;
        }
    }
}
