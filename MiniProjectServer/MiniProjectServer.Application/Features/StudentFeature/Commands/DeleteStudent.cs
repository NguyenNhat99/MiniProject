using AutoMapper;
using MediatR;
using MiniProjectServer.Application.Abstraction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Application.Features.StudentFeature.Commands
{
    public record DeleteStudentCommand(Guid id) : IRequest<bool>;
    public class DeleteStudent : IRequestHandler<DeleteStudentCommand, bool>
    {
        private readonly IStudentRepository _repo;
        public DeleteStudent(IStudentRepository repo)
        {
            _repo = repo;
        }
        public async Task<bool> Handle(DeleteStudentCommand request, CancellationToken cancellationToken)
        {
            var deleteStudent = await _repo.GetByIdAsync(request.id) ;
            if (deleteStudent == null) throw new KeyNotFoundException("Không tìm thấy học sinh");
            await _repo.DeleteAsync(deleteStudent, cancellationToken);
            return true;
        }
    }
}
