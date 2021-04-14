using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.AccessManagement;
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
    public class ServicesController : RestControllerBase<ServiceDefinition>
    {
        private readonly IStore<ServiceDefinition> servicesStore;
        private readonly IStore<ServiceRequest> serviceRequestsStore;
        private readonly IReadonlyStore<InstitutionPolicy> institutionPolicyStore;
        private readonly ServiceRequestChangePolicy serviceRequestChangePolicy;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IReadonlyStore<Account> accountsStore;

        public ServicesController(
            IStore<ServiceDefinition> servicesStore,
            IStore<ServiceRequest> serviceRequestsStore,
            IHttpContextAccessor httpContextAccessor,
            IReadonlyStore<InstitutionPolicy> institutionPolicyStore,
            IReadonlyStore<Account> accountsStore,
            ServiceRequestChangePolicy serviceRequestChangePolicy)
            : base(servicesStore)
        {
            this.servicesStore = servicesStore;
            this.serviceRequestsStore = serviceRequestsStore;
            this.httpContextAccessor = httpContextAccessor;
            this.institutionPolicyStore = institutionPolicyStore;
            this.serviceRequestChangePolicy = serviceRequestChangePolicy;
            this.accountsStore = accountsStore;
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
            request.Timestamps = new Dictionary<ServiceRequestState, DateTime> {{ServiceRequestState.Requested, DateTime.UtcNow}};
            request.Requester = userId;
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
            var account = await accountsStore.GetByIdAsync(userId);
            var institutionPolicy = await institutionPolicyStore.GetByIdAsync(InstitutionPolicy.DefaultId);
            if (!await serviceRequestChangePolicy.CanChange(existingRequest, account, institutionPolicy))
                return Forbid();
            existingRequest.ParameterResponses = request.ParameterResponses;
            await serviceRequestsStore.StoreAsync(existingRequest);
            return Ok();
        }

        protected override Expression<Func<ServiceDefinition, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "name" => x => x.Name,
                "department" => x => x.DepartmentId,
                _ => x => x.Name
            };
        }

        protected override Expression<Func<ServiceDefinition, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<ServiceDefinition>(x => x.Name.ToLower(), searchTerms);
        }

        protected override IEnumerable<ServiceDefinition> PrioritizeItems(
            List<ServiceDefinition> items,
            string searchText)
        {
            return items.OrderBy(x => x.Name.Length);
        }

    }
}
