namespace Energy.Api.Dtos;

public sealed class UpdateEnergyDrinkRequest
{
    public string Brand { get; set; } = null!;
    public string? Line { get; set; }
    public string? Flavor { get; set; }
    public int VolumeMl { get; set; }
    public DateTime? ExpirationDate { get; set; }
    public decimal? Price { get; set; }
    public string? PriceCurrency { get; set; }
    public int Quantity { get; set; }
    public decimal? CaffeineMg { get; set; }
    public decimal? SugarGrams { get; set; }
    public decimal? Calories { get; set; }
    public bool IsSugarFree { get; set; }
    public string[]? Countries { get; set; }
    public string? ImageUrl { get; set; }
    public Models.CanFillState CanFillState { get; set; }
}
