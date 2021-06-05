using System;
using System.Linq.Expressions;

namespace JanKIS.API.AccessManagement
{
    public class PermissionFilter<T>
    {
        private PermissionFilter(
            DataAccessType accessType,
            AuthorizationLevel authorizationLevel,
            Expression<Func<T, bool>> filter,
            Expression<Func<T, T>> transform)
        {
            AuthorizationLevel = authorizationLevel;
            Filter = filter;
            Transform = transform;
            AccessType = accessType;
        }

        public static PermissionFilter<T> FullyAuthorized(DataAccessType accessType)
        {
            return new(accessType, AuthorizationLevel.FullyAuthorized, null, null);
        }

        public static PermissionFilter<T> Unauthorized(DataAccessType accessType)
        {
            return new(accessType, AuthorizationLevel.Unauthorized, null, null);
        }

        public static PermissionFilter<T> PartialAuthorization(
            DataAccessType accessType,
            Expression<Func<T, bool>> filter,
            Expression<Func<T, T>> transform)
        {
            return new(accessType, AuthorizationLevel.FilteredAuthorization, filter, transform);
        }

        public DataAccessType AccessType { get; }
        public AuthorizationLevel AuthorizationLevel { get; }
        public Expression<Func<T, bool>> Filter { get; }
        public Expression<Func<T,T>> Transform { get; }

        public bool IsAuthorizedTo(
            DataAccessType accessType,
            T item)
        {
            if(accessType != AccessType)
            {
                throw new InvalidOperationException(
                    $"This permission filter is for access of type '{AccessType}', " 
                    + $"but authorization for '{accessType}' was requested");
            }

            switch (AuthorizationLevel)
            {
                case AuthorizationLevel.Unauthorized:
                    return false;
                case AuthorizationLevel.FilteredAuthorization:
                    return Filter.Compile().Invoke(item);
                case AuthorizationLevel.FullyAuthorized:
                    return true;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }

    public enum DataAccessType
    {
        Read,
        Store,
        Delete
    }
}