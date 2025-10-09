using MiniProjectServer.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Application.DTOs
{
    public class CreateClassRoomDto
    {
        [Required(ErrorMessage = "Tên lớp là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên lớp không vượt quá 100 ký tự")]
        public string ClassName { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "Tên giáo viên không vượt quá 100 ký tự")]
        public string FullNameTeacher { get; set; } = string.Empty;
        [StringLength(500, ErrorMessage = "Mô tả không vượt quá 500 ký tự")]
        public string Description { get; set; } = string.Empty;
    }
    public class UpdateClassRoomDto
    {
        [Required(ErrorMessage = "Tên lớp là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên lớp không vượt quá 100 ký tự")]
        public string ClassName { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "Tên giáo viên không vượt quá 100 ký tự")]
        public string FullNameTeacher { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Mô tả không vượt quá 500 ký tự")]
        public string Description { get; set; } = string.Empty;
    }
    public class ClassRoomDto
    {
        public int Id { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public string FullNameTeacher { get; set; } = string.Empty;
        public int NumberOfStudent { get; set; }
        public string Description { get; set; } = string.Empty;
        public List<StudentDto> Students { get; set; } = new();
    }
    public class ClassRoomListDto
    {
        public int Id { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public string FullNameTeacher { get; set; } = string.Empty;
        public int NumberOfStudent { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
