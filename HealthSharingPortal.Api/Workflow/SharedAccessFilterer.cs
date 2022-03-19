using System;
using System.Collections.Generic;
using System.Linq;
using HealthModels.AccessControl;

namespace HealthSharingPortal.API.Workflow
{
    public class SharedAccessFilter
    {
        public bool OnlyActive { get; set; }
    }
    public class SharedAccessFilterer
    {
        public IEnumerable<ISharedAccess> FilterAccesses(
            IEnumerable<ISharedAccess> accesses,
            SharedAccessFilter filter)
        {
            var filtered = accesses;
            if(filter.OnlyActive)
            {
                var utcNow = DateTime.UtcNow;
                filtered = filtered.Where(x => (x.AccessEndTimestamp == null || x.AccessEndTimestamp > utcNow) && x.AccessGrantedTimestamp > utcNow);
            }
            return filtered;
        }
    }
}
