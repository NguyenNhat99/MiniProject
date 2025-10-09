using AutoMapper;
using MediatR;
using MiniProjectServer.Application.Abstraction;
using MiniProjectServer.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Application.Features.ClassRooms.Queries
{
    public record GetAllClassQuery() : IRequest<List<ClassRoomDto>>;
    public class GetAllClassHandler : IRequestHandler<GetAllClassQuery, List<ClassRoomDto>>
    {
        private readonly IMapper _mapper;
        private readonly IClassRoomRepository _repo;

        public GetAllClassHandler(IMapper mapper, IClassRoomRepository repo) { 
            _mapper = mapper;
            _repo = repo;
        }
        public async Task<List<ClassRoomDto>> Handle(GetAllClassQuery request, CancellationToken cancellationToken)
        {
            var classList = await _repo.GetAllAsync(cancellationToken);
            return _mapper.Map<List<ClassRoomDto>>(classList);
        }
    }
}
