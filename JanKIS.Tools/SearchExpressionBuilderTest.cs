using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using MongoDB.Driver;
using NUnit.Framework;

namespace JanKIS.Tools
{
    public class SearchExpressionBuilderTest
    {
        [Test]
        public async Task CanPerformSearch()
        {
            var mongoClient = new MongoClient("mongodb://localhost");
            var database = mongoClient.GetDatabase("JanKIS");
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
