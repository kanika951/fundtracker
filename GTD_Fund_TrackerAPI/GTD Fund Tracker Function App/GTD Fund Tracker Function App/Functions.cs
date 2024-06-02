using GTD_Fund_Tracker_Function_App.IServices;
using GTD_Fund_Tracker_Function_App.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace GTD_Fund_Tracker_Function_App
{
    public class Functions
    {
        private readonly ILogger _logger;
        private readonly IUserService _userService;

        public Functions(ILoggerFactory loggerFactory, IUserService userService)
        {
            _logger = loggerFactory.CreateLogger<Functions>();
            _userService = userService;
        }

        [Function("UpdatePendingAmount")]
        public async Task UpdatePendingAmount([TimerTrigger("0 0 0 1 * *")] MyInfo myTimer)
        {
            _logger.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
            _logger.LogInformation($"Next timer schedule at: {myTimer.ScheduleStatus.Next}");
            await _userService.UpdatePendingAmount();
        }
    }
}
