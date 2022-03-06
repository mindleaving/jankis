using HealthModels.Symptoms;
using MongoDB.Driver;

namespace IcdAnnotation.API.Data
{
    public class SymptomStore : GenericStore<Symptom>
    {
        public SymptomStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }
    }
}
