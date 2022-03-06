using System;

namespace HealthModels.Icd.Annotation.Epidemiology
{
    [Flags]
    public enum TimeOfYear
    {
        Spring = 1,
        Summer = 2,
        Autumn = 4,
        Winter = 8
    }
}