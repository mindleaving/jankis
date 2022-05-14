using System.Linq;
using System.Security;
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
using HealthModels.Procedures;
using HealthModels.Services;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Models.Subscriptions;
using HealthSharingPortal.API.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

namespace HealthSharingPortal.API.Setups
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
            BsonClassMap.RegisterClassMap<PatientSubscription>();
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
            SetupPersonDataStores<Admission>(services);
            services.AddScoped<IAutocompleteCache, AutocompleteCache>();
            SetupTypeStores<Contact>(services);
            SetupTypeStores<Department>(services);
            SetupPersonDataStores<Diagnosis>(services);
            SetupTypeStores<DiagnosticTestDefinition>(services);
            SetupPersonDataStores<DiagnosticTestResult>(services);
            SetupTypeStores<Drug>(services);
            SetupTypeStores<EmergencyAccess>(services);
            SetupTypeStores<EmergencyAccessRequest>(services);
            services.AddScoped<IFilesStore, FilesStore>();
            SetupTypeStores<IcdCategory>(services);
            SetupTypeStores<Institution>(services);
            SetupPersonDataStores<GenomeExplorerDeployment>(services);
            SetupTypeStores<HealthProfessionalAccess>(services);
            services.AddScoped<IHealthProfessionalAccessInviteStore, HealthProfessionalAccessInviteStore>();
            SetupPersonDataStores<Immunization>(services);
            SetupTypeStores<Login>(services);
            services.AddScoped<ILoginStore, LoginStore>();
            SetupPersonDataStores<MedicationSchedule>(services);
            SetupPersonDataStores<MedicationDispension>(services);
            SetupPersonDataStores<MedicalProcedure>(services);
            SetupTypeStores<MedicalProcedureDefinition>(services);
            SetupTypeStores<MedicalText>(services);
            SetupTypeStores<MenschIdChallenge>(services);
            services.AddScoped<IMenschIdChallengeStore, MenschIdChallengeStore>();
            SetupTypeStores<NotificationBase>(services);
            services.AddScoped<INotificationsStore, NotificationsStore>();
            SetupPersonDataStores<Observation>(services);
            SetupPersonDataStores<PatientDocument>(services);
            SetupPersonDataStores<PatientNote>(services);
            SetupPersonDataStores<Person>(services);
            services.AddScoped<IPersonStore, PersonStore>();
            SetupTypeStores<PersonalizedAbbreviation>(services);
            SetupTypeStores<PersonDataChange>(services);
            SetupTypeStores<Questionnaire>(services);
            SetupPersonDataStores<QuestionnaireAnswers>(services);
            SetupTypeStores<ServiceDefinition>(services);
            SetupTypeStores<ServiceRequest>(services);
            SetupTypeStores<Study>(services);
            SetupTypeStores<StudyAssociation>(services);
            SetupPersonDataStores<StudyEnrollment>(services);
            services.AddScoped<IStudyEnrollmentStore, StudyEnrollmentStore>();
            SetupTypeStores<SubscriptionBase>(services);
            services.AddScoped<ISubscriptionsStore, SubscriptionsStore>();
            services.AddScoped<ITestResultStore, TestResultStore>();
        }

        private static void SetupTypeStores<T>(IServiceCollection services) where T: IId
        {
            if (typeof(T).GetInterfaces().Contains(typeof(IPersonData)))
                throw new SecurityException("SetupTypeStores cannot be used for person data, use SetupPersonDataStores instead");
            services.AddScoped<IReadonlyStore<T>, GenericReadonlyStore<T>>();
            services.AddSingleton<ICachedReadonlyStore<T>, GenericCachedReadonlyStore<T>>();
            services.AddScoped<IStore<T>, GenericStore<T>>();
        }

        private static void SetupPersonDataStores<T>(IServiceCollection services) where T: IPersonData
        {
            services.AddScoped<IPersonDataReadonlyStore<T>, GenericPersonDataReadonlyStore<T>>();
            services.AddScoped<IPersonDataStore<T>, GenericPersonDataStore<T>>();
        }

        private static void SetupInterfaceStores<T>(IServiceCollection services, string collectionName) where T: IId
        {
            services.AddScoped<IReadonlyStore<T>>(provider => new GenericReadonlyStore<T>(provider.GetService<IMongoDatabase>(), collectionName));
            services.AddSingleton<ICachedReadonlyStore<T>>(provider => new GenericCachedReadonlyStore<T>(provider.GetService<IMongoDatabase>(), collectionName));
            services.AddScoped<IStore<T>>(provider => new GenericStore<T>(provider.GetService<IMongoDatabase>(), collectionName));
        }
    }
}
