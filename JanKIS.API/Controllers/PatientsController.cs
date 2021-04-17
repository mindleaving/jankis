using System;
using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly IStore<Person> personsStore;
        private readonly IAdmissionsStore admissionsStore;
        private readonly IReadonlyStore<PatientNote> patientNotesStore;
        private readonly IReadonlyStore<DiagnosticTestResult> testResultsStore;
        private readonly IReadonlyStore<Observation> observationsStore;
        private readonly IReadonlyStore<PatientDocument> documentsStore;

        public PatientsController(
            IStore<Person> personsStore,
            IAdmissionsStore admissionsStore,
            IReadonlyStore<PatientNote> patientNotesStore,
            IReadonlyStore<DiagnosticTestResult> testResultsStore,
            IReadonlyStore<Observation> observationsStore,
            IReadonlyStore<PatientDocument> documentsStore)
        {
            this.personsStore = personsStore;
            this.admissionsStore = admissionsStore;
            this.patientNotesStore = patientNotesStore;
            this.testResultsStore = testResultsStore;
            this.observationsStore = observationsStore;
            this.documentsStore = documentsStore;
        }

        [HttpGet("{patientId}/" + nameof(OverviewViewModel))]
        public async Task<IActionResult> OverviewViewModel([FromRoute] string patientId)
        {
            var profileData = await personsStore.GetByIdAsync(patientId);
            if (profileData == null)
                return NotFound();
            var admissions = await admissionsStore.SearchAsync(x => x.PatientId == patientId);
            var notes = await patientNotesStore.SearchAsync(x => x.PatientId == patientId);
            var testResults = await testResultsStore.SearchAsync(x => x.PatientId == patientId);
            var observations = await observationsStore.SearchAsync(x => x.PatientId == patientId);
            var documents = await documentsStore.SearchAsync(x => x.PatientId == patientId);
            var viewModel = new PatientOverviewViewModel(
                profileData,
                admissions,
                notes,
                testResults,
                observations,
                documents);
            return Ok(viewModel);
        }

        [HttpGet("{patientId}/admissions")]
        public async Task<IActionResult> GetAdmissions([FromRoute] string patientId)
        {
            if (!await personsStore.ExistsAsync(patientId))
                return NotFound();
            var notes = await admissionsStore.SearchAsync(x => x.PatientId == patientId);
            return Ok(notes);
        }

        [HttpGet("{patientId}/notes")]
        public async Task<IActionResult> GetPatientNotes([FromRoute] string patientId)
        {
            if (!await personsStore.ExistsAsync(patientId))
                return NotFound();
            var notes = await patientNotesStore.SearchAsync(x => x.PatientId == patientId);
            return Ok(notes);
        }

        [HttpGet("{patientId}/observations")]
        public async Task<IActionResult> GetObservations([FromRoute] string patientId)
        {
            if (!await personsStore.ExistsAsync(patientId))
                return NotFound();
            var observations = await observationsStore.SearchAsync(x => x.PatientId == patientId);
            return Ok(observations);
        }

        [HttpGet("{patientId}/testresults")]
        public async Task<IActionResult> GetTestResults([FromRoute] string patientId)
        {
            if (!await personsStore.ExistsAsync(patientId))
                return NotFound();
            var testResults = await testResultsStore.SearchAsync(x => x.PatientId == patientId);
            return Ok(testResults);
        }

        [HttpGet("{patientId}/documents")]
        public async Task<IActionResult> GetDocuments([FromRoute] string patientId)
        {
            if (!await personsStore.ExistsAsync(patientId))
                return NotFound();
            var documents = await documentsStore.SearchAsync(x => x.PatientId == patientId);
            return Ok(documents);
        }

    }
}
