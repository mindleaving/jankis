using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.Models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public interface IRestController<T> where T : class, IId
    {
        Task<IActionResult> GetById(
            [FromRoute] string id,
            [FromQuery] Language language = Language.en);

        Task<IActionResult> GetMany(
            [FromQuery] string searchText, 
            [FromQuery] int? count = null,
            [FromQuery] int? skip = null,
            [FromQuery] string orderBy = null,
            [FromQuery] OrderDirection orderDirection = OrderDirection.Ascending,
            [FromQuery] Language language = Language.en);

        Task<IActionResult> CreateOrReplace([FromRoute] string id, [FromBody] T item);
        Task<IActionResult> PartialUpdate([FromRoute] string id, [FromBody] JsonPatchDocument<T> updates);
        Task<IActionResult> Delete([FromRoute] string id);
    }
}