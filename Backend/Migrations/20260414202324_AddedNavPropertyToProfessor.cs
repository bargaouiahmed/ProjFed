using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddedNavPropertyToProfessor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Identities_Professors_ProfessorId",
                table: "Identities");

            migrationBuilder.DropIndex(
                name: "IX_Identities_ProfessorId",
                table: "Identities");

            migrationBuilder.DropColumn(
                name: "ProfessorId",
                table: "Identities");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ProfessorId",
                table: "Identities",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Identities_ProfessorId",
                table: "Identities",
                column: "ProfessorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Identities_Professors_ProfessorId",
                table: "Identities",
                column: "ProfessorId",
                principalTable: "Professors",
                principalColumn: "Id");
        }
    }
}
