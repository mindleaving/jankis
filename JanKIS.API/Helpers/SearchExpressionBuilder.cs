using System;
using System.Linq;
using System.Linq.Expressions;

namespace JanKIS.API.Helpers
{
    public static class SearchExpressionBuilder
    {
        public static Expression<Func<T, bool>> ContainsAll<T>(
            Expression<Func<T, string>> selector,
            params string[] searchTerms)
        {
            var containsMethod = typeof(string).GetMethod("Contains", new[] {typeof(string)});
            Expression expression = Expression.Call(selector.Body, containsMethod, Expression.Constant(searchTerms[0], typeof(string)));
            foreach (var searchTerm in searchTerms.Skip(1))
            {
                expression = Expression.AndAlso(
                    expression, 
                    Expression.Call(selector.Body, containsMethod, Expression.Constant(searchTerm, typeof(string))));
            }
            var result = Expression.Lambda<Func<T,bool>>(expression, selector.Parameters[0]);
            return result;
        }
    }
}