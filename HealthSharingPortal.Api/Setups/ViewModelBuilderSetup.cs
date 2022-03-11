using HealthModels;
using HealthSharingPortal.Api.Models;
using HealthSharingPortal.Api.Workflow.ViewModelBuilders;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HealthSharingPortal.Api.Setups
{
    public class ViewModelBuilderSetup : ISetup
    {
        public void Run(IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IViewModelBuilder<Account>, AccountViewModelBuilder>();
        }
    }
}
