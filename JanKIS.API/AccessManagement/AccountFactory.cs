using System;
using JanKIS.API.Models;

namespace JanKIS.API.AccessManagement
{
    public static class AccountFactory
    {
        public static EmployeeAccount CreateEmployeeAccount(string personId)
        {
            var accountId = Guid.NewGuid().ToString();
            return new EmployeeAccount(accountId) { PersonId = personId};
        }

        public static PatientAccount CreatePatientAccount(string personId)
        {
            return new PatientAccount(personId);
        }
    }
}
