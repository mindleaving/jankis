using System;

namespace JanKIS.API.Models
{
    public class PatientAccount : Account
    {
        public PatientAccount(
            string personId,
            string username,
            DateTime createdTimestamp,
            string salt,
            string passwordHash)
            : base(personId, username, createdTimestamp, salt, passwordHash)
        {
        }

        public override AccountType AccountType => AccountType.Patient;
    }
}