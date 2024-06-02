namespace GTD_Fund_TrackerAPI.Exceptions
{
    public class BadRequestException: Exception
    {
            public BadRequestException(string message) : base(message)
            {
            }
    }
}
