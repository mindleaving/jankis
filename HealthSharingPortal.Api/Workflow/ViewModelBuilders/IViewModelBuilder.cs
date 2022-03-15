using System.Threading.Tasks;
using HealthSharingPortal.API.ViewModels;

namespace HealthSharingPortal.API.Workflow.ViewModelBuilders
{
    public interface IViewModelBuilder<T>
    {
        Task<IViewModel<T>> Build(T model);
    }
}