using MongoDB.Bson;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

namespace HealthSharingPortal.Tools
{
    public abstract class DatabaseAccess
    {
        private readonly IMongoDatabase database;

        protected DatabaseAccess()
        {
            var mongoClient = new MongoClient();
            ConventionRegistry.Register("EnumStringConvetion", new ConventionPack
            {
                new EnumRepresentationConvention(BsonType.String)
            }, type => true);
            database = mongoClient.GetDatabase("HealthSharingPortal");
        }
        
        protected IMongoCollection<T> GetCollection<T>(string collectionName = null)
        {
            return database.GetCollection<T>(collectionName ?? typeof(T).Name);
        }
    }
}
