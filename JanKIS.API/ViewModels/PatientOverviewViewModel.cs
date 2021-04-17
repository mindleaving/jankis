using System.Collections.Generic;
using JanKIS.API.Models;

namespace JanKIS.API.ViewModels
{
    public class PatientOverviewViewModel
    {
        public PatientOverviewViewModel(
            Person profileData,
            List<Admission> admissions,
            List<PatientNote> notes,
            List<DiagnosticTestResult> testResults,
            List<Observation> observations,
            List<PatientDocument> documents)
        {
            ProfileData = profileData;
            Admissions = admissions;
            Notes = notes;
            TestResults = testResults;
            Observations = observations;
            Documents = documents;
        }

        public Person ProfileData { get; set; }
        public List<Admission> Admissions { get; set; }
        public List<PatientNote> Notes { get; set; }
        public List<DiagnosticTestResult> TestResults { get; set; }
        public List<Observation> Observations { get; set; }
        public List<PatientDocument> Documents { get; set; }
    }
}
