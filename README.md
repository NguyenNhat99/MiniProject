# Mini Project Quản Lý Sinh Viên & Lớp Học

Dự án quản lý sinh viên và lớp học được xây dựng bằng **ASP.NET Core Web API** áp dụng **Clean Architecture** và **CQRS Pattern**. Hệ thống cung cấp các API để quản lý thông tin lớp học, sinh viên và mối quan hệ giữa chúng.

## Kiến trúc hệ thống
MiniProjectServer/
├── Api/ (Presentation Layer)
│ └── Controllers/
├── Application/ (Application Layer)
│ ├── DTOs/
│ ├── Features/
│ ├── Mapping/
│ └── Abstraction/
├── Domain/ (Domain Layer)
│ └── Entities/
└── Infrastructure/ (Infrastructure Layer)
├── Persistants/
└── Repository/
