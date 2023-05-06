using Microsoft.EntityFrameworkCore;

namespace StoreAPI.Models
{
    public class StoreContext : DbContext
    {
        public StoreContext() { }

        public StoreContext(DbContextOptions<StoreContext> options) : base(options)
        {
            // EnsureDeleted to skip migrations
            // delete to keep data between runs
            //Database.EnsureDeleted();
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Set PagePreference default value to 5
            modelBuilder.Entity<UserProfile>()
                .Property(p => p.PagePreference)
                .HasDefaultValue(5);

            // Set AccessLevel default value to Unconfirmed
            modelBuilder.Entity<User>()
                .Property(u => u.AccessLevel)
                .HasDefaultValue(AccessLevel.Unconfirmed);

            // Define unique constraints
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Name)
                .IsUnique();

            modelBuilder.Entity<ConfirmationCode>()
                .HasIndex(c => c.Code)
                .IsUnique();

            // Define one-to-one relationships
            modelBuilder.Entity<User>()
                .HasOne(u => u.UserProfile)
                .WithOne(p => p.User)
                .HasForeignKey<UserProfile>(p => p.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
                //.OnDelete(DeleteBehavior.ClientCascade);

            // Define one-to-many relationships
            modelBuilder.Entity<StoreEmployee>()
                .HasOne(e => e.StoreEmployeeRole)
                .WithMany(r => r.StoreEmployees)
                .HasForeignKey(e => e.StoreEmployeeRoleId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            // Define many-to-many relationships
            modelBuilder.Entity<StoreShift>()
                .HasKey(ss => new { ss.StoreId, ss.StoreEmployeeId });

            modelBuilder.Entity<StoreShift>()
                .HasOne(ss => ss.Store)
                .WithMany(s => s.StoreShifts)
                .HasForeignKey(ss => ss.StoreId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<StoreShift>()
                .HasOne(ss => ss.StoreEmployee)
                .WithMany(et => e.StoreShifts)
                .HasForeignKey(ss => ss.StoreEmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            // Assign users to entities
            modelBuilder.Entity<ConfirmationCode>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull); // TODO: Fix FK constraint

            modelBuilder.Entity<StoreEmployeeRole>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<StoreEmployee>()
                .HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Store>()
                .HasOne(s => s.User)
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<StoreShift>()
                .HasOne(ss => ss.User)
                .WithMany()
                .HasForeignKey(ss => ss.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        }

        public virtual DbSet<ConfirmationCode> ConfirmationCodes { get; set; } = null!;

        public virtual DbSet<User> Users { get; set; } = null!;
        public virtual DbSet<UserProfile> UserProfiles { get; set; } = null!;

        public virtual DbSet<StoreEmployeeRole> StoreEmployeeRoles { get; set; } = null!;
        public virtual DbSet<StoreEmployee> StoreEmployees { get; set; } = null!;

        public virtual DbSet<Store> Stores { get; set; } = null!;

        public virtual DbSet<StoreShift> StoreShifts { get; set; } = default!;
    }
}
