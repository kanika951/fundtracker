using GTD_Fund_Tracker_Function_App.RepositoryLayer.Context;
using GTD_Fund_Tracker_Function_App.RepositoryLayer.IRepository;
using GTD_Fund_Tracker_Function_App.RepositoryLayer.Repository;

namespace GTD_Fund_Tracker_Function_App.RepositoryLayer
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly GtdFundDbContext _dbContext;
        private IUserRepo _userRepo;
        private IContributionRepo _contributionRepo;
        private ISpendingRepo _spendingRepo;

        public UnitOfWork(GtdFundDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IUserRepo UserRepo => _userRepo ?? (_userRepo = new UserRepo(_dbContext));
        public IContributionRepo ContributionRepo => _contributionRepo ?? (_contributionRepo = new ContributionRepo(_dbContext));
        public ISpendingRepo SpendingRepo => _spendingRepo ?? (_spendingRepo = new SpendingRepo(_dbContext));

        public async Task DoTransactionAsync(Func<Task> operation)
        {
            try
            {
                await operation();
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}
