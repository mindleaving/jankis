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
    public class SymptomsController : ControllerBase
    {
        private readonly IStore<Symptom> symptomsStore;
        private readonly IDiseaseStore diseaseStore;

        public SymptomsController(
            IStore<Symptom> symptomsStore,
            IDiseaseStore diseaseStore)
        {
            this.symptomsStore = symptomsStore;
            this.diseaseStore = diseaseStore;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var item = await symptomsStore.GetByIdAsync(id);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        [HttpGet]
        public async Task<IActionResult> GetMany(int? count = 50, int? skip = 0)
        {
            var items = await symptomsStore.GetMany(count, skip, x => x.Name);
            return Ok(items);
        }

        [HttpGet(nameof(Search))]
        public async Task<IActionResult> Search(string searchText, int? count = 30, int? skip = 0)
        {
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.ContainsAll<Symptom>(x => x.Name.ToLower(), searchTerms);
            var items = await symptomsStore.SearchAsync(searchExpression, count, skip);
            var prioritizedItems = items.OrderBy(x => x.Name.Length);
            return Ok(prioritizedItems);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Store(string id, [FromBody] Symptom symptom)
        {
            if (id != symptom.Id)
                return BadRequest("ID from URL doesn't match ID in body");
            await symptomsStore.StoreAsync(symptom);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await symptomsStore.DeleteAsync(id);
            await diseaseStore.BatchRemove<Disease,Symptom>(x => x.Symptoms, x => x.Id == id);
            return Ok();
        }

        [HttpPost("{symptomId}/" + nameof(BatchAssign))]
        public async Task<IActionResult> BatchAssign(string symptomId, [FromBody] List<string> diseaseIcdCodes)
        {
            var symptom = await symptomsStore.GetByIdAsync(symptomId);
            if (symptom == null)
                return NotFound();
            await diseaseStore.BatchAssign<Disease,Symptom>(
                disease => diseaseIcdCodes.Contains(disease.Icd11Code) && !disease.Symptoms.Any(x => x.Id == symptomId), 
                disease => disease.Symptoms, 
                symptom);
            return Ok();
        }

        [HttpPost("{symptomId}/" + nameof(BatchRemove))]
        public async Task<IActionResult> BatchRemove(string symptomId, [FromBody] List<string> diseaseIcdCodes)
        {
            await diseaseStore.BatchRemove<Disease,Symptom>(x => x.Symptoms, x => x.Id == symptomId, diseaseIcdCodes);
            return Ok();
        }

    }
}
