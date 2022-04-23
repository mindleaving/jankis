using System;
using System.Threading.Tasks;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Authentication.Twitter;

namespace HealthSharingPortal.API.AccessControl.EventHandlers
{
    public class TwitterAuthenticationEvents : TwitterEvents
    {
        private readonly ILoginStore loginStore;

        public TwitterAuthenticationEvents(ILoginStore loginStore)
        {
            this.loginStore = loginStore;
        }

        public override async Task CreatingTicket(
            TwitterCreatingTicketContext context)
        {
            var loginProvider = LoginProvider.Twitter;
            var externalId = context.UserId;
            var existingAccount = await loginStore.GetExternalByIdAsync(loginProvider, externalId);
            if (existingAccount == null)
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
