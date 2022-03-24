using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HealthSharingPortal.API.Setups
{
    public class ViewModelBuilderSetup : ISetup
    {
        public void Run(IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IViewModelBuilder<Account>, AccountViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<StudyEnrollment>, StudyEnrollmentViewModelBuilder>();
        }
    }
}
