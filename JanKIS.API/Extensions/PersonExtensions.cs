using JanKIS.API.Models;

namespace JanKIS.API.Extensions
{
    public static class PersonExtensions
    {
        public static PersonReference ToPersonReference(this PersonWithLogin person)
        {
            return new (person.Type, person.Id);
        }
    }
}
