using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class OptionsServiceParameter : ServiceParameter
    {
        public override ServiceParameterValueType ValueType => ServiceParameterValueType.Option;
        public List<string> Options { get; set; }
    }
}