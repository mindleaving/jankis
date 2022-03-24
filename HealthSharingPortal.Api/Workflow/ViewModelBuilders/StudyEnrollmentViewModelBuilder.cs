using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;

namespace HealthSharingPortal.API.Workflow.ViewModelBuilders
{
    public class StudyEnrollmentViewModelBuilder : IViewModelBuilder<StudyEnrollment>
    {
        private readonly IReadonlyStore<Person> personStore;

        public StudyEnrollmentViewModelBuilder(
            IReadonlyStore<Person> personStore)
        {
            this.personStore = personStore;
        }

        public async Task<IViewModel<StudyEnrollment>> Build(StudyEnrollment model)
        {
            var person = await personStore.GetByIdAsync(model.PersonId);
            return new StudyEnrollmentViewModel
            {
                Enrollment = model,
                Person = person
            };
        }

        public async Task<List<IViewModel<StudyEnrollment>>> BatchBuild(List<StudyEnrollment> models)
        {
            var personIds = models.Select(x => x.PersonId).ToList();
            var persons = await personStore.SearchAsync(x => personIds.Contains(x.Id));
            var personDictionary = persons.ToDictionary(x => x.Id, x => x);
            var viewModels = new List<IViewModel<StudyEnrollment>>();
            foreach (var model in models)
            {
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
