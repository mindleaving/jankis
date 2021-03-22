using JanKIS.API.Workflow;
using NUnit.Framework;

namespace JanKIS.Tools
{
    public class TypescriptGeneration
    {
        [Test]
        public void GenerateTypescript()
        {
            TypescriptGeneratorRunner.Run();
        }
    }
}