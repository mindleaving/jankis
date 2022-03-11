using System.Threading.Tasks;
using HealthSharingPortal.Api.ViewModels;

namespace HealthSharingPortal.Api.Workflow.ViewModelBuilders
{
    public interface IViewModelBuilder<T>
    {
        Task<IViewModel<T>> Build(T model);
    }
}