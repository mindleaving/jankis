namespace HealthModels.Services
{
    public class BooleanServiceParameterResponse : ServiceParameterResponse
    {
        public override ServiceParameterValueType ValueType => ServiceParameterValueType.Boolean;
        public bool IsTrue { get; set; }
    }
}