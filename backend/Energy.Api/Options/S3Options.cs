namespace Energy.Api.Options;

public sealed class S3Options
{
    public const string SectionName = "S3";

    public string ServiceUrl { get; set; } = null!;
    public string AccessKey { get; set; } = null!;
    public string SecretKey { get; set; } = null!;
    public string Bucket { get; set; } = null!;
    public string? PublicBaseUrl { get; set; }
    public string KeyPrefix { get; set; } = "images";
    public long MaxUploadBytes { get; set; } = 10 * 1024 * 1024; // 10MB
}

