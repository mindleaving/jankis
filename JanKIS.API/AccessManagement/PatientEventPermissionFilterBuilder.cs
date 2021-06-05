using System.Threading.Tasks;
using JanKIS.API.Models;

namespace JanKIS.API.AccessManagement
{
    public class PatientEventPermissionFilterBuilder<T> : IPermissionFilterBuilder<T> where T: IPatientEvent
    {
        private readonly MyPatientsLister myPatientsLister;

        public PatientEventPermissionFilterBuilder(
            MyPatientsLister myPatientsLister)
        {
            this.myPatientsLister = myPatientsLister;
        }

        public async Task<PermissionFilter<T>> Build(CurrentUser currentUser)
        {
            if (currentUser.AccountType == AccountType.Patient)
            {
                return PermissionFilter<T>.PartialAuthorization(x => x.PatientId == currentUser.PersonId, null);
            }

            if (currentUser.Permissions.Contains(Permission.ViewDepartmentMedicalRecords))
            {
                var myPatientIds = await myPatientsLister.ListMyPatientIds(currentUser.DepartmentIds, new MyPatientsListerOptions
                {
                    ServiceRequestPatientFilter = patient => patient.GrantAccessToMedicalData
                });
                return PermissionFilter<T>.PartialAuthorization(x => myPatientIds.Contains(x.PatientId), null);
            }
            return PermissionFilter<T>.Unauthorized();
        }
    }
}
