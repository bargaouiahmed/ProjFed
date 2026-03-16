using System;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Auth;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);
    
   
}
}
