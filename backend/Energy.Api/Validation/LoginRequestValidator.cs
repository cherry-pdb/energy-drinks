using Energy.Api.Dtos;
using FluentValidation;

namespace Energy.Api.Validation;

public sealed class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Username).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Password).NotEmpty().MaximumLength(500);
    }
}
