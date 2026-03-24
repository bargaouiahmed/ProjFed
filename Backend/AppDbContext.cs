using System;
using System.Security.Cryptography.X509Certificates;
using Backend.Admin.Entities;
using Backend.Administration.Entities;
using Backend.Auth.Entities;
using Backend.StudentSpace.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Auth;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<AdminUser> AdminUsers { get; set; }
    public DbSet<Professor> Professors { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<AuthIdentity> Identities { get; set; }
    public DbSet<Institute> Institutes { get; set; }
    public DbSet<ClassMetadata> ClassMetadata { get; set; }
    public DbSet<UniUser> UniUsers { get; set; }
    public DbSet<Notification> Notifications{get;set;}
    public DbSet<UniClass> UniClasses { get; set; }
    public DbSet<UniStaffInvitation> UniStaffInvitations {get;set;}
    public DbSet<ProfessorInvitation> ProfessorInvitations{get;set;}
    public DbSet<Course> Courses { get; set; }
    public DbSet<PendingJoinRequest> PendingJoinRequests { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AuthIdentity>(identity =>
        {
            identity.HasIndex(i => i.Email).IsUnique();
            identity.HasIndex(i => i.RefreshToken).IsUnique();

        });
        modelBuilder.Entity<AdminUser>(admin =>
        {
            admin.HasOne(a => a.Identity)
                .WithOne(i => i.AdminUser)
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
                .WithOne(i => i.Student)
                .HasForeignKey<Student>(s => s.IdentityId)
                .OnDelete(DeleteBehavior.Cascade);

            student.HasOne(s => s.UniClass)
                .WithMany(c => c.Students)
                .HasForeignKey(s => s.UniClassId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<Course>(course =>
        {
            course.HasOne(c => c.Professor)
            .WithMany(p => p.Courses)
            .HasForeignKey(c => c.ProfessorId)
            .OnDelete(DeleteBehavior.Cascade);
            course.HasOne(c => c.UniClass)
            .WithMany(uc => uc.Courses)
            .HasForeignKey(c => c.UniClassId)
            .OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<UniUser>(uniUser =>
        {
            uniUser.HasOne(u => u.Identity)
                .WithOne(i => i.UniUser)
                .HasForeignKey<UniUser>(u => u.IdentityId)
                .OnDelete(DeleteBehavior.Cascade);

            uniUser.HasOne(u => u.Institute)
                .WithMany(i => i.Admins)
                .HasForeignKey(u => u.InstituteId)
                .OnDelete(DeleteBehavior.SetNull);
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
            uniClass.HasIndex(uc => uc.ClassCode).IsUnique();
            uniClass.HasIndex(uc => new { uc.MetadataId, uc.Number }).IsUnique();
        });

        modelBuilder.Entity<PendingJoinRequest>(pendingJoinRequest =>
        {
            pendingJoinRequest.HasOne(pjr => pjr.Identity)
                .WithMany()
                .HasForeignKey(pjr => pjr.IdentityId)
                .OnDelete(DeleteBehavior.Cascade);
            pendingJoinRequest.HasOne(pjr => pjr.ReviewedBy)
                .WithMany()
                .HasForeignKey(pjr => pjr.IdentityReviewedBy)
                .OnDelete(DeleteBehavior.SetNull);
        });


        modelBuilder.Entity<UniStaffInvitation>(invitation =>
        {
            invitation.HasOne(i=>i.Identity)
            .WithMany(ai=>ai.UniStaffInvitations)
            .HasForeignKey(i=>i.IdentityId)
            .OnDelete(DeleteBehavior.Cascade);
            invitation.HasOne(i=>i.Institute)
            .WithMany()
            .HasForeignKey(i=>i.InstituteId)
            .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ProfessorInvitation>(invitation =>
        {
            invitation.HasOne(i=>i.Identity).WithMany(au=>au.ProfessorInvitations).HasForeignKey(i=>i.IdentityId).OnDelete(DeleteBehavior.Cascade);
            invitation.HasOne(i=>i.Course).WithMany().HasForeignKey(i=>i.CourseId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Notification>(n =>
        {
            n.HasOne(n=>n.Identity)
            .WithMany(i=>i.Notifications)
            .HasForeignKey(n=>n.IdentityId)
            .OnDelete(DeleteBehavior.Cascade);
        });


    }
}
