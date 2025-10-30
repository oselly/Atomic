using DelegateDecompiler;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace AtomicAPI.Models.Core
{
    public class Task
    {
        public Guid EntityId { get; set; }
        public int Id { get; set; }
        [MaxLength(100), Required]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public User? AssignedTo { get; set; }
        public int? AssignedToUserId { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public User? CreatedBy { get; set; }
        [Required]
        public int CreatedByUserId { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedDate { get; set; }
        public bool IsCancelled { get; set; }
        public DateTime? CancelledDate { get; set; }
        public DateTime LastModifiedDate { get; set; } = DateTime.UtcNow;

        [Decompile]
        public static Task ToModel(AtomicDB.Models.Entities.TaskDB dbTask) => new()
        {
            EntityId = dbTask.EntityId,
            Id = dbTask.TaskId,
            Title = dbTask.Title,
            Description = dbTask.Description,
            DueDate = dbTask.DueDate,
            IsCompleted = dbTask.IsCompleted,
            CompletedDate = dbTask.CompletedDate,
            IsCancelled = dbTask.IsCancelled,
            CancelledDate = dbTask.CancelledDate,
            LastModifiedDate = dbTask.LastModifiedDate,
            CreatedBy = dbTask.CreatedByUser != null ? User.ToModel(dbTask.CreatedByUser) : null,
            AssignedTo = dbTask.AssignedToUser != null ? User.ToModel(dbTask.AssignedToUser) : null
        };

        public AtomicDB.Models.Entities.TaskDB CreateDbModel() => new()
        {
            Title = Title,
            Description = Description,
            DueDate = DueDate,
            CreatedDate = DateTime.UtcNow,
            CreatedByUserId = CreatedByUserId,
            AssignedToUserId = AssignedToUserId,
            LastModifiedDate = DateTime.UtcNow
        };

        public void UpdateDbModel(AtomicDB.Models.Entities.TaskDB dbTask)
        {
            dbTask.Title = Title;
            dbTask.Description = Description;
            dbTask.DueDate = DueDate;
            dbTask.AssignedToUserId = AssignedToUserId;
            dbTask.IsCancelled = IsCancelled;
            dbTask.CancelledDate = CancelledDate;
            dbTask.IsCompleted = IsCompleted;
            dbTask.CompletedDate = CompletedDate;
            dbTask.LastModifiedDate = DateTime.UtcNow;
        }
    }
}