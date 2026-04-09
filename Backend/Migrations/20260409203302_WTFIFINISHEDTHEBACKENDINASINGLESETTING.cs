using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class WTFIFINISHEDTHEBACKENDINASINGLESETTING : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "ProfessorId",
                table: "Courses",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.CreateTable(
                name: "Chapters",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    AttachmentUrls = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chapters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Chapters_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Exams",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    TotalMarks = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Exams_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    TotalMarks = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tests_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MCQs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ExamId = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionText = table.Column<string>(type: "text", nullable: false),
                    Options = table.Column<string>(type: "text", nullable: false),
                    CorrectOptions = table.Column<string>(type: "text", nullable: false),
                    QuestionMark = table.Column<int>(type: "integer", nullable: false),
                    Explanation = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AttachmentUrls = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MCQs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MCQs_Exams_ExamId",
                        column: x => x.ExamId,
                        principalTable: "Exams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RedactionQuestions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ExamId = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionText = table.Column<string>(type: "text", nullable: false),
                    QuestionMark = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AttachmentUrls = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RedactionQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RedactionQuestions_Exams_ExamId",
                        column: x => x.ExamId,
                        principalTable: "Exams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TestMCQs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TestId = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionText = table.Column<string>(type: "text", nullable: false),
                    Options = table.Column<string>(type: "text", nullable: false),
                    CorrectOptions = table.Column<string>(type: "text", nullable: false),
                    QuestionMark = table.Column<int>(type: "integer", nullable: false),
                    Explanation = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AttachmentUrls = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestMCQs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TestMCQs_Tests_TestId",
                        column: x => x.TestId,
                        principalTable: "Tests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TestRedactionQuestions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TestId = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionText = table.Column<string>(type: "text", nullable: false),
                    QuestionMark = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AttachmentUrls = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestRedactionQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TestRedactionQuestions_Tests_TestId",
                        column: x => x.TestId,
                        principalTable: "Tests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ResponseMCQs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MCQId = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    SelectedOptionIndex = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResponseMCQs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResponseMCQs_MCQs_MCQId",
                        column: x => x.MCQId,
                        principalTable: "MCQs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ResponseMCQs_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ResponseRedactionQuestions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RedactionQuestionId = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    AnswerText = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResponseRedactionQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResponseRedactionQuestions_RedactionQuestions_RedactionQues~",
                        column: x => x.RedactionQuestionId,
                        principalTable: "RedactionQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ResponseRedactionQuestions_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ResponseTestMCQs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TestMCQId = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    SelectedOptionIndex = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResponseTestMCQs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResponseTestMCQs_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ResponseTestMCQs_TestMCQs_TestMCQId",
                        column: x => x.TestMCQId,
                        principalTable: "TestMCQs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ResponseTestRedactionQuestions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TestRedactionQuestionId = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    AnswerText = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResponseTestRedactionQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResponseTestRedactionQuestions_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ResponseTestRedactionQuestions_TestRedactionQuestions_TestR~",
                        column: x => x.TestRedactionQuestionId,
                        principalTable: "TestRedactionQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Chapters_CourseId",
                table: "Chapters",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_CourseId",
                table: "Exams",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_MCQs_ExamId",
                table: "MCQs",
                column: "ExamId");

            migrationBuilder.CreateIndex(
                name: "IX_RedactionQuestions_ExamId",
                table: "RedactionQuestions",
                column: "ExamId");

            migrationBuilder.CreateIndex(
                name: "IX_ResponseMCQs_MCQId",
                table: "ResponseMCQs",
                column: "MCQId");

            migrationBuilder.CreateIndex(
                name: "IX_ResponseMCQs_StudentId",
                table: "ResponseMCQs",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_ResponseRedactionQuestions_RedactionQuestionId",
                table: "ResponseRedactionQuestions",
                column: "RedactionQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_ResponseRedactionQuestions_StudentId",
                table: "ResponseRedactionQuestions",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_ResponseTestMCQs_StudentId",
                table: "ResponseTestMCQs",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_ResponseTestMCQs_TestMCQId",
                table: "ResponseTestMCQs",
                column: "TestMCQId");

            migrationBuilder.CreateIndex(
                name: "IX_ResponseTestRedactionQuestions_StudentId",
                table: "ResponseTestRedactionQuestions",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_ResponseTestRedactionQuestions_TestRedactionQuestionId",
                table: "ResponseTestRedactionQuestions",
                column: "TestRedactionQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_TestMCQs_TestId",
                table: "TestMCQs",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_TestRedactionQuestions_TestId",
                table: "TestRedactionQuestions",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_Tests_CourseId",
                table: "Tests",
                column: "CourseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Chapters");

            migrationBuilder.DropTable(
                name: "ResponseMCQs");

            migrationBuilder.DropTable(
                name: "ResponseRedactionQuestions");

            migrationBuilder.DropTable(
                name: "ResponseTestMCQs");

            migrationBuilder.DropTable(
                name: "ResponseTestRedactionQuestions");

            migrationBuilder.DropTable(
                name: "MCQs");

            migrationBuilder.DropTable(
                name: "RedactionQuestions");

            migrationBuilder.DropTable(
                name: "TestMCQs");

            migrationBuilder.DropTable(
                name: "TestRedactionQuestions");

            migrationBuilder.DropTable(
                name: "Exams");

            migrationBuilder.DropTable(
                name: "Tests");

            migrationBuilder.AlterColumn<Guid>(
                name: "ProfessorId",
                table: "Courses",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);
        }
    }
}
