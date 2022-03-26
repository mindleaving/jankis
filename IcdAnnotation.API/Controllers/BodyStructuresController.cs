using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels.Icd.Annotation;
using HealthModels.Symptoms;
using IcdAnnotation.API.Data;
using IcdAnnotation.API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace IcdAnnotation.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BodyStructuresController : ControllerBase
    {
        private readonly IReadonlyStore<BodyStructure> bodyStructuresStore;
        private readonly IDiseaseStore diseaseStore;

        public BodyStructuresController(
            IReadonlyStore<BodyStructure> bodyStructuresStore,
            IDiseaseStore diseaseStore)
        {
            this.bodyStructuresStore = bodyStructuresStore;
            this.diseaseStore = diseaseStore;
        }

        [HttpGet]
        public async Task<IActionResult> GetMany(int? count = 50, int? skip = 0)
        {
            var items = await bodyStructuresStore.GetMany(count, skip, x => x.IcdCode);
            return Ok(items);
        }

        [HttpGet(nameof(Search))]
        public async Task<IActionResult> Search(string searchText, int? count = 30, int? skip = 0)
        {
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.ContainsAll<BodyStructure>(x => x.Name.ToLower(), searchTerms);
            var items = await bodyStructuresStore.SearchAsync(searchExpression, count, skip);
            var prioritizedItems = items.OrderBy(x => x.Name.Length);
            return Ok(prioritizedItems);
        }

        [HttpPost("{bodyStructureId}/" + nameof(BatchAssign))]
        public async Task<IActionResult> BatchAssign(string bodyStructureId, [FromBody] List<string> diseaseIcdCodes)
        {
            var bodyStructure = await bodyStructuresStore.GetByIdAsync(bodyStructureId);
            if (bodyStructure == null)
                return NotFound();
            await diseaseStore.BatchAssign<Disease,BodyStructure>(
                disease => diseaseIcdCodes.Contains(disease.Icd11Code) && !disease.AffectedBodyStructures.Any(x => x.Id == bodyStructureId), 
                disease => disease.AffectedBodyStructures, 
                bodyStructure);
            return Ok();
        }

        [HttpPost("{bodyStructureId}/" + nameof(BatchRemove))]
        public async Task<IActionResult> BatchRemove(string bodyStructureId, [FromBody] List<string> diseaseIcdCodes)
        {
            await diseaseStore.BatchRemove<Disease,BodyStructure>(x => x.AffectedBodyStructures, x => x.Id == bodyStructureId, diseaseIcdCodes);
            return Ok();
        }
    }
}
