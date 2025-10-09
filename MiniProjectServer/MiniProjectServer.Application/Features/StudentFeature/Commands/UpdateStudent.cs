using AutoMapper;
using MediatR;
using MiniProjectServer.Application.Abstraction;
using MiniProjectServer.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Application.Features.StudentFeature.Commands
{
    public record UpdateStudentCommand(Guid Id, UpdateStudentDto model) : IRequest<StudentDto>;
    public class UpdateStudent : IRequestHandler<UpdateStudentCommand, StudentDto>
    {
        private readonly IMapper _mapper;
        private readonly IStudentRepository _repo;
         public UpdateStudent(IMapper mapper, IStudentRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }
        public async Task<StudentDto> Handle(UpdateStudentCommand request, CancellationToken cancellationToken)
        {
            var entity = await _repo.GetByIdAsync(request.Id, cancellationToken) ?? throw new KeyNotFoundException("Class Room không tồn tại");
            _mapper.Map(request.model, entity);
            await _repo.UpdateAsync(entity, cancellationToken);
            return _mapper.Map<StudentDto>(entity);
        }
    }
}
