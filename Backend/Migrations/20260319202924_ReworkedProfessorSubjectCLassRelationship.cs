using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class ReworkedProfessorSubjectCLassRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProfessorUniClasses");

            migrationBuilder.RenameColumn(
                name: "Semester",
                table: "UniClasses",
                newName: "Term");

            migrationBuilder.RenameColumn(
                name: "Semester",
                table: "SubjectPerClasses",
                newName: "Term");

            migrationBuilder.CreateTable(
                name: "ProfessorUniClassSubjects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfId = table.Column<Guid>(type: "uuid", nullable: false),
                    UniClassId = table.Column<Guid>(type: "uuid", nullable: false),
                    SubjectPerClassId = table.Column<Guid>(type: "uuid", nullable: false)
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProfessorUniClassSubjects");

            migrationBuilder.RenameColumn(
                name: "Term",
                table: "UniClasses",
                newName: "Semester");

            migrationBuilder.RenameColumn(
                name: "Term",
                table: "SubjectPerClasses",
                newName: "Semester");

            migrationBuilder.CreateTable(
                name: "ProfessorUniClasses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfId = table.Column<Guid>(type: "uuid", nullable: false),
                    UniClassId = table.Column<Guid>(type: "uuid", nullable: false),
                    Semester = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessorUniClasses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfessorUniClasses_Professors_ProfId",
                        column: x => x.ProfId,
                        principalTable: "Professors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfessorUniClasses_UniClasses_UniClassId",
                        column: x => x.UniClassId,
                        principalTable: "UniClasses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorUniClasses_ProfId",
                table: "ProfessorUniClasses",
                column: "ProfId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorUniClasses_UniClassId",
                table: "ProfessorUniClasses",
                column: "UniClassId");
        }
    }
}
