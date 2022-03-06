using System.Linq;
using System.Threading.Tasks;
using HealthModels.Icd.Annotation.Diagnostics;
using IcdAnnotation.API.Data;
using IcdAnnotation.API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace IcdAnnotation.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiagnosticTestsController : ControllerBase
    {
        private readonly IReadonlyStore<DiagnosticTest> diagnosticTestStore;
        private readonly IDiseaseStore diseaseStore;

        public DiagnosticTestsController(
            IReadonlyStore<DiagnosticTest> diagnosticTestStore,
            IDiseaseStore diseaseStore)
        {
            this.diagnosticTestStore = diagnosticTestStore;
            this.diseaseStore = diseaseStore;
        }

        [HttpGet(nameof(Search))]
        public async Task<IActionResult> Search(string searchText, int? count = 30, int? skip = 0)
        {
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.ContainsAll<DiagnosticTest>(x => x.Name.ToLower(), searchTerms);
            var items = await diagnosticTestStore.SearchAsync(searchExpression, count, skip);
            var prioritizedItems = items.OrderBy(x => x.Name.Length);
            return Ok(prioritizedItems);
        }

    }
}
