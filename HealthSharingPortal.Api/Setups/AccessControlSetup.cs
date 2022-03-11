using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using Commons.Misc;
using HealthSharingPortal.Api.AccessControl;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace HealthSharingPortal.Api.Setups
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
                    });
            services.AddScoped<ISecurityTokenBuilder>(provider => new JwtSecurityTokenBuilder(privateKey, TimeSpan.FromMinutes(60)));
        }
    }
}
