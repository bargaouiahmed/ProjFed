using Backend.Database.Auth;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
DotNetEnv.Env.Load();
var connStr = Environment.GetEnvironmentVariable("DB_CONN_URL") ?? throw new Exception("DB_CONN_URL is not set in the environment variables");
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connStr));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
