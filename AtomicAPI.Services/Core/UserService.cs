using AtomicDB.AtomicDB;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using User = AtomicAPI.Models.Core.User;

namespace AtomicAPI.Services.Core
{
    public class UserService(IDbContextFactory<AtomicDBContext> atomicDBContextFactory, ILogger<UserService> logger) : IUserService
    {
        public async Task<User> Create(User user)
        {
            try
            {
                using var context = atomicDBContextFactory.CreateDbContext();
                var entity = user.CreateDbModel();

                context.Users.Add(entity);
                await context.SaveChangesAsync();

                logger.LogInformation("Created user {EntityId}.", entity.EntityId);

                return User.ToModel(entity);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error creating user.");
                throw;
            }
        }

        public User? Get(Guid entityIdentifier)
        {
            try
            {
                using var context = atomicDBContextFactory.CreateDbContext();

                var result = context.Users
                    .Where(x => x.EntityId == entityIdentifier)
                    .Select(x => User.ToModel(x))
                    .SingleOrDefault();

                if (result == null)
                    logger.LogWarning("User {EntityId} not found.", entityIdentifier);

                return result;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error retrieving user {EntityId}.", entityIdentifier);
                throw;
            }
        }

        public IEnumerable<User> GetAll()
        {
            try
            {
                using var context = atomicDBContextFactory.CreateDbContext();

                var users = context.Users
                    .Select(x => User.ToModel(x))
                    .ToList();

                logger.LogInformation("Retrieved {Count} users.", users.Count);

                return users;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error retrieving all users.");
                throw;
            }
        }

        public async Task<bool> UpdateAsync(User user)
        {
            try
            {
                using var context = atomicDBContextFactory.CreateDbContext();
                var entity = await context.Users.SingleOrDefaultAsync(x => x.EntityId == user.EntityId);

                if (entity == null)
                {
                    logger.LogWarning("Cannot update. User {EntityId} not found.", user.EntityId);

                    return false;
                }

                user.UpdateDbModel(entity);
                context.Users.Update(entity);
                await context.SaveChangesAsync();

                logger.LogInformation("Updated user {EntityId}.", user.EntityId);

                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating user {EntityId}.", user.EntityId);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(Guid entityIdentifier)
        {
            try
            {
                using var context = atomicDBContextFactory.CreateDbContext();

                var dbUser = await context.Users.SingleOrDefaultAsync(x => x.EntityId == entityIdentifier);
                if (dbUser == null)
                {
                    logger.LogWarning("Cannot delete. User {EntityId} not found.", entityIdentifier);

                    return false;
                }

                dbUser.IsActive = false;
                await context.SaveChangesAsync();

                logger.LogInformation("Deactivated user {EntityId}.", entityIdentifier);

                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error deleting user {EntityId}.", entityIdentifier);
                throw;
            }
        }
    }
}
