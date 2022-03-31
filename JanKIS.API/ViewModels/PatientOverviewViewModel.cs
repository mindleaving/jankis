using System.Collections.Generic;
using HealthModels;
using HealthModels.DiagnosticTestResults;
using HealthModels.Medication;
using HealthModels.Observations;
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
            List<DiagnosisViewModel> diagnoses,
            List<MedicationSchedule> medicationSchedules,
            List<MedicationDispension> medicationDispensions,
            List<DiagnosticTestResult> testResults,
            List<Observation> observations,
            List<PatientDocument> documents,
            List<QuestionnaireAnswersViewModel> questionnaires,
            PatientSubscription subscription)
        {
            ProfileData = profileData;
            CurrentBedOccupancy = currentBedOccupancy;
            Admissions = admissions;
            Notes = notes;
            Diagnoses = diagnoses;
            MedicationSchedules = medicationSchedules;
            MedicationDispensions = medicationDispensions;
            TestResults = testResults;
            Observations = observations;
            Documents = documents;
            Questionnaires = questionnaires;
            Subscription = subscription;
        }

        public Person ProfileData { get; set; }
        public BedOccupancy CurrentBedOccupancy { get; set; }
        public List<Admission> Admissions { get; set; }
        public List<PatientNote> Notes { get; set; }
        public List<DiagnosisViewModel> Diagnoses { get; set; }
        public List<MedicationSchedule> MedicationSchedules { get; }
        public List<MedicationDispension> MedicationDispensions { get; }
        public List<DiagnosticTestResult> TestResults { get; set; }
        public List<Observation> Observations { get; set; }
        public List<PatientDocument> Documents { get; set; }
        public List<QuestionnaireAnswersViewModel> Questionnaires { get; }
        public PatientSubscription Subscription { get; }
    }
}
