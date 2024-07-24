using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpenseApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class TenthMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Incomes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Incomes");
        }
    }
}
