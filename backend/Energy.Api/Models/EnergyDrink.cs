namespace Energy.Api.Models;

public sealed class EnergyDrink
{
    public Guid Id { get; set; }
    public string Brand { get; set; } = null!;
    public string? Line { get; set; }
    public string? Flavor { get; set; }
    public int VolumeMl { get; set; }
    public DateTime ExpirationDate { get; set; }
    public decimal? Price { get; set; }
    public string? PriceCurrency { get; set; }
    public int Quantity { get; set; }
    public int? CaffeineMg { get; set; }
    public int? SugarGrams { get; set; }
    public int? Calories { get; set; }
    public bool IsSugarFree { get; set; }
    public string[]? Countries { get; set; }
    public string? ImageUrl { get; set; }
    public CanFillState CanFillState { get; set; } = CanFillState.Full;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
