using MediatR;
using MiniProjectServer.Application.Mapping;                 
using MiniProjectServer.Application.Features.ClassRooms.Commands; 
using MiniProjectServer.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("MyCors", p => p
        .WithOrigins("http://localhost:3000", "https://nguyenhoangnhat.website")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
    );
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// ✅ AutoMapper: quét profile trong assembly Application
builder.Services.AddAutoMapper(typeof(ApplicationMapper).Assembly);

// ✅ MediatR: quét tất cả Handler trong Application
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(CreateClassRoom).Assembly));

// ✅ Infrastructure (DbContext, Repository, ...)
builder.Services.AddServiceInfrastructure(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
// CORS nên đặt trước MapControllers
app.UseCors("MyCors");
app.MapControllers();
app.Run();
