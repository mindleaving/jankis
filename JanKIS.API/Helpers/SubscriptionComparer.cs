using System;
using JanKIS.API.Models.Subscriptions;

namespace JanKIS.API.Helpers
{
    public static class SubscriptionComparer
    {
        public static bool IsMatch(
            SubscriptionBase a,
            SubscriptionBase b)
        {
            if (a.Username != b.Username)
                return false;
            if (a.Type != b.Type)
                return false;
            switch (a.Type)
            {
                case SubscriptionObjectType.Patient:
                    return ComparePatientSubscriptions((PatientSubscription) a, (PatientSubscription) b);
                case SubscriptionObjectType.Service:
                    return CompareServiceSubscriptions((ServiceSubscription) a, (ServiceSubscription) b);
                case SubscriptionObjectType.ServiceRequest:
                    return CompareServiceRequestSubscriptions((ServiceRequestSubscription) a, (ServiceRequestSubscription) b);
                case SubscriptionObjectType.Stock:
                    return CompareStockSubscriptions((StockSubscription) a, (StockSubscription) b);
                case SubscriptionObjectType.Resource:
                    return CompareResourceSubscriptions((ResourceSubscription) a, (ResourceSubscription) b);
                case SubscriptionObjectType.Department:
                    return CompareDepartmentSubscriptions((DepartmentSubscription) a, (DepartmentSubscription) b);
                case SubscriptionObjectType.Institution:
                    return CompareInstitutionSubscriptions((InstitutionSubscription) a, (InstitutionSubscription) b);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        private static bool ComparePatientSubscriptions(
            PatientSubscription a,
            PatientSubscription b)
        {
            if (a.PersonId != b.PersonId)
                return false;
            return true;
        }

        private static bool CompareServiceSubscriptions(
            ServiceSubscription a,
            ServiceSubscription b)
        {
            if (a.ServiceId != b.ServiceId)
                return false;
            return true;
        }

        private static bool CompareServiceRequestSubscriptions(
            ServiceRequestSubscription a,
            ServiceRequestSubscription b)
        {
            if (a.RequestId != b.RequestId)
                return false;
            return true;
        }

        private static bool CompareStockSubscriptions(
            StockSubscription a,
            StockSubscription b)
        {
            if (a.StockId != b.StockId)
                return false;
            return true;
        }

        private static bool CompareResourceSubscriptions(
            ResourceSubscription a,
            ResourceSubscription b)
        {
            if (a.ResourceId != b.ResourceId)
                return false;
            return true;
        }

        private static bool CompareDepartmentSubscriptions(
            DepartmentSubscription a,
            DepartmentSubscription b)
        {
            if (a.DepartmentId != b.DepartmentId)
                return false;
            return true;
        }

        private static bool CompareInstitutionSubscriptions(
            InstitutionSubscription a,
            InstitutionSubscription b)
        {
            if (a.InstitutionId != b.InstitutionId)
                return false;
            return true;
        }
    }
}
