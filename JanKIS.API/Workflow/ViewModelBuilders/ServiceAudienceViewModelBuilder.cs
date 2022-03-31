using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Services;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels;

namespace JanKIS.API.Workflow.ViewModelBuilders
{
    public class ServiceAudienceViewModelBuilder : IViewModelBuilder<ServiceAudience>
    {
        private readonly ICachedReadonlyStore<Person> personsStore;
        private readonly ICachedReadonlyStore<Role> rolesStore;

        public ServiceAudienceViewModelBuilder(
            ICachedReadonlyStore<Person> personsStore,
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
                var personAudience = (PersonServiceAudience) model;
                var person = await personsStore.CachedGetByIdAsync(personAudience.PersonId);
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
