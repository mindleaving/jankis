using System.Threading.Tasks;

namespace JanKIS.API.ViewModels.Builders
{
    public interface IViewModelBuilder<T>
    {
        Task<IViewModel<T>> Build(T model);
    }
}