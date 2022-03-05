using Commons.Physics;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;

namespace HealthSharingPortal.Api.Storage
{
    public class UnitValueBsonSerializer : SerializerBase<UnitValue>
    {
        public override UnitValue Deserialize(
            BsonDeserializationContext context,
            BsonDeserializationArgs args)
        {
            if (context.Reader.CurrentBsonType == BsonType.Null)
            {
                context.Reader.ReadNull();
                return null;
            }
            if(context.Reader.CurrentBsonType == BsonType.String)
                return UnitValue.Parse(context.Reader.ReadString());
            return base.Deserialize(context, args);
        }

        public override void Serialize(
            BsonSerializationContext context,
            BsonSerializationArgs args,
            UnitValue value)
        {
            if(value == null)
                context.Writer.WriteNull();
            else 
                context.Writer.WriteString(value.ToString());
        }
    }
}
