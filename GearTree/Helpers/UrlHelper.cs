using Microsoft.AspNetCore.Http;

namespace GearTree.Helpers
{
    public static class UrlHelper
    {
        public static string? FullUrl(HttpRequest request, string? relativePath)
        {
            if (string.IsNullOrEmpty(relativePath)) return null;
            return $"{request.Scheme}://{request.Host}{relativePath}";
        }
    }
}
