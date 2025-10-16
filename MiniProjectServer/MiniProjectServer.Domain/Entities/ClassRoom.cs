using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Domain.Entities
{
    public class ClassRoom
    {
        public int Id { get; set; }
        public string ClassName{ set; get; } = string.Empty;
        public string FullNameTeacher { set; get; } = string.Empty;
        public int NumberOfStudent { set; get; } = 0;
        public string Description { set; get; } = string.Empty;
        public ICollection<Student> Students { set; get; } = new List<Student>();   
    }
}
