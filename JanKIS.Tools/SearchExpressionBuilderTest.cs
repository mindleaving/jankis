using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using JanKIS.API.Helpers;
using MongoDB.Driver;
using NUnit.Framework;

namespace JanKIS.Tools
{
    public class SearchExpressionBuilderTest
    {
        private IMongoDatabase database;

        [SetUp]
        public void ConnectToDatabase()
        {
            var mongoClient = new MongoClient("mongodb://localhost");
            database = mongoClient.GetDatabase("JanKIS");
        }

        [Test]
        public async Task EmptyListReturnsEmptyResult()
        {
            var collection = database.GetCollection<Admission>(nameof(Admission));
            var personIds = new List<string>();
            Expression<Func<Admission, bool>> filter = x => personIds.Contains(x.PersonId);
            var admissions = await collection.Find(filter).ToListAsync();
            Assert.That(admissions.Count, Is.EqualTo(0));
        }

        [Test]
        public async Task CanPerformSearch()
        {
            var employeeCollection = database.GetCollection<Person>(nameof(Person));
            var searchTerms = new[] {"jan", "sch"};
            var constructedSearchExpression = SearchExpressionBuilder.Or(
                SearchExpressionBuilder.ContainsAny<Person>(x => x.Id.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Person>(x => x.LastName.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Person>(x => x.FirstName.ToLower(), searchTerms));
            Expression<Func<Person, bool>> manualSearchExpression = x
                => (x.Id.ToLower().Contains(searchTerms[0]) || x.Id.ToLower().Contains(searchTerms[1]))
                   || (x.LastName.ToLower().Contains(searchTerms[0]) || x.LastName.ToLower().Contains(searchTerms[1]))
                   || (x.FirstName.ToLower().Contains(searchTerms[0]) || x.FirstName.ToLower().Contains(searchTerms[1]));
            var items = await employeeCollection.Find(constructedSearchExpression).ToListAsync();
            Assert.That(items.Count, Is.GreaterThan(0));
        }
    }
}
