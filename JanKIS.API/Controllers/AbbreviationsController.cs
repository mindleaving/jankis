using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.MedicalTextEditor;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Http;

namespace JanKIS.API.Controllers
{
    public class AbbreviationsController : RestControllerBase<PersonalizedAbbreviation>
    {
        public AbbreviationsController(IStore<PersonalizedAbbreviation> store, IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
        }

        protected override Task<object> TransformItem(PersonalizedAbbreviation item)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<PersonalizedAbbreviation, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "username" => x => x.Username,
                _ => x => x.Abbreviation
            };
        }

        protected override Expression<Func<PersonalizedAbbreviation, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.And(
                SearchExpressionBuilder.ContainsAny<PersonalizedAbbreviation>(x => x.Abbreviation, searchTerms),
                SearchExpressionBuilder.ContainsAny<PersonalizedAbbreviation>(x => x.FullText, searchTerms)
            );
        }

        protected override IEnumerable<PersonalizedAbbreviation> PrioritizeItems(List<PersonalizedAbbreviation> items, string searchText)
        {
            return items;
        }

        protected override Task PublishChange(PersonalizedAbbreviation item, StorageOperation storageOperation, string submitterUsername)
        {
            // Nothing to publish
            return Task.CompletedTask;
        }
    }
}
