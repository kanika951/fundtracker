using GTD_Fund_TrackerAPI.RepositoryLayer.Context.Entity;
using Microsoft.EntityFrameworkCore;

namespace GTD_Fund_TrackerAPI.RepositoryLayer.Context;

public partial class GtdFundDbContext : DbContext
{
    public GtdFundDbContext()
    {
    }

    public GtdFundDbContext(DbContextOptions<GtdFundDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Contribution> Contributions { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Spending> Spendings { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=.;Database=gtdFund;TrustServerCertificate=True;Trusted_Connection=True;MultipleActiveResultSets=true");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Contribution>(entity =>
        {
            entity.ToTable("Contribution");

            entity.Property(e => e.Amount).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.ContributionDate).HasColumnType("datetime");
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.Remarks).HasMaxLength(200);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.User).WithMany(p => p.Contributions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Contribution_User");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Roles");

            entity.ToTable("Role");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Spending>(entity =>
        {
            entity.ToTable("Spending");

            entity.Property(e => e.Amount).HasColumnType("decimal(7, 2)");
            entity.Property(e => e.SpendDate).HasColumnType("datetime");
            entity.Property(e => e.UsedFor).HasMaxLength(200);

            entity.HasOne(d => d.User).WithMany(p => p.Spendings)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Spending_User");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Users");

            entity.ToTable("User");

            entity.HasIndex(e => e.UserName, "UQ_User_UserName").IsUnique();

            entity.Property(e => e.Designation)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.Gender)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.JoiningDate)
                .HasDefaultValueSql("(((2023)-(4))-(1))")
                .HasColumnType("datetime");
            entity.Property(e => e.PasswordHash).HasMaxLength(2000);
            entity.Property(e => e.PasswordSalt).HasMaxLength(2000);
            entity.Property(e => e.PendingAmount).HasColumnType("decimal(7, 2)");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Status).HasMaxLength(30);
            entity.Property(e => e.UserName).HasMaxLength(100);

            entity.HasMany(d => d.Roles).WithMany(p => p.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "UserRole",
                    r => r.HasOne<Role>().WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_UserRole_Role"),
                    l => l.HasOne<User>().WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_UserRole_User"),
                    j =>
                    {
                        j.HasKey("UserId", "RoleId");
                        j.ToTable("UserRole");
                    });
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
