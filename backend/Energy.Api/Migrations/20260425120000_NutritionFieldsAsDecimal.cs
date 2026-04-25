using Energy.Api.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Energy.Api.Migrations;

[DbContext(typeof(EnergyDbContext))]
[Migration("20260425120000_NutritionFieldsAsDecimal")]
public partial class NutritionFieldsAsDecimal : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("""
            ALTER TABLE energy_drinks
              ALTER COLUMN caffeine_mg TYPE numeric(7,2) USING caffeine_mg::numeric,
              ALTER COLUMN sugar_grams TYPE numeric(7,2) USING sugar_grams::numeric,
              ALTER COLUMN calories TYPE numeric(8,2) USING calories::numeric;
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("""
            ALTER TABLE energy_drinks
              ALTER COLUMN caffeine_mg TYPE integer USING round(caffeine_mg)::integer,
              ALTER COLUMN sugar_grams TYPE integer USING round(sugar_grams)::integer,
              ALTER COLUMN calories TYPE integer USING round(calories)::integer;
            """);
    }
}
