using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace HealthSharingPortal.Api.Models
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum AuthenticationErrorType
    {
        Ok = 0,
        UserNotFound = 1,
        InvalidPassword = 2,
        AuthenticationMethodNotAvailable = 3
    }
}