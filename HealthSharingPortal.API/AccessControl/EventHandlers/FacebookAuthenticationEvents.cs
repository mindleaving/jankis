using System;
using System.Linq;
using System.Threading.Tasks;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Authentication.OAuth;

namespace HealthSharingPortal.API.AccessControl.EventHandlers
{
    public class FacebookAuthenticationEvents : OAuthEvents
    {
        private readonly ILoginStore loginStore;

        public FacebookAuthenticationEvents(ILoginStore loginStore)
        {
            this.loginStore = loginStore;
        }

        public override async Task CreatingTicket(
            OAuthCreatingTicketContext context)
        {
            var loginProvider = LoginProvider.Facebook;
            var externalId = context.Identity.Claims.ToList().GetExternalId();
            var existingLogin = await loginStore.GetExternalByIdAsync(loginProvider, externalId);
            if (existingLogin == null)
            {
                var id = await loginStore.GetUnusedId();
                var externalLogin = new ExternalLogin
                {
                    Id = id,
                    LoginProvider = loginProvider,
                    ExternalId = externalId
                };
                await loginStore.StoreAsync(externalLogin);
            }
            await base.CreatingTicket(context);
        }
    }
}
