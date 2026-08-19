using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookQuotesApi.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueBookTitlePerUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Books_UserId",
                table: "Books");

            migrationBuilder.CreateIndex(
                name: "IX_Books_UserId_Title",
                table: "Books",
                columns: new[] { "UserId", "Title" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Books_UserId_Title",
                table: "Books");

            migrationBuilder.CreateIndex(
                name: "IX_Books_UserId",
                table: "Books",
                column: "UserId");
        }
    }
}
