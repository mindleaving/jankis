using JanKIS.API.Models;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.ViewModels
{
    public class MaterialViewModel
    {
        public MaterialViewModel(Consumable consumable)
        {
            Type = MaterialType.Consumable;
            Consumable = consumable;
        }
        public MaterialViewModel(Resource resource)
        {
            Type = MaterialType.Resource;
            Resource = resource;
        }

        public MaterialType Type { get; set; }
        [TypescriptIsOptional]
        public Consumable Consumable { get; set; }
        [TypescriptIsOptional]
        public Resource Resource { get; set; }
    }
}