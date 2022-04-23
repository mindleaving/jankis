using Newtonsoft.Json;
using TypescriptGenerator.Attributes;

namespace HealthSharingPortal.API.Models
{
    public class AuthenticationResult
    {
        [JsonConstructor]
        private AuthenticationResult(bool isAuthenticated,
            AuthenticationErrorType error,
            string accessToken,
            bool isPasswordChangeRequired)
        {
            IsAuthenticated = isAuthenticated;
            Error = error;
            AccessToken = accessToken;
            IsPasswordChangeRequired = isPasswordChangeRequired;
        }

        public static AuthenticationResult Success(string accessToken, bool isPasswordChangeRequired)
        {
            return new AuthenticationResult(true, AuthenticationErrorType.Ok, accessToken, isPasswordChangeRequired);
        }

        public static AuthenticationResult Failed(AuthenticationErrorType errorType)
        {
            return new AuthenticationResult(false, errorType, null, false);
        }

        public bool IsAuthenticated { get; }
        [TypescriptIsOptional]
        public string AccessToken { get; }
        public bool IsPasswordChangeRequired { get; }
        public AuthenticationErrorType Error { get; }
    }
}