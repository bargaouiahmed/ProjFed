using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddedExtraFieldsForInstituteAndPendingJoinRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Institutes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Institutes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Institutes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PostalCode",
                table: "Institutes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "PendingJoinRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IdentityId = table.Column<Guid>(type: "uuid", nullable: false),
                    RequestedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: true),
                    ProofDocumentUrl = table.Column<string>(type: "text", nullable: false),
                    IdentityDocumentUrl = table.Column<string>(type: "text", nullable: false),
                    InstituteName = table.Column<string>(type: "text", nullable: false),
                    InstituteCountry = table.Column<string>(type: "text", nullable: false),
                    InstituteCity = table.Column<string>(type: "text", nullable: false),
                    InstitutePostalCode = table.Column<string>(type: "text", nullable: false),
                    ReviewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PendingJoinRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PendingJoinRequests_Identities_IdentityId",
                        column: x => x.IdentityId,
                        principalTable: "Identities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PendingJoinRequests_IdentityId",
                table: "PendingJoinRequests",
                column: "IdentityId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PendingJoinRequests");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Institutes");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Institutes");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Institutes");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "Institutes");
        }
    }
}
