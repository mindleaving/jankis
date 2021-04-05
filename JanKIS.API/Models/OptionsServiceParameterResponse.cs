namespace JanKIS.API.Models
{
    public class OptionsServiceParameterResponse : ServiceParameterResponse
    {
        public override ServiceParameterValueType ValueType => ServiceParameterValueType.Option;
        public string SelectedOption { get; set; }
    }
}