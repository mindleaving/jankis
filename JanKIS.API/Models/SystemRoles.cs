using System.Collections.Generic;
using System.Linq;
using Commons.Extensions;

namespace JanKIS.API.Models
{
    public static class SystemRoles
    {
        public static readonly Role Patient = new() {Id = "Patient", Name = "Patient", Permissions = new List<Permission>(), IsSystemRole = true };
        public static readonly Role Admin = new() {Id = "Admin", Name = "Admin", Permissions = EnumExtensions.GetValues<Permission>().ToList(), IsSystemRole = true};
    }
}