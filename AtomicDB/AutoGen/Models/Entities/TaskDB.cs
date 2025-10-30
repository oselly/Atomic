using System;
using System.Collections.Generic;

namespace AtomicDB.Models.Entities
{
    public partial class TaskDB
    {
        public int TaskId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public int? AssignedToUserId { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedDate { get; set; }
        public bool IsCancelled { get; set; }
        public DateTime? CancelledDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedByUserId { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public Guid EntityId { get; set; }

        public virtual User? AssignedToUser { get; set; }
        public virtual User CreatedByUser { get; set; } = null!;
    }
}
