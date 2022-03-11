using System;
using HealthModels;
using HealthSharingPortal.Api.AccessControl;
using HealthSharingPortal.Api.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using NUnit.Framework;

namespace HealthSharingPortal.Tools
{
    public class DatabaseInitialization
    {
        [Test]
        public void Initialize()
        {
            // ######## EDIT START ############
            const string ServerName = "localhost";
            const string DatabaseName = "HealthSharingPortal";

            const string AdminUsername = "admin";
            const string AdminFirstName = "Jan";
            const string AdminLastName = "Scholtyssek";
            var AdminBirthday = new DateTime(1989, 11, 17, 0, 0, 0, DateTimeKind.Utc);
            const Sex AdminSex = Sex.Male;
            var AdminPassword = "abc123";//TemporaryPasswordGenerator.Generate();
            // ######## EDIT END ############

            Console.WriteLine($"Admin-username is: {AdminUsername}");
            Console.WriteLine($"Admin-password is: {AdminPassword}");

            var settings = new MongoClientSettings
            {
                Server = new MongoServerAddress(ServerName)
            };
            var mongoClient = new MongoClient(settings);
            ConventionRegistry.Register("EnumStringConvetion", new ConventionPack
            {
                new EnumRepresentationConvention(BsonType.String)
            }, type => true);
            var database = mongoClient.GetDatabase(DatabaseName);

            CreateAdminUser(database, 
                AdminUsername,
                AdminFirstName,
                AdminLastName,
                AdminBirthday,
                AdminSex,
                AdminPassword);
        }

        private static void CreateAdminUser(
            IMongoDatabase database,
            string adminUsername,
            string adminFirstName,
            string adminLastName,
            DateTime adminBirthday,
            Sex adminSex,
            string adminPassword)
        {
            var personsCollection = database.GetCollection<Person>(nameof(Person));
            var adminEmployee = new Person(Guid.NewGuid().ToString(), adminFirstName, adminLastName, adminBirthday, adminSex);
            personsCollection.InsertOne(adminEmployee);

            var accountsCollection = database.GetCollection<Account>(nameof(Account));
            var adminAccount = AccountFactory.Create(adminEmployee.Id, adminUsername, AccountType.Admin, adminPassword);
            adminAccount.IsPasswordChangeRequired = false;
            accountsCollection.InsertOne(adminAccount);
        }
    }
}
