using AtomicAPI.Services.Core;
using AtomicDB.Extensions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicAPI.Services.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddAtomicServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAtomicDBContextFactory(configuration.GetConnectionString("AtomicDB"));

            services.AddScoped<ITaskService, TaskService>()
                    .AddScoped<IUserService, UserService>();


            return services;
        }
    }
}
