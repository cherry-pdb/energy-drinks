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

        var creds = new BasicAWSCredentials(_options.AccessKey, _options.SecretKey);
        var cfg = new AmazonS3Config
        {
            ServiceURL = _options.ServiceUrl,
            ForcePathStyle = true
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

