using JanKIS.API.Workflow;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace JanKIS.API.Setups
{
    public class MiscSetup : ISetup
    {
        public void Run(IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<ServiceRequestGatekeeper>();
            services.AddScoped<ServiceRequestChangePolicy>();
            services.AddScoped<INotificationDistributor, NotificationDistributor>();
        }
    }
}