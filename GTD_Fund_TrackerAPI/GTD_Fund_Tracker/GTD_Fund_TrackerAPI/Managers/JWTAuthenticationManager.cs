using GTD_Fund_TrackerAPI.IManagers;
using GTD_Fund_TrackerAPI.Models.Dto;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace GTD_Fund_TrackerAPI.Managers
{
    public class JWTAuthenticationManager : IJWTAuthenticationManager
    {
        private readonly string _key;
        public JWTAuthenticationManager(string key)
        {
            _key = key;
        }

        public async Task<string> Authenticate(ValidUserDTO user)
        {
            if(user == null)
            {
                return null;
            }

            JwtSecurityTokenHandler tokenHandler = new ();
            var tokenKey = Encoding.ASCII.GetBytes(_key);
            SecurityTokenDescriptor tokenDescriptor = new()
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("UserName", user.UserName),
                    new Claim("FullName", user.FullName),
                    new Claim("Roles", user.UserRoles != null ? JsonSerializer.Serialize(user.UserRoles) : string.Empty,JsonClaimValueTypes.JsonArray)
                }),

                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature) 
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
