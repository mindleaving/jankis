using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.AccessControl;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;

namespace HealthSharingPortal.API.Workflow.ViewModelBuilders
{
    public class AccessViewModelBuilderOptions : IViewModelBuilderOptions<ISharedAccess>
    {
        public List<IPersonDataAccessGrant> AccessGrants { get; set; }
        public bool IncludeEmergencyTokens { get; set; }
    }
    public class AccessViewModelBuilder : IViewModelBuilder<ISharedAccess>
    {
        private readonly IPersonStore personStore;
        private readonly IReadonlyStore<Account> accountStore;

        public AccessViewModelBuilder(
            IPersonStore personStore,
            IReadonlyStore<Account> accountStore)
        {
            this.personStore = personStore;
            this.accountStore = accountStore;
        }

        public async Task<IViewModel<ISharedAccess>> Build(
            ISharedAccess model,
            IViewModelBuilderOptions<ISharedAccess> options = null)
        {
            var viewModels = await BatchBuild(new List<ISharedAccess> { model }, options);
            if (viewModels.Count != 1)
                throw new Exception("Could not build view model for shared access");
            return viewModels[0];
        }

        public async Task<List<IViewModel<ISharedAccess>>> BatchBuild(
            List<ISharedAccess> models,
            IViewModelBuilderOptions<ISharedAccess> options = null)
        {
            if(options is not AccessViewModelBuilderOptions typedOptions)
                throw new ArgumentException($"{nameof(AccessViewModelBuilder)} was called without options, but they are mandatory and must contain access grants");
            var sharerPersonIds = models.Select(x => x.SharerPersonId).Distinct();
            var persons = await personStore.SearchAsync(x => sharerPersonIds.Contains(x.Id), typedOptions.AccessGrants);
            var personDictionary = persons.ToDictionary(x => x.Id);
            var viewModels = new List<IViewModel<ISharedAccess>>();
            foreach (var model in models)
            {
                if(!personDictionary.ContainsKey(model.SharerPersonId))
                    continue;
                var sharer = personDictionary[model.SharerPersonId];
                var hasEmergencyToken = false;
                if (model is EmergencyAccess emergencyAccess && !typedOptions.IncludeEmergencyTokens)
                {
                    hasEmergencyToken = emergencyAccess.Token != null;
                    emergencyAccess.Token = null;
                }
                var viewModel = new AccessViewModel
                {
                    SharerProfileData = sharer,
                    Access = model,
                    HasEmergencyToken = hasEmergencyToken
                };
                viewModels.Add(viewModel);
            }
            return viewModels;
        }
    }
}
