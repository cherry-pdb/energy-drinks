using Energy.Api.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Energy.Api.Migrations;

[DbContext(typeof(EnergyDbContext))]
[Migration("20260408190000_MakeExpirationDateNullable")]
public partial class MakeExpirationDateNullable : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AlterColumn<DateTime>(
            name: "expiration_date",
            table: "energy_drinks",
            type: "timestamp with time zone",
            nullable: true,
            oldClrType: typeof(DateTime),
            oldType: "timestamp with time zone");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("UPDATE energy_drinks SET expiration_date = NOW() WHERE expiration_date IS NULL;");

        migrationBuilder.AlterColumn<DateTime>(
            name: "expiration_date",
            table: "energy_drinks",
            type: "timestamp with time zone",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "timestamp with time zone",
            oldNullable: true);
    }
}

