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
    public record GetAllStudentQuery() : IRequest<List<StudentDto>>;
    public class GetAllStudentHandler : IRequestHandler<GetAllStudentQuery, List<StudentDto>>
    {
        private readonly IMapper _mapper;
        private readonly IStudentRepository _repo;

        public GetAllStudentHandler(IMapper mapper, IStudentRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }
        public async Task<List<StudentDto>> Handle(GetAllStudentQuery request, CancellationToken cancellationToken)
        {
            var classList = await _repo.GetAllAsync(cancellationToken);
            return _mapper.Map<List<StudentDto>>(classList);
        }
    }
  
}
