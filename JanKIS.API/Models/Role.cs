using System.Collections.Generic;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class Role : IId
    {
        public string Id => Name;
        public string Name { get; set; }
        public List<Permission> Permissions { get; set; }
    }
}
