using AutoMapper;
using MediatR;
using MiniProjectServer.Application.Abstraction;
using MiniProjectServer.Application.DTOs;
using MiniProjectServer.Domain;
using MiniProjectServer.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Application.Features.ClassRooms.Commands
{
    public record CreateClassRoomCommand(CreateClassRoomDto model ) : IRequest<ClassRoomDto>;
    public class CreateClassRoom : IRequestHandler<CreateClassRoomCommand,ClassRoomDto>
    {
        private readonly IMapper _mapper;
        private readonly IClassRoomRepository _repo;

        public CreateClassRoom(IMapper mapper, IClassRoomRepository repo) {
            _mapper = mapper;   
            _repo = repo;
        }
        public async Task<ClassRoomDto> Handle(CreateClassRoomCommand request, CancellationToken cancellationToken)
        {
            var mapperToEntity = _mapper.Map<ClassRoom>(request.model);
            var addedClass = await _repo.AddAsync(mapperToEntity, cancellationToken);
            var dto = _mapper.Map<ClassRoomDto>(addedClass);
            return dto;
        }
    }
}
