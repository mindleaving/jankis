using System;
using System.Text.RegularExpressions;
using HealthModels;
using HealthSharingPortal.API.AccessControl;
using JanKIS.API.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using NUnit.Framework;
using AccountFactory = JanKIS.API.AccessManagement.AccountFactory;

namespace JanKIS.Tools
{
    public class DatabaseInitialization
    {
        [Test]
        public void Initialize()
        {
            // ######## EDIT START ############
            const string ServerName = "localhost";
            const string DatabaseName = "JanKIS";

            const string InstitutionId = "Test";
            const string InstitutionName = "Test";

            const string AdminUsername = "admin";
            const string AdminFirstName = "Jan";
            const string AdminLastName = "Scholtyssek";
            var AdminBirthday = new DateTime(1989, 11, 17, 0, 0, 0, DateTimeKind.Utc);
            const Sex AdminSex = Sex.Male;
            var AdminPassword = "abc123";//TemporaryPasswordGenerator.Generate();
            // ######## EDIT END ############

            if (!Regex.IsMatch(InstitutionId, "[a-zA-Z0-9]+"))
                throw new Exception("Institution-ID must only contain letters and number. Spaces are not allowed");
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
            CreateInstitution(database, InstitutionId, InstitutionName);

            CreateSystemRoles(database);

            CreateAdminUser(database, 
                AdminUsername,
                AdminFirstName,
                AdminLastName,
                AdminBirthday,
                AdminSex,
                AdminPassword);
        }

        private static void CreateInstitution(
            IMongoDatabase database,
            string institutionId,
            string institutionName)
        {
            var institutionCollection = database.GetCollection<Institution>(nameof(Institution));
            var institution = new Institution(institutionId, institutionName);
            institutionCollection.InsertOne(institution);
        }

        private void CreateSystemRoles(IMongoDatabase database)
        {
            var rolesCollection = database.GetCollection<Role>(nameof(Role));
            rolesCollection.InsertMany(new []
            {
                SystemRoles.Admin,
                SystemRoles.Patient
            });
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

            var loginCollection = database.GetCollection<Login>(nameof(Login));
            var login = LocalLoginFactory.Create(adminUsername, adminPassword);
            login.IsPasswordChangeRequired = false;

            var accountsCollection = database.GetCollection<Account>(nameof(Account));
            var adminAccount = AccountFactory.CreateEmployeeAccount(adminEmployee.Id);
            adminAccount.Roles.Add(SystemRoles.Admin.Id);
            accountsCollection.InsertOne(adminAccount);
            loginCollection.InsertOne(login);
        }
    }
}
