using Energy.Api.Dtos;
using Energy.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Energy.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public ActionResult<LoginResponse> Login([FromBody] LoginRequest request)
    {
        if (!_authService.ValidateCredentials(request.Username, request.Password))
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }

        var (token, expiresAtUtc) = _authService.CreateToken(request.Username);
        return Ok(new LoginResponse
        {
            Token = token,
            ExpiresAtUtc = expiresAtUtc,
            Username = request.Username
        });
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        return Ok(new
        {
            username = User.Identity?.Name,
            isAuthenticated = User.Identity?.IsAuthenticated ?? false
        });
    }
}
