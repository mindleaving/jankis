using System;
using Commons.Physics;
using IcdAnnotation.API.Data;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using NUnit.Framework;

namespace IcdAnnotation.API.Tools
{
    public class UnitValueStorage : DatabaseAccess
    {
        [Test]
        public void StoreUnitValue()
        {
            BsonSerializer.RegisterSerializer(typeof(UnitValue), new UnitValueBsonSerializer());
            var collection = GetCollection<UnitValueTestObject>(nameof(UnitValueTestObject));
            var toBeStored = new UnitValueTestObject
            {
                Start = UnitValue.Parse("5 mmol/L")
            };
            collection.InsertOne(toBeStored);
            var loadedItem = collection.Find(x => x.Id == toBeStored.Id).First();
            Assert.That(loadedItem.Id, Is.EqualTo(toBeStored.Id));
            Assert.That(loadedItem.Start, Is.EqualTo(toBeStored.Start));
            Assert.That(loadedItem.End, Is.EqualTo(toBeStored.End));
        }

        private class UnitValueTestObject
        {
            public string Id { get; set; } = Guid.NewGuid().ToString();
            public UnitValue Start { get; set; }
            public UnitValue End { get; set; }
        }
    }
}
