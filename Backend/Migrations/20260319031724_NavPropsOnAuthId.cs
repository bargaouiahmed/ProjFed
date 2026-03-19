using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class NavPropsOnAuthId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AdminUserId",
                table: "Identities",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ProfessorId",
                table: "Identities",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "StudentId",
                table: "Identities",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UniUserId",
                table: "Identities",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Identities_AdminUserId",
                table: "Identities",
                column: "AdminUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Identities_ProfessorId",
                table: "Identities",
                column: "ProfessorId");

            migrationBuilder.CreateIndex(
                name: "IX_Identities_StudentId",
                table: "Identities",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Identities_UniUserId",
                table: "Identities",
                column: "UniUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Identities_AdminUsers_AdminUserId",
                table: "Identities",
                column: "AdminUserId",
                principalTable: "AdminUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Identities_Professors_ProfessorId",
                table: "Identities",
                column: "ProfessorId",
                principalTable: "Professors",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Identities_Students_StudentId",
                table: "Identities",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Identities_UniUsers_UniUserId",
                table: "Identities",
                column: "UniUserId",
                principalTable: "UniUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Identities_AdminUsers_AdminUserId",
                table: "Identities");

            migrationBuilder.DropForeignKey(
                name: "FK_Identities_Professors_ProfessorId",
                table: "Identities");

            migrationBuilder.DropForeignKey(
                name: "FK_Identities_Students_StudentId",
                table: "Identities");

            migrationBuilder.DropForeignKey(
                name: "FK_Identities_UniUsers_UniUserId",
                table: "Identities");

            migrationBuilder.DropIndex(
                name: "IX_Identities_AdminUserId",
                table: "Identities");

            migrationBuilder.DropIndex(
                name: "IX_Identities_ProfessorId",
                table: "Identities");

            migrationBuilder.DropIndex(
                name: "IX_Identities_StudentId",
                table: "Identities");

            migrationBuilder.DropIndex(
                name: "IX_Identities_UniUserId",
                table: "Identities");

            migrationBuilder.DropColumn(
                name: "AdminUserId",
                table: "Identities");

            migrationBuilder.DropColumn(
                name: "ProfessorId",
                table: "Identities");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "Identities");

            migrationBuilder.DropColumn(
                name: "UniUserId",
                table: "Identities");
        }
    }
}
