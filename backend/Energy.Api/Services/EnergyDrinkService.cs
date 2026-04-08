using Energy.Api.Data;
using Energy.Api.Dtos;
using Energy.Api.Interfaces;
using Energy.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Energy.Api.Services;

public sealed class EnergyDrinkService : IEnergyDrinkService
{
    private readonly EnergyDbContext _db;

    public EnergyDrinkService(EnergyDbContext db)
    {
        _db = db;
    }

    public async Task<List<EnergyDrinkDto>> GetAllAsync(string? search, string? brand, bool? isSugarFree, bool onlyFull, CancellationToken ct)
    {
        return await BuildBaseQuery(search, brand, isSugarFree, onlyFull)
            .Select(ProjectToDto())
            .ToListAsync(ct);
    }

    public async Task<PagedResult<EnergyDrinkDto>> GetPagedAsync(string? search, string? brand, bool? isSugarFree, bool onlyFull, int page, int pageSize, CancellationToken ct)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 1;
        if (pageSize > 200) pageSize = 200;

        var baseQuery = BuildBaseQuery(search, brand, isSugarFree, onlyFull);
        var total = await baseQuery.CountAsync(ct);

        var items = await baseQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(ProjectToDto())
            .ToListAsync(ct);

        return new PagedResult<EnergyDrinkDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    private IQueryable<EnergyDrink> BuildBaseQuery(string? search, string? brand, bool? isSugarFree, bool onlyFull)
    {
        var query = _db.EnergyDrinks.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim().ToLower();
            query = query.Where(x =>
                x.Brand.ToLower().Contains(search) ||
                (x.Line != null && x.Line.ToLower().Contains(search)) ||
                (x.Flavor != null && x.Flavor.ToLower().Contains(search)));
        }

        if (!string.IsNullOrWhiteSpace(brand))
            query = query.Where(x => x.Brand == brand);

        if (isSugarFree.HasValue)
            query = query.Where(x => x.IsSugarFree == isSugarFree.Value);

        if (onlyFull)
            query = query.Where(x => x.CanFillState == CanFillState.Full);

        return query
            .OrderBy(x => x.ExpirationDate)
            .ThenBy(x => x.Brand)
            .ThenBy(x => x.Id);
    }

    private static System.Linq.Expressions.Expression<Func<EnergyDrink, EnergyDrinkDto>> ProjectToDto()
        => x => new EnergyDrinkDto
        {
            Id = x.Id,
            Brand = x.Brand,
            Line = x.Line,
            Flavor = x.Flavor,
            VolumeMl = x.VolumeMl,
            ExpirationDate = x.ExpirationDate,
            Price = x.Price,
            Quantity = x.Quantity,
            CaffeineMg = x.CaffeineMg,
            SugarGrams = x.SugarGrams,
            Calories = x.Calories,
            IsSugarFree = x.IsSugarFree,
            Countries = x.Countries,
            ImageUrl = x.ImageUrl,
            CanFillState = x.CanFillState,
            CreatedAt = x.CreatedAt,
            UpdatedAt = x.UpdatedAt
        };

    public async Task<List<string>> GetBrandsAsync(CancellationToken ct)
        => await _db.EnergyDrinks.AsNoTracking()
            .Select(x => x.Brand)
            .Distinct()
            .OrderBy(x => x)
            .ToListAsync(ct);

    public async Task<EnergyDrinkDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var entity = await _db.EnergyDrinks.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);
        return entity is null ? null : Map(entity);
    }

    public async Task<EnergyDrinkDto> CreateAsync(CreateEnergyDrinkRequest request, CancellationToken ct)
    {
        var expirationUtc = NormalizeToUtc(request.ExpirationDate);
        var currency = NormalizeCurrency(request.PriceCurrency);
        var entity = new EnergyDrink
        {
            Id = Guid.NewGuid(),
            Brand = request.Brand,
            Line = request.Line,
            Flavor = request.Flavor,
            VolumeMl = request.VolumeMl,
            ExpirationDate = expirationUtc,
            Price = request.Price,
            PriceCurrency = currency,
            Quantity = request.Quantity,
            CaffeineMg = request.CaffeineMg,
            SugarGrams = request.SugarGrams,
            Calories = request.Calories,
            IsSugarFree = request.IsSugarFree,
            Countries = request.Countries,
            ImageUrl = request.ImageUrl,
            CanFillState = request.CanFillState,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.EnergyDrinks.Add(entity);
        await _db.SaveChangesAsync(ct);

        return Map(entity);
    }

    public async Task<EnergyDrinkDto?> UpdateAsync(Guid id, UpdateEnergyDrinkRequest request, CancellationToken ct)
    {
        var entity = await _db.EnergyDrinks.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null) return null;

        entity.Brand = request.Brand;
        entity.Line = request.Line;
        entity.Flavor = request.Flavor;
        entity.VolumeMl = request.VolumeMl;
        entity.ExpirationDate = NormalizeToUtc(request.ExpirationDate);
        entity.Price = request.Price;
        entity.PriceCurrency = NormalizeCurrency(request.PriceCurrency);
        entity.Quantity = request.Quantity;
        entity.CaffeineMg = request.CaffeineMg;
        entity.SugarGrams = request.SugarGrams;
        entity.Calories = request.Calories;
        entity.IsSugarFree = request.IsSugarFree;
        entity.Countries = request.Countries;
        entity.ImageUrl = request.ImageUrl;
        entity.CanFillState = request.CanFillState;
        entity.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        var entity = await _db.EnergyDrinks.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null) return false;

        _db.EnergyDrinks.Remove(entity);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    private static EnergyDrinkDto Map(EnergyDrink x) => new()
    {
        Id = x.Id,
        Brand = x.Brand,
        Line = x.Line,
        Flavor = x.Flavor,
        VolumeMl = x.VolumeMl,
        ExpirationDate = x.ExpirationDate,
        Price = x.Price,
        PriceCurrency = x.PriceCurrency,
        Quantity = x.Quantity,
        CaffeineMg = x.CaffeineMg,
        SugarGrams = x.SugarGrams,
        Calories = x.Calories,
        IsSugarFree = x.IsSugarFree,
        Countries = x.Countries,
        ImageUrl = x.ImageUrl,
        CanFillState = x.CanFillState,
        CreatedAt = x.CreatedAt,
        UpdatedAt = x.UpdatedAt
    };

    private static DateTime NormalizeToUtc(DateTime value)
    {
        return value.Kind switch
        {
            DateTimeKind.Utc => value,
            DateTimeKind.Local => value.ToUniversalTime(),
            DateTimeKind.Unspecified => DateTime.SpecifyKind(value, DateTimeKind.Utc),
            _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
        };
    }

    private static string NormalizeCurrency(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return "USD";
        value = value.Trim().ToUpperInvariant();
        return value is "USD" or "EUR" or "RUB" ? value : "USD";
    }
}
