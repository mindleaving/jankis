using IcdAnnotation.API.Models;
using MongoDB.Driver;

namespace IcdAnnotation.API.Data
{
    public class PatientStore : GenericStore<Patient>
    {
        public PatientStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }
    }
}
