using System;
using System.Threading.Tasks;
using HealthModels;
using JanKIS.API.Models;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public interface IAdmissionsStore : IStore<Admission>
    {
        Task<Admission> GetCurrentAdmissionAsync(string personId);
    }

    public class AdmissionsStore : GenericStore<Admission>, IAdmissionsStore
    {
        public AdmissionsStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public async Task<Admission> GetCurrentAdmissionAsync(string personId)
        {
            var utcNow = DateTime.UtcNow;
            return await collection
                .Find(x => x.AdmissionTime <= utcNow && (x.DischargeTime == null || x.DischargeTime > utcNow))
                .FirstOrDefaultAsync();
        }
    }
}
