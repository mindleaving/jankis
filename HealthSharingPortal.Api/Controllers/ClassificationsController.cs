using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Icd;
using HealthModels.Interview;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassificationsController : ControllerBase
    {
        private readonly IReadonlyStore<IcdCategory> icd11CategoryStore;

        public ClassificationsController(
            IReadonlyStore<IcdCategory> icd11CategoryStore)
        {
            this.icd11CategoryStore = icd11CategoryStore;
        }

        [HttpGet("icd11/{icd11Code}")]
        public async Task<IActionResult> GetIcd11Entry([FromRoute] string icd11Code)
        {
            var item = await icd11CategoryStore.FirstOrDefaultAsync(x => x.Version == "11" && x.Code == icd11Code);
            if (item == null)
                return NotFound();
            return Ok(item);
        }



        [HttpGet("icd11")]
        public async Task<IActionResult> SearchIcd11Code(
            [FromQuery] string searchText,
            [FromQuery] int? count = null,
            [FromQuery] int? skip = null,
            [FromQuery] Language language = Language.en)
        {
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var filterExpressions = new List<Expression<Func<IcdCategory, bool>>> { x => x.Version == "11" };
            if (!string.IsNullOrWhiteSpace(searchText))
            {
                var searchTextExpression = SearchExpressionBuilder.Or(
                    SearchExpressionBuilder.ContainsAny<IcdCategory>(x => x.Code.ToLower(), searchTerms),
                    SearchExpressionBuilder.ContainsAll<IcdCategory>(x => x.Name.ToLower(), searchTerms)
                );
                filterExpressions.Add(searchTextExpression);
            }
            var combinedFilterExpression = SearchExpressionBuilder.And(filterExpressions.ToArray());
            var items = await icd11CategoryStore.SearchAsync(combinedFilterExpression, count, skip);
            if(language != Language.en)
                Translate(items, language);
            return Ok(items);
        }

        private void Translate(List<IcdCategory> items, Language language)
        {
            foreach (var item in items)
            {
                if (item.Translations.ContainsKey(language))
                    item.Name = item.Translations[language];
            }
        }
    }
}
