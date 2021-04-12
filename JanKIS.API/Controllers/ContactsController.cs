using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.Controllers
{
    public class ContactsController : RestControllerBase<Contact>
    {
        public ContactsController(IStore<Contact> store)
            : base(store)
        {
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
    }
}
