using HealthModels.Icd;
using HealthModels.Symptoms;
using IcdAnnotation.API.Tools.Extensions;
using MongoDB.Driver;
using NUnit.Framework;
using SharedTools;

namespace IcdAnnotation.API.Tools
{
    public class BodyStructureImporter : DatabaseAccess
    {
        [Test]
        public void ImportBodyStructures()
        {
            const string Version = "11";
            var icdFilePath = @"G:\Projects\DoctorsTodo\icd11.csv";
            var icdFileParser = new IcdFileParser(icdFilePath);
            var icdChapters = icdFileParser.Parse(Version);

            var bodyStructureCollection = GetCollection<BodyStructure>(nameof(BodyStructure));
            var bodyStructureSection = icdChapters.FindSection("Anatomy and topography");
            StoreSection(bodyStructureSection, null, bodyStructureCollection);
        }

        private void StoreSection(
            IIcdEntry entry,
            string parentIcdCode,
            IMongoCollection<BodyStructure> bodyStructureCollection)
        {
            string icdCode = null;
            if (entry is IcdCategory icdCategory)
            {
                icdCode = icdCategory.Code;
                if (!bodyStructureCollection.Find(x => x.Id == icdCode).Any())
                {
                    bodyStructureCollection.InsertOne(new BodyStructure
                    {
                        IcdCode = icdCategory.Code,
                        Name = icdCategory.Name,
                        CategoryIcdCode = parentIcdCode
                    });
                }
            }
            foreach (var subEntry in entry.SubEntries)
            {
                StoreSection(subEntry, icdCode, bodyStructureCollection);
            }
        }
    }
}
