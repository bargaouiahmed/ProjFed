using System;
using Backend.Database.Auth;
using Backend.StudentSpace.DataTransferObjects.Responses;
using Microsoft.EntityFrameworkCore;

namespace Backend.StudentSpace.Services;

public class StudentService(AppDbContext db) : IStudentService
{

    //implement a method to get all courses of a student
    public async Task<List<SerializedCourse>> GetAllStudentCourses(Guid studentIdentityId)
    {
        var courses = await db.Courses.Include(c => c.UniClass).ThenInclude(unic => unic.Students).Include(c => c.Professor).Where(c => c.UniClass.Students.Any(s => s.IdentityId == studentIdentityId)).ToListAsync();
        return [.. courses.Select(c =>
        {
            return new SerializedCourse
            {
                Id = c.Id,
                Name=c.Name,
                Description=c.Description,
                ProfessorFirstname=c.Professor.Firstname,
                ProfessorLastname=c.Professor.Lastname,

            };
        })];

    }
    public async Task AddStudentToClass(Guid studentIdentityId, string classCode)
    {
        var uniClass = await db.UniClasses.Include(c => c.Students).FirstOrDefaultAsync(c => c.ClassCode == classCode) ?? throw new InvalidOperationException("Invalid class code");
        var student = await db.Students.FirstOrDefaultAsync(s => s.IdentityId == studentIdentityId) ?? throw new InvalidOperationException("student not found");
        uniClass.Students.Add(student);
        await db.SaveChangesAsync();
    }
















}
