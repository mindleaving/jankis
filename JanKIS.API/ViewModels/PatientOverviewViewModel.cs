using System.Collections.Generic;
using HealthModels;
using HealthModels.DiagnosticTestResults;
using HealthModels.Medication;
using HealthModels.Observations;
using HealthSharingPortal.API.ViewModels;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;

namespace JanKIS.API.ViewModels
{
    public class PatientOverviewViewModel : HealthSharingPortal.API.ViewModels.PatientOverviewViewModel
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
            : base(profileData, admissions, notes, diagnoses, medicationSchedules, medicationDispensions, testResults, observations, documents, questionnaires)
        {
            CurrentBedOccupancy = currentBedOccupancy;
            Subscription = subscription;
        }

        public BedOccupancy CurrentBedOccupancy { get; set; }
        public PatientSubscription Subscription { get; set; }
    }
}
