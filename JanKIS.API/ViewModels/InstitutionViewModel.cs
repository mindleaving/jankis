using System.Collections.Generic;
using JanKIS.API.Models;

namespace JanKIS.API.ViewModels
{
    public class InstitutionViewModel
    {
        public InstitutionViewModel(string id,
            string name,
            List<Room> rooms,
            List<Department> departments)
        {
            Id = id;
            Name = name;
            Rooms = rooms;
            Departments = departments;
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public List<Room> Rooms { get; set; }
        public List<Department> Departments { get; set; }
    }
}
