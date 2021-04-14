using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class EmployeeAccount : Account
    {
        public EmployeeAccount(
            string personId,
            string username,
            string salt,
            string passwordHash)
            : base(personId, username, salt, passwordHash)
        {
            Roles = new List<string>();
            PermissionModifiers = new List<PermissionModifier>();
            DepartmentIds = new List<string>();
        }

        public override AccountType AccountType => AccountType.Employee;

        #region Permission-system
        public List<string> Roles { get; set; }
        public List<PermissionModifier> PermissionModifiers { get; set; }
        #endregion

        #region Employment-info
        public List<string> DepartmentIds { get; set; }
        #endregion
    }
}