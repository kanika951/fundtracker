namespace GTD_Fund_TrackerAPI.ExtensionMethods
{
    public static class DecimalExtensions
    {
        public static bool IsGreaterThan(this decimal invoker, decimal value)
        {
            return invoker > value;
        }
    }
}
