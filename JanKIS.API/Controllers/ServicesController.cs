using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.Workflow;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ServicesController : ControllerBase
    {
        private readonly IStore<ServiceDefinition> servicesStore;
        private readonly IStore<ServiceRequest> serviceRequestsStore;
        private readonly IReadonlyStore<InstitutionPolicy> institutionPolicyStore;
        private readonly ServiceRequestChangePolicy serviceRequestChangePolicy;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IReadonlyStore<Employee> employeesStore;
        private readonly IReadonlyStore<Patient> patientsStore;

        public ServicesController(
            IStore<ServiceDefinition> servicesStore,
            IStore<ServiceRequest> serviceRequestsStore,
            IHttpContextAccessor httpContextAccessor,
            IReadonlyStore<InstitutionPolicy> institutionPolicyStore,
            IReadonlyStore<Employee> employeesStore,
            IReadonlyStore<Patient> patientsStore,
            ServiceRequestChangePolicy serviceRequestChangePolicy)
        {
            this.servicesStore = servicesStore;
            this.serviceRequestsStore = serviceRequestsStore;
            this.httpContextAccessor = httpContextAccessor;
            this.institutionPolicyStore = institutionPolicyStore;
            this.employeesStore = employeesStore;
            this.patientsStore = patientsStore;
            this.serviceRequestChangePolicy = serviceRequestChangePolicy;
        }

        [HttpGet]
        public async Task<IActionResult> GetMany(
            int? count = null, 
            int? skip = null, 
            string orderBy = null,
            OrderDirection? orderDirection = null)
        {
            Expression<Func<ServiceDefinition, object>> orderByExpression = orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "name" => x => x.Name,
                "department" => x => x.DepartmentId,
                _ => x => x.Name
            };
            var items = await servicesStore.GetMany(count, skip, orderByExpression, orderDirection ?? OrderDirection.Ascending);
            return Ok(items);
        }

        [HttpGet(nameof(Search))]
        public async Task<IActionResult> Search([FromQuery] string searchText, [FromQuery] int? count = null, [FromQuery] int? skip = null)
        {
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.ContainsAll<ServiceDefinition>(x => x.Name.ToLower(), searchTerms);
            var items = await servicesStore.SearchAsync(searchExpression, count, skip);
            var prioritizedItems = items.OrderBy(x => x.Name.Length);
            return Ok(prioritizedItems);
        }

        [HttpPost("{serviceId}/request")]
        public async Task<IActionResult> RequestService([FromRoute] string serviceId, [FromBody] ServiceRequest request)
        {
            if (serviceId != request.ServiceId)
                return BadRequest("Service-ID of route doesn't match service-ID in request");
            var service = await servicesStore.GetByIdAsync(serviceId);
            if (service == null)
                return NotFound();
            if (string.IsNullOrWhiteSpace(request.Id))
                request.Id = Guid.NewGuid().ToString();
            if (await serviceRequestsStore.ExistsAsync(request.Id))
                return Conflict("A request with that ID already exists");
            var claimsPrincipal = httpContextAccessor.HttpContext.User;
            var userId = claimsPrincipal.Claims.Single(x => x.Type == "id").Value;
            var personType = Enum.Parse<PersonType>(claimsPrincipal.Claims.Single(x => x.Type == "personType").Value);
            request.Timestamps = new Dictionary<ServiceRequestState, DateTime> {{ServiceRequestState.Requested, DateTime.UtcNow}};
            request.Requester = new PersonReference(personType, userId);
            await serviceRequestsStore.StoreAsync(request);
            // TODO: Distribute request through hub
            return Ok(request.Id);
        }

        [HttpPatch("{serviceId}/requests/{requestId}")]
        public async Task<IActionResult> UpdateRequest([FromRoute] string serviceId, [FromRoute] string requestId, [FromBody] ServiceRequest request)
        {
            var existingRequest = await serviceRequestsStore.GetByIdAsync(requestId);
            if (existingRequest == null)
                return NotFound();
            var claimsPrincipal = httpContextAccessor.HttpContext.User;
            var userId = claimsPrincipal.Claims.Single(x => x.Type == "id").Value;
            var personType = Enum.Parse<PersonType>(claimsPrincipal.Claims.Single(x => x.Type == "personType").Value);
            PersonWithLogin user = personType switch
            {
                PersonType.Employee => await employeesStore.GetByIdAsync(userId),
                PersonType.Patient => await patientsStore.GetByIdAsync(userId),
                _ => throw new NotSupportedException($"Cannot load user for person-type '{personType}'")
            };
            var institutionPolicy = await institutionPolicyStore.GetByIdAsync(InstitutionPolicy.DefaultId);
            if (!await serviceRequestChangePolicy.CanChange(existingRequest, user, institutionPolicy))
                return Forbid();
            existingRequest.ParameterResponses = request.ParameterResponses;
            await serviceRequestsStore.StoreAsync(existingRequest);
            return Ok();
        }

    }
}
