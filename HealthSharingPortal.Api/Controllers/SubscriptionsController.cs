using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models.Subscriptions;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class SubscriptionsController : RestControllerBase<SubscriptionBase>
    {
        public SubscriptionsController(
            IStore<SubscriptionBase> store,
            IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
        }

        public override async Task<IActionResult> CreateOrReplace(
            string id,
            SubscriptionBase item)
        {
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
            var existingTypeSubscriptions = await store.SearchAsync(x => x.AccountId.ToLower() == username && x.Type == item.Type);
            var matchingSubscription = existingTypeSubscriptions.FirstOrDefault(existing => SubscriptionComparer.IsMatch(existing, item));
            if (matchingSubscription != null)
                return Conflict(matchingSubscription.Id);
            item.AccountId = username;
            return await base.CreateOrReplace(id, item);
        }

        protected override Task<object> TransformItem(
            SubscriptionBase item,
            Language language = Language.en)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<SubscriptionBase, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                _ => x => x.AccountId
            };
        }

        protected override Expression<Func<SubscriptionBase, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<SubscriptionBase>(x => x.AccountId.ToLower(), searchTerms);
        }

        protected override Task PublishChange(
            SubscriptionBase item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            // Nothing to do
            return Task.CompletedTask;
        }
    }
}
