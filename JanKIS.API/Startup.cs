using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using Commons.Extensions;
using Commons.Misc;
using Commons.Physics;
using JanKIS.API.AccessManagement;
using JanKIS.API.Models;
using JanKIS.API.Storage;
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
            SetupMongoDB(services);

            services.AddScoped<IAccountStore, AccountStore>();
            services.AddScoped<IStore<Account>, GenericStore<Account>>();
            services.AddScoped<IReadonlyStore<Account>, GenericReadonlyStore<Account>>();
            services.AddScoped<IReadonlyStore<Role>, GenericReadonlyStore<Role>>();
            services.AddScoped<IStore<Role>, GenericStore<Role>>();
            services.AddScoped<IReadonlyStore<Person>, GenericReadonlyStore<Person>>();
            services.AddScoped<IStore<Person>, GenericStore<Person>>();
            services.AddScoped<IAccountStore, AccountStore>();
            services.AddScoped<IReadonlyStore<Person>, GenericReadonlyStore<Person>>();
            services.AddScoped<IStore<Person>, GenericStore<Person>>();
            services.AddScoped<IAutocompleteCache, AutocompleteCache>();
            services.AddScoped<IReadonlyStore<Contact>, GenericReadonlyStore<Contact>>();
            services.AddScoped<IStore<Contact>, GenericStore<Contact>>();
            services.AddScoped<IAdmissionsStore, AdmissionsStore>();
            services.AddScoped<IReadonlyStore<Institution>, GenericReadonlyStore<Institution>>();
            services.AddScoped<IStore<Institution>, GenericStore<Institution>>();
            services.AddScoped<IReadonlyStore<Department>, GenericReadonlyStore<Department>>();
            services.AddScoped<IStore<Department>, GenericStore<Department>>();
            services.AddScoped<IReadonlyStore<ServiceDefinition>, GenericReadonlyStore<ServiceDefinition>>();
            services.AddScoped<IStore<ServiceDefinition>, GenericStore<ServiceDefinition>>();
            services.AddScoped<IReadonlyStore<ServiceRequest>, GenericReadonlyStore<ServiceRequest>>();
            services.AddScoped<IStore<ServiceRequest>, GenericStore<ServiceRequest>>();
            services.AddScoped<IReadonlyStore<ConsumableOrder>, GenericReadonlyStore<ConsumableOrder>>();
            services.AddScoped<IStore<ConsumableOrder>, GenericStore<ConsumableOrder>>();
            services.AddScoped<IReadonlyStore<Consumable>, GenericReadonlyStore<Consumable>>();
            services.AddScoped<IStore<Consumable>, GenericStore<Consumable>>();
            services.AddScoped<IReadonlyStore<InstitutionPolicy>, GenericReadonlyStore<InstitutionPolicy>>();
            services.AddScoped<IStore<InstitutionPolicy>, GenericStore<InstitutionPolicy>>();

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
                                .AllowAnyHeader();
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
                //endpoints.MapHub<xxxx>("hubs/xxxx");
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
