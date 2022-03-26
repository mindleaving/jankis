﻿using System.IO;
using System.Linq;
using HealthModels.DiagnosticTestResults;
using HealthModels.Icd.Annotation.Diagnostics;
using MongoDB.Driver;
using NUnit.Framework;
using SharedTools;

namespace IcdAnnotation.API.Tools
{
    public class LoincImporter : DatabaseAccess
    {
        private IMongoCollection<DiagnosticTest> diagnosticTestCollection;

        [OneTimeSetUp]
        public void Setup()
        {
            diagnosticTestCollection = GetCollection<DiagnosticTest>(nameof(DiagnosticTest));
        }

        [Test]
        public void ImportLoincCodes()
        {
            var filePath = @"G:\Projects\DoctorsTodo\Loinc.csv";
            foreach (var line in File.ReadLines(filePath).Skip(1))
            {
                var splittedLine = ParserHelpers.QuoteAwareSplit(line, ',');

                var loincNumber = splittedLine[0];
                var name = splittedLine[1];
                var measuredProperty = splittedLine[2];
                var timeAspect = splittedLine[3];
                var system = splittedLine[4];
                if(!TryParseScaleType(splittedLine[5], out var scaleType))
                    continue;
                var methodType = splittedLine[6];
                var category = splittedLine[7];
                var description = splittedLine[10];
                var status = splittedLine[11];
                if(status != "ACTIVE")
                    continue;

                var formula = splittedLine[14];
                var unitRequired = splittedLine[18];
                var shortName = splittedLine[21];
                var externalCopyright = splittedLine[25];
                if(!string.IsNullOrWhiteSpace(externalCopyright))
                    continue;
                var longName = splittedLine[27];
                var displayName = splittedLine[44];

                var diagnosticTest = new DiagnosticTest
                {
                    LoincCode = loincNumber,
                    Name = longName,
                    Description = description,
                    ScaleType = scaleType,
                    BodyStructure = system,
                    MethodType = methodType,
                    Category = category,
                    TimeAspect = timeAspect,
                    MeasuredProperty = measuredProperty,
                    Formula = formula
                };
                diagnosticTestCollection.InsertOne(diagnosticTest);
            }
        }

        private bool TryParseScaleType(
            string str,
            out DiagnosticTestScaleType scaleType)
        {
            switch (str)
            {
                case "Qn":
                    scaleType = DiagnosticTestScaleType.Quantitative;
                    return true;
                case "Ord":
                    scaleType = DiagnosticTestScaleType.Ordinal;
                    return true;
                case "OrdQn":
                    scaleType = DiagnosticTestScaleType.OrdinalOrQuantitative;
                    return true;
                case "Nom":
                    scaleType = DiagnosticTestScaleType.Nominal;
                    return true;
                case "Nar":
                    scaleType = DiagnosticTestScaleType.Freetext;
                    return true;
                case "Doc":
                    scaleType = DiagnosticTestScaleType.Document;
                    return true;
                case "Set":
                    scaleType = DiagnosticTestScaleType.Set;
                    return true;
            }

            scaleType = DiagnosticTestScaleType.Undefined;
            return false;
        }
    }
}
