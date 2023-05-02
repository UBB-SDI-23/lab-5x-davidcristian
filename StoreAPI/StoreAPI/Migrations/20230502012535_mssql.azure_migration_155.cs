using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StoreAPI.Migrations
{
    /// <inheritdoc />
    public partial class mssqlazure_migration_155 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "AccessLevel",
                table: "Users",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccessLevel",
                table: "Users");
        }
    }
}
