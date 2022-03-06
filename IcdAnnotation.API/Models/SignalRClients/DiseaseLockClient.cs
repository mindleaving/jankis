using System.Threading.Tasks;
using HealthModels.Icd.Annotation;

namespace IcdAnnotation.API.Models.SignalRClients
{
    public interface IDiseaseLockClient
    {
        Task ReceiveLock(DiseaseLock diseaseLock);
    }
}
