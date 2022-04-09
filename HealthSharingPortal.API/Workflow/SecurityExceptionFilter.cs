using System.Net;
using System.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace HealthSharingPortal.API.Workflow
{
    public class SecurityExceptionFilter : IActionFilter, IOrderedFilter
    {
        public int Order { get; } = 0;

        public void OnActionExecuting(ActionExecutingContext context) { }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Exception is SecurityException)
            {
                context.Result = new ObjectResult("resolveText:Exception_NotEnoughPermissions")
                {
                    StatusCode = (int)HttpStatusCode.Forbidden
                };
                context.ExceptionHandled = true;
            }
        }
    }
}