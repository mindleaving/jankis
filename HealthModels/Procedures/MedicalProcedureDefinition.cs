using HealthModels.Services;

namespace HealthModels.Procedures
{
    public class MedicalProcedureDefinition : ServiceDefinition
    {
        public string SnomedCtCode { get; set; }
        public string LocalCode { get; set; }
    }
}
