using HealthModels.Diagnoses;

namespace HealthSharingPortal.API.ViewModels
{
    public class DiagnosisViewModel : Diagnosis, IViewModel<Diagnosis>
    {
        public string Name { get; set; }
    }
}
