using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.Workflow;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    public class ServiceRequestsController : RestControllerBase<ServiceRequest>
    {
        private readonly IServiceRequestsStore serviceRequestsStore;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IReadonlyStore<Account> accountsStore;
        private readonly IReadonlyStore<InstitutionPolicy> institutionPolicyStore;
        private readonly ServiceRequestChangePolicy serviceRequestChangePolicy;

        public ServiceRequestsController(
            IServiceRequestsStore serviceRequestsStore,
            IHttpContextAccessor httpContextAccessor,
            IReadonlyStore<Account> accountsStore,
            IReadonlyStore<InstitutionPolicy> institutionPolicyStore,
            ServiceRequestChangePolicy serviceRequestChangePolicy)
            : base(serviceRequestsStore)
        {
            this.serviceRequestsStore = serviceRequestsStore;
            this.httpContextAccessor = httpContextAccessor;
            this.institutionPolicyStore = institutionPolicyStore;
            this.serviceRequestChangePolicy = serviceRequestChangePolicy;
            this.accountsStore = accountsStore;
        }

        public override async Task<IActionResult> GetMany(
            int? count = null,
            int? skip = null,
            string orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending)
        {
            Request.Query.TryGetValue("departmentId", out var departmentId);
            Request.Query.TryGetValue("serviceId", out var serviceId);
            var orderByExpression = BuildOrderByExpression(orderBy);
            var items = await serviceRequestsStore.GetManyFiltered(count, skip, orderByExpression, orderDirection, departmentId, serviceId);
            return Ok(items);
        }

        [HttpPatch("{requestId}")]
        public async Task<IActionResult> UpdateRequest([FromRoute] string requestId, [FromBody] ServiceRequest request)
        {
            var existingRequest = await store.GetByIdAsync(requestId);
            if (existingRequest == null)
                return NotFound();
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var account = await accountsStore.GetByIdAsync(username);
            var institutionPolicy = await institutionPolicyStore.GetByIdAsync(InstitutionPolicy.DefaultId);
            if (!await serviceRequestChangePolicy.CanChange(existingRequest, account, institutionPolicy))
                return Forbid();
            if (!existingRequest.TrySetState(request.State, out var stateChangeError))
                return BadRequest(stateChangeError);
            existingRequest.ParameterResponses = request.ParameterResponses;
            existingRequest.Note = request.Note;
            await store.StoreAsync(existingRequest);
            return Ok();
        }

        protected override Expression<Func<ServiceRequest, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "service" => x => x.Service.Name,
                "requester" => x => x.Requester,
                "assignedto" => x => x.AssignedTo,
                "time" => x => x.Timestamps[0].Timestamp,
                _ => x => x.Timestamps[0].Timestamp
            };
        }

        protected override Expression<Func<ServiceRequest, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.Or(
                SearchExpressionBuilder.ContainsAny<ServiceRequest>(x => x.Requester, searchTerms),
                SearchExpressionBuilder.ContainsAny<ServiceRequest>(x => x.AssignedTo, searchTerms),
                SearchExpressionBuilder.ContainsAny<ServiceRequest>(x => x.Service.Name, searchTerms));
        }

        protected override IEnumerable<ServiceRequest> PrioritizeItems(
            List<ServiceRequest> items,
            string searchText)
        {
            return items.OrderBy(x => x.Timestamps[0].Timestamp);
        }
    }
}
