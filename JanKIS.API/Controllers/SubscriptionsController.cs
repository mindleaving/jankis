using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Interview;
using HealthSharingPortal.API.Controllers;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using JanKIS.API.Models.Subscriptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SearchExpressionBuilder = JanKIS.API.Helpers.SearchExpressionBuilder;
using SubscriptionComparer = JanKIS.API.Helpers.SubscriptionComparer;

namespace JanKIS.API.Controllers
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
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var existingTypeSubscriptions = await store.SearchAsync(x => x.Username.ToLower() == username && x.Type == item.Type);
            var matchingSubscription = existingTypeSubscriptions.FirstOrDefault(existing => SubscriptionComparer.IsMatch(existing, item));
            if (matchingSubscription != null)
                return Conflict(matchingSubscription.Id);
            item.Username = username;
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
                _ => x => x.Username
            };
        }

        protected override Expression<Func<SubscriptionBase, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<SubscriptionBase>(x => x.Username.ToLower(), searchTerms);
        }

        protected override IEnumerable<SubscriptionBase> PrioritizeItems(
            List<SubscriptionBase> items,
            string searchText)
        {
            return items;
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
