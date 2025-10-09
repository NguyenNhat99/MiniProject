using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Domain.Entities
{
    [Table("Student")]
    public class Student
    {
        [Key]
        public Guid Id { set; get; } = Guid.NewGuid();
        [Required(ErrorMessage = "Không được bỏ trống tên sinh viên")]
        public string Name { set; get; } = string.Empty;
        public string StudentCode { set; get; } = string.Empty;
        [Required]
        public DateTime BirthDay { set; get; }
        public DateTime CreateAt { set; get; } = DateTime.UtcNow;
        public string Description { set; get; } = string.Empty ;
        public int? ClassRoomId { set; get; }
        public ClassRoom? ClassRoom { set; get; } 

    }
}
