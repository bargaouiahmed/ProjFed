# Method Documentation (From Current Git Diff)

This document lists newly added methods and related DTOs/entities so implementation can be done consistently.

## Schema context from this diff

- Added table/entity: `Course` (`Backend/StudentSpace/Entities/Course.cs`)
- Removed table/entities: `ProfessorUniClassSubject`, `SubjectPerClass`
- Updated relations:
  - `Professor` now links to `ICollection<Course> Courses`
  - `UniClass` now links to `ICollection<Course>`
  - `ClassMetadata` no longer has `AvailableSubjects`; added `MaxTerms` and `CurrentTerm`
  - `CurrentTerm` now starts at `1` by default
  - `AppDbContext` now exposes `DbSet<Course> Courses`
  - `UniClass.ClassCode` has a unique index
  - `(UniClass.MetadataId, UniClass.Number)` has a unique composite index

## Methods

### `AdministrationService.AddNewClassMetaData(NewClassMetaDataRequest request, Guid uniAdminIdentityId)`

- Location: `Backend/Administration/Services/AdministrationService.cs`
- Purpose: Create multiple `ClassMetadata` rows (one per academic level from `1..MaxYears`).
- Input DTOs:
  - `NewClassMetaDataRequest`
    - `Specialty`
    - `InstituteId`
    - `LevelOfStudies`
    - `MaxYears`
    - `DefaultMaxTerms`
- Return type: `Task` (no response payload)
- Side effects:
  - Reads `Institutes` with `Admins` for authorization check.
  - Inserts multiple `ClassMetadata` rows.
  - Initializes `CurrentTerm = 1` for created metadata rows.
  - Persists changes via `SaveChangesAsync`.
  - Throws `InvalidOperationException` if institute not found or caller is not an institute admin.

### `AdministrationService.GetAllClassMetaData(Guid instituteId, Guid uniAdminIdentityId, int pageNumber = 1, int pageSize = 10)`

- Location: `Backend/Administration/Services/AdministrationService.cs`
- Purpose: Paginated read of class metadata for an institute.
- Output DTOs:
  - `List<SerializedClassMetaData>`
    - `MetadataId`
    - `LevelOfStudies`
    - `Specialty`
    - `MaxYears`
    - `Level`
    - `MaxTerms`
    - `NumberOfClasses`
- Return type: `Task<List<SerializedClassMetaData>>`
- Side effects:
  - Read-only query against `UniUsers`, `ClassMetadata`, and related `Classes`.
  - Authorization check that user belongs to institute.
  - Throws `InvalidOperationException` for unauthorized access.

### `AdministrationService.AddClassToMetadataType(Guid uniAdminIdentityId, Guid metadataId)`

- Location: `Backend/Administration/Services/AdministrationService.cs`
- Purpose: Create a new `UniClass` under a given metadata type and generate a class code.
- Output DTOs:
  - `ClassPrettyName` record (`Name`)
- Return type: `Task<ClassPrettyName>`
- Side effects:
  - Starts a DB transaction.
  - Reads `ClassMetadata` + institute admins for authorization.
  - Uses `pg_advisory_xact_lock` (keyed by metadata id) to serialize concurrent class creation per metadata.
  - Computes next class number using `Max(Number) + 1`.
  - Creates and inserts new `UniClass`.
  - Calls `UniClass.CreateClassCode()` and retries if generated code already exists.
  - Persists changes via `SaveChangesAsync`.
  - Commits transaction.
  - Throws `InvalidOperationException` if metadata invalid or unauthorized.

### `AdministrationService.UpdateClassMetaData(SerializedClassMetaData request, Guid uniAdminIdentityId)`

- Location: `Backend/Administration/Services/AdministrationService.cs`
- Purpose: Update editable fields of an existing `ClassMetadata`.
- Input DTOs:
  - `SerializedClassMetaData`
- Output DTOs:
  - `SerializedClassMetaData` (returns the same payload shape)
- Return type: `Task<SerializedClassMetaData>`
- Side effects:
  - Reads `ClassMetadata` + institute admins for authorization.
  - Updates `Level`, `LevelOfStudies`, `MaxTerms`, `Specialty`.
  - Does **not** update `MaxYears` (treated as immutable after creation).
  - Persists changes via `SaveChangesAsync`.
  - Throws `InvalidOperationException` if metadata id invalid or caller unauthorized.

### `StudentService.GetAllStudentCourses(Guid studentIdentityId)`

- Location: `Backend/StudentSpace/Services/StudentService.cs`
- Purpose: Fetch all courses linked to the student through class membership.
- Output DTOs:
  - `List<SerializedCourse>`
    - `Id`
    - `Name`
    - `Description`
    - `ProfessorFirstname`
    - `ProfessorLastname`
- Return type: `Task<List<SerializedCourse>>`
- Side effects:
  - Read-only query using `Courses`, related `UniClass.Students`, and `Professor`.
  - No DB writes.

### `StudentService.AddStudentToClass(Guid studentIdentityId, string classCode)`

- Location: `Backend/StudentSpace/Services/StudentService.cs`
- Purpose: Enroll a student in a class using a class code.
- Input DTOs: none (primitive parameters only)
- Return type: `Task`
- Side effects:
  - Reads `UniClasses` by `ClassCode`.
  - Reads `Students` by `IdentityId`.
  - Mutates class membership: adds student to `uniClass.Students`.
  - Persists changes via `SaveChangesAsync`.
  - Throws `InvalidOperationException` if class code invalid or student not found.

### `UniClass.CreateClassCode(int length = 6)`

- Location: `Backend/Auth/Entities/UniClass.cs`
- Purpose: Generate and assign a random alphanumeric class code.
- Input DTOs: none
- Return type: `string`
- Side effects:
  - Mutates entity state by setting `UniClass.ClassCode`.
  - Uses `RandomNumberGenerator.GetInt32(...)` for random character generation.

## Service Contracts (added)

### `IAdministrationService` (`Backend/Administration/Services/IAdministrationService.cs`)

- `Task AddNewClassMetaData(NewClassMetaDataRequest request, Guid uniAdminIdentityId)`
- `Task<List<SerializedClassMetaData>> GetAllClassMetaData(Guid instituteId, Guid uniAdminIdentityId, int pageNumber = 1, int pageSize = 10)`
- `Task<ClassPrettyName> AddClassToMetadataType(Guid uniAdminIdentityId, Guid metadataId)`
- `Task<SerializedClassMetaData> UpdateClassMetaData(SerializedClassMetaData request, Guid uniAdminIdentityId)`

### `IStudentService` (`Backend/StudentSpace/Services/IStudentService.cs`)

- `Task<List<SerializedCourse>> GetAllStudentCourses(Guid studentIdentityId)`
- `Task AddStudentToClass(Guid studentIdentityId, string classCode)`

### Implementations

- `AdministrationService : IAdministrationService`
- `StudentService : IStudentService`

## DI Registration

- Added in `Backend/Program.cs`:
  - `builder.Services.AddScoped<IAdministrationService, AdministrationService>();`
  - `builder.Services.AddScoped<IStudentService, StudentService>();`

## DTO Reference (added in this diff)

- `Backend/Administration/DataTransferObjects/Requests/NewClassMetaDataRequest.cs`
- `Backend/Administration/DataTransferObjects/Responses/SerializedClassMetaData.cs`
- `Backend/StudentSpace/DataTransferObjects/Responses/SerializedCourse.cs`
- `ClassPrettyName` record (declared in `NewClassMetaDataRequest.cs`)
