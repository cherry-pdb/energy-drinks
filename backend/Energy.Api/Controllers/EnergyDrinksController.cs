using Energy.Api.Dtos;
using Energy.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Energy.Api.Controllers;

[ApiController]
[Route("api/energy-drinks")]
public sealed class EnergyDrinksController : ControllerBase
{
    private readonly IEnergyDrinkService _drinks;

    public EnergyDrinksController(IEnergyDrinkService drinks)
    {
        _drinks = drinks;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<EnergyDrinkDto>>> GetAll([FromQuery] string? search, [FromQuery] string? brand, [FromQuery] bool? isSugarFree, [FromQuery] bool onlyFull = true, CancellationToken ct = default)
        => Ok(await _drinks.GetAllAsync(search, brand, isSugarFree, onlyFull, ct));

    [HttpGet("paged")]
    [AllowAnonymous]
    public async Task<ActionResult<PagedResult<EnergyDrinkDto>>> GetPaged(
        [FromQuery] string? search,
        [FromQuery] string? brand,
        [FromQuery] bool? isSugarFree,
        [FromQuery] bool onlyFull = true,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 30,
        CancellationToken ct = default)
        => Ok(await _drinks.GetPagedAsync(search, brand, isSugarFree, onlyFull, page, pageSize, ct));

    [HttpGet("brands")]
    [AllowAnonymous]
    public async Task<ActionResult<List<string>>> GetBrands(CancellationToken ct)
        => Ok(await _drinks.GetBrandsAsync(ct));

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<EnergyDrinkDto>> GetById(Guid id, CancellationToken ct)
    {
        var dto = await _drinks.GetByIdAsync(id, ct);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<EnergyDrinkDto>> Create([FromBody] CreateEnergyDrinkRequest request, CancellationToken ct)
    {
        var created = await _drinks.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<EnergyDrinkDto>> Update(Guid id, [FromBody] UpdateEnergyDrinkRequest request, CancellationToken ct)
    {
        var updated = await _drinks.UpdateAsync(id, request, ct);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await _drinks.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound();
    }
}
