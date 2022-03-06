using System;
using System.Collections.Generic;
using System.Linq;
using HealthModels.Icd;
using HealthModels.Icd.Annotation;
using MongoDB.Driver;
using NUnit.Framework;

namespace IcdAnnotation.API.Tools
{
    public class DiseaseImporter : DatabaseAccess
    {
        private List<IcdChapter> icdChapters;
        private IMongoCollection<Disease> diseaseCollection;

        [OneTimeSetUp]
        public void LoadIcdChapters()
        {
            var icdFilePath = @"G:\Projects\DoctorsTodo\icd11.csv";
            var icdFileParser = new IcdFileParser(icdFilePath);
            icdChapters = icdFileParser.Parse();
            diseaseCollection = GetCollection<Disease>(nameof(Disease));
        }

        [Test]
        public void ImportIcdChapter()
        {
            var icdChapterCollection = GetCollection<IcdChapter>(nameof(IcdChapter));
            icdChapterCollection.InsertMany(icdChapters);
        }
        
        [Test]
        public void ImportInfectiousDiseases()
        {
            Disease BuilderDiseaseFromIcdCategory(
                IcdCategory icdCategory,
                string parentIcdCode)
            {
                return new InfectiousDisease
                {
                    IcdCode = icdCategory.Code,
                    Name = icdCategory.Name,
                    CategoryIcdCode = parentIcdCode
                };
            }

            StoreSection(icdChapters[0], null, diseaseCollection, BuilderDiseaseFromIcdCategory);
        }
        
        [Test]
        public void ImportDiseases()
        {
            Disease BuilderDiseaseFromIcdCategory(
                IcdCategory icdCategory,
                string parentIcdCode)
            {
                return new Disease
                {
                    IcdCode = icdCategory.Code,
                    Name = icdCategory.Name,
                    CategoryIcdCode = parentIcdCode
                };
            }

            foreach (var icdChapter in icdChapters.Skip(1).Take(22))
            {
                StoreSection(icdChapter, null, diseaseCollection, BuilderDiseaseFromIcdCategory);
            }
        }
        
        private static void StoreSection(
            IIcdEntry entry,
            string parentIcdCode,
            IMongoCollection<Disease> diseaseCollection,
            Func<IcdCategory, string, Disease> builderFunc)
        {
            string icdCode = null;
            if (entry is IcdCategory icdCategory)
            {
                icdCode = icdCategory.Code;
                if (!diseaseCollection.Find(x => x.Id == icdCode).Any())
                {
                    var disease = builderFunc(icdCategory, parentIcdCode);
                    diseaseCollection.InsertOne(disease);
                }
            }
            foreach (var subEntry in entry.SubEntries)
            {
                StoreSection(subEntry, icdCode, diseaseCollection, builderFunc);
            }
        }
    }
}
