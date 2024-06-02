using AutoMapper;
using GTD_Fund_TrackerAPI.Models;
using GTD_Fund_TrackerAPI.Models.Dto;
using GTD_Fund_TrackerAPI.RepositoryLayer.Context.Entity;

namespace GTD_Fund_TrackerAPI.MappingConfig
{
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<UserModel, UserDTO>().ReverseMap();
            CreateMap<ContributionModel, ContributionDTO>().ReverseMap();
            CreateMap<Contribution, ContributionModel>().ReverseMap();
            CreateMap<User, UserModel>().ReverseMap();
            CreateMap<User, ValidationInfoDTO>().ReverseMap();
        }
    }
}
