using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Commons.Misc;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace HealthSharingPortal.API.Setups
{
    public class AccessControlSetup : ISetup
    {
        public void Run(IServiceCollection services, IConfiguration configuration)
        {
            SetupJwtTokenAuthentication(services, configuration);
            services.AddScoped<AuthenticationModule>();
            services.AddScoped<IAuthorizationHandler, SameUserRequirementHandler>();
            services.AddScoped<IAuthorizationHandler, AdminRequirementHandler>();
            services.AddAuthorization();
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
                            ValidAudience = "HealthSharingPortal",
                            ValidIssuer = "HealthSharingPortal"
                        };
                        options.Events = new JwtBearerEvents
                        {
                            OnMessageReceived = context =>
                            {
                                var accessToken = context.Request.Query["access_token"];

                                // If the request is for our hub...
                                var path = context.HttpContext.Request.Path;
                                if (!string.IsNullOrEmpty(accessToken) &&
                                    (path.StartsWithSegments(AccessRequestHub.Route)))
                                {
                                    // Read the token out of the query string
                                    context.Token = accessToken;
                                }
                                return Task.CompletedTask;
                            }
                        };
                    });
            services.AddScoped<ISecurityTokenBuilder>(provider => new JwtSecurityTokenBuilder(privateKey, TimeSpan.FromMinutes(60)));
        }
    }
}
