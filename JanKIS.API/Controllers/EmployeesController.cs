using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        [HttpPut("{employeeId}")]
        public async Task<IActionResult> CreateNew([FromRoute] string employeeId)
        {
            throw new NotImplementedException();
        }

        [HttpPatch("{employeeId}/permissions/{permissionId}/add")]
        public async Task<IActionResult> AddPermission([FromRoute] string employeeId, [FromRoute] string permissionId)
        {
            throw new NotImplementedException();
        }

        [HttpPatch("{employeeId}/permissions/{permissionId}/remove")]
        public async Task<IActionResult> RemovePermission([FromRoute] string employeeId, [FromRoute] string permissionId)
        {
            throw new NotImplementedException();
        }


        [HttpGet("{employeeId}/" + nameof(ViewState))]
        public async Task<IActionResult> ViewState([FromRoute] string employeeId)
        {
            throw new NotImplementedException();
        }

    }
}
