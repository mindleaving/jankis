using System;
using System.Threading.Tasks;
using JanKIS.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {
        [HttpGet("{patientId}")]
        public async Task<IActionResult> GetPatient([FromRoute] string patientId)
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        public async Task<IActionResult> CreatePatient([FromBody] Patient patient)
        {
            throw new NotImplementedException();
        }

        [HttpPatch("{patientId}/" + nameof(Admit))]
        public async Task<IActionResult> Admit([FromRoute] string patientId, [FromBody] AdmissionInfo admissionInfo)
        {
            throw new NotImplementedException();
        }

        [HttpPatch("{patientId}/" + nameof(Move))]
        public async Task<IActionResult> Move([FromRoute] string patientId, [FromQuery] string wardId, [FromQuery] string roomId, [FromQuery] string bedIndex)
        {
            throw new NotImplementedException();
        }

        [HttpPatch("{patientId}")]
        public async Task<IActionResult> Discharge([FromRoute] string patientId, [FromBody] DischargeInfo dischargeInfo)
        {
            throw new NotImplementedException();
        }

        [HttpDelete("{patientId}")]
        public async Task<IActionResult> DeletePatient([FromRoute] string patientId)
        {
            throw new NotImplementedException();
        }
    }
}
