using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels.Icd.Annotation;
using HealthModels.Icd.Annotation.Diagnostics;
using IcdAnnotation.API.Data;
using IcdAnnotation.API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace IcdAnnotation.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ObservationsController : ControllerBase
    {
        private readonly IStore<Observation> observationStore;
        private readonly IDiseaseStore diseaseStore;

        public ObservationsController(
            IStore<Observation> observationStore,
            IDiseaseStore diseaseStore)
        {
            this.observationStore = observationStore;
            this.diseaseStore = diseaseStore;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var item = await observationStore.GetByIdAsync(id);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        [HttpGet]
        public async Task<IActionResult> GetMany(int? count = 50, int? skip = 0)
        {
            var items = await observationStore.GetMany(count, skip, x => x.Name);
            return Ok(items);
        }

        [HttpGet(nameof(Search))]
        public async Task<IActionResult> Search(string searchText, int? count = 50, int? skip = 0)
        {
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.ContainsAll<Observation>(x => x.Name.ToLower(), searchTerms);
            var items = await observationStore.SearchAsync(searchExpression, count, skip);
            var prioritizedItems = items.OrderBy(x => x.Name.Length);
            return Ok(prioritizedItems);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Store(string id, [FromBody] Observation symptom)
        {
            if (id != symptom.Id)
                return BadRequest("ID from URL doesn't match ID in body");
            await observationStore.StoreAsync(symptom);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await observationStore.DeleteAsync(id);
            await diseaseStore.BatchRemove<Disease,Observation>(x => x.Observations, x => x.Id == id);
            return Ok();
        }

        [HttpPost("{observationId}/" + nameof(BatchAssign))]
        public async Task<IActionResult> BatchAssign(string observationId, [FromBody] List<string> diseaseIcdCodes)
        {
            var observation = await observationStore.GetByIdAsync(observationId);
            if (observation == null)
                return NotFound();
            await diseaseStore.BatchAssign<Disease,Observation>(
                disease => diseaseIcdCodes.Contains(disease.IcdCode) && !disease.Observations.Any(x => x.Id == observationId), 
                disease => disease.Observations, 
                observation);
            return Ok();
        }

        [HttpPost("{observationId}/" + nameof(BatchRemove))]
        public async Task<IActionResult> BatchRemove(string observationId, [FromBody] List<string> diseaseIcdCodes)
        {
            await diseaseStore.BatchRemove<Disease,Observation>(x => x.Observations, x => x.Id == observationId, diseaseIcdCodes);
            return Ok();
        }

    }
}
