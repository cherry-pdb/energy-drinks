using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Energy.Api.Data;

public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<EnergyDbContext>
{
    public EnergyDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<EnergyDbContext>();
        var connectionString = Environment.GetEnvironmentVariable("ENERGY_DB_CONNECTION")
                               ?? "Host=localhost;Port=5432;Database=energydb;Username=postgres;Password=postgres";
        optionsBuilder.UseNpgsql(connectionString);
        return new EnergyDbContext(optionsBuilder.Options);
    }
}
