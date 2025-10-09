using Microsoft.EntityFrameworkCore;
using MiniProjectServer.Application.Abstraction;
using MiniProjectServer.Domain.Entities;
using MiniProjectServer.Infrastructure.Persisstants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Infrastructure.Repository
{
    public class ClassRoomRepository : IClassRoomRepository
    {
        private readonly MiniProjectDbContext _context;

        public ClassRoomRepository(MiniProjectDbContext context) {
            _context = context;
        }

        public async Task<ClassRoom> AddAsync(ClassRoom classRoom, CancellationToken ct = default)
        {
            _context.ClassRooms.Add(classRoom);
            await _context.SaveChangesAsync();
            return classRoom;
        }

        public async Task DeleteAsync(ClassRoom classRoom, CancellationToken ct = default)
        {
            var students = await _context.Students.Where(s => s.ClassRoomId == classRoom.Id).ToListAsync();
            if(students.Count > 0)
            {
                foreach (var student in students)
                {
                    student.ClassRoomId = null;
                }
            }
            _context.ClassRooms.Remove(classRoom);  
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<ClassRoom?>> GetAllAsync(CancellationToken ct = default)
        {
            var classList = await _context.ClassRooms.Include(c => c.Students).ToListAsync();
            return classList;
        }

        public async Task<ClassRoom?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var classRoom = await _context.ClassRooms.FindAsync(id);
            return classRoom;   
        }

        public async Task UpdateAsync(ClassRoom classRoom, CancellationToken ct = default)
        {
            _context.ClassRooms.Update(classRoom);
            await _context.SaveChangesAsync();
        }
    }
}
