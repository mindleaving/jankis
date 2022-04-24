using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Storage;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public interface IAdmissionsStore : IPersonDataStore<Admission>
    {
        Task<Admission> GetCurrentAdmissionAsync(string personId, List<IPersonDataAccessGrant> accessGrants);
    }

    public class AdmissionsStore : GenericPersonDataStore<Admission>, IAdmissionsStore
    {
        public AdmissionsStore(IMongoDatabase mongoDatabase, IStore<PersonDataChange> recordChangeStore)
            : base(mongoDatabase, recordChangeStore)
        {
        }

        public async Task<Admission> GetCurrentAdmissionAsync(string personId, List<IPersonDataAccessGrant> accessGrants)
        {
            var utcNow = DateTime.UtcNow;
            return await FirstOrDefaultAsync(
                x => x.AdmissionTime <= utcNow && (x.DischargeTime == null || x.DischargeTime > utcNow),
                accessGrants);
        }
    }
}
