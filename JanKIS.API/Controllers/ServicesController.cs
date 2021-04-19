using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
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
        private readonly IServiceStore servicesStore;
        private readonly IStore<ServiceRequest> serviceRequestsStore;
        private readonly IHttpContextAccessor httpContextAccessor;

        public ServicesController(
            IServiceStore servicesStore,
            IStore<ServiceRequest> serviceRequestsStore,
            IHttpContextAccessor httpContextAccessor)
            : base(servicesStore)
        {
            this.servicesStore = servicesStore;
            this.serviceRequestsStore = serviceRequestsStore;
            this.httpContextAccessor = httpContextAccessor;
        }

        public override async Task<IActionResult> GetMany(
            int? count = null,
            int? skip = null,
            string orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending)
        {
            Request.Query.TryGetValue("departmentId", out var departmentId);
            var orderByExpression = BuildOrderByExpression(orderBy);
            var items = await servicesStore.GetManyFiltered(count, skip, orderByExpression, orderDirection, departmentId);
            return Ok(items);
        }

        [HttpPost("{serviceId}/request")]
        public async Task<IActionResult> RequestService([FromRoute] string serviceId, [FromBody] ServiceRequest request)
        {
            if (serviceId != request.Service.Id)
                return BadRequest("Service-ID of route doesn't match service-ID in request");
            var service = await servicesStore.GetByIdAsync(serviceId);
            if (service == null)
                return NotFound();
            request.Service = service;
            if (string.IsNullOrWhiteSpace(request.Id))
                request.Id = Guid.NewGuid().ToString();
            if (await serviceRequestsStore.ExistsAsync(request.Id))
                return Conflict("A request with that ID already exists");
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            request.Timestamps = new List<ServiceRequestStateChange> {new(ServiceRequestState.Requested, DateTime.UtcNow)};
            request.Requester = username;
            await serviceRequestsStore.StoreAsync(request);
            // TODO: Distribute request through hub
            return Ok(request.Id);
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
