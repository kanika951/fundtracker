using GTD_Fund_TrackerAPI.Models;
using GTD_Fund_TrackerAPI.RepositoryLayer.Context;
using GTD_Fund_TrackerAPI.RepositoryLayer.IRepository;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Data.SqlClient;

namespace GTD_Fund_TrackerAPI.RepositoryLayer.Repository
{
    public class SpendingRepo : ISpendingRepo
    {
        private readonly GtdFundDbContext _db;
        private readonly IConfiguration _configuration;

        public SpendingRepo(GtdFundDbContext db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
        }

        public async Task<decimal> GetTotalSpending(DateTime date)
        {
           return (await _db.Spendings.Where(u => u.SpendDate.Month == date.Month && u.SpendDate.Year == date.Year).ToListAsync()).Select(u => u.Amount).Sum();
        }

        public async Task<IEnumerable<SpendingModel>> GetSpendings(DateTime startDate, DateTime endDate, string name)
        {
            var spendings = new List<SpendingModel>();
            if (name.ToLower() == "all")
            {
                spendings = await _db.Spendings.Where(s => s.SpendDate.Date >= startDate.Date && s.SpendDate.Date <= endDate.Date).AsNoTracking()
                               .Join(_db.Users.AsNoTracking(), s => s.UserId, u => u.Id, (s, u) => new { s, u })
                               .Select(f => new SpendingModel()
                               {
                                   UserName = f.u.UserName,
                                   FullName = f.u.FullName,
                                   SpendDate = f.s.SpendDate,
                                   Amount = f.s.Amount,
                                   UsedFor = f.s.UsedFor
                               }).ToListAsync();
            }
            else
            {
                spendings = await _db.Spendings.Where(s => s.SpendDate.Date >= startDate.Date && s.SpendDate.Date <= endDate.Date).AsNoTracking()
                                .Join(_db.Users.AsNoTracking(), s => s.UserId, u => u.Id, (s, u) => new { s, u })
                                .Where(x => x.u.UserName.StartsWith(name) || x.u.FullName.StartsWith(name))
                                .Select(f => new SpendingModel()
                                {
                                    UserName = f.u.UserName,
                                    FullName = f.u.FullName,
                                    SpendDate = f.s.SpendDate,
                                    Amount = f.s.Amount,
                                    UsedFor = f.s.UsedFor
                                }).ToListAsync();
            }
            return spendings;
        }

        public async Task<bool> AddSpending(SpendingModel spending,int userId)
        {
            string connectionString = _configuration.GetConnectionString("DefaultSQLConnection"); 
            using (var sqlConnection = new SqlConnection(connectionString))
            {
                try
                {
                    sqlConnection.Open();
                    SqlCommand cmd = new SqlCommand("sp_add_spending", sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@userId", SqlDbType.Int, 50).Value = userId;
                    cmd.Parameters.Add("@amount", SqlDbType.Decimal, 50).Value = spending.Amount;
                    cmd.Parameters.Add("@spendingDate", SqlDbType.DateTime, 50).Value = spending.SpendDate;
                    cmd.Parameters.Add("@usedFor", SqlDbType.NVarChar, 200).Value = spending.UsedFor;
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
    }
}
