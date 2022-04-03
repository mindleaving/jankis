using System.Collections.Generic;
using HealthModels;
using HealthModels.DiagnosticTestResults;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.ViewModels
{
    public class PersonGenomeSequencesViewModel
    {
        public Person Person { get; set; }
        public List<NominalDiagnosticTestResult> ReferenceSequences { get; set; }
        public List<DocumentDiagnosticTestResult> TestResults { get; set; }
        public List<PatientDocument> Documents { get; set; }
        public List<GenomeExplorerDeployment> Deployments { get; set; }
    }
}
