using System;
using System.Collections.Generic;

namespace HealthModels
{
    public static class Constants
    {
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