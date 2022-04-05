using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;

namespace HealthSharingPortal.API.Workflow.ViewModelBuilders
{
    public class StudyEnrollmentViewModelBuilderOptions : IViewModelBuilderOptions<StudyEnrollment>
    {
        public List<IPersonDataAccessGrant> AccessGrants { get; set; }
    }
    public class StudyEnrollmentViewModelBuilder : IViewModelBuilder<StudyEnrollment>
    {
        private readonly IPersonDataReadonlyStore<Person> personStore;

        public StudyEnrollmentViewModelBuilder(
            IPersonDataReadonlyStore<Person> personStore)
        {
            this.personStore = personStore;
        }

        public async Task<IViewModel<StudyEnrollment>> Build(
            StudyEnrollment model, 
            IViewModelBuilderOptions<StudyEnrollment> options = null)
        {
            if(options == null || options is not StudyEnrollmentViewModelBuilderOptions typedOptions)
                throw new ArgumentException($"{nameof(StudyEnrollmentViewModelBuilder)} was called without options, but they are mandatory and must contain access grants");
            var person = await personStore.GetByIdAsync(model.PersonId, typedOptions.AccessGrants);
            return new StudyEnrollmentViewModel
            {
                Enrollment = model,
                Person = person
            };
        }

        public async Task<List<IViewModel<StudyEnrollment>>> BatchBuild(
            List<StudyEnrollment> models, 
            IViewModelBuilderOptions<StudyEnrollment> options = null)
        {
            if(options == null || options is not StudyEnrollmentViewModelBuilderOptions typedOptions)
                throw new ArgumentException($"{nameof(StudyEnrollmentViewModelBuilder)} was called without options, but they are mandatory and must contain access grants");
            var personIds = models.Select(x => x.PersonId).ToList();
            var persons = personIds.Count > 0
                ? await personStore.SearchAsync(x => personIds.Contains(x.Id), typedOptions.AccessGrants)
                : new List<Person>();
            var personDictionary = persons.ToDictionary(x => x.Id, x => x);
            var viewModels = new List<IViewModel<StudyEnrollment>>();
            foreach (var model in models)
            {
                if(!personDictionary.ContainsKey(model.PersonId))
                    continue;
                var viewModel = new StudyEnrollmentViewModel
                {
                    Enrollment = model,
                    Person = personDictionary[model.PersonId]
                };
                viewModels.Add(viewModel);
            }
            return viewModels;
        }
    }
}
