using Amazon.Runtime;
using Amazon.S3;
using Energy.Api.Interfaces;
using Energy.Api.Options;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Net.Http;

namespace Energy.Api.Controllers;

[ApiController]
[Route("api/uploads")]
public sealed class UploadsController : ControllerBase
{
    private static readonly HashSet<string> AllowedImageContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
    };

    private readonly IObjectStorage _storage;
    private readonly S3Options _options;

    public UploadsController(IObjectStorage storage, IOptions<S3Options> options)
    {
        _storage = storage;
        _options = options.Value;
    }

    public sealed class UploadImageResponse
    {
        public string Url { get; set; } = null!;
    }

    [HttpPost("images")]
    [Authorize]
    [RequestSizeLimit(15 * 1024 * 1024)]
    public async Task<ActionResult<UploadImageResponse>> UploadImage([FromForm] IFormFile file, CancellationToken ct)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { error = "File is required" });

        if (file.Length > _options.MaxUploadBytes)
            return BadRequest(new { error = $"File is too large (max {_options.MaxUploadBytes} bytes)" });

        var contentType = file.ContentType?.Trim();
        if (string.IsNullOrWhiteSpace(contentType) || !AllowedImageContentTypes.Contains(contentType))
            return BadRequest(new { error = "Unsupported image type" });

        var ext = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(ext))
        {
            ext = contentType.ToLowerInvariant() switch
            {
                "image/jpeg" => ".jpg",
                "image/png" => ".png",
                "image/webp" => ".webp",
                "image/gif" => ".gif",
                _ => ".img"
            };
        }

        await using var stream = file.OpenReadStream();
        try
        {
            var url = await _storage.UploadPublicImageAsync(stream, contentType, ext, ct);
            return Ok(new UploadImageResponse { Url = url });
        }
        catch (AmazonS3Exception ex)
        {
            return Problem(
                detail: $"{ex.ErrorCode}: {ex.Message}",
                statusCode: StatusCodes.Status502BadGateway,
                title: "S3 upload failed");
        }
        catch (AmazonServiceException ex)
        {
            return Problem(
                detail: $"{ex.ErrorCode}: {ex.Message}",
                statusCode: StatusCodes.Status502BadGateway,
                title: "S3 upload failed");
        }
        catch (HttpRequestException ex)
        {
            return Problem(
                detail: ex.Message,
                statusCode: StatusCodes.Status502BadGateway,
                title: "S3 endpoint unreachable");
        }
        catch (InvalidOperationException ex)
        {
            return Problem(
                detail: ex.Message,
                statusCode: StatusCodes.Status500InternalServerError,
                title: "S3 is misconfigured");
        }
    }
}

