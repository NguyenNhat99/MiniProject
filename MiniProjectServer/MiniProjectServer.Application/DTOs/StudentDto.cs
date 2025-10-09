using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Application.DTOs
{
    public class CreateStudentDto
    {
        [Required(ErrorMessage = "Tên sinh viên là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên sinh viên không vượt quá 100 ký tự")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mã sinh viên là bắt buộc")]
        [StringLength(20, ErrorMessage = "Mã sinh viên không vượt quá 20 ký tự")]
        public string StudentCode { get; set; } = string.Empty;

        [Required(ErrorMessage = "Ngày sinh là bắt buộc")]
        [DataType(DataType.Date)]
        public DateTime BirthDay { get; set; }

        [StringLength(500, ErrorMessage = "Mô tả không vượt quá 500 ký tự")]
        public string Description { get; set; } = string.Empty;

        public int? ClassRoomId { get; set; }
    }
    public class UpdateStudentDto
    {
        [Required(ErrorMessage = "Tên sinh viên là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên sinh viên không vượt quá 100 ký tự")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mã sinh viên là bắt buộc")]
        [StringLength(20, ErrorMessage = "Mã sinh viên không vượt quá 20 ký tự")]
        public string StudentCode { get; set; } = string.Empty;

        [Required(ErrorMessage = "Ngày sinh là bắt buộc")]
        [DataType(DataType.Date)]
        public DateTime BirthDay { get; set; }

        [StringLength(500, ErrorMessage = "Mô tả không vượt quá 500 ký tự")]
        public string Description { get; set; } = string.Empty;

        public int? ClassRoomId { get; set; }
    }
    public class StudentDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string StudentCode { get; set; } = string.Empty;
        public DateTime BirthDay { get; set; }
        public DateTime CreateAt { get; set; }
        public string Description { get; set; } = string.Empty;
        public int? ClassRoomId { get; set; }
        public string? ClassRoomName { get; set; }
    }
    public class StudentDetailDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string StudentCode { get; set; } = string.Empty;
        public DateTime BirthDay { get; set; }
        public DateTime CreateAt { get; set; }
        public string Description { get; set; } = string.Empty;
        public int? ClassRoomId { get; set; }
        public ClassRoomListDto? ClassRoom { get; set; }
    }
}
