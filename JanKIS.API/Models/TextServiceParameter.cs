namespace JanKIS.API.Models
{
    public class TextServiceParameter : ServiceParameter
    {
        public override ServiceParameterValueType ValueType => ServiceParameterValueType.Text;
        public string Value { get; set; }
    }
}