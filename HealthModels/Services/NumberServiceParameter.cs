namespace HealthModels.Services
{
    public class NumberServiceParameter : ServiceParameter
    {
        public override ServiceParameterValueType ValueType => ServiceParameterValueType.Number;
        public int Value { get; set; }
        public int? LowerLimit { get; set; }
        public int? UpperLimit { get; set; }
    }
}