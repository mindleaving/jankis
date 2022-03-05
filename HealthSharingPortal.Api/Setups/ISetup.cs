using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HealthSharingPortal.Api.Setups
{
    public interface ISetup
    {
        void Run(IServiceCollection services, IConfiguration configuration);
    }
}
