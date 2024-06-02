using GTD_Fund_Tracker_Function_App.RepositoryLayer.IRepository;

namespace GTD_Fund_Tracker_Function_App.RepositoryLayer
{
    public interface IUnitOfWork
    {
        IUserRepo UserRepo { get; }
        IContributionRepo ContributionRepo { get; }
        ISpendingRepo SpendingRepo { get; }
        Task DoTransactionAsync(Func<Task> operation);
    }
}
