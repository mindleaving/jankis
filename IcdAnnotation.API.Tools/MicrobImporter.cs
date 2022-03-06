using HealthModels.Icd;
using HealthModels.Icd.Annotation.Epidemiology;
using IcdAnnotation.API.Tools.Extensions;
using MongoDB.Driver;
using NUnit.Framework;

namespace IcdAnnotation.API.Tools
{
    public class MicrobImporter : DatabaseAccess
    {
        [Test]
        [TestCase("Bacteria", MicrobType.Bacteria)]
        [TestCase("Virus", MicrobType.Virus)]
        [TestCase("Fungi", MicrobType.Fungi)]
        [TestCase("Helminths", MicrobType.Helminths)]
        [TestCase("Protozoa", MicrobType.Protozoa)]
        [TestCase("Lice & Mites", MicrobType.LiceMites)]
        [TestCase("Other Pathogens", MicrobType.Other)]
        public void ImportMicrobs(string sectionName, MicrobType microbType)
        {
            var icdFilePath = @"G:\Projects\DoctorsTodo\icd11.csv";
            var icdFileParser = new IcdFileParser(icdFilePath);
            var icdChapters = icdFileParser.Parse();

            var microbCollection = GetCollection<Microb>(nameof(Microb));
            var microbSection = icdChapters.FindSection(sectionName);
            StoreSection(microbSection, null, microbType, microbCollection);
        }

        private void StoreSection(
            IIcdEntry entry,
            string parentIcdCode,
            MicrobType microbType,
            IMongoCollection<Microb> microbCollection)
        {
            string icdCode = null;
            if (entry is IcdCategory icdCategory)
            {
                icdCode = icdCategory.Code;
                if (!microbCollection.Find(x => x.Id == icdCode).Any())
                {
                    microbCollection.InsertOne(new Microb
                    {
                        IcdCode = icdCategory.Code,
                        Type = microbType,
                        Name = icdCategory.Name,
                        CategoryIcdCode = parentIcdCode
                    });
                }
            }
            foreach (var subEntry in entry.SubEntries)
            {
                StoreSection(subEntry, icdCode, microbType, microbCollection);
            }
        }
    }
}