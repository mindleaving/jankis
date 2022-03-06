using Commons.Physics;
using HealthModels.Icd;
using HealthModels.Icd.Annotation.Diagnostics;
using HealthModels.Icd.Annotation.Epidemiology;
using HealthModels.Symptoms;
using IcdAnnotation.API.Data;
using IcdAnnotation.API.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

namespace IcdAnnotation.API.Setups
{
    public class StoreSetup : ISetup
    {
        public void Run(IServiceCollection services, IConfiguration configuration)
        {
            SetupMongoDB(services, configuration);
            SetupStores(services);
        }

        private void SetupMongoDB(IServiceCollection services, IConfiguration configuration)
        {
            ConventionRegistry.Register("EnumStringConvetion", new ConventionPack
            {
                new EnumRepresentationConvention(BsonType.String)
            }, type => true);
            BsonSerializer.RegisterSerializer(typeof(UnitValue), new UnitValueBsonSerializer());
            services.AddSingleton<IMongoClient>(new MongoClient());
            services.AddSingleton<IMongoDatabase>(
                provider =>
                {
                    var databaseName = configuration["MongoDB:DatabaseName"];
                    return provider.GetService<IMongoClient>().GetDatabase(databaseName);
                });
        }

        private static void SetupStores(IServiceCollection services)
        {
            services.AddScoped<IReadonlyStore<BodyStructure>, GenericReadonlyStore<BodyStructure>>();
            services.AddScoped<IReadonlyStore<Microb>, GenericReadonlyStore<Microb>>();
            services.AddScoped<IReadonlyStore<Location>, GenericReadonlyStore<Location>>();
            services.AddScoped<IReadonlyStore<DiagnosticTest>, GenericReadonlyStore<DiagnosticTest>>();
            services.AddScoped<IReadonlyStore<IcdChapter>, GenericReadonlyStore<IcdChapter>>();
            services.AddScoped<IStore<Observation>, GenericStore<Observation>>();
            services.AddScoped<IStore<DiseaseHost>, GenericStore<DiseaseHost>>();
            services.AddScoped<IDiseaseStore, DiseaseStore>();
            services.AddScoped<IStore<Patient>, PatientStore>();
            services.AddScoped<IStore<Symptom>, SymptomStore>();
            services.AddScoped<IStore<User>, GenericStore<User>>();
            services.AddScoped<IStore<Feedback>, GenericStore<Feedback>>();
        }
    }
}
