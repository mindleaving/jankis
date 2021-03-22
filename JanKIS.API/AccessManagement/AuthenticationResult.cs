using Newtonsoft.Json;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.AccessManagement
{
    public class AuthenticationResult
    {
        [JsonConstructor]
        private AuthenticationResult(bool isAuthenticated,
            AuthenticationErrorType error,
            string employeeId,
            string accessToken)
        {
            IsAuthenticated = isAuthenticated;
            Error = error;
            AccessToken = accessToken;
            EmployeeId = employeeId;
        }

        public static AuthenticationResult Success(string username, string accessToken)
        {
            return new AuthenticationResult(true, AuthenticationErrorType.Ok, username, accessToken);
        }

        public static AuthenticationResult Failed(AuthenticationErrorType errorType)
        {
            return new AuthenticationResult(false, errorType, null, null);
        }

        public bool IsAuthenticated { get; }
        [TypescriptIsOptional]
        public string EmployeeId { get; }
        [TypescriptIsOptional]
        public string AccessToken { get; }
        public AuthenticationErrorType Error { get; }
    }
}