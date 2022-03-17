namespace HealthModels.Services
{
    public class PatientServiceParameterResponse : ServiceParameterResponse
    {
        public override ServiceParameterValueType ValueType => ServiceParameterValueType.Patient;
        public Person Patient { get; set; }
    }
}