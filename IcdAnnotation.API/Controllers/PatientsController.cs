using System.Threading.Tasks;
using HealthModels.Icd.Annotation.Symptoms;
using IcdAnnotation.API.Data;
using IcdAnnotation.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace IcdAnnotation.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly IStore<Patient> patientStore;

        public PatientsController(IStore<Patient> patientStore)
        {
            this.patientStore = patientStore;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var item = await patientStore.GetByIdAsync(id);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Store([FromBody] Patient patient)
        {
            await patientStore.StoreAsync(patient);
            return Ok();
        }

        [HttpPatch("{id}/symptom/add")]
        public async Task<IActionResult> AddSymptom([FromRoute] string id, [FromBody] Symptom symptom)
        {
            var item = await patientStore.GetByIdAsync(id);
            if (item == null)
                return NotFound();
            item.Symptoms.Add(symptom);
            await patientStore.StoreAsync(item);
            return Ok();
        }
        
        [HttpPatch("{id}/symptom/remove")]
        public async Task<IActionResult> RemoveSymptom([FromRoute] string id, [FromBody] Symptom symptom)
        {
            var item = await patientStore.GetByIdAsync(id);
            if (item == null)
                return NotFound();
            item.Symptoms.Remove(symptom); // TODO: Determine how to identify symptoms
            await patientStore.StoreAsync(item);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await patientStore.DeleteAsync(id);
            return Ok();
        }


    }
}
