﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RolesController : RestControllerBase<Role>
    {
        private readonly IStore<Role> rolesStore;
        private readonly IPersonWithLoginStore<Employee> employeesStore;
        private readonly IPersonWithLoginStore<Employee> patientsStore;

        public RolesController(
            IStore<Role> rolesStore,
            IPersonWithLoginStore<Employee> employeesStore,
            IPersonWithLoginStore<Employee> patientsStore)
            : base(rolesStore)
        {
            this.rolesStore = rolesStore;
            this.employeesStore = employeesStore;
            this.patientsStore = patientsStore;
        }

        public override async Task<IActionResult> Delete(string id)
        {
            var role = await rolesStore.GetByIdAsync(id);
            if (role == null)
                return Ok();
            if (role.IsSystemRole)
                return BadRequest("System-roles cannot be deleted");
            await employeesStore.RemoveRoleFromAllUsers(id);
            await patientsStore.RemoveRoleFromAllUsers(id);
            return await base.Delete(id);
        }


        protected override Expression<Func<Role, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "name" => x => x.Name,
                _ => x => x.Id
            };
        }

        protected override Expression<Func<Role, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<Role>(x => x.Name.ToLower(), searchTerms);
        }

        protected override IEnumerable<Role> PrioritizeItems(List<Role> items, string searchText)
        {
            return items
                .OrderBy(x => x.Name.ToLower().StartsWith(searchText.ToLower()))
                .ThenBy(x => x.Name.Length);
        }
    }
}
