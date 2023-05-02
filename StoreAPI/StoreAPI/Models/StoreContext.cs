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

            // UserProfile has the primary key equal to the id of the User
            modelBuilder.Entity<UserProfile>()
                .HasKey(u => u.UserId);

            // Set PagePreference default value to 5
            modelBuilder.Entity<UserProfile>()
                .Property(u => u.PagePreference)
                .HasDefaultValue(5);

            // Define unique constraints
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Name)
                .IsUnique();

            modelBuilder.Entity<ConfirmationCode>()
                .HasIndex(u => u.Code)
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
                .HasOne(s => s.StoreEmployeeRole)
                .WithMany(g => g.StoreEmployees)
                .HasForeignKey(s => s.StoreEmployeeRoleId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            // Define many-to-many relationships
            modelBuilder.Entity<StoreShift>()
                .HasKey(t => new { t.StoreId, t.StoreEmployeeId });

            modelBuilder.Entity<StoreShift>()
                .HasOne(pt => pt.Store)
                .WithMany(p => p.StoreShifts)
                .HasForeignKey(pt => pt.StoreId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<StoreShift>()
                .HasOne(pt => pt.StoreEmployee)
                .WithMany(t => t.StoreShifts)
                .HasForeignKey(pt => pt.StoreEmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            // Assign users to entities
            modelBuilder.Entity<ConfirmationCode>()
                .HasOne(u => u.User)
                .WithMany()
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<StoreEmployeeRole>()
                .HasOne(u => u.User)
                .WithMany()
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<StoreEmployee>()
                .HasOne(u => u.User)
                .WithMany()
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Store>()
                .HasOne(u => u.User)
                .WithMany()
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<StoreShift>()
                .HasOne(u => u.User)
                .WithMany()
                .HasForeignKey(u => u.UserId)
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
