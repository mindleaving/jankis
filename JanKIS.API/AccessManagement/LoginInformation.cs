using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace JanKIS.API.AccessManagement
{
    public class LoginInformation
    {
        [JsonConstructor]
        public LoginInformation(string employeeId, string password)
        {
            EmployeeId = employeeId;
            Password = password;
        }

        [Required]
        public string EmployeeId { get; set; }

        [Required]
        public string Password { get; set; }
    }
}