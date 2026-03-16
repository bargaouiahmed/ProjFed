using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Identities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    HashedPassword = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    RefreshToken = table.Column<string>(type: "text", nullable: true),
                    RefreshTokenExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ActivateAccountToken = table.Column<string>(type: "text", nullable: true),
                    ActivateAccountTokenExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PasswordResetToken = table.Column<string>(type: "text", nullable: true),
                    PasswordResetTokenExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Identities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Institutes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Institutes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AdminUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IdentityId = table.Column<Guid>(type: "uuid", nullable: false),
                    Firstname = table.Column<string>(type: "text", nullable: false),
                    Lastname = table.Column<string>(type: "text", nullable: false),
                    PfpUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AdminUsers_Identities_IdentityId",
                        column: x => x.IdentityId,
                        principalTable: "Identities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Professors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IdentityId = table.Column<Guid>(type: "uuid", nullable: false),
                    Firstname = table.Column<string>(type: "text", nullable: false),
                    Lasttname = table.Column<string>(type: "text", nullable: false),
                    PfpUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Professors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Professors_Identities_IdentityId",
                        column: x => x.IdentityId,
                        principalTable: "Identities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClassMetadata",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    InstituteId = table.Column<Guid>(type: "uuid", nullable: false),
                    LevelOfStudies = table.Column<string>(type: "text", nullable: false),
                    Specialty = table.Column<string>(type: "text", nullable: false),
                    MaxYears = table.Column<int>(type: "integer", nullable: false),
                    Level = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassMetadata", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClassMetadata_Institutes_InstituteId",
                        column: x => x.InstituteId,
                        principalTable: "Institutes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UniUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IdentityId = table.Column<Guid>(type: "uuid", nullable: false),
                    InstutiteId = table.Column<Guid>(type: "uuid", nullable: false),
                    Firstname = table.Column<string>(type: "text", nullable: false),
                    Lastname = table.Column<string>(type: "text", nullable: false),
                    PfpUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UniUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UniUsers_Identities_IdentityId",
                        column: x => x.IdentityId,
                        principalTable: "Identities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UniUsers_Institutes_InstutiteId",
                        column: x => x.InstutiteId,
                        principalTable: "Institutes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SubjectPerClasses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassMetadataId = table.Column<Guid>(type: "uuid", nullable: false),
                    Semester = table.Column<int>(type: "integer", nullable: false),
                    IsOptional = table.Column<bool>(type: "boolean", nullable: false)
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
                name: "UniClasses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MetadataId = table.Column<Guid>(type: "uuid", nullable: false),
                    Number = table.Column<int>(type: "integer", nullable: false),
                    Semester = table.Column<int>(type: "integer", nullable: false),
                    ClassCode = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UniClasses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UniClasses_ClassMetadata_MetadataId",
                        column: x => x.MetadataId,
                        principalTable: "ClassMetadata",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IdentityId = table.Column<Guid>(type: "uuid", nullable: false),
                    UniClassId = table.Column<Guid>(type: "uuid", nullable: false),
                    Firstname = table.Column<string>(type: "text", nullable: false),
                    Lastname = table.Column<string>(type: "text", nullable: false),
                    PfpUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Students_Identities_IdentityId",
                        column: x => x.IdentityId,
                        principalTable: "Identities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Students_UniClasses_UniClassId",
                        column: x => x.UniClassId,
                        principalTable: "UniClasses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdminUsers_IdentityId",
                table: "AdminUsers",
                column: "IdentityId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClassMetadata_InstituteId",
                table: "ClassMetadata",
                column: "InstituteId");

            migrationBuilder.CreateIndex(
                name: "IX_Professors_IdentityId",
                table: "Professors",
                column: "IdentityId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorUniClasses_ProfId",
                table: "ProfessorUniClasses",
                column: "ProfId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorUniClasses_UniClassId",
                table: "ProfessorUniClasses",
                column: "UniClassId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_IdentityId",
                table: "Students",
                column: "IdentityId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Students_UniClassId",
                table: "Students",
                column: "UniClassId");

            migrationBuilder.CreateIndex(
                name: "IX_SubjectPerClasses_ClassMetadataId",
                table: "SubjectPerClasses",
                column: "ClassMetadataId");

            migrationBuilder.CreateIndex(
                name: "IX_UniClasses_MetadataId",
                table: "UniClasses",
                column: "MetadataId");

            migrationBuilder.CreateIndex(
                name: "IX_UniUsers_IdentityId",
                table: "UniUsers",
                column: "IdentityId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UniUsers_InstutiteId",
                table: "UniUsers",
                column: "InstutiteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminUsers");

            migrationBuilder.DropTable(
                name: "ProfessorUniClasses");

            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "SubjectPerClasses");

            migrationBuilder.DropTable(
                name: "UniUsers");

            migrationBuilder.DropTable(
                name: "Professors");

            migrationBuilder.DropTable(
                name: "UniClasses");

            migrationBuilder.DropTable(
                name: "Identities");

            migrationBuilder.DropTable(
                name: "ClassMetadata");

            migrationBuilder.DropTable(
                name: "Institutes");
        }
    }
}
