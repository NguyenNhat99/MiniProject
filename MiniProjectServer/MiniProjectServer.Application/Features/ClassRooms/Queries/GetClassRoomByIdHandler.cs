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
    public record GetClassById(int Id) : IRequest<ClassRoomDto>;
    public class GetClassRoomByIdHandler : IRequestHandler<GetClassById, ClassRoomDto>
    {
        private readonly IMapper _mapper;
        private readonly IClassRoomRepository _repo;

        public GetClassRoomByIdHandler(IMapper mapper, IClassRoomRepository repo) { 
            _mapper = mapper;
            _repo = repo;
        }    
        public async Task<ClassRoomDto> Handle(GetClassById request, CancellationToken cancellationToken)
        {
            var classRoom = await _repo.GetByIdAsync(request.Id, cancellationToken) ?? throw new KeyNotFoundException("Không tìm thấy lớp");
            return _mapper.Map<ClassRoomDto>(classRoom);
        }
    }
}
