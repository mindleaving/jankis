using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Commons.Misc;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.AccessControl.EventHandlers;
using HealthSharingPortal.API.Hubs;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
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
            var authenticationBuilder = services.AddAuthentication(
                options =>
                {
                    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                });
            SetupJwtTokenAuthentication(authenticationBuilder, services, configuration);
            SetupExternalLogins(authenticationBuilder, services, configuration);
            services.AddScoped<IAuthenticationModule, AuthenticationModule>();
            services.AddScoped<IAuthorizationHandler, SameUserRequirementHandler>();
            services.AddScoped<IAuthorizationHandler, AdminRequirementHandler>();
            services.AddAuthorization();
            services.AddScoped<IAuthorizationModule, AuthorizationModule>();
            services.AddSingleton<IEmergencyTokenGenerator, EmergencyTokenGenerator>();
        }

        private void SetupJwtTokenAuthentication(AuthenticationBuilder authenticationBuilder, 
            IServiceCollection services,
            IConfiguration configuration)
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

            authenticationBuilder.AddJwtBearer(
                options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = privateKey,
                        ValidAudience = JwtSecurityTokenBuilder.Audience,
                        ValidIssuer = JwtSecurityTokenBuilder.Issuer
                    };
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            // If the request is for our hub...
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments(AccessRequestHub.Route)))
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

        private void SetupExternalLogins(
            AuthenticationBuilder authenticationBuilder,
            IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddScoped<GoogleAuthenticationEvents>();
            services.AddScoped<TwitterAuthenticationEvents>();
            services.AddScoped<FacebookAuthenticationEvents>();
            services.AddScoped<MicrosoftAuthenticationEvents>();
            authenticationBuilder
                .AddCookie()
                .AddGoogle(
                    options =>
                    {
                        options.ClientId = configuration["Authentication:Google:ClientID"];
                        options.ClientSecret = configuration["Authentication:Google:ClientSecret"];
                        options.CallbackPath = "/api/accounts/external-login/google/callback";
                        options.EventsType = typeof(GoogleAuthenticationEvents);
                    })
                .AddTwitter(
                    options =>
                    {
                        options.ConsumerKey = configuration["Authentication:Twitter:APIKey"];
                        options.ConsumerSecret = configuration["Authentication:Twitter:APISecret"];
                        options.CallbackPath = "/api/accounts/external-login/twitter/callback";
                        options.EventsType = typeof(TwitterAuthenticationEvents);
                    })
                .AddFacebook(
                    options =>
                    {
                        options.AppId = configuration["Authentication:Facebook:AppID"];
                        options.AppSecret = configuration["Authentication:Facebook:AppSecret"];
                        options.CallbackPath = "/api/accounts/external-login/facebook/callback";
                        options.EventsType = typeof(FacebookAuthenticationEvents);
                    })
                .AddMicrosoftAccount(
                    options =>
                    {
                        options.ClientId = configuration["Authentication:Microsoft:ClientId"];
                        options.ClientSecret = configuration["Authentication:Microsoft:ClientSecret"];
                        options.CallbackPath = "/api/accounts/external-login/microsoft/callback";
                        options.EventsType = typeof(MicrosoftAuthenticationEvents);
                    });
        }
    }
}
