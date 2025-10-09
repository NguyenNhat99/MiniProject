using AutoMapper;
using MiniProjectServer.Application.DTOs;
using MiniProjectServer.Domain.Entities;

namespace MiniProjectServer.Application.Mapping
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper() {
            //classroom
            CreateMap<ClassRoom, ClassRoomDto>()
                .ForMember(dest => dest.Students,
                          opt => opt.MapFrom(src => src.Students));
            CreateMap<ClassRoom, ClassRoomListDto>();
            CreateMap<CreateClassRoomDto, ClassRoom>();
            CreateMap<UpdateClassRoomDto, ClassRoom>();


            //student
            CreateMap<Student, StudentDto>()
                .ForMember(dest => dest.ClassRoomName,
                          opt => opt.MapFrom(src => src.ClassRoom != null ? src.ClassRoom.ClassName : null));

            CreateMap<Student, StudentDetailDto>();
            CreateMap<CreateStudentDto, Student>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreateAt, opt => opt.MapFrom(_ => DateTime.UtcNow));

            CreateMap<UpdateStudentDto, Student>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreateAt, opt => opt.Ignore()); 

        }
    }
}
