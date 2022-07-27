using System;
using System.IO;
using System.Reflection;
using Commons.Physics;
using HealthModels;
using HealthModels.Attributes;
using HealthModels.Converters;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.ViewModels;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;
using JanKIS.API.ViewModels;
using TypescriptGenerator;
using Account = JanKIS.API.Models.Account;

namespace JanKIS.API.Setups
{
    public static class TypescriptGeneratorRunner
    {
        public static void Run()
        {
            var repositoryPath = Constants.GetRepositoryPath();
            TypescriptGenerator.TypescriptGenerator.Builder
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(Person)), "HealthModels")
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(BedOccupancy)), "JanKIS.API.Models")
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(ResourceViewModel)), "JanKIS.API.ViewModels")
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(Publication)), "HealthSharingPortal.API.Models")
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(StudyViewModel)), "HealthSharingPortal.API.ViewModels")
                .Include<SubscriptionObjectType>()
                .Include<NotificationType>()
                .Exclude<HealthSharingPortal.API.Models.Filters.SharedAccessFilter>()
                .Exclude<HealthSharingPortal.API.Models.Subscriptions.AdmissionNotification>()
                .Exclude<HealthSharingPortal.API.Models.Account>()
                .Exclude<HealthSharingPortal.API.Models.AccountType>()
                .Exclude<HealthSharingPortal.API.Models.CreateAccessInviteBody>()
                .Exclude<HealthSharingPortal.API.Models.SharerAccount>()
                .Exclude<HealthSharingPortal.API.Models.SharerPrivacySettings>()
                .Exclude<HealthSharingPortal.API.Models.HealthProfessionalAccount>()
                .Exclude<HealthSharingPortal.API.Models.Publication>()
                .Exclude<HealthSharingPortal.API.Models.ResearchStaff>()
                .Exclude<HealthSharingPortal.API.Models.Study>()
                .Exclude<HealthSharingPortal.API.Models.StudyAssociation>()
                .Exclude<HealthSharingPortal.API.Models.StudyEnrollementState>()
                .Exclude<HealthSharingPortal.API.Models.StudyEnrollment>()
                .Exclude<HealthSharingPortal.API.Models.StudyEnrollmentStatistics>()
                .Exclude<HealthSharingPortal.API.Models.StudyParticipation>()
                .Exclude<HealthSharingPortal.API.Models.StudyStaffRole>()
                .Exclude<HealthSharingPortal.API.ViewModels.AccountCreationInfo>()
                .Exclude<HealthSharingPortal.API.ViewModels.AccountViewModel>()
                .Exclude<HealthSharingPortal.API.ViewModels.LoggedInUserViewModel>()
                .Exclude<HealthSharingPortal.API.ViewModels.StudyEnrollmentViewModel>()
                .Exclude<HealthSharingPortal.API.ViewModels.StudyParticipationOfferViewModel>()
                .Exclude<HealthSharingPortal.API.ViewModels.StudyViewModel>()
                .Exclude<OfferAutocompleteAttribute>()
                .Exclude<DiagnosticCriteriaJsonConverter>()
                .Exclude<DiagnosticTestResultJsonConverter>()
                .Exclude<DiseaseJsonConverter>()
                .Exclude<ObservationsJsonConverter>()
                .Exclude<SymptomJsonConverter>()
                .Exclude<ServiceAudienceJsonConverter>()
                .Exclude<ServiceParameterJsonConverter>()
                .Exclude<ServiceParameterResponseJsonConverter>()
                .ReactDefaults()
                .ConfigureNamespace("HealthModels", options => options.Translation = "Models")
                .ConfigureNamespace("JanKIS.API.Models", options => options.Translation = "Models")
                .ConfigureNamespace("HealthSharingPortal.API.Models", options => options.Translation = "Models")
                .ConfigureNamespace("JanKIS.API.ViewModels", options =>
                {
                    options.Translation = "ViewModels";
                    options.Filename = "viewModels.d.ts";
                })
                .ConfigureNamespace("HealthSharingPortal.API.ViewModels", options =>
                {
                    options.Translation = "ViewModels";
                    options.Filename = "viewModels.d.ts";
                })
                .CustomizeType(x => x == typeof(UnitValue), _ => "math.Unit")
                .CustomizeType(x => x == typeof(Guid), _ => "string")
                .SetOutputDirectory(Path.Combine(repositoryPath, "jankis-frontend", "src", "localComponents", "types"))
                .Generate();
        }
    }
}
