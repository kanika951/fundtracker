using GTD_Fund_Tracker_Function_App.IServices;
using GTD_Fund_Tracker_Function_App.Middleware;
using GTD_Fund_Tracker_Function_App.RepositoryLayer;
using GTD_Fund_Tracker_Function_App.RepositoryLayer.Context;
using GTD_Fund_Tracker_Function_App.RepositoryLayer.IRepository;
using GTD_Fund_Tracker_Function_App.RepositoryLayer.Repository;
using GTD_Fund_Tracker_Function_App.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults(builder =>
    {
        builder.UseMiddleware<ExceptionMiddleware>();
    })
    .ConfigureServices((hostContext, service) =>
    {
        service.AddTransient<IUnitOfWork, UnitOfWork>();
        service.AddTransient<IUserService, UserService>();
        service.AddTransient<IContributionRepo, ContributionRepo>();
        service.AddTransient<IUserRepo, UserRepo>();
        service.AddTransient<ISpendingRepo, SpendingRepo>();
        service.AddDbContext<GtdFundDbContext>(option =>
        {
            option.UseSqlServer(Environment.GetEnvironmentVariable("DefaultSQLConnection"));
        });
    })

    .Build();

host.Run();
