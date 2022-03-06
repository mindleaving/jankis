using IcdAnnotation.API.Data;
using Microsoft.AspNetCore.Mvc;

namespace IcdAnnotation.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiagnosticCriteriasController : ControllerBase
    {
        private readonly IDiseaseStore diseaseStore;

        public DiagnosticCriteriasController(IDiseaseStore diseaseStore)
        {
            this.diseaseStore = diseaseStore;
        }

        //[HttpPost("{diagnosticCriteriaId}/" + nameof(BatchAssign))]
        //public async Task<IActionResult> BatchAssign(string diagnosticCriteriaId, [FromBody] List<string> diseaseIcdCodes)
        //{
        //    if (diagnosticCriteria == null)
        //        return NotFound();
        //    await diseaseStore.BatchAssign(
        //        disease => diseaseIcdCodes.Contains(disease.IcdCode) && !disease.DiagnosticCriteria.Any(x => x.Id == diagnosticCriteriaId), 
        //        disease => disease.DiagnosticCriteria, 
        //        diagnosticCriteria);
        //    return Ok();
        //}

        //[HttpPost("{diagnosticCriteriaId}/" + nameof(BatchRemove))]
        //public async Task<IActionResult> BatchRemove(string diagnosticCriteriaId, [FromBody] List<string> diseaseIcdCodes)
        //{
        //    await diseaseStore.BatchRemove(x => x.DiagnosticCriteria, x => x.Id == diagnosticCriteriaId, diseaseIcdCodes);
        //    return Ok();
        //}

    }
}
