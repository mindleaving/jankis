using System;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.DiagnosticTestResults;
using HealthModels.Medication;
using HealthModels.Observations;
using HealthModels.Services;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;
using MongoDB.Driver;
using NUnit.Framework;

namespace JanKIS.Tools
{
    public class PersistedModelChecker : DatabaseAccess
    {
        /// <summary>
        /// Check compatibility of persisted data in database with current data model
        /// </summary>
        [Test]
        public async Task CheckCompatibility()
        {
            var collection = GetCollection<SubscriptionBase>();
            var allItems = await collection.Find(x => true).ToListAsync();
            Console.WriteLine($"Item count: {allItems.Count}");
        }

        [Test]
        public async Task FixModels()
        {
            //var collection = GetCollection<PatientEventNotification>(nameof(NotificationBase));
            //await collection.UpdateManyAsync(x => true, 
            //    Builders<PatientEventNotification>.Update
            //        .Rename(
            //            new StringFieldDefinition<PatientEventNotification>("PersonId"),
            //            "Subscription.PersonId"
            //        )
            //    );

            //var collection = GetCollection<BedOccupancy>();
            //await collection.DeleteManyAsync(new JsonFilterDefinition<BedOccupancy>("{ 'DepartmentId': { $exists: true } }"));

            //var collection = GetCollection<DiagnosticTestResult>();
            //await RenameField(collection, "PatientId", "PersonId");
            //await UnsetField(collection, "AdmissionId");

            var collection = GetCollection<PatientNote>();
            await RenameField(collection, "PatientId", "PersonId");
            await UnsetField(collection, "AdmissionId");
        }

        private async Task UnsetField<T>(
            IMongoCollection<T> collection,
            string fieldName)
        {
            await collection.UpdateManyAsync(
                new JsonFilterDefinition<T>($"{{ '{fieldName}': {{ $exists: true }} }}"),
                Builders<T>.Update.Unset(new StringFieldDefinition<T>(fieldName))
            );
        }

        private async Task RenameField<T>(
            IMongoCollection<T> collection,
            string oldFieldName,
            string newFieldName)
        {
            await collection.UpdateManyAsync(
                new JsonFilterDefinition<T>($"{{ '{oldFieldName}': {{ $exists: true }} }}"),
                Builders<T>.Update.Rename(new StringFieldDefinition<T>(oldFieldName), newFieldName)
            );
        }
    }
}
