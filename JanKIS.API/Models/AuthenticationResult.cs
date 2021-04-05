using JanKIS.API.AccessManagement;
using Newtonsoft.Json;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.Models
{
    public class AuthenticationResult
    {
        [JsonConstructor]
        private AuthenticationResult(bool isAuthenticated,
            AuthenticationErrorType error,
            PersonWithLogin user,
            string accessToken)
        {
            IsAuthenticated = isAuthenticated;
            Error = error;
            User = user;
            AccessToken = accessToken;
        }

        public static AuthenticationResult Success(PersonWithLogin user, string accessToken)
        {
            return new AuthenticationResult(true, AuthenticationErrorType.Ok, user, accessToken);
        }

        public static AuthenticationResult Failed(AuthenticationErrorType errorType)
        {
            return new AuthenticationResult(false, errorType, null, null);
        }

        public bool IsAuthenticated { get; }
        [TypescriptIsOptional]
        public PersonWithLogin User { get; }
        [TypescriptIsOptional]
        public string AccessToken { get; }
        public AuthenticationErrorType Error { get; }
    }
}