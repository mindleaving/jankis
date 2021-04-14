using System;
using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PatientsController : ControllerBase
    {
        private readonly IPatientStore patientsStore;

        public PatientsController(IPatientStore patientsStore)
        {
            this.patientsStore = patientsStore;
        }


        [HttpPatch("{patientId}/" + nameof(Admit))]
        public async Task<IActionResult> Admit([FromRoute] string patientId, [FromBody] AdmissionInfo admissionInfo)
        {
            var patient = await patientsStore.GetByIdAsync(patientId);
            if (patient == null)
                return NotFound();
            await patientsStore.AdmitAsync(patientId, admissionInfo);
            return Ok();
        }

        [HttpPatch("{patientId}/" + nameof(Move))]
        public async Task<IActionResult> Move([FromRoute] string patientId, [FromQuery] string wardId, [FromQuery] string roomId, [FromQuery] string bedIndex)
        {
            var patient = await patientsStore.GetByIdAsync(patientId);
            if (patient == null)
                return NotFound();
            throw new NotImplementedException();
            await patientsStore.StoreAsync(patient);
            return Ok();
        }

        [HttpPatch("{patientId}")]
        public async Task<IActionResult> Discharge([FromRoute] string patientId, [FromBody] DischargeInfo dischargeInfo)
        {
            var patient = await patientsStore.GetByIdAsync(patientId);
            if (patient == null)
                return NotFound();
            throw new NotImplementedException();
        }

        [HttpGet("{patientId}/equipment")]
        public async Task<IActionResult> GetAttachedEquipment([FromRoute] string patientId)
        {
            var patient = await patientsStore.GetByIdAsync(patientId);
            if (patient == null)
                return NotFound();
            throw new NotImplementedException();
        }

        [HttpPost("{patientId}/equipment")]
        public async Task<IActionResult> AddEquipment([FromRoute] string patientId, [FromBody] MedicalEquipment medicalEquipment)
        {
            if (medicalEquipment == null)
                return BadRequest("No medical equipment specified in body");
            if(!await patientsStore.AttachEquipmentAsync(patientId, medicalEquipment))
                return NotFound();
            return Ok();
        }

        [HttpDelete("{patientId}/equipment/{equipmentId}")]
        public async Task<IActionResult> RemoveEquipment([FromRoute] string patientId, [FromRoute] string equipmentId)
        {
            if (!await patientsStore.RemoveEquipmentAsync(patientId, equipmentId))
                return NotFound();
            return Ok();
        }
    }
}
