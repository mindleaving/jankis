using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;
using JanKIS.API.AccessManagement;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PatientsController : RestControllerBase<Patient>
    {
        private readonly IPatientStore patientsStore;
        private readonly AuthenticationModule<Patient> authenticationModule;

        public PatientsController(
            IPatientStore patientsStore,
            AuthenticationModule<Patient> authenticationModule)
            : base(patientsStore)
        {
            this.patientsStore = patientsStore;
            this.authenticationModule = authenticationModule;
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

        public override async Task<IActionResult> Delete(string id)
        {
            throw new NotImplementedException("Implement checks that only patients can be deleted that are not admitted, fully discharged, billed and invoices paid, etc.");
            return await base.Delete(id);
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

        [HttpPost("{patientId}/login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromRoute] string patientId, [FromBody] string password)
        {
            var authenticationResult = await authenticationModule.AuthenticateAsync(patientId, password);
            if (!authenticationResult.IsAuthenticated)
                return StatusCode((int) HttpStatusCode.Unauthorized, authenticationResult);
            return Ok(authenticationResult);
        }

        [HttpPost("{patientId}/resetpassword")]
        [Authorize(Policy = nameof(Permission.ResetPasswords))]
        public async Task<IActionResult> ResetPassword([FromRoute] string patientId, [FromBody] string password)
        {
            await authenticationModule.ChangePasswordAsync(patientId, password, true);
            return Ok();
        }

        [HttpPost("{patientId}/changepassword")]
        [Authorize(Policy = SameUserRequirement.PolicyName)]
        public async Task<IActionResult> ChangePassword([FromRoute] string patientId, [FromBody] string password)
        {
            await authenticationModule.ChangePasswordAsync(patientId, password);
            return Ok();
        }

        protected override Expression<Func<Patient, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "name" => x => x.LastName,
                "lastname" => x => x.LastName,
                "firstname" => x => x.FirstName,
                "birthday" => x => x.BirthDate,
                _ => x => x.LastName
            };
        }

        protected override Expression<Func<Patient, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.Or(
                SearchExpressionBuilder.ContainsAny<Patient>(x => x.Id.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Patient>(x => x.LastName.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Patient>(x => x.FirstName.ToLower(), searchTerms));
        }

        protected override IEnumerable<Patient> PrioritizeItems(
            List<Patient> items,
            string searchText)
        {
            return items.OrderBy(x => x.LastName);
        }
    }
}
