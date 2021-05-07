using System.Threading.Tasks;

namespace JanKIS.API.AccessManagement
{
    public interface IPermissionFilterBuilder<T>
    {
        Task<PermissionFilter<T>> Build();
    }
}