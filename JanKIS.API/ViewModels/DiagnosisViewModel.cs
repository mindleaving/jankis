using HealthModels.Diagnoses;

namespace JanKIS.API.ViewModels
{
    public class DiagnosisViewModel : Diagnosis, IViewModel<Diagnosis>
    {
        public string Name { get; set; }
    }
}
