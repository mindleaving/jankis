using System;
using System.Linq.Expressions;

namespace JanKIS.API.AccessManagement
{
    public class PermissionFilter<T>
    {
        private PermissionFilter(
            AuthorizationLevel authorizationLevel,
            Expression<Func<T, bool>> filter,
            Expression<Func<T, T>> transform)
        {
            AuthorizationLevel = authorizationLevel;
            Filter = filter;
            Transform = transform;
        }

        public static PermissionFilter<T> FullyAuthorized()
        {
            return new(AuthorizationLevel.FullyAuthorized, null, null);
        }

        public static PermissionFilter<T> Unauthorized()
        {
            return new(AuthorizationLevel.Unauthorized, null, null);
        }

        public static PermissionFilter<T> PartialAuthorization(
            Expression<Func<T, bool>> filter,
            Expression<Func<T, T>> transform)
        {
            return new PermissionFilter<T>(AuthorizationLevel.FilteredAuthorization, filter, transform);
        }

        public AuthorizationLevel AuthorizationLevel { get; }
        public Expression<Func<T, bool>> Filter { get; }
        public Expression<Func<T,T>> Transform { get; }
    }
}