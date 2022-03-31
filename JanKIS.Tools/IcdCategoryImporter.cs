using System.Collections.Generic;
using System.Linq;
using HealthModels.Icd;
using MongoDB.Driver;
using NUnit.Framework;
using SharedTools;

namespace JanKIS.Tools
{
    public class IcdCategoryImporter : DatabaseAccess
    {
        private IMongoCollection<IcdCategory> icdCategoryCollection;

        [OneTimeSetUp]
        public void Setup()
        {
            icdCategoryCollection = GetCollection<IcdCategory>(nameof(IcdCategory));
        }

        [Test]
        public void LoadIcdCategories()
        {
            var filePath = @"F:\Projects\DoctorsTodo\icd11.csv";
            var icdCsvFileParser = new IcdFileParser(filePath);
            var icdChapters = icdCsvFileParser.Parse("11");
            var icdCategories = ExtractCategories(icdChapters.Take(23));
            foreach (var icdCategory in icdCategories)
            {
                icdCategoryCollection.InsertOne(icdCategory);
            }
        }

        private IEnumerable<IcdCategory> ExtractCategories(IEnumerable<IIcdEntry> icdEntries)
        {
            foreach (var icdEntry in icdEntries)
            {
                if (icdEntry is IcdCategory icdCategory)
                    yield return icdCategory;
                foreach (var subEntry in ExtractCategories(icdEntry.SubEntries))
                {
                    yield return subEntry;
                }
            }
        }
    }
}
