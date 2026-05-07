using System.Text.Json;
using Backend.Account.Services;
using Backend.Administration.Services;
using Backend.Admin.Services;
using Backend.FileSystem;
using Backend.Auth.Services;
using Backend.Database.Auth;
using Backend.Database.Seeders;
using Backend.ProfessorSpace.Services;
using Backend.StudentSpace.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi;


var builder = WebApplication.CreateBuilder(args);
DotNetEnv.Env.Load();
var seedDemoData = args.Any(arg => string.Equals(arg, "--seed-demo-data", StringComparison.OrdinalIgnoreCase));

var connStr = string.Empty;
if (builder.Environment.IsDevelopment())
{
    connStr = Environment.GetEnvironmentVariable("DB_CONN_URL_DEV") ?? throw new InvalidOperationException("DB_CONN_URL_DEV not found in environment variables.");
}
else
{
    connStr = Environment.GetEnvironmentVariable("DB_CONN_URL") ?? throw new InvalidOperationException("DB_CONN_URL not found in environment variables.");
}
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IAdministrationService, AdministrationService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IProfessorService, ProfessorService>();
builder.Services.AddScoped<IFSService, FSService>();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, _, _) =>
    {
        document.Components ??= new OpenApiComponents();
        document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();
        document.Components.SecuritySchemes["Bearer"] = new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Name = "Authorization",
            Description = "Paste the JWT access token. The client will send it as 'Authorization: Bearer {token}'."
        };

        return Task.CompletedTask;
    });

    options.AddOperationTransformer((operation, context, _) =>
    {
        var endpointMetadata = context.Description.ActionDescriptor.EndpointMetadata;
        var allowsAnonymous = endpointMetadata.OfType<IAllowAnonymous>().Any();
        var requiresAuthorization = endpointMetadata.OfType<IAuthorizeData>().Any();

        if (allowsAnonymous || !requiresAuthorization)
        {
            return Task.CompletedTask;
        }

        operation.Security ??= new List<OpenApiSecurityRequirement>();
        operation.Security.Add(new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer", context.Document, null)] = []
        });

        return Task.CompletedTask;
    });
});

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
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
{
    var autoPassChanged = context.Principal?.FindFirst("autoPassChanged")?.Value;

    if (autoPassChanged == "false")
    {
        context.Fail("Password change required.");
    }

    return Task.CompletedTask;
},
            OnChallenge = async context =>
            {
                // suppress the default 401 response
                context.HandleResponse();

                var error = context.AuthenticateFailure;
                string message;

                if (error is SecurityTokenExpiredException)
                    message = "Token has expired. Please log in again.";
                else if (error is SecurityTokenInvalidSignatureException)
                    message = "Invalid token signature.";
                else if (context.Request.Headers.ContainsKey("Authorization"))
                    message = "Token is invalid.";
                else
                    message = "Authentication required.";

                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";

                var body = JsonSerializer.Serialize(new
                {
                    status = 401,
                    message
                });

                await context.Response.WriteAsync(body);
            }
        };
    });



builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connStr));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
        app.UseSwaggerUI(options =>
    {
        // Point Swagger UI to the JSON endpoint .NET 9 generated
        options.SwaggerEndpoint("/openapi/v1.json", "v1");
    });
}


using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await dbContext.Database.MigrateAsync();

    var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
    await authService.EnsureSuperAdminExistsAsync();

    if (seedDemoData)
    {
        var seedResult = await DemoDataSeeder.SeedAsync(dbContext, app.Environment);
        Console.WriteLine(seedResult);
        return;
    }
}

app.UseHttpsRedirection();
var webRootPath = app.Environment.WebRootPath;
if (string.IsNullOrWhiteSpace(webRootPath))
{
    webRootPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot");
}

var uploadsPath = Path.Combine(webRootPath, "uploads");
Directory.CreateDirectory(uploadsPath);

app.UseStaticFiles(new StaticFileOptions    
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/api/v0/uploads"
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
