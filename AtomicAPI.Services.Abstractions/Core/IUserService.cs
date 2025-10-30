using User = AtomicAPI.Models.Core.User;


namespace AtomicAPI.Services.Core
{
    public interface IUserService
    {
        User? Get(Guid entityIdentifier);
        IEnumerable<User> GetAll();
        Task<User> Create(User user);
        Task<bool> UpdateAsync(User user);
        Task<bool> DeleteAsync(Guid entityIdentifier);
    }
}