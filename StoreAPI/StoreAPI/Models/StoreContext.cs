using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using StoreAPI.Models;

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

            // Define one-to-many relationships
            modelBuilder.Entity<StoreItem>()
                .HasOne(s => s.StoreItemCategory)
                .WithMany(g => g.StoreItems)
                .HasForeignKey(s => s.StoreItemCategoryId);

            modelBuilder.Entity<StoreEmployee>()
                .HasOne(s => s.StoreEmployeeRole)
                .WithMany(g => g.StoreEmployees)
                .HasForeignKey(s => s.StoreEmployeeRoleId);

            // Define many-to-many relationships
            modelBuilder.Entity<StoreShift>()
                .HasKey(t => new { t.StoreId, t.StoreEmployeeId });

            modelBuilder.Entity<StoreShift>()
                .HasOne(pt => pt.Store)
                .WithMany(p => p.StoreShifts)
                .HasForeignKey(pt => pt.StoreId);

            modelBuilder.Entity<StoreShift>()
                .HasOne(pt => pt.StoreEmployee)
                .WithMany(t => t.StoreShifts)
                .HasForeignKey(pt => pt.StoreEmployeeId);
        }

        public virtual DbSet<StoreItemCategory> StoreItemCategories { get; set; } = null!;
        public virtual DbSet<StoreItem> StoreItems { get; set; } = null!;

        public virtual DbSet<StoreEmployeeRole> StoreEmployeeRoles { get; set; } = null!;
        public virtual DbSet<StoreEmployee> StoreEmployees { get; set; } = null!;

        public virtual DbSet<Store> Stores { get; set; } = null!;

        public virtual DbSet<StoreShift> StoreShifts { get; set; } = default!;
    }
}
