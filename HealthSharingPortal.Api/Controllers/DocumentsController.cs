using System;
using System.Collections.Generic;
using System.IO;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.Api.Helpers;
using HealthSharingPortal.Api.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.Api.Controllers
{
    public class DocumentsController : RestControllerBase<PatientDocument>
    {
        private readonly IFilesStore filesStore;

        public DocumentsController(
            IStore<PatientDocument> store,
            IFilesStore filesStore,
            IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
            this.filesStore = filesStore;
        }

        [HttpPut("{documentId}/upload")]
        public async Task<IActionResult> Upload([FromRoute] string documentId)
        {
            var document = await store.GetByIdAsync(documentId);
            if (document == null)
                return BadRequest($"No document exists with ID '{documentId}'. It must be created before uploading the file content");
            await filesStore.StoreAsync(documentId, Request.Body);
            return Ok();
        }

        [HttpGet("{documentId}/download")]
        public async Task<IActionResult> Download([FromRoute] string documentId)
        {
            var document = await store.GetByIdAsync(documentId);
            if (document == null)
                return NotFound();
            var fileStream = filesStore.GetById(documentId);
            var contentType = MimeHelpers.GetContentTypeFromFileExtension(Path.GetExtension(document.FileName));
            return File(fileStream, contentType, document.FileName);
        }

        public override async Task<IActionResult> Delete(string id)
        {
            filesStore.Delete(id);
            return await base.Delete(id);
        }

        protected override Task<object> TransformItem(PatientDocument item)
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

        protected override IEnumerable<PatientDocument> PrioritizeItems(
            List<PatientDocument> items,
            string searchText)
        {
            return items;
        }
        
    }
}
