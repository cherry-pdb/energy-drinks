using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Energy.Api.Interfaces;
using Energy.Api.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Energy.Api.Services;

public sealed class AuthService : IAuthService
{
    private readonly AuthOptions _options;

    public AuthService(IOptions<AuthOptions> options)
    {
        _options = options.Value;
    }

    public bool ValidateCredentials(string username, string password)
        => string.Equals(username, _options.AdminUsername, StringComparison.Ordinal)
           && string.Equals(password, _options.AdminPassword, StringComparison.Ordinal);

    public (string token, DateTime expiresAtUtc) CreateToken(string username)
    {
        var expiresAtUtc = DateTime.UtcNow.AddHours(_options.ExpirationHours);
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.JwtSecret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, username),
            new(JwtRegisteredClaimNames.UniqueName, username),
            new(ClaimTypes.Name, username),
            new(ClaimTypes.Role, "Admin")
        };

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expiresAtUtc,
            signingCredentials: creds);

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAtUtc);
    }
}
