using System;
using System.Xml;

namespace HealthSharingPortal.API.Workflow
{
    public static class DateTimeHelpers
    {
        public static bool TryParseTimespan(
            string str,
            out TimeSpan timeSpan)
        {
            if (string.IsNullOrWhiteSpace(str))
            {
                timeSpan = TimeSpan.Zero;
                return false;
            }
            try
            {
                timeSpan = XmlConvert.ToTimeSpan(str);
                return true;
            }
            catch
            {
                timeSpan = TimeSpan.Zero;
                return false;
            }
        }
    }
}
