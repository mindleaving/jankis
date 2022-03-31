using System.Collections.Generic;
using System.Threading.Tasks;
using JanKIS.API.ViewModels;

namespace JanKIS.API.Workflow.ViewModelBuilders
{
    public interface IViewModelBuilder<T>
    {
        Task<IViewModel<T>> Build(T model, IViewModelBuilderOptions<T> options = null);
        Task<List<IViewModel<T>>> BatchBuild(List<T> models, IViewModelBuilderOptions<T> options = null);
    }
}