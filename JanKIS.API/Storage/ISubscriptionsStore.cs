using System.Collections.Generic;
using System.Threading.Tasks;
using JanKIS.API.Models.Subscriptions;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public interface ISubscriptionsStore : IStore<SubscriptionBase>
    {
        Task<List<PatientSubscription>> GetPatientSubscriptions(string patientId);
        Task<List<ServiceSubscription>> GetServiceSubscriptions(string serviceId);
        Task<List<ServiceRequestSubscription>> GetServiceRequestSubscriptions(string requestId);
        Task<List<DepartmentSubscription>> GetDepartmentSubscriptions(string departmentId);
        Task<List<InstitutionSubscription>> GetInstitutionSubscriptions(string institutionId);
        Task<List<ResourceSubscription>> GetResourceSubscriptions(string resourceId);
        Task<List<StockSubscription>> GetStockSubscription(string stockId);
        Task<List<ConsumableOrderSubscription>> GetConsumableOrderSubscriptions(string orderId);

        Task<PatientSubscription> GetPatientSubscription(string patientId, string username);
        Task<ServiceSubscription> GetServiceSubscription(string serviceId, string username);
        Task<ServiceRequestSubscription> GetServiceRequestSubscription(string requestId, string username);
        Task<DepartmentSubscription> GetDepartmentSubscription(string departmentId, string username);
        Task<InstitutionSubscription> GetInstitutionSubscription(string institutionId, string username);
        Task<ResourceSubscription> GetResourceSubscription(string resourceId, string username);
        Task<StockSubscription> GetStockSubscription(string stockId, string username);
        Task<ConsumableOrderSubscription> GetConsumableOrderSubscription(string orderId, string username);
    }

    public class SubscriptionsStore : GenericStore<SubscriptionBase>, ISubscriptionsStore
    {
        public SubscriptionsStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public Task<List<PatientSubscription>> GetPatientSubscriptions(string patientId)
        {
            return collection.OfType<PatientSubscription>().Find(x => x.PatientId == patientId).ToListAsync();
        }

        public Task<List<ServiceSubscription>> GetServiceSubscriptions(string serviceId)
        {
            return collection.OfType<ServiceSubscription>().Find(x => x.ServiceId == serviceId).ToListAsync();
        }

        public Task<List<ServiceRequestSubscription>> GetServiceRequestSubscriptions(string requestId)
        {
            return collection.OfType<ServiceRequestSubscription>().Find(x => x.RequestId == requestId).ToListAsync();
        }

        public Task<List<DepartmentSubscription>> GetDepartmentSubscriptions(string departmentId)
        {
            return collection.OfType<DepartmentSubscription>().Find(x => x.DepartmentId == departmentId).ToListAsync();
        }

        public Task<List<InstitutionSubscription>> GetInstitutionSubscriptions(string institutionId)
        {
            return collection.OfType<InstitutionSubscription>().Find(x => x.InstitutionId == institutionId).ToListAsync();
        }

        public Task<List<ResourceSubscription>> GetResourceSubscriptions(string resourceId)
        {
            return collection.OfType<ResourceSubscription>().Find(x => x.ResourceId == resourceId).ToListAsync();
        }

        public Task<List<StockSubscription>> GetStockSubscription(string stockId)
        {
            return collection.OfType<StockSubscription>().Find(x => x.StockId == stockId).ToListAsync();
        }

        public Task<List<ConsumableOrderSubscription>> GetConsumableOrderSubscriptions(string orderId)
        {
            return collection.OfType<ConsumableOrderSubscription>().Find(x => x.OrderId == orderId).ToListAsync();
        }

        public Task<PatientSubscription> GetPatientSubscription(
            string patientId,
            string username)
        {
            return collection.OfType<PatientSubscription>().Find(x => x.PatientId == patientId && x.Username == username).FirstOrDefaultAsync();
        }

        public Task<ServiceSubscription> GetServiceSubscription(
            string serviceId,
            string username)
        {
            return collection.OfType<ServiceSubscription>().Find(x => x.ServiceId == serviceId && x.Username == username).FirstOrDefaultAsync();
        }

        public Task<ServiceRequestSubscription> GetServiceRequestSubscription(
            string requestId,
            string username)
        {
            return collection.OfType<ServiceRequestSubscription>().Find(x => x.RequestId == requestId && x.Username == username).FirstOrDefaultAsync();
        }

        public Task<DepartmentSubscription> GetDepartmentSubscription(
            string departmentId,
            string username)
        {
            return collection.OfType<DepartmentSubscription>().Find(x => x.DepartmentId == departmentId && x.Username == username).FirstOrDefaultAsync();
        }

        public Task<InstitutionSubscription> GetInstitutionSubscription(
            string institutionId,
            string username)
        {
            return collection.OfType<InstitutionSubscription>().Find(x => x.InstitutionId == institutionId && x.Username == username).FirstOrDefaultAsync();
        }

        public Task<ResourceSubscription> GetResourceSubscription(
            string resourceId,
            string username)
        {
            return collection.OfType<ResourceSubscription>().Find(x => x.ResourceId == resourceId && x.Username == username).FirstOrDefaultAsync();
        }

        public Task<StockSubscription> GetStockSubscription(
            string stockId,
            string username)
        {
            return collection.OfType<StockSubscription>().Find(x => x.StockId == stockId && x.Username == username).FirstOrDefaultAsync();
        }

        public Task<ConsumableOrderSubscription> GetConsumableOrderSubscription(
            string orderId,
            string username)
        {
            return collection.OfType<ConsumableOrderSubscription>().Find(x => x.OrderId == orderId && x.Username == username).FirstOrDefaultAsync();
        }
    }
}
