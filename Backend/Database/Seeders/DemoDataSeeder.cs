using System.Text;
using Backend.Admin.Entities;
using Backend.Administration.Entities;
using Backend.Auth.Entities;
using Backend.Database.Auth;
using Backend.StudentSpace.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Seeders;

public static class DemoDataSeeder
{
    private const string DemoPassword = "Demo123!";
    private const string DemoAdminEmail = "demo.admin@eduadmin.local";
    private const string ActiveInstituteName = "ISAMM Demo Institute";
    private static readonly ClassMetadataSeed ActiveClassMetadataSeed = new("License", "Computer Science", 3, 1, 6, 2);
    private static readonly int[] ActiveClassNumbers = [1, 2];
    private static readonly DemoUniStaffSeed[] ActiveUniStaff =
    [
        new("sami.ghannem@isamm-demo.local", "Sami", "Ghannem"),
        new("hana.oueslati@isamm-demo.local", "Hana", "Oueslati")
    ];
    private static readonly DemoProfessorSeed[] ActiveProfessors =
    [
        new("ines.haddad@isamm-demo.local", "Ines", "Haddad"),
        new("walid.ayachi@isamm-demo.local", "Walid", "Ayachi")
    ];
    private static readonly DemoStudentSeed[] ActiveStudents =
    [
        new("adam.lahlou@isamm-demo.local", "Adam", "Lahlou", 1),
        new("ranya.saad@isamm-demo.local", "Ranya", "Saad", 1),
        new("mehdi.kammoun@isamm-demo.local", "Mehdi", "Kammoun", 2),
        new("yasmine.benali@isamm-demo.local", "Yasmine", "Benali", 2)
    ];
    private static readonly DemoCourseSeed[] ActiveCourses =
    [
        new("Algorithms", "Core algorithms and complexity basics.", 1, 1, "ines.haddad@isamm-demo.local"),
        new("Databases", "Relational databases and SQL fundamentals.", 1, 1, "walid.ayachi@isamm-demo.local")
    ];

    public static async Task<DemoSeedResult> SeedAsync(AppDbContext db, IWebHostEnvironment env, CancellationToken cancellationToken = default)
    {
        var documentUrls = EnsureDemoDocuments(env);
        await using var transaction = await db.Database.BeginTransactionAsync(cancellationToken);

        var result = new DemoSeedResult();

        var reviewerIdentity = await EnsureDemoPlatformAdminAsync(db, result, cancellationToken);

        foreach (var institute in AcceptedInstitutes)
        {
            var adminIdentity = await EnsureAcceptedInstituteAsync(db, institute, result, cancellationToken);
            await EnsureNotificationAsync(
                db,
                adminIdentity.Id,
                $"Welcome to EduAdmin. {institute.Name} is ready for demo administration.",
                DateTime.UtcNow.AddDays(-8),
                false,
                result,
                cancellationToken);
            await EnsureNotificationAsync(
                db,
                adminIdentity.Id,
                "A new academic term setup checklist is waiting in your dashboard.",
                DateTime.UtcNow.AddDays(-3),
                false,
                result,
                cancellationToken);
        }

            await EnsureActiveInstituteShowcaseAsync(db, result, cancellationToken);

        foreach (var request in JoinRequests)
        {
            var requestIdentity = await EnsureJoinRequestAsync(db, request, reviewerIdentity, documentUrls, result, cancellationToken);
            await EnsureNotificationAsync(
                db,
                requestIdentity.Id,
                BuildApplicantNotificationMessage(request),
                request.RequestedAt.AddHours(4),
                request.Status != "pending",
                result,
                cancellationToken);
        }

        var reviewerNotifications = new[]
        {
            "Demo data loaded: sample institute join requests are ready for review.",
            "There are pending institute registration requests waiting in the admin queue.",
            "Recently reviewed demo requests have been kept in the list for status testing."
        };

        foreach (var adminIdentityId in await db.Identities
            .Where(i => i.Role == "admin" || i.Role == "super_admin")
            .Select(i => i.Id)
            .ToListAsync(cancellationToken))
        {
            foreach (var notification in reviewerNotifications)
            {
                await EnsureNotificationAsync(
                    db,
                    adminIdentityId,
                    notification,
                    DateTime.UtcNow.AddDays(-1),
                    false,
                    result,
                    cancellationToken);
            }
        }

        await db.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return result;
    }

    private static async Task<AuthIdentity> EnsureDemoPlatformAdminAsync(AppDbContext db, DemoSeedResult result, CancellationToken cancellationToken)
    {
        var existingIdentity = await db.Identities
            .Include(i => i.AdminUser)
            .FirstOrDefaultAsync(i => i.Email == DemoAdminEmail, cancellationToken);

        if (existingIdentity != null)
        {
            if (existingIdentity.AdminUser == null)
            {
                db.AdminUsers.Add(new AdminUser
                {
                    Id = Guid.NewGuid(),
                    IdentityId = existingIdentity.Id,
                    Firstname = "Nadia",
                    Lastname = "Bennour"
                });
                result.AdminUsersCreated++;
            }

            return existingIdentity;
        }

        var identity = new AuthIdentity
        {
            Id = Guid.NewGuid(),
            Email = DemoAdminEmail,
            Role = "admin",
            Status = "accepted",
            IsActive = true,
            HasChangedAutoAssignedPassword = true
        };

        if (!identity.HashPassword(DemoPassword))
        {
            throw new InvalidOperationException("Demo admin password does not meet password policy.");
        }

        db.Identities.Add(identity);
        db.AdminUsers.Add(new AdminUser
        {
            Id = Guid.NewGuid(),
            Identity = identity,
            Firstname = "Nadia",
            Lastname = "Bennour"
        });

        result.IdentitiesCreated++;
        result.AdminUsersCreated++;

        return identity;
    }

    private static async Task<AuthIdentity> EnsureAcceptedInstituteAsync(AppDbContext db, AcceptedInstituteSeed seed, DemoSeedResult result, CancellationToken cancellationToken)
    {
        var institute = await db.Institutes
            .FirstOrDefaultAsync(i => i.Name.ToLower() == seed.Name.ToLower(), cancellationToken);

        if (institute == null)
        {
            institute = new Institute
            {
                Id = Guid.NewGuid(),
                Name = seed.Name,
                Country = seed.Country,
                City = seed.City,
                PostalCode = seed.PostalCode
            };
            db.Institutes.Add(institute);
            result.InstitutesCreated++;
        }

        var identity = await db.Identities
            .Include(i => i.UniUser)
            .FirstOrDefaultAsync(i => i.Email == seed.AdminEmail, cancellationToken);

        if (identity == null)
        {
            identity = new AuthIdentity
            {
                Id = Guid.NewGuid(),
                Email = seed.AdminEmail,
                Role = "uni_admin",
                Status = "accepted",
                IsActive = true,
                HasChangedAutoAssignedPassword = true
            };

            if (!identity.HashPassword(DemoPassword))
            {
                throw new InvalidOperationException($"Demo password does not meet password policy for {seed.AdminEmail}.");
            }

            db.Identities.Add(identity);
            db.UniUsers.Add(new UniUser
            {
                Id = Guid.NewGuid(),
                Identity = identity,
                Institute = institute,
                Firstname = seed.AdminFirstname,
                Lastname = seed.AdminLastname
            });

            result.IdentitiesCreated++;
            result.UniUsersCreated++;
        }
        else if (identity.UniUser == null)
        {
            db.UniUsers.Add(new UniUser
            {
                Id = Guid.NewGuid(),
                IdentityId = identity.Id,
                Institute = institute,
                Firstname = seed.AdminFirstname,
                Lastname = seed.AdminLastname
            });

            result.UniUsersCreated++;
        }
        else if (!identity.UniUser.InstituteId.HasValue)
        {
            identity.UniUser.Institute = institute;
        }

        foreach (var metadataSeed in seed.ClassMetadata)
        {
            var exists = await db.ClassMetadata.AnyAsync(cm =>
                cm.InstituteId == institute.Id &&
                cm.Level == metadataSeed.Level &&
                cm.LevelOfStudies == metadataSeed.LevelOfStudies &&
                cm.Specialty == metadataSeed.Specialty,
                cancellationToken);

            if (exists)
            {
                continue;
            }

            db.ClassMetadata.Add(new ClassMetadata
            {
                Id = Guid.NewGuid(),
                Institute = institute,
                Level = metadataSeed.Level,
                LevelOfStudies = metadataSeed.LevelOfStudies,
                Specialty = metadataSeed.Specialty,
                MaxYears = metadataSeed.MaxYears,
                MaxTerms = metadataSeed.MaxTerms,
                CurrentTerm = metadataSeed.CurrentTerm
            });

            result.ClassMetadataCreated++;
        }

        return identity;
    }

    private static async Task EnsureActiveInstituteShowcaseAsync(AppDbContext db, DemoSeedResult result, CancellationToken cancellationToken)
    {
        var instituteName = ActiveInstituteName.ToLower();
        var institute = await db.Institutes
            .Include(i => i.AvailableClassSelection)
            .FirstOrDefaultAsync(i => i.Name.ToLower() == instituteName, cancellationToken);

        if (institute == null)
        {
            return;
        }

        var classMetadata = institute.AvailableClassSelection.FirstOrDefault(cm =>
            cm.LevelOfStudies == ActiveClassMetadataSeed.LevelOfStudies &&
            cm.Specialty == ActiveClassMetadataSeed.Specialty &&
            cm.Level == ActiveClassMetadataSeed.Level);

        if (classMetadata == null)
        {
            classMetadata = await EnsureClassMetadataAsync(db, institute, ActiveClassMetadataSeed, result, cancellationToken);
        }

        var classesByNumber = new Dictionary<int, UniClass>();
        foreach (var classNumber in ActiveClassNumbers)
        {
            classesByNumber[classNumber] = await EnsureUniClassAsync(db, classMetadata, classNumber, result, cancellationToken);
        }

        foreach (var staffSeed in ActiveUniStaff)
        {
            var staffIdentity = await EnsureUniStaffAsync(db, institute, staffSeed, result, cancellationToken);
            await EnsureUniStaffInvitationAsync(db, staffIdentity, institute, "accepted", result, cancellationToken);
            await EnsureNotificationAsync(
                db,
                staffIdentity.Id,
                $"You are active as university staff at {institute.Name}.",
                DateTime.UtcNow.AddDays(-2),
                false,
                result,
                cancellationToken);
        }

        var professorsByEmail = new Dictionary<string, Professor>(StringComparer.OrdinalIgnoreCase);
        foreach (var professorSeed in ActiveProfessors)
        {
            var professor = await EnsureProfessorAsync(db, professorSeed, result, cancellationToken);
            professorsByEmail[professorSeed.Email] = professor;
        }

        foreach (var courseSeed in ActiveCourses)
        {
            if (!classesByNumber.TryGetValue(courseSeed.ClassNumber, out var uniClass))
            {
                continue;
            }

            var course = await EnsureCourseAsync(db, uniClass, courseSeed, result, cancellationToken);

            if (!professorsByEmail.TryGetValue(courseSeed.ProfessorEmail, out var professor))
            {
                continue;
            }

            if (!course.ProfessorId.HasValue)
            {
                course.ProfessorId = professor.Id;
            }

            var classPrettyName = BuildClassPrettyName(classMetadata, uniClass.Number, course.Term);
            await EnsureProfessorInvitationAsync(
                db,
                professor.IdentityId,
                course,
                classPrettyName,
                "accepted",
                result,
                cancellationToken);
            await EnsureNotificationAsync(
                db,
                professor.IdentityId,
                $"You are assigned to teach {course.Name} for {classPrettyName}.",
                DateTime.UtcNow.AddDays(-1),
                false,
                result,
                cancellationToken);
        }

        foreach (var studentSeed in ActiveStudents)
        {
            if (!classesByNumber.TryGetValue(studentSeed.ClassNumber, out var uniClass))
            {
                continue;
            }

            var studentIdentity = await EnsureStudentAsync(db, uniClass, studentSeed, result, cancellationToken);
            var classPrettyName = BuildClassPrettyName(classMetadata, uniClass.Number, classMetadata.CurrentTerm);
            await EnsureNotificationAsync(
                db,
                studentIdentity.Id,
                $"Welcome to {institute.Name}. Your class is {classPrettyName}.",
                DateTime.UtcNow.AddDays(-1),
                false,
                result,
                cancellationToken);
        }
    }

    private static async Task<ClassMetadata> EnsureClassMetadataAsync(
        AppDbContext db,
        Institute institute,
        ClassMetadataSeed seed,
        DemoSeedResult result,
        CancellationToken cancellationToken)
    {
        var metadata = await db.ClassMetadata.FirstOrDefaultAsync(cm =>
            cm.InstituteId == institute.Id &&
            cm.Level == seed.Level &&
            cm.LevelOfStudies == seed.LevelOfStudies &&
            cm.Specialty == seed.Specialty,
            cancellationToken);

        if (metadata != null)
        {
            return metadata;
        }

        metadata = new ClassMetadata
        {
            Id = Guid.NewGuid(),
            Institute = institute,
            Level = seed.Level,
            LevelOfStudies = seed.LevelOfStudies,
            Specialty = seed.Specialty,
            MaxYears = seed.MaxYears,
            MaxTerms = seed.MaxTerms,
            CurrentTerm = seed.CurrentTerm
        };

        db.ClassMetadata.Add(metadata);
        result.ClassMetadataCreated++;

        return metadata;
    }

    private static async Task<UniClass> EnsureUniClassAsync(
        AppDbContext db,
        ClassMetadata metadata,
        int number,
        DemoSeedResult result,
        CancellationToken cancellationToken)
    {
        var existing = await db.UniClasses.FirstOrDefaultAsync(uc =>
            uc.MetadataId == metadata.Id && uc.Number == number,
            cancellationToken);

        if (existing != null)
        {
            return existing;
        }

        var uniClass = new UniClass
        {
            Id = Guid.NewGuid(),
            Metadata = metadata,
            Number = number
        };

        db.UniClasses.Add(uniClass);
        result.UniClassesCreated++;

        return uniClass;
    }

    private static async Task<AuthIdentity> EnsureUniStaffAsync(
        AppDbContext db,
        Institute institute,
        DemoUniStaffSeed seed,
        DemoSeedResult result,
        CancellationToken cancellationToken)
    {
        var identity = await db.Identities
            .Include(i => i.UniUser)
            .FirstOrDefaultAsync(i => i.Email == seed.Email, cancellationToken);

        if (identity == null)
        {
            identity = new AuthIdentity
            {
                Id = Guid.NewGuid(),
                Email = seed.Email,
                Role = "uni_staff",
                Status = "accepted",
                IsActive = true,
                HasChangedAutoAssignedPassword = true
            };

            if (!identity.HashPassword(DemoPassword))
            {
                throw new InvalidOperationException($"Demo password does not meet password policy for {seed.Email}.");
            }

            db.Identities.Add(identity);
            result.IdentitiesCreated++;
        }
        else
        {
            identity.Role = "uni_staff";
            identity.Status = "accepted";
            identity.IsActive = true;
            identity.IsDeleted = false;
            identity.HasChangedAutoAssignedPassword = true;
            if (string.IsNullOrWhiteSpace(identity.HashedPassword))
            {
                if (!identity.HashPassword(DemoPassword))
                {
                    throw new InvalidOperationException($"Demo password does not meet password policy for {seed.Email}.");
                }
            }
        }

        if (identity.UniUser == null)
        {
            identity.UniUser = new UniUser
            {
                Id = Guid.NewGuid(),
                Identity = identity,
                Institute = institute,
                Firstname = seed.Firstname,
                Lastname = seed.Lastname
            };
            db.UniUsers.Add(identity.UniUser);
            result.UniUsersCreated++;
        }
        else
        {
            identity.UniUser.Firstname = seed.Firstname;
            identity.UniUser.Lastname = seed.Lastname;
            if (!identity.UniUser.InstituteId.HasValue)
            {
                identity.UniUser.Institute = institute;
            }
        }

        return identity;
    }

    private static async Task EnsureUniStaffInvitationAsync(
        AppDbContext db,
        AuthIdentity identity,
        Institute institute,
        string status,
        DemoSeedResult result,
        CancellationToken cancellationToken)
    {
        var invitation = await db.UniStaffInvitations.FirstOrDefaultAsync(i =>
            i.IdentityId == identity.Id && i.InstituteId == institute.Id,
            cancellationToken);

        if (invitation == null)
        {
            db.UniStaffInvitations.Add(new UniStaffInvitation
            {
                Id = Guid.NewGuid(),
                Identity = identity,
                Institute = institute,
                Status = status
            });
            result.UniStaffInvitationsCreated++;
            return;
        }

        if (invitation.Status != status)
        {
            invitation.Status = status;
        }
    }

    private static async Task<Professor> EnsureProfessorAsync(
        AppDbContext db,
        DemoProfessorSeed seed,
        DemoSeedResult result,
        CancellationToken cancellationToken)
    {
        var identity = await db.Identities
            .Include(i => i.Professor)
            .FirstOrDefaultAsync(i => i.Email == seed.Email, cancellationToken);

        if (identity == null)
        {
            identity = new AuthIdentity
            {
                Id = Guid.NewGuid(),
                Email = seed.Email,
                Role = "professor",
                Status = "accepted",
                IsActive = true,
                HasChangedAutoAssignedPassword = true
            };

            if (!identity.HashPassword(DemoPassword))
            {
                throw new InvalidOperationException($"Demo password does not meet password policy for {seed.Email}.");
            }

            db.Identities.Add(identity);
            result.IdentitiesCreated++;
        }
        else
        {
            identity.Role = "professor";
            identity.Status = "accepted";
            identity.IsActive = true;
            identity.IsDeleted = false;
            identity.HasChangedAutoAssignedPassword = true;
            if (string.IsNullOrWhiteSpace(identity.HashedPassword))
            {
                if (!identity.HashPassword(DemoPassword))
                {
                    throw new InvalidOperationException($"Demo password does not meet password policy for {seed.Email}.");
                }
            }
        }

        if (identity.Professor == null)
        {
            identity.Professor = new Professor
            {
                Id = Guid.NewGuid(),
                Identity = identity,
                Firstname = seed.Firstname,
                Lastname = seed.Lastname
            };
            db.Professors.Add(identity.Professor);
            result.ProfessorsCreated++;
        }
        else
        {
            identity.Professor.Firstname = seed.Firstname;
            identity.Professor.Lastname = seed.Lastname;
        }

        return identity.Professor;
    }

    private static async Task<AuthIdentity> EnsureStudentAsync(
        AppDbContext db,
        UniClass uniClass,
        DemoStudentSeed seed,
        DemoSeedResult result,
        CancellationToken cancellationToken)
    {
        var identity = await db.Identities
            .Include(i => i.Student)
            .FirstOrDefaultAsync(i => i.Email == seed.Email, cancellationToken);

        if (identity == null)
        {
            identity = new AuthIdentity
            {
                Id = Guid.NewGuid(),
                Email = seed.Email,
                Role = "student",
                Status = "accepted",
                IsActive = true,
                HasChangedAutoAssignedPassword = true
            };

            if (!identity.HashPassword(DemoPassword))
            {
                throw new InvalidOperationException($"Demo password does not meet password policy for {seed.Email}.");
            }

            db.Identities.Add(identity);
            result.IdentitiesCreated++;
        }
        else
        {
            identity.Role = "student";
            identity.Status = "accepted";
            identity.IsActive = true;
            identity.IsDeleted = false;
            identity.HasChangedAutoAssignedPassword = true;
            if (string.IsNullOrWhiteSpace(identity.HashedPassword))
            {
                if (!identity.HashPassword(DemoPassword))
                {
                    throw new InvalidOperationException($"Demo password does not meet password policy for {seed.Email}.");
                }
            }
        }

        if (identity.Student == null)
        {
            identity.Student = new Student
            {
                Id = Guid.NewGuid(),
                Identity = identity,
                Firstname = seed.Firstname,
                Lastname = seed.Lastname,
                UniClass = uniClass
            };
            db.Students.Add(identity.Student);
            result.StudentsCreated++;
        }
        else if (!identity.Student.UniClassId.HasValue)
        {
            identity.Student.UniClass = uniClass;
        }

        return identity;
    }

    private static async Task<Course> EnsureCourseAsync(
        AppDbContext db,
        UniClass uniClass,
        DemoCourseSeed seed,
        DemoSeedResult result,
        CancellationToken cancellationToken)
    {
        var course = await db.Courses.FirstOrDefaultAsync(c =>
            c.UniClassId == uniClass.Id &&
            c.Term == seed.Term &&
            c.Name == seed.Name,
            cancellationToken);

        if (course != null)
        {
            if (string.IsNullOrWhiteSpace(course.Description) && !string.IsNullOrWhiteSpace(seed.Description))
            {
                course.Description = seed.Description;
            }
            return course;
        }

        course = new Course
        {
            Id = Guid.NewGuid(),
            Name = seed.Name,
            Description = seed.Description,
            Term = seed.Term,
            UniClassId = uniClass.Id
        };

        db.Courses.Add(course);
        result.CoursesCreated++;

        return course;
    }

    private static async Task EnsureProfessorInvitationAsync(
        AppDbContext db,
        Guid identityId,
        Course course,
        string classPrettyName,
        string status,
        DemoSeedResult result,
        CancellationToken cancellationToken)
    {
        var invitation = await db.ProfessorInvitations.FirstOrDefaultAsync(i =>
            i.IdentityId == identityId && i.CourseId == course.Id,
            cancellationToken);

        if (invitation == null)
        {
            db.ProfessorInvitations.Add(new ProfessorInvitation
            {
                Id = Guid.NewGuid(),
                IdentityId = identityId,
                Course = course,
                ClassPrettyName = classPrettyName,
                Status = status
            });
            result.ProfessorInvitationsCreated++;
            return;
        }

        if (invitation.Status != status)
        {
            invitation.Status = status;
        }
    }

    private static string BuildClassPrettyName(ClassMetadata metadata, int classNumber, int term)
    {
        return $"{metadata.Level}{metadata.LevelOfStudies}{metadata.Specialty}{classNumber}-term:{term}";
    }

    private static async Task<AuthIdentity> EnsureJoinRequestAsync(
        AppDbContext db,
        JoinRequestSeed seed,
        AuthIdentity reviewerIdentity,
        DemoDocumentUrls documentUrls,
        DemoSeedResult result,
        CancellationToken cancellationToken)
    {
        var identity = await db.Identities
            .Include(i => i.UniUser)
            .FirstOrDefaultAsync(i => i.Email == seed.AdminEmail, cancellationToken);

        if (identity == null)
        {
            identity = new AuthIdentity
            {
                Id = Guid.NewGuid(),
                Email = seed.AdminEmail,
                Role = "uni_admin",
                Status = seed.Status,
                IsActive = seed.Status == "accepted",
                IsDeleted = seed.Status == "rejected",
                DeletedAt = seed.Status == "rejected" ? seed.ReviewedAt : null,
                HasChangedAutoAssignedPassword = true
            };

            if (!identity.HashPassword(DemoPassword))
            {
                throw new InvalidOperationException($"Demo password does not meet password policy for {seed.AdminEmail}.");
            }

            db.Identities.Add(identity);
            result.IdentitiesCreated++;
        }

        if (identity.UniUser == null)
        {
            identity.UniUser = new UniUser
            {
                Id = Guid.NewGuid(),
                Identity = identity,
                Firstname = seed.AdminFirstname,
                Lastname = seed.AdminLastname
            };

            db.UniUsers.Add(identity.UniUser);

            result.UniUsersCreated++;
        }

        var requestExists = await db.PendingJoinRequests
            .AnyAsync(request => request.IdentityId == identity.Id, cancellationToken);

        if (!requestExists)
        {
            db.PendingJoinRequests.Add(new PendingJoinRequest
            {
                Id = Guid.NewGuid(),
                Identity = identity,
                RequestedAt = seed.RequestedAt,
                Message = seed.Message,
                ProofDocumentUrl = documentUrls.ProofDocumentUrl,
                IdentityDocumentUrl = documentUrls.IdentityDocumentUrl,
                InstituteName = seed.InstituteName,
                InstituteCountry = seed.Country,
                InstituteCity = seed.City,
                InstitutePostalCode = seed.PostalCode,
                ReviewedAt = seed.ReviewedAt,
                ReviewedBy = seed.Status == "pending" ? null : reviewerIdentity
            });

            result.PendingRequestsCreated++;
        }

        if (seed.Status == "accepted")
        {
            await EnsureAcceptedRequestInstituteAsync(db, seed, identity, result, cancellationToken);
        }

        return identity;
    }

    private static async Task EnsureAcceptedRequestInstituteAsync(
        AppDbContext db,
        JoinRequestSeed seed,
        AuthIdentity identity,
        DemoSeedResult result,
        CancellationToken cancellationToken)
    {
        var institute = await db.Institutes
            .FirstOrDefaultAsync(i => i.Name.ToLower() == seed.InstituteName.ToLower(), cancellationToken);

        if (institute == null)
        {
            institute = new Institute
            {
                Id = Guid.NewGuid(),
                Name = seed.InstituteName,
                Country = seed.Country,
                City = seed.City,
                PostalCode = seed.PostalCode
            };
            db.Institutes.Add(institute);
            result.InstitutesCreated++;
        }

        if (identity.UniUser != null && !identity.UniUser.InstituteId.HasValue)
        {
            identity.UniUser.Institute = institute;
        }
    }

    private static async Task EnsureNotificationAsync(
        AppDbContext db,
        Guid identityId,
        string message,
        DateTime createdAt,
        bool seen,
        DemoSeedResult result,
        CancellationToken cancellationToken)
    {
        var exists = await db.Notifications
            .AnyAsync(n => n.IdentityId == identityId && n.Message == message, cancellationToken);

        if (exists)
        {
            return;
        }

        db.Notifications.Add(new Notification
        {
            Id = Guid.NewGuid(),
            IdentityId = identityId,
            Message = message,
            CreatedAt = createdAt,
            Seen = seen
        });

        result.NotificationsCreated++;
    }

    private static DemoDocumentUrls EnsureDemoDocuments(IWebHostEnvironment env)
    {
        var webRootPath = string.IsNullOrWhiteSpace(env.WebRootPath)
            ? Path.Combine(env.ContentRootPath, "wwwroot")
            : env.WebRootPath;

        var uploadDirectory = Path.Combine(webRootPath, "uploads", "demo-seed");
        Directory.CreateDirectory(uploadDirectory);

        var proofDocumentPath = Path.Combine(uploadDirectory, "proof-document.txt");
        var identityDocumentPath = Path.Combine(uploadDirectory, "identity-document.txt");

        EnsureTextFile(proofDocumentPath, "Demo proof document for seeded institute join requests.");
        EnsureTextFile(identityDocumentPath, "Demo identity document for seeded institute join requests.");

        return new DemoDocumentUrls(
            "/uploads/demo-seed/proof-document.txt",
            "/uploads/demo-seed/identity-document.txt");
    }

    private static void EnsureTextFile(string path, string contents)
    {
        if (File.Exists(path))
        {
            return;
        }

        File.WriteAllText(path, contents + Environment.NewLine, Encoding.UTF8);
    }

    private static string BuildApplicantNotificationMessage(JoinRequestSeed request)
    {
        return request.Status switch
        {
            "accepted" => $"Your request for {request.InstituteName} has been accepted.",
            "rejected" => $"Your request for {request.InstituteName} was rejected: {request.Message}",
            _ => $"Your request for {request.InstituteName} is waiting for admin review."
        };
    }

    private static readonly AcceptedInstituteSeed[] AcceptedInstitutes =
    [
        new(
            "ISAMM Demo Institute",
            "Tunisia",
            "Manouba",
            "2010",
            "Leila",
            "Mansour",
            "leila.mansour@isamm-demo.local",
            [
                new("License", "Computer Science", 3, 1, 6, 2),
                new("Engineering", "Software Engineering", 3, 1, 6, 1)
            ]),
        new(
            "Carthage Digital College",
            "Tunisia",
            "Tunis",
            "1002",
            "Youssef",
            "Trabelsi",
            "youssef.trabelsi@carthage-digital.local",
            [
                new("Master", "Data Science", 2, 1, 4, 1),
                new("License", "Business Computing", 3, 2, 6, 3)
            ]),
        new(
            "Northbridge Business School",
            "France",
            "Lyon",
            "69002",
            "Amira",
            "Khaled",
            "amira.khaled@northbridge-business.local",
            [
                new("Bachelor", "Management", 3, 1, 6, 1),
                new("Master", "Finance", 2, 1, 4, 2)
            ])
    ];

    private static readonly JoinRequestSeed[] JoinRequests =
    [
        new(
            "Atlas Digital University",
            "Morocco",
            "Casablanca",
            "20250",
            "Samir",
            "El Fassi",
            "samir.elfassi@atlas-digital.local",
            "pending",
            DateTime.UtcNow.AddDays(-7),
            null,
            "Requesting access for a new engineering and design faculty."),
        new(
            "Medina Institute of Analytics",
            "Tunisia",
            "Sfax",
            "3000",
            "Nour",
            "Gharbi",
            "nour.gharbi@medina-analytics.local",
            "pending",
            DateTime.UtcNow.AddDays(-5),
            null,
            "We want to onboard our administration team before the next semester."),
        new(
            "Sahara Polytechnic",
            "Algeria",
            "Oran",
            "31000",
            "Karim",
            "Saidi",
            "karim.saidi@sahara-polytechnic.local",
            "pending",
            DateTime.UtcNow.AddDays(-3),
            null,
            "Documents attached for accreditation review."),
        new(
            "Blue Harbor University",
            "United States",
            "Boston",
            "02108",
            "Maya",
            "Cole",
            "maya.cole@blue-harbor.local",
            "pending",
            DateTime.UtcNow.AddDays(-2),
            null,
            "Demo request for an international institute profile."),
        new(
            "Riviera School of Design",
            "France",
            "Nice",
            "06000",
            "Claire",
            "Martin",
            "claire.martin@riviera-design.local",
            "accepted",
            DateTime.UtcNow.AddDays(-12),
            DateTime.UtcNow.AddDays(-10),
            "Accepted after validating proof documents."),
        new(
            "Old Town Training Center",
            "Tunisia",
            "Sousse",
            "4000",
            "Rami",
            "Ben Ali",
            "rami.benali@old-town-training.local",
            "rejected",
            DateTime.UtcNow.AddDays(-9),
            DateTime.UtcNow.AddDays(-8),
            "Rejected because the proof document does not match the requested institute name.")
    ];
}

public sealed record DemoSeedResult
{
    public int IdentitiesCreated { get; set; }
    public int AdminUsersCreated { get; set; }
    public int UniUsersCreated { get; set; }
    public int ProfessorsCreated { get; set; }
    public int StudentsCreated { get; set; }
    public int InstitutesCreated { get; set; }
    public int ClassMetadataCreated { get; set; }
    public int UniClassesCreated { get; set; }
    public int CoursesCreated { get; set; }
    public int UniStaffInvitationsCreated { get; set; }
    public int ProfessorInvitationsCreated { get; set; }
    public int PendingRequestsCreated { get; set; }
    public int NotificationsCreated { get; set; }

    public override string ToString()
    {
        return string.Join(Environment.NewLine,
            "Demo seed completed.",
            $"  Identities: {IdentitiesCreated}",
            $"  Admin users: {AdminUsersCreated}",
            $"  University users: {UniUsersCreated}",
            $"  Professors: {ProfessorsCreated}",
            $"  Students: {StudentsCreated}",
            $"  Institutes: {InstitutesCreated}",
            $"  Class metadata rows: {ClassMetadataCreated}",
            $"  Classes: {UniClassesCreated}",
            $"  Courses: {CoursesCreated}",
            $"  Uni staff invitations: {UniStaffInvitationsCreated}",
            $"  Professor invitations: {ProfessorInvitationsCreated}",
            $"  Pending join requests: {PendingRequestsCreated}",
            $"  Notifications: {NotificationsCreated}",
            "Demo logins (all use Demo123!):",
            "  platform admin: demo.admin@eduadmin.local",
            "  institute admin: leila.mansour@isamm-demo.local",
            "  uni staff: sami.ghannem@isamm-demo.local",
            "  professor: ines.haddad@isamm-demo.local",
            "  student: adam.lahlou@isamm-demo.local");
    }
}

internal sealed record DemoDocumentUrls(string ProofDocumentUrl, string IdentityDocumentUrl);

internal sealed record AcceptedInstituteSeed(
    string Name,
    string Country,
    string City,
    string PostalCode,
    string AdminFirstname,
    string AdminLastname,
    string AdminEmail,
    ClassMetadataSeed[] ClassMetadata);

internal sealed record ClassMetadataSeed(
    string LevelOfStudies,
    string Specialty,
    int MaxYears,
    int Level,
    int MaxTerms,
    int CurrentTerm);

internal sealed record DemoUniStaffSeed(
    string Email,
    string Firstname,
    string Lastname);

internal sealed record DemoProfessorSeed(
    string Email,
    string Firstname,
    string Lastname);

internal sealed record DemoStudentSeed(
    string Email,
    string Firstname,
    string Lastname,
    int ClassNumber);

internal sealed record DemoCourseSeed(
    string Name,
    string Description,
    int Term,
    int ClassNumber,
    string ProfessorEmail);

internal sealed record JoinRequestSeed(
    string InstituteName,
    string Country,
    string City,
    string PostalCode,
    string AdminFirstname,
    string AdminLastname,
    string AdminEmail,
    string Status,
    DateTime RequestedAt,
    DateTime? ReviewedAt,
    string Message);
