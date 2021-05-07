using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.AccessManagement
{
    public class PatientEventPermissionFilterBuilder<T> : IPermissionFilterBuilder<T> where T: IPatientEvent
    {
        private readonly CurrentUser currentUser;
        private readonly IReadonlyStore<Account> accountsStore;
        private readonly MyPatientsLister myPatientsLister;

        public PatientEventPermissionFilterBuilder(
            CurrentUser currentUser,
            IReadonlyStore<Account> accountsStore,
            MyPatientsLister myPatientsLister)
        {
            this.currentUser = currentUser;
            this.accountsStore = accountsStore;
            this.myPatientsLister = myPatientsLister;
        }

        public async Task<PermissionFilter<T>> Build()
        {
            var account = await accountsStore.GetByIdAsync(currentUser.Username);
            if (currentUser.AccountType == AccountType.Patient)
            {
                return PermissionFilter<T>.PartialAuthorization(x => x.PatientId == account.PersonId, null);
            }

            var employeeAccount = (EmployeeAccount) account;
            if (currentUser.Permissions.Contains(Permission.ViewDepartmentMedicalRecords))
            {
                var myPatientIds = await myPatientsLister.ListMyPatientIds(employeeAccount, new MyPatientsListerOptions
                {
                    ServiceRequestPatientFilter = patient => patient.GrantAccessToMedicalData
                });
                return PermissionFilter<T>.PartialAuthorization(x => myPatientIds.Contains(x.PatientId), null);
            }
            return PermissionFilter<T>.Unauthorized();
        }
    }
}
