using HealthSharingPortal.API.Hubs;
using JanKIS.API.Setups;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;

namespace JanKIS.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            var setups = new ISetup[]
            {
                new StoreSetup(),
                new MiscSetup(),
                new HubSetup(),
                new ViewModelBuilderSetup(),
                new ControllerSetup(),
                new AccessControlSetup(),
                new CorsSetup(),
                new OpenApiSetup(),
                new SignalRSetup()
            };
            foreach (var setup in setups)
            {
                setup.Run(services, Configuration);
            }
        }



        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                TypescriptGeneratorRunner.Run();
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            app.UseSwagger();
            app.UseSwaggerUI(
                c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "JanKIS API");
                });
            app.UseRouting();
            if (env.IsDevelopment())
            {
                app.UseCors();
            }
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<NotificationsHub>(NotificationsHub.Route);
            });
        }
    }
}
