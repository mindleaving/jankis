using HealthSharingPortal.API.Workflow;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HealthSharingPortal.API.Setups
{
    public class SignalRSetup : ISetup
    {
        public void Run(IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<INotificationDistributor, NotificationDistributor>();
            services.AddSignalR();
        }
    }
}
