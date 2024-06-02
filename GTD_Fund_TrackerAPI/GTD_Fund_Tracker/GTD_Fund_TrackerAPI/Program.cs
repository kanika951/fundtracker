using AutoMapper;
using GTD_Fund_TrackerAPI.Concrete_Layer;
using GTD_Fund_TrackerAPI.Contract_Layer;
using GTD_Fund_TrackerAPI.IManagers;
using GTD_Fund_TrackerAPI.Managers;
using GTD_Fund_TrackerAPI.MappingConfig;
using GTD_Fund_TrackerAPI.Middlewares;
using GTD_Fund_TrackerAPI.Repository_Layer;
using GTD_Fund_TrackerAPI.RepositoryLayer;
using GTD_Fund_TrackerAPI.RepositoryLayer.Context;
using GTD_Fund_TrackerAPI.RepositoryLayer.IRepository;
using GTD_Fund_TrackerAPI.RepositoryLayer.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<GtdFundDbContext>(option =>
{
    option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultSQLConnection"));
});
builder.Services.AddControllers().AddNewtonsoftJson();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var mapperConfig = new MapperConfiguration(mc =>
{
    mc.AddProfile(new Mapping());
});

var _key = "@uthentic@tedU$er";
builder.Services.AddAuthentication(u =>
{
    u.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    u.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(u =>
{
    u.RequireHttpsMetadata = false;
    u.SaveToken = true;
    u.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_key)),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

//builder.Services.AddSingleton<IConfiguration>(Configuration);

builder.Services.AddSingleton <IJWTAuthenticationManager>(new JWTAuthenticationManager(_key));
IMapper mapper = mapperConfig.CreateMapper();
builder.Services.AddSingleton(mapper);
builder.Services.AddControllers().AddNewtonsoftJson(x => x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore).AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

builder.Services.AddTransient<ICommonManager, CommonManager>();
builder.Services.AddTransient<IUserManager, UserManager>();
builder.Services.AddTransient<IAdminManager, AdminManager>();
builder.Services.AddTransient<IUserRepo, UserRepo>();
builder.Services.AddTransient<IContributionRepo, ContributionRepo>();
builder.Services.AddTransient<ISpendingRepo, SpendingRepo>();
builder.Services.AddTransient<ExceptionMiddleware>();
builder.Services.AddTransient<IUnitOfWork, UnitOfWork>();
builder.Services.AddCors(p => p.AddPolicy("corspolicy", build =>
{
    build.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
}));


var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
 
app.UseAuthorization();

app.MapControllers();

app.UseCors("corspolicy");

app.Run();
