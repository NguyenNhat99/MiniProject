using Microsoft.EntityFrameworkCore;
using MiniProjectServer.Domain.Entities;

namespace MiniProjectServer.Infrastructure.Persisstants // (nếu được nên đổi thành .Persistence)
{
    public class MiniProjectDbContext : DbContext
    {
        public MiniProjectDbContext(DbContextOptions<MiniProjectDbContext> opt) : base(opt) { }

        public DbSet<ClassRoom> ClassRooms { get; set; }
        public DbSet<Student> Students { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ===== ClassRoom =====
            modelBuilder.Entity<ClassRoom>(b =>
            {
                b.ToTable("ClassRoom");

                // PK
                b.HasKey(x => x.Id);

                // Columns
                b.Property(x => x.ClassName)
                    .IsRequired()
                    .HasMaxLength(100);

                b.Property(x => x.FullNameTeacher)
                    .HasMaxLength(150);

                b.Property(x => x.Description)
                    .HasMaxLength(500);

                // Index (không bắt buộc unique; nếu muốn duy nhất thì thêm .IsUnique())
                b.HasIndex(x => x.ClassName);

                // 1 ClassRoom - n Students (FK: Student.ClassRoomId)
                // Vì ClassRoomId là nullable (int?), quan hệ là OPTIONAL.
                // Khi xoá ClassRoom, FK sẽ về NULL thay vì xoá Student.
                b.HasMany(x => x.Students)
                 .WithOne(s => s.ClassRoom)
                 .HasForeignKey(s => s.ClassRoomId)
                 .OnDelete(DeleteBehavior.SetNull);
            });

            // ===== Student =====
            modelBuilder.Entity<Student>(b =>
            {
                b.ToTable("Student");

                // PK (Guid được khởi tạo ở entity; EF sẽ dùng giá trị đó)
                b.HasKey(x => x.Id);

                // Columns
                b.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(200);

                b.Property(x => x.StudentCode)
                    .HasMaxLength(50);

                // Thường mã SV là duy nhất — nếu không cần, hãy bỏ dòng này
                b.HasIndex(x => x.StudentCode).IsUnique();

                // Lưu ngày sinh ở kiểu 'date' (không có time)
                b.Property(x => x.BirthDay)
                    .IsRequired()
                    .HasColumnType("date");

                // Thời điểm tạo: dùng mặc định từ SQL Server cho nhất quán
                b.Property(x => x.CreateAt)
                    .HasPrecision(0)
                    .HasDefaultValueSql("GETUTCDATE()");

                b.Property(x => x.Description)
                    .HasMaxLength(500);
            });
        }
    }
}
