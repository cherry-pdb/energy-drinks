using Energy.Api.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Energy.Api.Migrations;

[DbContext(typeof(EnergyDbContext))]
[Migration("20260408180000_RepairEnergyDrinksCountriesAndCanFill")]
public partial class RepairEnergyDrinksCountriesAndCanFill : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            """
            ALTER TABLE energy_drinks ADD COLUMN IF NOT EXISTS countries text[];

            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = 'energy_drinks' AND column_name = 'can_fill_state'
              ) THEN
                ALTER TABLE energy_drinks ADD COLUMN can_fill_state integer NOT NULL DEFAULT 1;
              END IF;
            END $$;

            DO $$
            BEGIN
              IF EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = 'energy_drinks' AND column_name = 'is_active'
              ) THEN
                UPDATE energy_drinks SET can_fill_state = CASE WHEN is_active THEN 1 ELSE 0 END;
              END IF;
            END $$;

            DO $$
            BEGIN
              IF EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = 'energy_drinks' AND column_name = 'country'
              ) THEN
                UPDATE energy_drinks
                SET countries = CASE
                  WHEN country IS NULL OR btrim(country) = '' THEN NULL
                  ELSE ARRAY[btrim(country)]::text[]
                END
                WHERE countries IS NULL;
              END IF;
            END $$;

            DROP INDEX IF EXISTS "IX_energy_drinks_is_active";

            ALTER TABLE energy_drinks DROP COLUMN IF EXISTS country;
            ALTER TABLE energy_drinks DROP COLUMN IF EXISTS is_active;

            CREATE INDEX IF NOT EXISTS "IX_energy_drinks_can_fill_state" ON energy_drinks (can_fill_state);
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
    }
}
