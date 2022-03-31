using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.AspNetCore.Mvc.Controllers;

namespace JanKIS.API.Setups
{
    public class FilteredHealthControllersProvider : IApplicationFeatureProvider<ControllerFeature>
    {
        private readonly Type[] ExcludedControllers =
        {
            typeof(HealthSharingPortal.API.Controllers.AccountsController),
            typeof(HealthSharingPortal.API.Controllers.AccessesController),
            typeof(HealthSharingPortal.API.Controllers.AccessRequestsController),
            typeof(HealthSharingPortal.API.Controllers.NotificationsController),
            typeof(HealthSharingPortal.API.Controllers.StudiesController),
            typeof(HealthSharingPortal.API.Controllers.SubscriptionsController),
            typeof(HealthSharingPortal.API.Controllers.ViewModelsController)
        };

        public void PopulateFeature(
            IEnumerable<ApplicationPart> parts,
            ControllerFeature feature)
        {
            var excludedControllers = feature.Controllers
                .Where(controller => ExcludedControllers.Any(excludedController => IsMatch(controller, excludedController)))
                .ToList();
            foreach (var controller in excludedControllers)
            {
                feature.Controllers.Remove(controller);
            }
        }

        private bool IsMatch(
            TypeInfo controller,
            Type excludedController)
        {
            return controller == excludedController;
        }
    }
}