namespace JanKIS.API.Models
{
    public class TextServiceParameterResponse : ServiceParameterResponse
    {
        public override ServiceParameterValueType ValueType => ServiceParameterValueType.Text;
        public string Value { get; set; }
    }
}