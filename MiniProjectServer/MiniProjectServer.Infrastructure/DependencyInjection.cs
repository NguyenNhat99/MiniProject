using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MiniProjectServer.Application.Abstraction;
using MiniProjectServer.Application.Mapping;
using MiniProjectServer.Infrastructure.Persisstants;
using MiniProjectServer.Infrastructure.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace MiniProjectServer.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddServiceInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<MiniProjectDbContext>(opt => opt.UseSqlServer(config.GetConnectionString("MiniProjectConnection")));
            services.AddScoped<IClassRoomRepository, ClassRoomRepository>();
            services.AddScoped<IStudentRepository, StudentRepository>();
            services.AddScoped<IMapper, Mapper>();
            return services;
        }
    }
}
