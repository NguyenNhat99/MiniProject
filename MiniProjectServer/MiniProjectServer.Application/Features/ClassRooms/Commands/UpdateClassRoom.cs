using AutoMapper;
using MediatR;
using MiniProjectServer.Application.Abstraction;
using MiniProjectServer.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Application.Features.ClassRooms.Commands
{
    public record UpdateClassRoomCommand(int Id,UpdateClassRoomDto model) : IRequest<ClassRoomDto>;
    public class UpdateClassRoom : IRequestHandler<UpdateClassRoomCommand, ClassRoomDto>
    {
        private readonly IMapper _mapper;
        private readonly IClassRoomRepository _repo;

        public UpdateClassRoom(IMapper mapper, IClassRoomRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }
        public async Task<ClassRoomDto> Handle(UpdateClassRoomCommand request, CancellationToken cancellationToken)
        {
            var entity = await _repo.GetByIdAsync(request.Id, cancellationToken) ?? throw new KeyNotFoundException("Class Room không tồn tại");
            _mapper.Map(request.model, entity);
            await _repo.UpdateAsync(entity, cancellationToken);
            return _mapper.Map<ClassRoomDto>(entity);
        }
    }
}
