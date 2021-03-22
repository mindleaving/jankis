using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    /// <summary>
    /// Examples: Dressings, monitors, drainages, etc.
    /// </summary>
    public class MedicalEquipment : IId
    {
        public string Id { get; }
    }
}