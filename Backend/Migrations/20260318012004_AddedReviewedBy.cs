using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddedReviewedBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "IdentityReviewedBy",
                table: "PendingJoinRequests",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_PendingJoinRequests_IdentityReviewedBy",
                table: "PendingJoinRequests",
                column: "IdentityReviewedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_PendingJoinRequests_Identities_IdentityReviewedBy",
                table: "PendingJoinRequests",
                column: "IdentityReviewedBy",
                principalTable: "Identities",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PendingJoinRequests_Identities_IdentityReviewedBy",
                table: "PendingJoinRequests");

            migrationBuilder.DropIndex(
                name: "IX_PendingJoinRequests_IdentityReviewedBy",
                table: "PendingJoinRequests");

            migrationBuilder.DropColumn(
                name: "IdentityReviewedBy",
                table: "PendingJoinRequests");
        }
    }
}
