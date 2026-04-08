using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Energy.Api.Migrations;

/// <inheritdoc />
public partial class InitialCreate : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "energy_drinks",
            columns: table => new
            {
                id = table.Column<Guid>(type: "uuid", nullable: false),
                brand = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                line = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                flavor = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                volume_ml = table.Column<int>(type: "integer", nullable: false),
                expiration_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                quantity = table.Column<int>(type: "integer", nullable: false),
                caffeine_mg = table.Column<int>(type: "integer", nullable: true),
                sugar_grams = table.Column<int>(type: "integer", nullable: true),
                calories = table.Column<int>(type: "integer", nullable: true),
                is_sugar_free = table.Column<bool>(type: "boolean", nullable: false),
                country = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                image_url = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                is_active = table.Column<bool>(type: "boolean", nullable: false),
                created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_energy_drinks", x => x.id);
            });

        migrationBuilder.CreateIndex(
            name: "IX_energy_drinks_brand",
            table: "energy_drinks",
            column: "brand");

        migrationBuilder.CreateIndex(
            name: "IX_energy_drinks_expiration_date",
            table: "energy_drinks",
            column: "expiration_date");

        migrationBuilder.CreateIndex(
            name: "IX_energy_drinks_is_active",
            table: "energy_drinks",
            column: "is_active");

        migrationBuilder.CreateIndex(
            name: "IX_energy_drinks_brand_line_flavor_volume_ml",
            table: "energy_drinks",
            columns: new[] { "brand", "line", "flavor", "volume_ml" });
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "energy_drinks");
    }
}
