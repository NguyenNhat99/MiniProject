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
- Tự động cập nhật số lượng sinh viên khi thêm/xóa
- Validate dữ liệu đầu vào

### Quản lý Sinh viên  
- Tạo, cập nhật, xóa, xem danh sách sinh viên, tìm kiếm
- Phân công sinh viên vào lớp học
- Tự động cập nhật thông tin lớp khi thay đổi

## Mô hình cơ sở dữ liệu
<img width="678" height="319" alt="image" src="https://github.com/user-attachments/assets/3731e5f4-dfaa-43a4-8387-260a4bc433c5" />

## Triển khai
- Được triển khai lên Internet với tên miền: https://nguyenhoangnhat.website
- API Server được tách riêng với tên miền: https://api.nguyenhoangnhat.website
