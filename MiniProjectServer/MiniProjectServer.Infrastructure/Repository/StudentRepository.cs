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
    public class StudentRepository : IStudentRepository
    {
        private readonly MiniProjectDbContext _context;

        public StudentRepository(MiniProjectDbContext context) {
            _context = context;
        }
        public async Task<Student> AddAsync(Student student, CancellationToken ct = default)
        {
            _context.Students.Add(student);
            var getClass = _context.ClassRooms.FirstOrDefault(c => c.Id == student.ClassRoomId);
            if (getClass != null)
            {
                getClass.NumberOfStudent += 1;
            }
            await _context.SaveChangesAsync();
            return student;
        }

        public async Task DeleteAsync(Student student, CancellationToken ct = default)
        {
            _context.Students.Remove(student);
            var getClass = _context.ClassRooms.FirstOrDefault(c => c.Id == student.ClassRoomId);
            if (getClass != null && getClass.NumberOfStudent > 0)
            {
                getClass.NumberOfStudent -= 1;
            }
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Student?>> GetAllAsync(CancellationToken ct = default)
        {
            var students = await _context.Students.Include(s => s.ClassRoom).ToListAsync();
            return students;
        }

        public async Task<Student?> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            var student = await _context.Students.Include(s => s.ClassRoom).FirstOrDefaultAsync(s => s.Id == id);
            return student;
        }

        public async Task UpdateAsync(Student student, CancellationToken ct = default)
        {
            var studentCurrent = await _context.Students.AsNoTracking().FirstOrDefaultAsync(s => s.Id == student.Id);
            if (studentCurrent.ClassRoomId != student.ClassRoomId)
            {
                var classCurrent = await _context.ClassRooms.FirstOrDefaultAsync(c => c.Id == studentCurrent.ClassRoomId);
                if(classCurrent != null && classCurrent.NumberOfStudent > 0)
                    classCurrent.NumberOfStudent -= 1;

                var newClass = await _context.ClassRooms.FirstOrDefaultAsync(c => c.Id == student.ClassRoomId);
                if(newClass != null)
                    newClass.NumberOfStudent += 1;
                await _context.SaveChangesAsync();
            }
          
            _context.Students.Update(student);
            await _context.SaveChangesAsync();
        }
    }
}
