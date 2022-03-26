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
    public class DiseaseHostsController : ControllerBase
    {
        private readonly IStore<DiseaseHost> diseaseHostsStore;
        private readonly IDiseaseStore diseaseStore;

        public DiseaseHostsController(
            IStore<DiseaseHost> diseaseHostsStore,
            IDiseaseStore diseaseStore)
        {
            this.diseaseHostsStore = diseaseHostsStore;
            this.diseaseStore = diseaseStore;
        }

        [HttpGet(nameof(Search))]
        public async Task<IActionResult> Search(string searchText, int? count = 30, int? skip = 0)
        {
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.ContainsAll<DiseaseHost>(x => x.Name.ToLower(), searchTerms);
            var items = await diseaseHostsStore.SearchAsync(searchExpression, count, skip);
            var prioritizedItems = items.OrderBy(x => x.Name.Length);
            return Ok(prioritizedItems);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Store(string id, [FromBody] DiseaseHost diseaseHost)
        {
            if (id != diseaseHost.Id)
                return BadRequest("ID from URL doesn't match ID in body");
            await diseaseHostsStore.StoreAsync(diseaseHost);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await diseaseHostsStore.DeleteAsync(id);
            await diseaseStore.BatchRemove<InfectiousDisease,DiseaseHost>(x => x.Hosts, x => x.Id == id);
            return Ok();
        }

        [HttpPost("{hostId}/" + nameof(BatchAssign))]
        public async Task<IActionResult> BatchAssign(string hostId, [FromBody] List<string> diseaseIcdCodes)
        {
            var diseaseHost = await diseaseHostsStore.GetByIdAsync(hostId);
            if (diseaseHost == null)
                return NotFound();
            await diseaseStore.BatchAssign<InfectiousDisease,DiseaseHost>(
                disease => diseaseIcdCodes.Contains(disease.Icd11Code) && !disease.Hosts.Any(x => x.Id == hostId), 
                disease => disease.Hosts, 
                diseaseHost);
            return Ok();
        }

        [HttpPost("{hostId}/" + nameof(BatchRemove))]
        public async Task<IActionResult> BatchRemove(string hostId, [FromBody] List<string> diseaseIcdCodes)
        {
            await diseaseStore.BatchRemove<InfectiousDisease, DiseaseHost>(x => x.Hosts, x => x.Id == hostId, diseaseIcdCodes);
            return Ok();
        }

    }
}
