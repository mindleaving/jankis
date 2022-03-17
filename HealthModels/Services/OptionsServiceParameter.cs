using System.Collections.Generic;

namespace HealthModels.Services
{
    public class OptionsServiceParameter : ServiceParameter
    {
        public override ServiceParameterValueType ValueType => ServiceParameterValueType.Option;
        public List<string> Options { get; set; }
    }
}