using IcdAnnotation.API.Hubs;
using IcdAnnotation.API.Setups;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace IcdAnnotation.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<FeedbackOptions>(Configuration.GetSection(FeedbackOptions.ConfigurationSectionName));

            var setups = new ISetup[]
            {
                new StoreSetup(),
                new ControllerSetup(),
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
                TypescriptGeneratorRunner.Generate();
                app.UseDeveloperExceptionPage();
            }

            //app.UseHttpsRedirection();
            app.UseSwagger();
            app.UseSwaggerUI(
                c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ICD Annotation API");
                });
            app.UseRouting();
            if (env.IsDevelopment())
            {
                app.UseCors();
            }
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<DiseaseLockHub>("/hubs/diseaselock");
            });
        }
    }
}
