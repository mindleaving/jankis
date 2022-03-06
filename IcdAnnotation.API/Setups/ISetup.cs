using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace IcdAnnotation.API.Setups
{
    public interface ISetup
    {
        void Run(IServiceCollection services, IConfiguration configuration);
    }
}
