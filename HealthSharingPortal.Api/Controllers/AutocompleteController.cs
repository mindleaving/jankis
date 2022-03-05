using System.Threading.Tasks;
using HealthSharingPortal.Api.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AutocompleteController : ControllerBase
    {
        private readonly IAutocompleteCache autocompleteCache;

        public AutocompleteController(IAutocompleteCache autocompleteCache)
        {
            this.autocompleteCache = autocompleteCache;
        }

        [HttpGet("{context}")]
        public async Task<IActionResult> Suggestions([FromRoute] string context, [FromQuery] string searchText, [FromQuery] int? count = null)
        {
            var suggestions = await autocompleteCache.GetSuggestions(context, searchText, count);
            return Ok(suggestions);
        }

    }
}
