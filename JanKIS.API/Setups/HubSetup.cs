using JanKIS.API.Workflow;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace JanKIS.API.Setups
{
    public class HubSetup : ISetup
    {
        public void Run(IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<INotificationDistributor, NotificationDistributor>();
        }
    }
}