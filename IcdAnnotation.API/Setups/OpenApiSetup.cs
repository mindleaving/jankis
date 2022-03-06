using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace IcdAnnotation.API.Setups
{
    public class OpenApiSetup : ISetup
    {
        public void Run(IServiceCollection services, IConfiguration configuration)
        {
            services.AddSwaggerGen();
        }
    }
}
