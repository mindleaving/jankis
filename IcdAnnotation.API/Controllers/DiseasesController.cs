using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using HealthModels.Icd;
using HealthModels.Icd.Annotation;
using IcdAnnotation.API.Data;
using IcdAnnotation.API.Helpers;
using IcdAnnotation.API.Hubs;
using IcdAnnotation.API.Models;
using IcdAnnotation.API.Models.Filters;
using IcdAnnotation.API.Models.SignalRClients;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace IcdAnnotation.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiseasesController : ControllerBase
    {
        private readonly IDiseaseStore diseaseStore;
        private readonly IReadonlyStore<IcdChapter> icdChapterStore;
        private readonly IHubContext<DiseaseLockHub, IDiseaseLockClient> diseaseLockHub;

        public DiseasesController(
            IDiseaseStore diseaseStore,
            IReadonlyStore<IcdChapter> icdChapterStore,
            IHubContext<DiseaseLockHub, IDiseaseLockClient> diseaseLockHub)
        {
            this.diseaseStore = diseaseStore;
            this.icdChapterStore = icdChapterStore;
            this.diseaseLockHub = diseaseLockHub;
        }

        [HttpGet]
        [HttpPost]
        public async Task<IActionResult> GetMany([FromQuery] int? count, [FromQuery] int skip = 0, [FromBody] DiseaseFilter filter = null)
        {
            var items = await diseaseStore.GetMany(filter, count, skip, x => x.Icd11Code);
            return Ok(items);
        }

        [HttpGet(nameof(Hierarchy))]
        public async Task<IActionResult> Hierarchy(string prefix = null, int? maxDepth = null)
        {
            var hierarchy = await diseaseStore.GetDiseaseHierarchy(prefix?.ToUpper(), maxDepth);
            return Ok(hierarchy);
        }

        [HttpGet(nameof(IcdChapters))]
        public async Task<IActionResult> IcdChapters()
        {
            var icdChapters = await icdChapterStore.GetAllAsync();
            return Ok(icdChapters);
        }



        [HttpGet("{icdCode}")]
        public async Task<IActionResult> GetByIcdCode(string icdCode)
        {
            icdCode = icdCode.ToUpper();
            var item = await diseaseStore.GetByIdAsync(icdCode);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        [HttpGet(nameof(Search))]
        public async Task<IActionResult> Search(string searchText, int? count = 30, int? skip = 0)
        {
            var items = await diseaseStore.SearchAsync(x => x.Icd11Code.Contains(searchText.ToUpper()), count);
            if (items.Any())
                return Ok(items);
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.ContainsAll<Disease>(x => x.Name.ToLower(), searchTerms);
            items = await diseaseStore.SearchAsync(searchExpression, count, skip);
            var prioritizedItems = items.OrderBy(x => x.Name.Length);
            return Ok(prioritizedItems);
        }


        [HttpPut("{icdCode}")]
        public async Task<IActionResult> Store(string icdCode, [FromQuery] string username, [FromBody] Disease disease)
        {
            icdCode = icdCode.ToUpper();
            disease.Icd11Code = disease.Icd11Code.ToUpper();
            disease.CategoryIcdCode = disease.CategoryIcdCode.ToUpper();
            if (disease.Icd11Code != icdCode)
                return BadRequest("ICD-Code from URL doesn't match ICD-code in body");
            var diseaseLock = await diseaseStore.GetLock(icdCode);
            if (diseaseLock != null && diseaseLock.User != username)
                return StatusCode((int) HttpStatusCode.Forbidden, $"The disease '{icdCode}' is locked by another user");
            await diseaseStore.StoreAsync(disease);
            return Ok();
        }

        [HttpDelete("{icdCode}")]
        public async Task<IActionResult> Delete(string icdCode)
        {
            icdCode = icdCode.ToUpper();
            await diseaseStore.DeleteAsync(icdCode);
            return Ok();
        }

        [HttpPost("{icdCode}/" + nameof(Lock))]
        public async Task<IActionResult> Lock(string icdCode, [FromQuery] string username)
        {
            icdCode = icdCode.ToUpper();
            var diseaseLock = new DiseaseLock
            {
                CreatedTimestamp = DateTime.UtcNow,
                IcdCode = icdCode,
                User = username
            };
            if (!await diseaseStore.TryLock(icdCode, diseaseLock))
                return StatusCode((int) HttpStatusCode.Conflict);
            await diseaseLockHub.Clients.Group(icdCode).ReceiveLock(diseaseLock);
            return Ok(diseaseLock);
        }

        [HttpPost("{icdCode}/" + nameof(Unlock))]
        public async Task<IActionResult> Unlock(string icdCode, [FromQuery] string username)
        {
            icdCode = icdCode.ToUpper();
            if (!await diseaseStore.TryUnlock(icdCode, username))
                return StatusCode((int) HttpStatusCode.Forbidden);
            await diseaseLockHub.Clients.Group(icdCode).ReceiveLock(null);
            return Ok();
        }
    }
}
