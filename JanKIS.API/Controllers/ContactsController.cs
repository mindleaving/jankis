using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Http;

namespace JanKIS.API.Controllers
{
    public class ContactsController : RestControllerBase<Contact>
    {
        public ContactsController(
            IStore<Contact> store,
            IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
        }

        protected override Task<object> TransformItem(Contact item)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<Contact, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "name" => x => x.Name,
                "phonenumber" => x => x.PhoneNumber,
                "email" => x => x.Email,
                _ => x => x.Name
            };
        }

        protected override Expression<Func<Contact, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<Contact>(x => x.Name.ToLower(), searchTerms);
        }

        protected override IEnumerable<Contact> PrioritizeItems(
            List<Contact> items,
            string searchText)
        {
            return items.OrderBy(x => x.Name);
        }

        protected override Task PublishChange(
            Contact item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            // Nothing to do
            return Task.CompletedTask;
        }
    }
}
