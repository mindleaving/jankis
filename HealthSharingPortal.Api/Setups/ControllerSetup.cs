using HealthSharingPortal.API.Converters;
using HealthSharingPortal.API.Workflow;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace HealthSharingPortal.API.Setups
{ 
    public class ControllerSetup : ISetup
    {
        public void Run(IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpContextAccessor();
            services.AddControllers(
                    options =>
                    {
                        options.Filters.Add<SecurityExceptionFilter>();
                    })
                .AddNewtonsoftJson(
                    options =>
                    {
                        options.SerializerSettings.Converters.Add(new StringEnumConverter());
                        options.SerializerSettings.Formatting = Formatting.None;
                        options.SerializerSettings.Converters.Add(new SubscriptionJsonConverter());
                        options.SerializerSettings.Converters.Add(new NotificationJsonConverter());
                    });
        }
    }
}
