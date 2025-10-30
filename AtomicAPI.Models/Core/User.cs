using DelegateDecompiler;
using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace AtomicAPI.Models.Core
{
    public class User
    {
        public Guid EntityId { get; set; }
        public int Id { get; set; }
        [MaxLength(100), Required]
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        [Decompile]
        public static User ToModel(AtomicDB.Models.Entities.User dbUser) => new()
        {
            EntityId = dbUser.EntityId,
            Id = dbUser.UserId,
            Name = dbUser.Name,
            IsActive = dbUser.IsActive
        };

        public AtomicDB.Models.Entities.User CreateDbModel() => new()
        {
            Name = Name,
            IsActive = IsActive,
            CreatedDate = DateTime.UtcNow
        };

        public void UpdateDbModel(AtomicDB.Models.Entities.User dbUser)
        {
            dbUser.Name = Name;
            dbUser.IsActive = IsActive;
        }
    }
}
