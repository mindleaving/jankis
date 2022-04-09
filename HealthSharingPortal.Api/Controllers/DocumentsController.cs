using System;
using System.Collections.Generic;
using System.IO;
using System.Linq.Expressions;
using System.Security;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class DocumentsController : HealthRecordEntryControllerBase<PatientDocument>
    {
        private readonly IFilesStore filesStore;
        private readonly INotificationDistributor notificationDistributor;

        public DocumentsController(
            IPersonDataStore<PatientDocument> store,
            IFilesStore filesStore,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule,
            INotificationDistributor notificationDistributor)
            : base(store, httpContextAccessor, authorizationModule)
        {
            this.filesStore = filesStore;
            this.notificationDistributor = notificationDistributor;
        }

        [DisableRequestSizeLimit]
        [HttpPut("{documentId}/upload")]
        public async Task<IActionResult> Upload([FromRoute] string documentId)
        {
            var accessGrants = await GetAccessGrants();
            var document = await store.GetByIdAsync(documentId, accessGrants);
            if (document == null)
                return BadRequest($"No document exists with ID '{documentId}'. It must be created before uploading the file content");
            await filesStore.StoreAsync(documentId, Request.Body);
            return Ok();
        }

        [HttpGet("{documentId}/download")]
        public async Task<IActionResult> Download([FromRoute] string documentId)
        {
            var accessGrants = await GetAccessGrants();
            var document = await store.GetByIdAsync(documentId, accessGrants);
            if (document == null)
                return NotFound();
            var fileStream = filesStore.GetById(documentId);
            var contentType = MimeHelpers.GetContentTypeFromFileExtension(Path.GetExtension(document.FileName));
            return File(fileStream, contentType, document.FileName);
        }

        public override async Task<IActionResult> Delete(string id)
        {
            var documentDeletionResult = await base.Delete(id);
            if(documentDeletionResult is OkResult)
                filesStore.Delete(id);
            return documentDeletionResult;
        }

        protected override Task<object> TransformItem(
            PatientDocument item,
            Language language = Language.en)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<PatientDocument, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                _ => x => x.Id
            };
        }

        protected override Expression<Func<PatientDocument, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<PatientDocument>(x => x.Id.ToLower(), searchTerms);
        }

        protected override Task PublishChange(
            PatientDocument item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            return notificationDistributor.NotifyNewPatientEvent(item, storageOperation, submitterUsername);
        }
    }
}
