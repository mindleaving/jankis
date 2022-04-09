using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Services;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using JanKIS.API.Models;
using JanKIS.API.ViewModels;

namespace JanKIS.API.Workflow.ViewModelBuilders
{
    public class ServiceAudienceViewModelBuilderOptions : IViewModelBuilderOptions<ServiceAudience>
    {
        public List<IPersonDataAccessGrant> AccessGrants { get; set; }
    }
    public class ServiceAudienceViewModelBuilder : IViewModelBuilder<ServiceAudience>
    {
        private readonly IPersonDataReadonlyStore<Person> personsStore;
        private readonly ICachedReadonlyStore<Role> rolesStore;

        public ServiceAudienceViewModelBuilder(
            IPersonDataReadonlyStore<Person> personsStore,
            ICachedReadonlyStore<Role> rolesStore)
        {
            this.personsStore = personsStore;
            this.rolesStore = rolesStore;
        }

        public async Task<IViewModel<ServiceAudience>> Build(ServiceAudience model, IViewModelBuilderOptions<ServiceAudience> options = null)
        {
            if (model.Type == ServiceAudienceType.All)
            {
                return new ServiceAudienceViewModel(model);
            }
            if (model.Type == ServiceAudienceType.Person)
            {
                if (options is not ServiceAudienceViewModelBuilderOptions typedOptions)
                    throw new ArgumentException($"{nameof(ServiceAudienceViewModelBuilder)} was called without options, but this is required");
                var personAudience = (PersonServiceAudience) model;
                var person = await personsStore.GetByIdAsync(personAudience.PersonId, typedOptions.AccessGrants);
                return new ServiceAudienceViewModel(model)
                {
                    Person = person
                };
            }
            if (model.Type == ServiceAudienceType.Role)
            {
                var roleAudience = (RoleServiceAudience) model;
                var role = await rolesStore.CachedGetByIdAsync(roleAudience.RoleId);
                return new ServiceAudienceViewModel(model)
                {
                    Role = role
                };
            }

            throw new ArgumentOutOfRangeException(nameof(model.Type), $"View model building for that service audience type not implemented");
        }

        public Task<List<IViewModel<ServiceAudience>>> BatchBuild(
            List<ServiceAudience> models,
            IViewModelBuilderOptions<ServiceAudience> options = null)
        {
            throw new NotImplementedException();
        }
    }
}
