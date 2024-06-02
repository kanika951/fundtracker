using System;
using System.Collections.Generic;

namespace GTD_Fund_Tracker_Function_App.RepositoryLayer.Context.Entity;

public partial class Spending
{
    public int Id { get; set; }

    public DateTime SpendDate { get; set; }

    public decimal Amount { get; set; }

    public int UserId { get; set; }

    public string UsedFor { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
