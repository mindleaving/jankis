using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Commons.Extensions;
using Commons.Misc;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Hubs;
using HealthSharingPortal.API.Storage;
using JanKIS.API.AccessManagement;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using AuthenticationModule = JanKIS.API.AccessManagement.AuthenticationModule;
using AuthorizationModule = JanKIS.API.AccessManagement.AuthorizationModule;
using ISecurityTokenBuilder = JanKIS.API.AccessManagement.ISecurityTokenBuilder;
using SameUserRequirement = JanKIS.API.AccessManagement.SameUserRequirement;
using SameUserRequirementHandler = JanKIS.API.AccessManagement.SameUserRequirementHandler;

namespace JanKIS.API.Setups
{
    public class AccessControlSetup : ISetup
    {
        public void Run(IServiceCollection services, IConfiguration configuration)
        {
            SetupJwtTokenAuthentication(services, configuration);
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
            services.AddScoped<IAuthorizationModule, AuthorizationModule>();
        }

        private void SetupJwtTokenAuthentication(IServiceCollection services, IConfiguration configuration)
        {
            var jwtPrivateKeyEnvironmentVariable = configuration["Authentication:Jwt:PrivateKeyEnvironmentVariable"];
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
