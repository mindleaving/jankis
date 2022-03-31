using Commons.Physics;
using HealthModels;
using HealthModels.AccessControl;
using HealthModels.Diagnoses;
using HealthModels.DiagnosticTestResults;
using HealthModels.Icd;
using HealthModels.Interview;
using HealthModels.MedicalTextEditor;
using HealthModels.Medication;
using HealthModels.Observations;
using HealthModels.Services;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;
using JanKIS.API.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

namespace JanKIS.API.Setups
{
    public class StoreSetup : ISetup
    {
        public void Run(IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<FileStoreOptions>(configuration.GetSection(FileStoreOptions.AppSettingsSectionName));
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
            SetupTypeStores<Account>(services);
            services.AddScoped<IAccountStore, AccountStore>();
            SetupTypeStores<Admission>(services);
            services.AddScoped<IAdmissionsStore, AdmissionsStore>();
            SetupTypeStores<AttachedEquipment>(services);
            services.AddScoped<IAutocompleteCache, AutocompleteCache>();
            SetupTypeStores<BedOccupancy>(services);
            SetupTypeStores<Consumable>(services);
            SetupTypeStores<ConsumableOrder>(services);
            services.AddScoped<IConsumableOrdersStore, ConsumableOrdersStore>();
            SetupTypeStores<Contact>(services);
            SetupTypeStores<Department>(services);
            SetupTypeStores<Diagnosis>(services);
            SetupTypeStores<DiagnosticTestDefinition>(services);
            SetupTypeStores<DiagnosticTestResult>(services);
            SetupTypeStores<Drug>(services);
            SetupTypeStores<EmergencyAccess>(services);
            services.AddScoped<IFilesStore, FilesStore>();
            SetupTypeStores<IcdCategory>(services);
            SetupTypeStores<Institution>(services);
            SetupTypeStores<InstitutionPolicy>(services);
            SetupTypeStores<HealthProfessionalAccess>(services);
            SetupTypeStores<MedicationSchedule>(services);
            services.AddScoped<IMedicationScheduleStore, MedicationScheduleStore>();
            SetupTypeStores<MedicationDispension>(services);
            SetupTypeStores<MedicalText>(services);
            SetupTypeStores<NotificationBase>(services);
            services.AddScoped<INotificationsStore, NotificationsStore>();
            SetupTypeStores<Observation>(services);
            SetupTypeStores<PatientDocument>(services);
            SetupTypeStores<PatientNote>(services);
            SetupTypeStores<Person>(services);
            SetupTypeStores<PersonalizedAbbreviation>(services);
            SetupTypeStores<Questionnaire>(services);
            SetupTypeStores<QuestionnaireAnswers>(services);
            SetupTypeStores<Resource>(services);
            SetupTypeStores<Role>(services);
            SetupTypeStores<Room>(services);
            SetupTypeStores<ServiceDefinition>(services);
            services.AddScoped<IServiceStore, ServiceStore>();
            SetupTypeStores<ServiceRequest>(services);
            services.AddScoped<IServiceRequestsStore, ServiceRequestsStore>();
            SetupTypeStores<Stock>(services);
            SetupTypeStores<SubscriptionBase>(services);
            services.AddScoped<ISubscriptionsStore, SubscriptionsStore>();
        }

        private static void SetupTypeStores<T>(IServiceCollection services) where T: IId
        {
            services.AddScoped<IReadonlyStore<T>, GenericReadonlyStore<T>>();
            services.AddSingleton<ICachedReadonlyStore<T>, GenericCachedReadonlyStore<T>>();
            services.AddScoped<IStore<T>, GenericStore<T>>();
        }
    }
}
