using AutoMapper;
using MediatR;
using MiniProjectServer.Application.Abstraction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Application.Features.ClassRooms.Commands
{
    public record DeleteClassRoomCommand(int Id) : IRequest<bool>;
    public class DeleteClassRoom : IRequestHandler<DeleteClassRoomCommand, bool>
    {
        private readonly IClassRoomRepository _repo;
        public DeleteClassRoom(IClassRoomRepository repo) { 
            _repo = repo;
        }
        public async Task<bool> Handle(DeleteClassRoomCommand request, CancellationToken cancellationToken)
        {
            var classRoom = await _repo.GetByIdAsync(request.Id, cancellationToken);
            if (classRoom == null) throw new KeyNotFoundException("Không có lớp này");
            await _repo.DeleteAsync(classRoom);
            return true;
        }
    }
}
