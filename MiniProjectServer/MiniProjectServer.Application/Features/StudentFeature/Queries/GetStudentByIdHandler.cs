using AutoMapper;
using MediatR;
using MiniProjectServer.Application.Abstraction;
using MiniProjectServer.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Application.Features.StudentFeature.Queries
{
    public record GetStudentById(Guid Id) : IRequest<StudentDto>;
    public class GetStudentByIdHandler : IRequestHandler<GetStudentById, StudentDto>
    {
        private readonly IMapper _mapper;
        private readonly IStudentRepository _repo;

        public GetStudentByIdHandler(IMapper mapper, IStudentRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }
        public async Task<StudentDto> Handle(GetStudentById request, CancellationToken cancellationToken)
        {
            var classRoom = await _repo.GetByIdAsync(request.Id, cancellationToken) ?? throw new KeyNotFoundException("Không tìm thấy hoc sinh");
            return _mapper.Map<StudentDto>(classRoom);
        }
    }
   
}
