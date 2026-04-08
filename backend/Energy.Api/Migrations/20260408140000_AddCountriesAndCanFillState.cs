using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Energy.Api.Migrations;

public partial class AddCountriesAndCanFillState : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string[]>(
            name: "countries",
            table: "energy_drinks",
            type: "text[]",
            nullable: true);

        migrationBuilder.AddColumn<int>(
            name: "can_fill_state",
            table: "energy_drinks",
            type: "integer",
            nullable: false,
            defaultValue: 1);

        migrationBuilder.Sql(@"
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'energy_drinks' AND column_name = 'is_active'
  ) THEN
    UPDATE energy_drinks
    SET can_fill_state = CASE WHEN is_active THEN 1 ELSE 0 END;
  END IF;
END $$;
");

        migrationBuilder.Sql(@"
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'energy_drinks' AND column_name = 'country'
  ) THEN
    ALTER TABLE energy_drinks DROP COLUMN country;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'energy_drinks' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE energy_drinks DROP COLUMN is_active;
  END IF;
END $$;
");

        migrationBuilder.CreateIndex(
            name: "IX_energy_drinks_can_fill_state",
            table: "energy_drinks",
            column: "can_fill_state");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(
            name: "IX_energy_drinks_can_fill_state",
            table: "energy_drinks");

        migrationBuilder.DropColumn(
            name: "countries",
            table: "energy_drinks");

        migrationBuilder.DropColumn(
            name: "can_fill_state",
            table: "energy_drinks");

    }
}

