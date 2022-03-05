using System;

namespace HealthSharingPortal.Api.Helpers
{
    public static class SearchTermSplitter
    {
        public static string[] SplitAndToLower(string searchText)
        {
            return searchText.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        }
    }
}
