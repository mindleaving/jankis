using System.Threading.Tasks;
using JanKIS.API.ViewModels;

namespace JanKIS.API.Workflow.ViewModelBuilders
{
    public interface IViewModelBuilder<T>
    {
        Task<IViewModel<T>> Build(T model);
    }
}