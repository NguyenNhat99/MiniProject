using AutoMapper;
using MediatR;
using MiniProjectServer.Application.Abstraction;
using MiniProjectServer.Application.DTOs;
using MiniProjectServer.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Application.Features.StudentFeature.Commands
{
    public record CreateStudentCommand(CreateStudentDto model) : IRequest<StudentDto>;
    public class CreateStudent : IRequestHandler<CreateStudentCommand, StudentDto>
    {
        private readonly IMapper _mapper;
        private readonly IStudentRepository _repo;
        public CreateStudent(IMapper mapper, IStudentRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }
        public async Task<StudentDto> Handle(CreateStudentCommand request, CancellationToken cancellationToken)
        {
            var mapperToEntity = _mapper.Map<Student>(request.model);
            var addStudent = await _repo.AddAsync(mapperToEntity,cancellationToken);
            var dto = _mapper.Map<StudentDto>(addStudent);
            return dto;
        }
    }
}
