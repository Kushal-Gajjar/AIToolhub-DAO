using System;
using System.Collections.Concurrent;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace AIToolHub.API.Middleware
{
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private static readonly ConcurrentDictionary<string, (int Count, DateTime Window)> _requests = new();
        private const int MaxRequests = 100;
        private static readonly TimeSpan WindowDuration = TimeSpan.FromMinutes(1);

        public RateLimitingMiddleware(RequestDelegate next) => _next = next;

        public async Task InvokeAsync(HttpContext context)
        {
            var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var now = DateTime.UtcNow;

            var entry = _requests.GetOrAdd(ip, _ => (0, now));

            if (now - entry.Window > WindowDuration)
                entry = (0, now);

            if (entry.Count >= MaxRequests)
            {
                context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                await context.Response.WriteAsync("Rate limit exceeded. Try again in 1 minute.");
                return;
            }

            _requests[ip] = (entry.Count + 1, entry.Window);
            await _next(context);
        }
    }
}
