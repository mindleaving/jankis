using System;

namespace JanKIS.API.Models
{
    public class PersonReference : IEquatable<PersonReference>
    {
        public PersonReference(PersonType type,
            string id)
        {
            Type = type;
            Id = id;
        }

        public PersonType Type { get; set; }
        public string Id { get; set; }

        public bool Equals(PersonReference other)
        {
            if (ReferenceEquals(null, other)) return false;
            if (ReferenceEquals(this, other)) return true;
            return Type == other.Type && Id == other.Id;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((PersonReference) obj);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine((int) Type, Id);
        }

        public static bool operator ==(
            PersonReference left,
            PersonReference right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(
            PersonReference left,
            PersonReference right)
        {
            return !Equals(left, right);
        }
    }
}