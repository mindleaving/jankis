namespace JanKIS.API.Models
{
    public class NumberServiceParameterResponse : ServiceParameterResponse
    {
        public override ServiceParameterValueType ValueType => ServiceParameterValueType.Number;
        public int Value { get; set; }
    }
}