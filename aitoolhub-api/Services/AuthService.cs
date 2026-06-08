using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using AIToolHub.API.Data;
using AIToolHub.API.DTOs.Auth;
using AIToolHub.API.Models;
using BCrypt.Net;

namespace AIToolHub.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            if (await _db.Users.AnyAsync(u => u.Email == request.Email))
                throw new InvalidOperationException("Email already registered.");

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                WalletAddress = request.WalletAddress,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                AitBalance = 100m, // Welcome bonus
                VotingPower = 100m
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return GenerateAuthResponse(user);
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email)
                       ?? throw new UnauthorizedAccessException("Invalid credentials.");

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid credentials.");

            return GenerateAuthResponse(user);
        }

        public Task<AuthResponse> RefreshTokenAsync(string refreshToken)
            => throw new NotImplementedException("Refresh token logic to be implemented.");

        public Task RevokeTokenAsync(string refreshToken)
            => throw new NotImplementedException("Revoke token logic to be implemented.");

        private AuthResponse GenerateAuthResponse(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _config["Jwt:Secret"] ?? "fallback-secret-change-in-production"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiry = DateTime.UtcNow.AddHours(24);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                },
                expires: expiry,
                signingCredentials: creds
            );

            return new AuthResponse
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                RefreshToken = Guid.NewGuid().ToString("N"),
                UserId = user.Id,
                Username = user.Username,
                Email = user.Email,
                WalletAddress = user.WalletAddress,
                AitBalance = user.AitBalance,
                Role = user.Role,
                ExpiresAt = expiry
            };
        }
    }
}
