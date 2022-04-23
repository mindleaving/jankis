namespace JanKIS.API.Models
{
    public class PatientAccount : Account
    {
        public PatientAccount(string personId)
            : base(personId)
        {
            PersonId = personId;
        }

        public override AccountType AccountType => AccountType.Patient;
    }
}