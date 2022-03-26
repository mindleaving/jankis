using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels.Icd.Annotation;
using HealthModels.Icd.Annotation.Epidemiology;
using IcdAnnotation.API.Data;
using IcdAnnotation.API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace IcdAnnotation.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MicrobsController : ControllerBase
    {
        private readonly IReadonlyStore<Microb> microbStore;
        private readonly IDiseaseStore diseaseStore;

        public MicrobsController(
            IReadonlyStore<Microb> microbStore,
            IDiseaseStore diseaseStore)
        {
            this.microbStore = microbStore;
            this.diseaseStore = diseaseStore;
        }

        [HttpGet(nameof(Search))]
        public async Task<IActionResult> Search(string searchText, int? count = 30, int? skip = 0)
        {
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.ContainsAll<Microb>(x => x.Name.ToLower(), searchTerms);
            var items = await microbStore.SearchAsync(searchExpression, count, skip);
            var prioritizedItems = items.OrderBy(x => x.Name.Length);
            return Ok(prioritizedItems);
        }

        [HttpPost("{microbIcdCode}/" + nameof(BatchAssign))]
        public async Task<IActionResult> BatchAssign(string microbIcdCode, [FromBody] List<string> diseaseIcdCodes)
        {
            var microb = await microbStore.GetByIdAsync(microbIcdCode);
            if (microb == null)
                return NotFound();
            await diseaseStore.BatchAssign<InfectiousDisease,Microb>(
                disease => diseaseIcdCodes.Contains(disease.Icd11Code) && !disease.Pathogens.Any(x => x.IcdCode == microbIcdCode), 
                disease => disease.Pathogens, 
                microb);
            return Ok();
        }

        [HttpPost("{microbIcdCode}/" + nameof(BatchRemove))]
        public async Task<IActionResult> BatchRemove(string microbIcdCode, [FromBody] List<string> diseaseIcdCodes)
        {
            await diseaseStore.BatchRemove<InfectiousDisease, Microb>(x => x.Pathogens, x => x.IcdCode == microbIcdCode, diseaseIcdCodes);
            return Ok();
        }
    }
}
