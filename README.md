# Mini Project Quản Lý Sinh Viên & Lớp Học

Dự án quản lý sinh viên và lớp học được xây dựng bằng **ASP.NET Core Web API** áp dụng **Clean Architecture** và **CQRS Pattern**. Hệ thống cung cấp các API để quản lý thông tin lớp học, sinh viên và mối quan hệ giữa chúng.

## Kiến trúc hệ thống

## Công nghệ sử dụng

- **Backend**: ASP.NET Core 8, Web API
- **Frontend**: Next.Js
- **Architecture**: Clean Architecture, CQRS Pattern
- **Data Access**: Entity Framework Core, Repository Pattern
- **Mediator**: MediatR for Command/Query separation
- **Object Mapping**: AutoMapper
- **Database**: SQL Server
- **Validation**: Data Annotations

## Tính năng chính

### Quản lý Lớp học
- Tạo, cập nhật, xóa, xem danh sách lớp học, tìm kiếm
- Tự động cập nhật số lượng sinh viên khi thêm/sửa/xóa
- Validate dữ liệu đầu vào

### Quản lý Sinh viên  
- Tạo, cập nhật, xóa, xem danh sách sinh viên, tìm kiếm
- Phân công sinh viên vào lớp học
- Tự động cập nhật thông tin lớp khi thay đổi

## Cơ sở dữ liệu
<img width="678" height="319" alt="image" src="https://github.com/user-attachments/assets/3731e5f4-dfaa-43a4-8387-260a4bc433c5" />

## Giao diện
<img width="1881" height="953" alt="image" src="https://github.com/user-attachments/assets/4b01cc9b-3521-45fb-810b-d091edcd2a61" />
<img width="1914" height="463" alt="image" src="https://github.com/user-attachments/assets/b857140c-541c-4786-974a-7fb70bf98036" />
<img width="1885" height="510" alt="image" src="https://github.com/user-attachments/assets/32273076-b92c-4675-9cce-6f9487013a2b" />

## Triển khai
- Giao diện được triển khai trên: https://nguyenhoangnhat.website
- Api được triển khai: https://api.nguyenhoangnhat.website
