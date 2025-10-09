using MiniProjectServer.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Application.Abstraction
{
    public interface IClassRoomRepository
    {
        Task<IEnumerable<ClassRoom?>> GetAllAsync(CancellationToken ct = default);
        Task<ClassRoom?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<ClassRoom> AddAsync(ClassRoom classRoom, CancellationToken ct = default);
        Task DeleteAsync(ClassRoom classRoom, CancellationToken ct = default);
        Task UpdateAsync(ClassRoom classRoom, CancellationToken ct = default);
    }
}
