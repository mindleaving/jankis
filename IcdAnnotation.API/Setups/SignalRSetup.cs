using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace IcdAnnotation.API.Setups
{
    public class SignalRSetup : ISetup
    {
        public void Run(IServiceCollection services, IConfiguration configuration)
        {
            services.AddSignalR();
        }
    }
}
