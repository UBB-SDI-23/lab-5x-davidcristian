using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StoreAPI.Migrations
{
    /// <inheritdoc />
    public partial class mssqlazure_migration_901 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StoreEmployees_StoreEmployeeRoles_StoreEmployeeRoleId",
                table: "StoreEmployees");

            migrationBuilder.DropForeignKey(
                name: "FK_StoreShifts_StoreEmployees_StoreEmployeeId",
                table: "StoreShifts");

            migrationBuilder.DropForeignKey(
                name: "FK_StoreShifts_Stores_StoreId",
                table: "StoreShifts");

            migrationBuilder.DropForeignKey(
                name: "FK_UserProfiles_Users_UserId",
                table: "UserProfiles");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Users",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<long>(
                name: "UserId",
                table: "StoreShifts",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "UserId",
                table: "Stores",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "UserId",
                table: "StoreEmployees",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "UserId",
                table: "StoreEmployeeRoles",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Name",
                table: "Users",
                column: "Name",
                unique: true,
                filter: "[Name] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_StoreShifts_UserId",
                table: "StoreShifts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Stores_UserId",
                table: "Stores",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_StoreEmployees_UserId",
                table: "StoreEmployees",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_StoreEmployeeRoles_UserId",
                table: "StoreEmployeeRoles",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_StoreEmployeeRoles_Users_UserId",
                table: "StoreEmployeeRoles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StoreEmployees_StoreEmployeeRoles_StoreEmployeeRoleId",
                table: "StoreEmployees",
                column: "StoreEmployeeRoleId",
                principalTable: "StoreEmployeeRoles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StoreEmployees_Users_UserId",
                table: "StoreEmployees",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Stores_Users_UserId",
                table: "Stores",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StoreShifts_StoreEmployees_StoreEmployeeId",
                table: "StoreShifts",
                column: "StoreEmployeeId",
                principalTable: "StoreEmployees",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StoreShifts_Stores_StoreId",
                table: "StoreShifts",
                column: "StoreId",
                principalTable: "Stores",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StoreShifts_Users_UserId",
                table: "StoreShifts",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserProfiles_Users_UserId",
                table: "UserProfiles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StoreEmployeeRoles_Users_UserId",
                table: "StoreEmployeeRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_StoreEmployees_StoreEmployeeRoles_StoreEmployeeRoleId",
                table: "StoreEmployees");

            migrationBuilder.DropForeignKey(
                name: "FK_StoreEmployees_Users_UserId",
                table: "StoreEmployees");

            migrationBuilder.DropForeignKey(
                name: "FK_Stores_Users_UserId",
                table: "Stores");

            migrationBuilder.DropForeignKey(
                name: "FK_StoreShifts_StoreEmployees_StoreEmployeeId",
                table: "StoreShifts");

            migrationBuilder.DropForeignKey(
                name: "FK_StoreShifts_Stores_StoreId",
                table: "StoreShifts");

            migrationBuilder.DropForeignKey(
                name: "FK_StoreShifts_Users_UserId",
                table: "StoreShifts");

            migrationBuilder.DropForeignKey(
                name: "FK_UserProfiles_Users_UserId",
                table: "UserProfiles");

            migrationBuilder.DropIndex(
                name: "IX_Users_Name",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_StoreShifts_UserId",
                table: "StoreShifts");

            migrationBuilder.DropIndex(
                name: "IX_Stores_UserId",
                table: "Stores");

            migrationBuilder.DropIndex(
                name: "IX_StoreEmployees_UserId",
                table: "StoreEmployees");

            migrationBuilder.DropIndex(
                name: "IX_StoreEmployeeRoles_UserId",
                table: "StoreEmployeeRoles");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "StoreShifts");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Stores");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "StoreEmployees");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "StoreEmployeeRoles");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_StoreEmployees_StoreEmployeeRoles_StoreEmployeeRoleId",
                table: "StoreEmployees",
                column: "StoreEmployeeRoleId",
                principalTable: "StoreEmployeeRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StoreShifts_StoreEmployees_StoreEmployeeId",
                table: "StoreShifts",
                column: "StoreEmployeeId",
                principalTable: "StoreEmployees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StoreShifts_Stores_StoreId",
                table: "StoreShifts",
                column: "StoreId",
                principalTable: "Stores",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserProfiles_Users_UserId",
                table: "UserProfiles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
