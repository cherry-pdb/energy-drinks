namespace Energy.Api.Interfaces;

public interface IAuthService
{
    bool ValidateCredentials(string username, string password);

    (string token, DateTime expiresAtUtc) CreateToken(string username);
}
