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
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Models.Subscriptions;
using HealthSharingPortal.API.Storage;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;
using JanKIS.API.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using Account = JanKIS.API.Models.Account;
using AdmissionNotification = HealthSharingPortal.API.Models.Subscriptions.AdmissionNotification;
using INotificationsStore = JanKIS.API.Storage.INotificationsStore;
using NotificationsStore = JanKIS.API.Storage.NotificationsStore;
using PatientEventNotification = HealthSharingPortal.API.Models.Subscriptions.PatientEventNotification;

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
            BsonClassMap.RegisterClassMap<PatientEventNotification>();
            BsonClassMap.RegisterClassMap<AdmissionNotification>();
            BsonClassMap.RegisterClassMap<BedOccupancyNotification>();
            BsonClassMap.RegisterClassMap<ServiceNotification>();
            BsonClassMap.RegisterClassMap<ServiceRequestNotification>();
            BsonClassMap.RegisterClassMap<PatientSubscription>();
            BsonClassMap.RegisterClassMap<ConsumableOrderSubscription>();
            BsonClassMap.RegisterClassMap<DepartmentSubscription>();
            BsonClassMap.RegisterClassMap<InstitutionSubscription>();
            BsonClassMap.RegisterClassMap<ResourceSubscription>();
            BsonClassMap.RegisterClassMap<ServiceSubscription>();
            BsonClassMap.RegisterClassMap<ServiceRequestSubscription>();
            BsonClassMap.RegisterClassMap<StockSubscription>();
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
            services.AddScoped<Storage.IAccountStore, Storage.AccountStore>();
            SetupPersonDataStores<Admission>(services);
            services.AddScoped<IAdmissionsStore, AdmissionsStore>();
            SetupPersonDataStores<AttachedEquipment>(services);
            services.AddScoped<IAutocompleteCache, AutocompleteCache>();
            SetupTypeStores<BedOccupancy>(services);
            SetupTypeStores<Consumable>(services);
            SetupTypeStores<ConsumableOrder>(services);
            services.AddScoped<IConsumableOrdersStore, ConsumableOrdersStore>();
            SetupTypeStores<Contact>(services);
            SetupTypeStores<Department>(services);
            SetupPersonDataStores<Diagnosis>(services);
            SetupTypeStores<DiagnosticTestDefinition>(services);
            SetupPersonDataStores<DiagnosticTestResult>(services);
            SetupTypeStores<Drug>(services);
            SetupTypeStores<EmergencyAccess>(services);
            services.AddScoped<IFilesStore, FilesStore>();
            SetupTypeStores<IcdCategory>(services);
            SetupTypeStores<Institution>(services);
            SetupTypeStores<InstitutionPolicy>(services);
            SetupPersonDataStores<GenomeExplorerDeployment>(services);
            SetupTypeStores<HealthProfessionalAccess>(services);
            SetupPersonDataStores<MedicationSchedule>(services);
            SetupPersonDataStores<MedicationDispension>(services);
            SetupTypeStores<MedicalText>(services);
            SetupTypeStores<NotificationBase>(services);
            services.AddScoped<INotificationsStore, NotificationsStore>();
            services.AddScoped<HealthSharingPortal.API.Storage.INotificationsStore, HealthSharingPortal.API.Storage.NotificationsStore>();
            SetupPersonDataStores<Observation>(services);
            SetupPersonDataStores<PatientDocument>(services);
            SetupPersonDataStores<PatientNote>(services);
            SetupPersonDataStores<Person>(services);
            SetupTypeStores<PersonalizedAbbreviation>(services);
            SetupTypeStores<Questionnaire>(services);
            SetupPersonDataStores<QuestionnaireAnswers>(services);
            SetupTypeStores<Resource>(services);
            SetupTypeStores<Role>(services);
            SetupTypeStores<Room>(services);
            SetupTypeStores<ServiceDefinition>(services);
            services.AddScoped<IServiceStore, ServiceStore>();
            SetupTypeStores<ServiceRequest>(services);
            services.AddScoped<IServiceRequestsStore, ServiceRequestsStore>();
            SetupTypeStores<Stock>(services);
            SetupTypeStores<SubscriptionBase>(services);
            services.AddScoped<Storage.ISubscriptionsStore, Storage.SubscriptionsStore>();
            services.AddScoped<HealthSharingPortal.API.Storage.ISubscriptionsStore, HealthSharingPortal.API.Storage.SubscriptionsStore>();
        }

        private static void SetupTypeStores<T>(IServiceCollection services) where T: IId
        {
            services.AddScoped<IReadonlyStore<T>, GenericReadonlyStore<T>>();
            services.AddSingleton<ICachedReadonlyStore<T>, GenericCachedReadonlyStore<T>>();
            services.AddScoped<IStore<T>, GenericStore<T>>();
        }

        private static void SetupPersonDataStores<T>(IServiceCollection services) where T: IPersonData
        {
            services.AddScoped<IPersonDataReadonlyStore<T>, GenericPersonDataReadonlyStore<T>>();
            services.AddScoped<IPersonDataStore<T>, GenericPersonDataStore<T>>();
        }
    }
}
