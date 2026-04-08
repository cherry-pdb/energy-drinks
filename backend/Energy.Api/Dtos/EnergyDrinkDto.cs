namespace Energy.Api.Dtos;

public sealed class EnergyDrinkDto
{
    public Guid Id { get; set; }
    public string Brand { get; set; } = null!;
    public string? Line { get; set; }
    public string? Flavor { get; set; }
    public int VolumeMl { get; set; }
    public DateTime? ExpirationDate { get; set; }
    public decimal? Price { get; set; }
    public string? PriceCurrency { get; set; }
    public int Quantity { get; set; }
    public int? CaffeineMg { get; set; }
    public int? SugarGrams { get; set; }
    public int? Calories { get; set; }
    public bool IsSugarFree { get; set; }
    public string[]? Countries { get; set; }
    public string? ImageUrl { get; set; }
    public Models.CanFillState CanFillState { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string DisplayName => string.Join(" ", new[] { Brand, Line, Flavor }.Where(x => !string.IsNullOrWhiteSpace(x)));
}
