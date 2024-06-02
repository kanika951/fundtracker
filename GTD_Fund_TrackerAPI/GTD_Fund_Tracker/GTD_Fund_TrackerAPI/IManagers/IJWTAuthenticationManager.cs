using GTD_Fund_TrackerAPI.Models.Dto;

namespace GTD_Fund_TrackerAPI.IManagers
{
    public interface IJWTAuthenticationManager
    {
        public Task<string> Authenticate(ValidUserDTO user);
    }
}
