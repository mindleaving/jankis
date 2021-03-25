using System.Collections.Generic;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public static class SystemRoles
    {
        public static readonly Role Patient = new() {Name = "Patient", Permissions = new List<Permission>(), IsSystemRole = true };
    }

    public class Role : IId
    {
        public string Id => Name;
        public string Name { get; set; }
        public List<Permission> Permissions { get; set; }
        public bool IsSystemRole { get; set; }
    }
}
