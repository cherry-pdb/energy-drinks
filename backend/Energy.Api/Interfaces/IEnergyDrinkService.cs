using Energy.Api.Dtos;

namespace Energy.Api.Interfaces;

public interface IEnergyDrinkService
{
    Task<List<EnergyDrinkDto>> GetAllAsync(string? search, string? brand, string? country, bool? isSugarFree, bool onlyFull, CancellationToken ct);

    Task<PagedResult<EnergyDrinkDto>> GetPagedAsync(string? search, string? brand, string? country, bool? isSugarFree, bool onlyFull, int page, int pageSize, CancellationToken ct);

    Task<List<string>> GetBrandsAsync(CancellationToken ct);

    Task<EnergyDrinkDto?> GetByIdAsync(Guid id, CancellationToken ct);

    Task<EnergyDrinkDto> CreateAsync(CreateEnergyDrinkRequest request, CancellationToken ct);

    Task<EnergyDrinkDto?> UpdateAsync(Guid id, UpdateEnergyDrinkRequest request, CancellationToken ct);

    Task<EnergyDrinkDto?> MarkDrankAsync(Guid id, CancellationToken ct);

    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}
