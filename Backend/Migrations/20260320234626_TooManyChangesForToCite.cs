using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class TooManyChangesForToCite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProfessorUniClassSubjects");

            migrationBuilder.DropTable(
                name: "SubjectPerClasses");

            migrationBuilder.DropColumn(
                name: "Term",
                table: "UniClasses");

            migrationBuilder.AddColumn<int>(
                name: "CurrentTerm",
                table: "ClassMetadata",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MaxTerms",
                table: "ClassMetadata",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Term = table.Column<int>(type: "integer", nullable: false),
                    UniClassId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfessorId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Courses_Professors_ProfessorId",
                        column: x => x.ProfessorId,
                        principalTable: "Professors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Courses_UniClasses_UniClassId",
                        column: x => x.UniClassId,
                        principalTable: "UniClasses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Courses_ProfessorId",
                table: "Courses",
                column: "ProfessorId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_UniClassId",
                table: "Courses",
                column: "UniClassId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropColumn(
                name: "CurrentTerm",
                table: "ClassMetadata");

            migrationBuilder.DropColumn(
                name: "MaxTerms",
                table: "ClassMetadata");

            migrationBuilder.AddColumn<int>(
                name: "Term",
                table: "UniClasses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "SubjectPerClasses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassMetadataId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsOptional = table.Column<bool>(type: "boolean", nullable: false),
                    Term = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubjectPerClasses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SubjectPerClasses_ClassMetadata_ClassMetadataId",
                        column: x => x.ClassMetadataId,
                        principalTable: "ClassMetadata",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProfessorUniClassSubjects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfId = table.Column<Guid>(type: "uuid", nullable: false),
                    SubjectPerClassId = table.Column<Guid>(type: "uuid", nullable: false),
                    UniClassId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessorUniClassSubjects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfessorUniClassSubjects_Professors_ProfId",
                        column: x => x.ProfId,
                        principalTable: "Professors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfessorUniClassSubjects_SubjectPerClasses_SubjectPerClass~",
                        column: x => x.SubjectPerClassId,
                        principalTable: "SubjectPerClasses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfessorUniClassSubjects_UniClasses_UniClassId",
                        column: x => x.UniClassId,
                        principalTable: "UniClasses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorUniClassSubjects_ProfId",
                table: "ProfessorUniClassSubjects",
                column: "ProfId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorUniClassSubjects_SubjectPerClassId",
                table: "ProfessorUniClassSubjects",
                column: "SubjectPerClassId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorUniClassSubjects_UniClassId",
                table: "ProfessorUniClassSubjects",
                column: "UniClassId");

            migrationBuilder.CreateIndex(
                name: "IX_SubjectPerClasses_ClassMetadataId",
                table: "SubjectPerClasses",
                column: "ClassMetadataId");
        }
    }
}
