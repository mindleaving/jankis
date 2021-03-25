using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class InstitutionPolicy : IId
    {
        public const string DefaultId = "1";
        public string Id => DefaultId;
        public bool UsersFromSameDepartmentCanChangeServiceRequests { get; set; }
    }
}
