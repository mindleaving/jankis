namespace JanKIS.API.Models
{
    public class DiagnosticTestDefinition : ServiceDefinition
    {
        public string TestCodeLoinc { get; set; }
        public string TestCodeLocal { get; set; }
        public DiagnosticTestScaleType ScaleType { get; set; }
    }
}