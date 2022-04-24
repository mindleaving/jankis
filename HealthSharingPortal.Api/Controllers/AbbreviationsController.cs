using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthModels.MedicalTextEditor;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.API.Controllers
{
    public class AbbreviationsController : RestControllerBase<PersonalizedAbbreviation>
    {
        public AbbreviationsController(IStore<PersonalizedAbbreviation> store, IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
        }

        protected override Task<object> TransformItem(
            PersonalizedAbbreviation item,
            Language language = Language.en)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<PersonalizedAbbreviation, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "username" => x => x.AccountId,
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

        protected override Task PublishChange(PersonalizedAbbreviation item, StorageOperation storageOperation, string submitterUsername)
        {
            // Nothing to publish
            return Task.CompletedTask;
        }
    }
}
