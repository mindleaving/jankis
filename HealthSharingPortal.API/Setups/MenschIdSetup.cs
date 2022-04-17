using System.Net.Http;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Workflow.MenschId;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HealthSharingPortal.API.Setups
{
    public class MenschIdSetup : ISetup
    {
        public void Run(
            IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddSingleton<HttpClient>();
            services.AddSingleton(new MenschIdApiClientSettings());
            services.AddScoped<IMenschIdApiClient, MenschIdApiClient>();
            services.AddScoped<IMenschIdVerifier, MenschIdVerifier>();
        }
    }
}
