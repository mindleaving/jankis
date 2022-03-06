using IcdAnnotation.API.Workflow;
using NUnit.Framework;

namespace IcdAnnotation.API.Tools
{
    public class TypescriptGeneration
    {
        [Test]
        public void GenerateTypescript()
        {
            TypescriptGeneratorRunner.Generate();
        }
    }
}
