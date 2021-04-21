using System.Collections.Generic;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;

namespace JanKIS.API.ViewModels
{
    public class PatientOverviewViewModel
    {
        public PatientOverviewViewModel(
            Person profileData,
            BedOccupancy currentBedOccupancy,
            List<Admission> admissions,
            List<PatientNote> notes,
            List<DiagnosticTestResult> testResults,
            List<Observation> observations,
            List<PatientDocument> documents,
            PatientSubscription subscription)
        {
            ProfileData = profileData;
            CurrentBedOccupancy = currentBedOccupancy;
            Admissions = admissions;
            Notes = notes;
            TestResults = testResults;
            Observations = observations;
            Documents = documents;
            Subscription = subscription;
        }

        public Person ProfileData { get; set; }
        public BedOccupancy CurrentBedOccupancy { get; set; }
        public List<Admission> Admissions { get; set; }
        public List<PatientNote> Notes { get; set; }
        public List<DiagnosticTestResult> TestResults { get; set; }
        public List<Observation> Observations { get; set; }
        public List<PatientDocument> Documents { get; set; }
        public PatientSubscription Subscription { get; }
    }
}
