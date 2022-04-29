using System;
using System.Collections.Generic;

namespace HealthModels
{
    public static class Constants
    {
        public static readonly TimeSpan MorningTime = TimeSpan.FromHours(7);
        public static readonly TimeSpan NoonTime = TimeSpan.FromHours(12);
        public static readonly TimeSpan EveningTime = TimeSpan.FromHours(18);
        public static readonly TimeSpan NightTime = TimeSpan.FromHours(22);

        public static readonly Dictionary<string, string> RepositoryPaths = new()
        {
            {"stationary-win8", @"F:\Projects\JanKIS"},
            {"ubuntu-stationary", @"/mnt/data/Projects/JanKIS"},
        };
        public static string GetRepositoryPath()
        {
            return RepositoryPaths[Environment.MachineName.ToLowerInvariant()];
        }
    }
}