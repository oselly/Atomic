using System;
using System.Collections.Generic;

namespace AtomicDB.Models.Entities
{
    public partial class User
    {
        public User()
        {
            TaskDBAssignedToUsers = new HashSet<TaskDB>();
            TaskDBCreatedByUsers = new HashSet<TaskDB>();
        }

        public int UserId { get; set; }
        public string Name { get; set; } = null!;
        public Guid EntityId { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }

        public virtual ICollection<TaskDB> TaskDBAssignedToUsers { get; set; }
        public virtual ICollection<TaskDB> TaskDBCreatedByUsers { get; set; }
    }
}
