﻿namespace JanKIS.API.Models
{
    public class DocumentDiagnosticTestResult : DiagnosticTestResult
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Quantitative;
        public string DocumentId { get; set; }
    }
}