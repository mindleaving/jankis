using System;
using System.Threading.Tasks;
using JanKIS.API.AccessManagement;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly IPatientStore patientsStore;

        public PatientsController(IPatientStore patientsStore)
        {
            this.patientsStore = patientsStore;
        }

        [HttpGet("{patientId}")]
        public async Task<IActionResult> GetPatient([FromRoute] string patientId)
        {
            var patient = await patientsStore.GetByIdAsync(patientId);
            if (patient == null)
                return NotFound();
            return Ok(patient);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePatient([FromBody] PatientRegistrationInfo registrationInfo)
        {
            if (string.IsNullOrWhiteSpace(registrationInfo.Id))
                return BadRequest("ID must be non-empty");
            if (await patientsStore.ExistsAsync(registrationInfo.Id))
                return Conflict();
            var patient = PersonFactory.CreatePatient(
                registrationInfo.Id,
                registrationInfo.FirstName,
                registrationInfo.LastName,
                registrationInfo.BirthDate,
                TemporaryPasswordGenerator.Generate(), // TODO: Store or return, such that it can be printed and given to patient. Or have it generated in frontend.
                registrationInfo.HealthInsurance);
            await patientsStore.StoreAsync(patient);
            return Ok(registrationInfo.Id);
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
            if (patient.AdmissionInfo == null)
                return BadRequest("Patient is not admitted. Cannot be moved");
            patient.AdmissionInfo.Ward = wardId;
            patient.AdmissionInfo.Room = roomId;
            patient.AdmissionInfo.Bed = bedIndex;
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

        [HttpDelete("{patientId}")]
        public async Task<IActionResult> DeletePatient([FromRoute] string patientId)
        {
            throw new NotImplementedException("Implement checks that only patients can be deleted that are not admitted, fully discharged, billed and invoices paid, etc.");
            await patientsStore.DeleteAsync(patientId);
            return Ok();
        }

        [HttpGet("{patientId}/equipment")]
        public async Task<IActionResult> GetAttachedEquipment([FromRoute] string patientId)
        {
            var patient = await patientsStore.GetByIdAsync(patientId);
            if (patient == null)
                return NotFound();
            return Ok(patient.AttachedEquipment);
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
