using System;
using System.Collections.Generic;

namespace GTD_Fund_Tracker_Function_App.RepositoryLayer.Context.Entity;

public partial class User
{
    public int Id { get; set; }

    public string UserName { get; set; } = null!;

    public DateTime JoiningDate { get; set; }

    public decimal PendingAmount { get; set; }

    public string Status { get; set; } = null!;

    public string Email { get; set; } = null!;

    public bool Verified { get; set; }

    public string FullName { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string Designation { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public byte[] PasswordHash { get; set; } = null!;

    public byte[] PasswordSalt { get; set; } = null!;

    public virtual ICollection<Contribution> Contributions { get; set; } = new List<Contribution>();

    public virtual ICollection<Spending> Spendings { get; set; } = new List<Spending>();

    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
}
