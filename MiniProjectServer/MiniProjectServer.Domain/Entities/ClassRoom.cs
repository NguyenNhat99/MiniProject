using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Domain.Entities
{
    [Table("ClassRoom")]
    public class ClassRoom
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required(ErrorMessage = "Không được bỏ trống tên lớp")]
        public string ClassName{ set; get; } = string.Empty;
        public string FullNameTeacher { set; get; } = string.Empty;
        public int NumberOfStudent { set; get; } = 0;
        public string Description { set; get; } = string.Empty;
        public ICollection<Student> Students { set; get; } = new List<Student>();   
    }
}
