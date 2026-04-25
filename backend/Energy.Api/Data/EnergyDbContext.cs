using Energy.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Energy.Api.Data;

public sealed class EnergyDbContext : DbContext
{
    public EnergyDbContext(DbContextOptions<EnergyDbContext> options) : base(options) { }

    public DbSet<EnergyDrink> EnergyDrinks => Set<EnergyDrink>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var entity = modelBuilder.Entity<EnergyDrink>();

        entity.ToTable("energy_drinks");
        entity.HasKey(x => x.Id);

        entity.Property(x => x.Id).HasColumnName("id");
        entity.Property(x => x.Brand).HasColumnName("brand").HasMaxLength(100).IsRequired();
        entity.Property(x => x.Line).HasColumnName("line").HasMaxLength(100);
        entity.Property(x => x.Flavor).HasColumnName("flavor").HasMaxLength(100);
        entity.Property(x => x.VolumeMl).HasColumnName("volume_ml");
        entity.Property(x => x.ExpirationDate).HasColumnName("expiration_date");
        entity.Property(x => x.Price).HasColumnName("price").HasPrecision(10, 2);
        entity.Property(x => x.PriceCurrency).HasColumnName("price_currency").HasMaxLength(3);
        entity.Property(x => x.Quantity).HasColumnName("quantity");
        entity.Property(x => x.CaffeineMg).HasColumnName("caffeine_mg").HasPrecision(7, 2);
        entity.Property(x => x.SugarGrams).HasColumnName("sugar_grams").HasPrecision(7, 2);
        entity.Property(x => x.Calories).HasColumnName("calories").HasPrecision(8, 2);
        entity.Property(x => x.IsSugarFree).HasColumnName("is_sugar_free");
        entity.Property(x => x.Countries).HasColumnName("countries").HasColumnType("text[]");
        entity.Property(x => x.ImageUrl).HasColumnName("image_url").HasMaxLength(1000);
        entity.Property(x => x.CanFillState).HasColumnName("can_fill_state");
        entity.Property(x => x.CreatedAt).HasColumnName("created_at");
        entity.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        entity.HasIndex(x => x.Brand);
        entity.HasIndex(x => x.ExpirationDate);
        entity.HasIndex(x => x.CanFillState);
        entity.HasIndex(x => new { x.Brand, x.Line, x.Flavor, x.VolumeMl });
    }
}
