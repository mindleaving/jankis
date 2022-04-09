using System.Reflection;
using HealthSharingPortal.API.Controllers;
using HealthSharingPortal.API.Workflow;
using JanKIS.API.Converters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace JanKIS.API.Setups
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
                .AddApplicationPart(Assembly.GetAssembly(typeof(ObservationsController)))
                .ConfigureApplicationPartManager(
                    manager =>
                    {
                        manager.FeatureProviders.Add(new FilteredHealthControllersProvider());
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
