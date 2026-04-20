using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Energy.Api.Interfaces;
using Energy.Api.Options;
using Microsoft.Extensions.Options;

namespace Energy.Api.Services;

public sealed class S3ObjectStorage : IObjectStorage
{
    private readonly IAmazonS3 _s3;
    private readonly S3Options _options;

    public S3ObjectStorage(IOptions<S3Options> options)
    {
        _options = options.Value;

        if (string.IsNullOrWhiteSpace(_options.ServiceUrl))
            throw new InvalidOperationException("S3:ServiceUrl is not configured.");
        if (string.IsNullOrWhiteSpace(_options.AccessKey))
            throw new InvalidOperationException("S3:AccessKey is not configured.");
        if (string.IsNullOrWhiteSpace(_options.SecretKey))
            throw new InvalidOperationException("S3:SecretKey is not configured.");
        if (string.IsNullOrWhiteSpace(_options.Bucket))
            throw new InvalidOperationException("S3:Bucket is not configured.");

        var creds = new BasicAWSCredentials(_options.AccessKey.Trim(), _options.SecretKey.Trim());
        var cfg = new AmazonS3Config
        {
            ServiceURL = _options.ServiceUrl.Trim(),
            ForcePathStyle = true,
            AuthenticationRegion = "us-east-1",
            UseHttp = _options.ServiceUrl.Trim().StartsWith("http://", StringComparison.OrdinalIgnoreCase)
        };

        _s3 = new AmazonS3Client(creds, cfg);
    }

    public async Task<string> UploadPublicImageAsync(Stream content, string contentType, string fileExtension, CancellationToken ct)
    {
        fileExtension = fileExtension.Trim();
        if (!fileExtension.StartsWith('.')) fileExtension = "." + fileExtension;

        var key = $"{_options.KeyPrefix.TrimEnd('/')}/{DateTime.UtcNow:yyyy/MM}/{Guid.NewGuid():N}{fileExtension.ToLowerInvariant()}";

        var req = new PutObjectRequest
        {
            BucketName = _options.Bucket,
            Key = key,
            InputStream = content,
            ContentType = contentType
        };

        await _s3.PutObjectAsync(req, ct);

        return BuildPublicUrl(key);
    }

    private string BuildPublicUrl(string key)
    {
        if (!string.IsNullOrWhiteSpace(_options.PublicBaseUrl))
        {
            var baseUrl = _options.PublicBaseUrl!.TrimEnd('/');
            return $"{baseUrl}/{_options.Bucket}/{key}";
        }

        var serviceUrl = _options.ServiceUrl.TrimEnd('/');
        return $"{serviceUrl}/{_options.Bucket}/{key}";
    }
}

