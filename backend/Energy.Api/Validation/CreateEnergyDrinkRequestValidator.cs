using Energy.Api.Dtos;
using FluentValidation;

namespace Energy.Api.Validation;

public sealed class CreateEnergyDrinkRequestValidator : AbstractValidator<CreateEnergyDrinkRequest>
{
    public CreateEnergyDrinkRequestValidator()
    {
        RuleFor(x => x.Brand).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Line).MaximumLength(100);
        RuleFor(x => x.Flavor).MaximumLength(100);
        RuleFor(x => x.VolumeMl).InclusiveBetween(1, 5000);
        RuleFor(x => x.Price).InclusiveBetween(0, 999999).When(x => x.Price.HasValue);
        RuleFor(x => x.PriceCurrency)
            .Must(x => string.IsNullOrWhiteSpace(x) || x.Trim().ToUpperInvariant() is "USD" or "EUR" or "RUB")
            .WithMessage("PriceCurrency must be one of: USD, EUR, RUB");
        RuleFor(x => x.Quantity).InclusiveBetween(0, 100000);
        RuleFor(x => x.CaffeineMg).InclusiveBetween(0, 5000).When(x => x.CaffeineMg.HasValue);
        RuleFor(x => x.SugarGrams).InclusiveBetween(0, 5000).When(x => x.SugarGrams.HasValue);
        RuleFor(x => x.Calories).InclusiveBetween(0, 10000).When(x => x.Calories.HasValue);
        RuleForEach(x => x.Countries)
            .Must(x => string.IsNullOrWhiteSpace(x) || (x.Trim().Length == 2 && x.Trim().All(char.IsLetter)))
            .WithMessage("Countries must be ISO2 codes, e.g. US, DE");
        RuleFor(x => x.ImageUrl).MaximumLength(1000);
    }
}
