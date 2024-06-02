using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;

namespace GTD_Fund_Tracker_Function_App.Middleware
{
    public class ExceptionMiddleware : IFunctionsWorkerMiddleware
    {
            private readonly ILogger<ExceptionMiddleware> _logger;
            public ExceptionMiddleware(ILogger<ExceptionMiddleware> logger)
            {
                _logger = logger;
            }

        public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong");
                throw;
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
            {
                var code = HttpStatusCode.InternalServerError;
                var result = JsonSerializer.Serialize(new { error = ex.Message });
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)code;
                return context.Response.WriteAsync(result);
            }
    }

    public static class ExceptionMiddlewareExtension
    {
        public static void ConfigureExceptionMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<ExceptionMiddleware>();
        }
    }
}
