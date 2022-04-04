﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.API.Controllers
{
    public class PersonsController : PersonDataRestControllerBase<Person>
    {
        public PersonsController(
            IPersonDataStore<Person> store,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule)
            : base(store, httpContextAccessor, authorizationModule)
        {
        }

        protected override Task<object> TransformItem(
            Person item,
            Language language = Language.en)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<Person, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "firstname" => x => x.FirstName,
                "lastname" => x => x.LastName,
                "birthdate" => x => x.BirthDate,
                "insurer" => x => x.HealthInsurance.InsurerName,
                _ => x => x.Id
            };
        }

        protected override Expression<Func<Person, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.Or(
                SearchExpressionBuilder.ContainsAny<Person>(x => x.Id.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Person>(x => x.FirstName.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Person>(x => x.LastName.ToLower(), searchTerms));
        }

        protected override IEnumerable<Person> PrioritizeItems(
            List<Person> items,
            string searchText)
        {
            return items.OrderBy(x => x.Id);
        }

        protected override Task PublishChange(
            Person item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            // Nothing to do
            return Task.CompletedTask;
        }
    }
}
