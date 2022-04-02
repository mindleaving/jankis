using System;
using HealthSharingPortal.API.Models.Subscriptions;

namespace HealthSharingPortal.API.Helpers
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
                case nameof(SubscriptionObjectType.Patient):
                    return ComparePatientSubscriptions((PatientSubscription) a, (PatientSubscription) b);
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
    }
}
