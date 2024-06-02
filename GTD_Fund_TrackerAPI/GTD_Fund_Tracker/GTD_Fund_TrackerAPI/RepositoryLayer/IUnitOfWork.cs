using GTD_Fund_TrackerAPI.RepositoryLayer.IRepository;

namespace GTD_Fund_TrackerAPI.RepositoryLayer
{
    public interface IUnitOfWork
    {
            IContributionRepo ContributionRepo { get; }
            IUserRepo UserRepo { get; }
            ISpendingRepo SpendingRepo { get; }
            Task DoTransactionAsync(Func<Task> operation);
    }
}
