using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using AtomicDB.Models.Entities;

namespace AtomicDB.AtomicDB
{
    public partial class AtomicDBContext : DbContext
    {
        public virtual DbSet<TaskDB> TaskDBs { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;

        public AtomicDBContext()
        {
        }

        public AtomicDBContext(DbContextOptions<AtomicDBContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaskDB>(entity =>
            {
                entity.HasKey(e => e.TaskId)
                    .HasName("PK_tblTask_TaskId");

                entity.ToTable("tblTask");

                entity.Property(e => e.CancelledDate).HasPrecision(0);

                entity.Property(e => e.CompletedDate).HasPrecision(0);

                entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETUTCDATE()");

                entity.Property(e => e.DueDate).HasPrecision(0);

                entity.Property(e => e.EntityId).HasDefaultValueSql("newid()");

                entity.Property(e => e.LastModifiedDate).HasDefaultValueSql("GETUTCDATE()");

                entity.Property(e => e.Title).HasMaxLength(100);

                entity.HasOne(d => d.AssignedToUser)
                    .WithMany(p => p.TaskDBAssignedToUsers)
                    .HasForeignKey(d => d.AssignedToUserId)
                    .HasConstraintName("FK_tblTask_AssignedToUserId_tblUser_UserId");

                entity.HasOne(d => d.CreatedByUser)
                    .WithMany(p => p.TaskDBCreatedByUsers)
                    .HasForeignKey(d => d.CreatedByUserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_tblTask_CreatedByUserId_tblUser_UserId");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("tblUser");

                entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETUTCDATE()");

                entity.Property(e => e.EntityId).HasDefaultValueSql("newid()");

                entity.Property(e => e.IsActive).HasDefaultValue(true);

                entity.Property(e => e.Name).HasMaxLength(100);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
