using System;
using System.Collections.Generic;

namespace GTD_Fund_Tracker_Function_App.RepositoryLayer.Context.Entity;

public partial class Contribution
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public decimal Amount { get; set; }

    public DateTime ContributionDate { get; set; }

    public DateTime CreatedDate { get; set; }

    public string Status { get; set; } = null!;

    public string Remarks { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
