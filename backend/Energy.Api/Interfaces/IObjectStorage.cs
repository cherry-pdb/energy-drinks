namespace Energy.Api.Interfaces;

public interface IObjectStorage
{
    Task<string> UploadPublicImageAsync(
        Stream content,
        string contentType,
        string fileExtension,
        CancellationToken ct);
}

