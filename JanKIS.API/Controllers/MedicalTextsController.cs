using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.MedicalTextEditor;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Http;

namespace JanKIS.API.Controllers
{
    public class MedicalTextsController : RestControllerBase<MedicalText>
    {
        public MedicalTextsController(IStore<MedicalText> store, IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
        }

        protected override Task<object> TransformItem(MedicalText item)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<MedicalText, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "title" => x => x.Title,
                _ => x => x.Id
            };
        }

        protected override Expression<Func<MedicalText, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<MedicalText>(x => x.Title, searchTerms);
        }

        protected override IEnumerable<MedicalText> PrioritizeItems(List<MedicalText> items, string searchText)
        {
            return items;
        }

        protected override Task PublishChange(MedicalText item, StorageOperation storageOperation, string submitterUsername)
        {
            // Nothing to do
            return Task.CompletedTask;
        }
    }
}
