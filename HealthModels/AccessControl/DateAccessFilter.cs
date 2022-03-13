using System;

namespace HealthModels.AccessControl
{
    public class DateAccessFilter : IAccessFilter
    {
        public AccessFilterType Type => AccessFilterType.Date;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}