namespace JanKIS.API.Models
{
    public class PatientAccount : Account
    {
        public PatientAccount(
            string personId,
            string username,
            string salt,
            string passwordHash)
            : base(personId, username, salt, passwordHash)
        {
        }

        public override AccountType AccountType => AccountType.Patient;
    }
}