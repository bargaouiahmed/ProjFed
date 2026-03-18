using Backend.Auth.Services;
using Backend.Database.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


var builder = WebApplication.CreateBuilder(args);
DotNetEnv.Env.Load();

var connStr=string.Empty;
if(builder.Environment.IsDevelopment())
{
    connStr=Environment.GetEnvironmentVariable("DB_CONN_URL_DEV") ?? throw new InvalidOperationException("DB_CONN_URL_DEV not found in environment variables.");
}
else
{
    connStr=Environment.GetEnvironmentVariable("DB_CONN_URL") ?? throw new InvalidOperationException("DB_CONN_URL not found in environment variables.");
}
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddOpenApi();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // read secret from config and fail fast with a helpful message if missing
        var secret = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? throw new InvalidOperationException("Configuration key 'AppSettings:SecretKey' is missing.");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? throw new InvalidOperationException("JWT_ISSUER not found in environment variables."),
            ValidAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? throw new InvalidOperationException("JWT_AUDIENCE not found in environment variables."),
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(secret))
        };
    });



builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connStr));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await dbContext.Database.MigrateAsync();

    var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
    await authService.EnsureSuperAdminExistsAsync();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
