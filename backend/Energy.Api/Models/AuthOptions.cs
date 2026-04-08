namespace Energy.Api.Models;

public sealed class AuthOptions
{
    public const string SectionName = "Auth";

    public string AdminUsername { get; set; } = "admin";
    public string AdminPassword { get; set; } = "change_me";
    public string JwtSecret { get; set; } = "change_this_secret_to_a_long_random_string_1234567890";
    public string Issuer { get; set; } = "Energy.Api";
    public string Audience { get; set; } = "Energy.Web";
    public int ExpirationHours { get; set; } = 24;
}
