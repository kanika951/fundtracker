using GTD_Fund_TrackerAPI.Models;
using GTD_Fund_TrackerAPI.Models.Dto;
using GTD_Fund_TrackerAPI.RepositoryLayer.Context;
using GTD_Fund_TrackerAPI.RepositoryLayer.Context.Entity;
using GTD_Fund_TrackerAPI.RepositoryLayer.IRepository;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Data.SqlClient;

namespace GTD_Fund_TrackerAPI.RepositoryLayer.Repository
{
    public class ContributionRepo : IContributionRepo
    {
        private readonly GtdFundDbContext _db;
        private readonly IConfiguration _configuration;

        public ContributionRepo(GtdFundDbContext db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
        }

        public async Task<decimal> GetTotalContribution(DateTime date)
        {
            return (await _db.Contributions
                              .Where(u => u.ContributionDate.Month == date.Month && u.ContributionDate.Year == date.Year && u.Status == "Accepted").ToListAsync())
                              .Select(u => u.Amount).Sum();
        }

        public async Task<IEnumerable<ContributionModel>> GetContributions(DateTime startDate, DateTime endDate, string name, string Category)
        {
            var contributions = new List<ContributionModel>();
            if (name.ToLower() == "all")
            {
                if(Category != "")
                {
                    contributions = await _db.Contributions.Where(c => c.Status == Category && c.ContributionDate.Date >= startDate.Date && c.ContributionDate.Date <= endDate.Date)
                               .AsNoTracking()
                               .Join(_db.Users, c => c.UserId, u => u.Id, (c, u) => new { c, u })
                               .Select(f => new ContributionModel()
                               {
                                   Id = f.c.Id,
                                   UserName = f.u.UserName,
                                   FullName = f.u.FullName,
                                   ContributionDate = f.c.ContributionDate,
                                   Amount = f.c.Amount,
                                   Status = f.c.Status
                               }).ToListAsync();
                }
                else
                {
                    contributions = await _db.Contributions.Where(c => c.ContributionDate.Date >= startDate.Date && c.ContributionDate.Date <= endDate.Date).AsNoTracking()
                               .Join(_db.Users.AsNoTracking(), c => c.UserId, u => u.Id, (c, u) => new { c, u })
                               .Select(f => new ContributionModel()
                               {
                                   Id = f.c.Id,
                                   UserName = f.u.UserName,
                                   FullName = f.u.FullName,
                                   ContributionDate = f.c.ContributionDate,
                                   Amount = f.c.Amount,
                                   Status = f.c.Status
                               }).ToListAsync();
                }
            }
            else
            {
                if (Category != "")
                {
                    contributions = await _db.Contributions.Where(c => c.Status == Category && c.ContributionDate.Date >= startDate.Date && c.ContributionDate.Date <= endDate.Date)
                                .AsNoTracking()
                                .Join(_db.Users.AsNoTracking(), c => c.UserId, u => u.Id, (c, u) => new { c, u })
                                .Where(x => x.u.UserName.StartsWith(name) || x.u.FullName.StartsWith(name))
                                .Select(f => new ContributionModel()
                                {
                                    Id = f.c.Id,
                                    UserName = f.u.UserName,
                                    FullName = f.u.FullName,
                                    ContributionDate = f.c.ContributionDate,
                                    Amount = f.c.Amount,
                                    Status = f.c.Status
                                }).ToListAsync();
                }
                else
                {
                    contributions = await _db.Contributions.Where(c => c.ContributionDate.Date >= startDate.Date && c.ContributionDate.Date <= endDate.Date).AsNoTracking()
                                .Join(_db.Users.AsNoTracking(), c => c.UserId, u => u.Id, (c, u) => new { c, u })
                                .Where(x => x.u.UserName.StartsWith(name) || x.u.FullName.StartsWith(name))
                                .Select(f => new ContributionModel()
                                {
                                    Id = f.c.Id,
                                    UserName = f.u.UserName,
                                    FullName = f.u.FullName,
                                    ContributionDate = f.c.ContributionDate,
                                    Amount = f.c.Amount,
                                    Status = f.c.Status
                                }).ToListAsync();
                }
            }
            return contributions;
        }

        public async Task<bool> AddContribution(ContributionDTO contribution, int userId, string status)
        {
            string connectionString = _configuration.GetConnectionString("DefaultSQLConnection");
            using (var sqlConnection = new SqlConnection(connectionString))
            {
                try
                {
                    sqlConnection.Open();
                    SqlCommand cmd = new SqlCommand("sp_add_contribution", sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@userId", SqlDbType.Int, 50).Value = userId;
                    cmd.Parameters.Add("@amount", SqlDbType.Decimal, 50).Value = contribution.Amount;
                    cmd.Parameters.Add("@status", SqlDbType.VarChar, 20).Value = status;
                    cmd.Parameters.Add("@contributionDate ", SqlDbType.DateTime, 50).Value = contribution.ContributionDate;
                    cmd.ExecuteNonQuery();
                    sqlConnection.Close();
                    return true;
                }
                catch(Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Contribution> GetContribution(int contributionId)
        {
            return await _db.Contributions.Include(u => u.User).Where(u => u.Id == contributionId).FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateContribution(Contribution contribution)
        {
            try
            {
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<decimal> GetAvailableFund()
        {
            var totalContribution = (await _db.Contributions.Where(u => u.Status == "Accepted").ToListAsync()).Select(u => u.Amount).Sum();
            var totalSpending = (await _db.Spendings.ToListAsync()).Select(u => u.Amount).Sum();
            return (totalContribution - totalSpending);
        }
    }
}
