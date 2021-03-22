using System;
using Newtonsoft.Json.Linq;

namespace JanKIS.API.Helpers
{
    public static class JObjectExtensions
    {
        public static T GetValueCaseInsensitive<T>(
            this JObject jObject,
            string propertyName)
        {
            if(jObject.TryGetValue(propertyName, StringComparison.InvariantCultureIgnoreCase, out var jToken))
            {
                if (typeof(T).IsEnum)
                {
                    var value = jToken.Value<string>();
                    return (T) Enum.Parse(typeof(T), value);
                }
                else
                {
                    return jToken.Value<T>();
                }
            }
            return default;
        }
    }
}
