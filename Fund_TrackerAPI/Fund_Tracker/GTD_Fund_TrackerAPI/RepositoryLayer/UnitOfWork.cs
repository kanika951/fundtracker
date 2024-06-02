using GTD_Fund_TrackerAPI.Repository_Layer;
using GTD_Fund_TrackerAPI.RepositoryLayer.Context;
using GTD_Fund_TrackerAPI.RepositoryLayer.IRepository;
using GTD_Fund_TrackerAPI.RepositoryLayer.Repository;

namespace GTD_Fund_TrackerAPI.RepositoryLayer
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly GtdFundDbContext _dbContext;
        private readonly IConfiguration _configuration;
        private IContributionRepo _contributionRepo;
        private IUserRepo _userRepo;
        private ISpendingRepo _spendingRepo;

        public UnitOfWork(GtdFundDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public IContributionRepo ContributionRepo => _contributionRepo ?? (_contributionRepo = new ContributionRepo(_dbContext, _configuration));    
        public IUserRepo UserRepo => _userRepo ?? (_userRepo = new UserRepo(_dbContext));
        public ISpendingRepo SpendingRepo => _spendingRepo ?? (_spendingRepo = new SpendingRepo(_dbContext, _configuration));

        public async Task DoTransactionAsync(Func<Task> operation)
        {
            try
            {
                await _dbContext.Database.BeginTransactionAsync();
                await operation();
                await _dbContext.SaveChangesAsync();
                await _dbContext.Database.CommitTransactionAsync();
            }
            catch (Exception)
            {
                await _dbContext.Database.RollbackTransactionAsync();
                throw;
            }
        }
    }
}
