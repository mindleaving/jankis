using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Commons.Extensions;
using Commons.Misc;
using Commons.Physics;
using JanKIS.API.AccessManagement;
using JanKIS.API.Hubs;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels.Builders;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using JanKIS.API.Workflow;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

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
            services.Configure<FileStoreOptions>(Configuration.GetSection(FileStoreOptions.AppSettingsSectionName));
            SetupMongoDB(services);

            SetupStores(services);
            services.AddScoped<ServiceRequestGatekeeper>();
            services.AddScoped<ServiceRequestChangePolicy>();
            services.AddScoped<INotificationDistributor, NotificationDistributor>();
            SetupViewModelBuilders(services);

            services.AddHttpContextAccessor();
            services.AddControllers()
                .AddNewtonsoftJson(
                    options =>
                    {
                        options.SerializerSettings.Converters.Add(new StringEnumConverter());
                        options.SerializerSettings.Formatting = Formatting.None;
                    });
            SetupJwtTokenAuthentication(services);
            services.AddScoped<AuthenticationModule>();
            services.AddScoped<IAuthorizationHandler, SameUserRequirementHandler>();
            services.AddScoped<IAuthorizationHandler, NotSameUserRequirementHandler>();
            services.AddAuthorization(
                options =>
                {
                    foreach (var permission in EnumExtensions.GetValues<Permission>())
                    {
                        options.AddPolicy(permission.ToString(), policy => policy.RequireClaim(permission.ToString()));
                    }
                    options.AddPolicy(SameUserRequirement.PolicyName, builder => builder.AddRequirements(new SameUserRequirement("username")));
                    options.AddPolicy(NotSameUserRequirement.PolicyName, builder => builder.AddRequirements(new NotSameUserRequirement("username")));
                });
            services.AddCors(
                options =>
                {
                    options.AddDefaultPolicy(
                        builder =>
                        {
                            builder
                                .WithOrigins(Configuration["CORS:Origins"].Split(','))
                                .AllowAnyMethod()
                                .AllowAnyHeader()
                                .AllowCredentials();
                        });
                });
            services.AddSwaggerGen(
                options =>
                {
                    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                    {
                        Description = "JWT Bearer token authentication",
                        BearerFormat = "JWT",
                        Name = "Authorization",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.ApiKey,
                        Scheme = "bearer"
                    });
                    options.AddSecurityRequirement(new OpenApiSecurityRequirement
                    {
                        { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }, new List<string>() }
                    });
                });
            services.AddSignalR();
        }

        private static void SetupStores(IServiceCollection services)
        {
            SetupTypeStores<Account>(services);
            services.AddScoped<IAccountStore, AccountStore>();
            SetupTypeStores<Admission>(services);
            services.AddScoped<IAdmissionsStore, AdmissionsStore>();
            SetupTypeStores<AttachedEquipment>(services);
            services.AddScoped<IAutocompleteCache, AutocompleteCache>();
            SetupTypeStores<BedOccupancy>(services);
            SetupTypeStores<Consumable>(services);
            SetupTypeStores<ConsumableOrder>(services);
            services.AddScoped<IConsumableOrdersStore, ConsumableOrdersStore>();
            SetupTypeStores<Contact>(services);
            SetupTypeStores<Department>(services);
            SetupTypeStores<DiagnosticTestDefinition>(services);
            SetupTypeStores<DiagnosticTestResult>(services);
            SetupTypeStores<Drug>(services);
            services.AddScoped<IFilesStore, FilesStore>();
            SetupTypeStores<Institution>(services);
            SetupTypeStores<InstitutionPolicy>(services);
            SetupTypeStores<MedicationSchedule>(services);
            services.AddScoped<IMedicationScheduleStore, MedicationScheduleStore>();
            SetupTypeStores<MedicationDispension>(services);
            SetupTypeStores<NotificationBase>(services);
            services.AddScoped<INotificationsStore, NotificationsStore>();
            SetupTypeStores<Observation>(services);
            SetupTypeStores<PatientDocument>(services);
            SetupTypeStores<PatientNote>(services);
            SetupTypeStores<Person>(services);
            SetupTypeStores<Resource>(services);
            SetupTypeStores<Role>(services);
            SetupTypeStores<Room>(services);
            SetupTypeStores<ServiceDefinition>(services);
            services.AddScoped<IServiceStore, ServiceStore>();
            SetupTypeStores<ServiceRequest>(services);
            services.AddScoped<IServiceRequestsStore, ServiceRequestsStore>();
            SetupTypeStores<Stock>(services);
            SetupTypeStores<SubscriptionBase>(services);
            services.AddScoped<ISubscriptionsStore, SubscriptionsStore>();
        }

        private static void SetupTypeStores<T>(IServiceCollection services) where T: IId
        {
            services.AddScoped<IReadonlyStore<T>, GenericReadonlyStore<T>>();
            services.AddSingleton<ICachedReadonlyStore<T>, GenericCachedReadonlyStore<T>>();
            services.AddScoped<IStore<T>, GenericStore<T>>();
        }

        private static void SetupViewModelBuilders(IServiceCollection services)
        {
            services.AddScoped<IViewModelBuilder<Account>, AccountViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<AttachedEquipment>, AttachedEquipmentViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<Consumable>, ConsumableViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<ConsumableOrder>, ConsumableOrderViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<Department>, DepartmentViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<Institution>, InstitutionViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<LocationReference>, LocationViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<Resource>, ResourceViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<ServiceAudience>, ServiceAudienceViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<ServiceDefinition>, ServiceViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<Stock>, StockViewModelBuilder>();
            services.AddScoped<IViewModelBuilder<StockState>, StockStateViewModelBuilder>();
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
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Doctor's ToDo API");
                });
            app.UseRouting();
            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<NotificationsHub>(NotificationsHub.Route);
            });
        }

        private void SetupMongoDB(IServiceCollection services)
        {
            ConventionRegistry.Register("EnumStringConvetion", new ConventionPack
            {
                new EnumRepresentationConvention(BsonType.String)
            }, type => true);
            BsonSerializer.RegisterSerializer(typeof(UnitValue), new UnitValueBsonSerializer());
            services.AddSingleton<IMongoClient>(new MongoClient());
            services.AddSingleton<IMongoDatabase>(
                provider =>
                {
                    var databaseName = Configuration["MongoDB:DatabaseName"];
                    return provider.GetService<IMongoClient>().GetDatabase(databaseName);
                });
        }

        private void SetupJwtTokenAuthentication(IServiceCollection services)
        {
            var jwtPrivateKeyEnvironmentVariable = Configuration["Authentication:Jwt:PrivateKeyEnvironmentVariable"];
            SymmetricSecurityKey privateKey;
            try
            {
                privateKey = new SymmetricSecurityKey(Convert.FromBase64String(Secrets.Get(jwtPrivateKeyEnvironmentVariable)));
            }
            catch (KeyNotFoundException)
            {
                using var rng = new RNGCryptoServiceProvider();
                var bytes = new byte[32];
                rng.GetBytes(bytes);
                privateKey = new SymmetricSecurityKey(bytes);
                Console.WriteLine(
                    $"JWT private key candidate: {Convert.ToBase64String(bytes)}. Store this as environment variable '{jwtPrivateKeyEnvironmentVariable}'.");
            }

            services.AddAuthentication(
                    x =>
                    {
                        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    })
                .AddJwtBearer(
                    options =>
                    {
                        options.SaveToken = true;
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = privateKey,
                            ValidAudience = "JanKIS",
                            ValidIssuer = "JanKIS"
                        };
                        options.Events = new JwtBearerEvents
                        {
                            OnMessageReceived = context =>
                            {
                                var accessToken = context.Request.Query["access_token"];

                                // If the request is for our hub...
                                var path = context.HttpContext.Request.Path;
                                if (!string.IsNullOrEmpty(accessToken) &&
                                    (path.StartsWithSegments(NotificationsHub.Route)))
                                {
                                    // Read the token out of the query string
                                    context.Token = accessToken;
                                }
                                return Task.CompletedTask;
                            }
                        };
                    });
            services.AddScoped<ISecurityTokenBuilder>(
                provider =>
                {
                    var rolesStore = provider.GetService<IReadonlyStore<Role>>();
                    return new JwtSecurityTokenBuilder(rolesStore, privateKey, TimeSpan.FromMinutes(60));
                });
        }
    }
}
