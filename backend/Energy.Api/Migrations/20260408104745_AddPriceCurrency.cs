using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Energy.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPriceCurrency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "price_currency",
                table: "energy_drinks",
                type: "character varying(3)",
                maxLength: 3,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "price_currency",
                table: "energy_drinks");
        }
    }
}
