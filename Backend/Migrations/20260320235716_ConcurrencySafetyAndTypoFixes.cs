using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class ConcurrencySafetyAndTypoFixes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_UniClasses_MetadataId",
                table: "UniClasses");

            migrationBuilder.CreateIndex(
                name: "IX_UniClasses_ClassCode",
                table: "UniClasses",
                column: "ClassCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UniClasses_MetadataId_Number",
                table: "UniClasses",
                columns: new[] { "MetadataId", "Number" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_UniClasses_ClassCode",
                table: "UniClasses");

            migrationBuilder.DropIndex(
                name: "IX_UniClasses_MetadataId_Number",
                table: "UniClasses");

            migrationBuilder.CreateIndex(
                name: "IX_UniClasses_MetadataId",
                table: "UniClasses",
                column: "MetadataId");
        }
    }
}
