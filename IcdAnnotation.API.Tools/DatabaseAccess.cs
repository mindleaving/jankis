using MongoDB.Bson;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

namespace IcdAnnotation.API.Tools
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
            database = mongoClient.GetDatabase("DoctorsToDo");
        }
        
        protected IMongoCollection<T> GetCollection<T>(string collectionName)
        {
            return database.GetCollection<T>(collectionName);
        }
    }
}
