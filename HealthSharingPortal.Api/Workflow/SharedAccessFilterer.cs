using System;
using System.Collections.Generic;
using System.Linq;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Models.Filters;

namespace HealthSharingPortal.API.Workflow
{
    public class SharedAccessFilterer
    {
        public IEnumerable<ISharedAccess> FilterAccesses(
            IEnumerable<ISharedAccess> accesses,
            SharedAccessFilter filter)
        {
            if (filter == null)
                return accesses;
            var filtered = accesses;
            if(filter.OnlyActive)
            {
                var utcNow = DateTime.UtcNow;
                filtered = filtered.Where(x => (x.AccessEndTimestamp == null || x.AccessEndTimestamp > utcNow) && x.AccessGrantedTimestamp <= utcNow);
            }
            if (filter.StartTime.HasValue)
            {
                filtered = filtered.Where(x => x.AccessEndTimestamp == null || x.AccessEndTimestamp > filter.StartTime.Value);
            }
            if (filter.EndTime.HasValue)
            {
                filtered = filtered.Where(x => x.AccessGrantedTimestamp < filter.EndTime.Value);
            }
            if (!string.IsNullOrWhiteSpace(filter.SearchText))
            {
                var trimmedLowerSearchText = filter.SearchText.Trim().ToLower();
                filtered = filtered.Where(x => x.AccessReceiverAccountId.ToLower().Contains(trimmedLowerSearchText));
            }
            return filtered;
        }
    }
}
