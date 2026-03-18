using System;
using Backend.Auth.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Auth;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<AdminUser> AdminUsers { get; set; } = null!;
    public DbSet<Professor> Professors { get; set; } = null!;
    public DbSet<Student> Students { get; set; } = null!;
    public DbSet<AuthIdentity> Identities { get; set; } = null!;
    public DbSet<Institute> Institutes { get; set; } = null!;
    public DbSet<ClassMetadata> ClassMetadata { get; set; } = null!;
    public DbSet<SubjectPerClass> SubjectPerClasses { get; set; } = null!;
    public DbSet<UniUser> UniUsers { get; set; } = null!;
    public DbSet<ProfessorUniClass> ProfessorUniClasses { get; set; } = null!;
    public DbSet<UniClass> UniClasses { get; set; } = null!;


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AuthIdentity>(identity =>
        {
            identity.HasIndex(i => i.Email).IsUnique();
            identity.HasIndex(i=>i.RefreshToken).IsUnique();
        });
        modelBuilder.Entity<AdminUser>(admin =>
        {
            admin.HasOne(a => a.Identity)
                .WithOne()
                .HasForeignKey<AdminUser>(a => a.IdentityId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<Professor>(prof =>
        {
            prof.HasOne(p => p.Identity)
                .WithOne()
                .HasForeignKey<Professor>(p => p.IdentityId)
                .OnDelete(DeleteBehavior.Cascade);
            
        });
        modelBuilder.Entity<Student>(student =>
        {
            student.HasOne(s => s.Identity)
                .WithOne()
                .HasForeignKey<Student>(s => s.IdentityId)
                .OnDelete(DeleteBehavior.Cascade);
            
            student.HasOne(s => s.UniClass)
                .WithMany(c => c.Students)
                .HasForeignKey(s => s.UniClassId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<UniUser>(uniUser =>
        {
            uniUser.HasOne(u => u.Identity)
                .WithOne()
                .HasForeignKey<UniUser>(u => u.IdentityId)
                .OnDelete(DeleteBehavior.Cascade);
     
            uniUser.HasOne(u => u.Institute)
                .WithMany(i => i.Admins)
                .HasForeignKey(u => u.InstutiteId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<ProfessorUniClass>(profUniClass =>
        {
            profUniClass.HasOne(puc => puc.Prof)
                .WithMany(p => p.Classes)
                .HasForeignKey(puc => puc.ProfId)
                .OnDelete(DeleteBehavior.Cascade);
            
            profUniClass.HasOne(puc => puc.UniClass)
                .WithMany(c => c.Professors)
                .HasForeignKey(puc => puc.UniClassId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<SubjectPerClass>(subjectPerClass =>
        {
            subjectPerClass.HasOne(spc => spc.ClassMetadata)
                .WithMany(cm => cm.AvailableSubjects)
                .HasForeignKey(spc => spc.ClassMetadataId)
                .OnDelete(DeleteBehavior.Cascade);
        });
            modelBuilder.Entity<ClassMetadata>(classMetadata =>
            {
                classMetadata.HasOne(cm => cm.Institute)
                    .WithMany(i => i.AvailableClassSelection)
                    .HasForeignKey(cm => cm.InstituteId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<UniClass>(uniClass =>
            {
                uniClass.HasOne(uc => uc.Metadata)
                    .WithMany(cm => cm.Classes)
                    .HasForeignKey(uc => uc.MetadataId)
                    .OnDelete(DeleteBehavior.Cascade);
            });


    }
}
