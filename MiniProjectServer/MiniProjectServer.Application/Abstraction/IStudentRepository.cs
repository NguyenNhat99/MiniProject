using MiniProjectServer.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Application.Abstraction
{
    public interface IStudentRepository
    {
        Task<IEnumerable<Student?>> GetAllAsync(CancellationToken ct = default);
        Task<Student?> GetByIdAsync(Guid id, CancellationToken ct = default);
        Task<Student> AddAsync(Student student, CancellationToken ct = default);
        Task DeleteAsync(Student student, CancellationToken ct = default);
        Task UpdateAsync( Student student, CancellationToken ct = default);
    }
}
