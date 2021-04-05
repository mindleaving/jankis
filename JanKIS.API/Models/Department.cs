﻿using JanKIS.API.Storage;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.Models
{
    public class Department : IId
    {
        public string Id { get; }
        public string Name { get; set; }
        [TypescriptIsOptional]
        public string ParentDepartment { get; set; }
    }
}
