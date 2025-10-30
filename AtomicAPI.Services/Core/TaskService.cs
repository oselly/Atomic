using AtomicDB.AtomicDB;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Task = AtomicAPI.Models.Core.Task;

namespace AtomicAPI.Services.Core
{
    public class TaskService(IDbContextFactory<AtomicDBContext> dbContextFactory, ILogger<TaskService> logger) : ITaskService
    {
        public async Task<Task> Create(Task task)
        {
            try
            {
                using var context = dbContextFactory.CreateDbContext();
                var entity = task.CreateDbModel();
                context.TaskDBs.Add(entity);
                await context.SaveChangesAsync();

                logger.LogInformation("Task created successfully with EntityId: {EntityId}", entity.EntityId);

                return Task.ToModel(entity);
            }
            catch (DbUpdateException dbEx)
            {
                logger.LogError(dbEx, "Database update failed while creating task {Title}", task.Title);
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error while creating task {Title}", task.Title);
                throw;
            }
        }

        public Task? Get(Guid entityIdentifier)
        {
            try
            {
                using var context = dbContextFactory.CreateDbContext();

                return context.TaskDBs
                    .Where(x => x.EntityId == entityIdentifier)
                    .Select(x => Task.ToModel(x))
                    .SingleOrDefault();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error fetching task {EntityId}", entityIdentifier);
                throw;
            }
        }

        public IEnumerable<Task> GetAll( bool? isCompleted, bool? isCancelled, DateTime? dueDateFrom, DateTime? dueDateTo, int? pageNumber, int? pageSize, string? sortBy, string? sortOrder)
        {
            try
            {
                using var context = dbContextFactory.CreateDbContext();
                var query = context.TaskDBs.AsQueryable();

                if (isCompleted.HasValue)
                    query = query.Where(t => t.IsCompleted == isCompleted.Value);

                if (isCancelled.HasValue)
                    query = query.Where(t => t.IsCancelled == isCancelled.Value);

                if (dueDateFrom.HasValue)
                    query = query.Where(t => t.DueDate >= dueDateFrom.Value);

                if (dueDateTo.HasValue)
                    query = query.Where(t => t.DueDate <= dueDateTo.Value);

                query = sortBy?.ToLower() switch
                {
                    "title" => sortOrder?.ToLower() == "desc" ? query.OrderByDescending(t => t.Title) : query.OrderBy(t => t.Title),
                    "duedate" => sortOrder?.ToLower() == "desc" ? query.OrderByDescending(t => t.DueDate) : query.OrderBy(t => t.DueDate),
                    "iscompleted" => sortOrder?.ToLower() == "desc" ? query.OrderByDescending(t => t.IsCompleted) : query.OrderBy(t => t.IsCompleted),
                    _ => sortOrder?.ToLower() == "desc" ? query.OrderByDescending(t => t.CreatedDate) : query.OrderBy(t => t.CreatedDate)
                };

                if (pageNumber.HasValue && pageSize.HasValue && pageNumber > 0 && pageSize > 0)
                    query = query.Skip((pageNumber.Value - 1) * pageSize.Value).Take(pageSize.Value);

                return query.Select(x => Task.ToModel(x)).ToList();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred while retrieving tasks");
                throw;
            }
        }

        public async Task<bool> UpdateAsync(Task task)
        {
            try
            {
                using var context = dbContextFactory.CreateDbContext();
                var dbTask = await context.TaskDBs.SingleOrDefaultAsync(x => x.EntityId == task.EntityId);

                if (dbTask == null)
                {
                    logger.LogWarning("Attempted to update non-existent task: {EntityId}", task.EntityId);

                    return false;
                }

                task.UpdateDbModel(dbTask);
                await context.SaveChangesAsync();

                logger.LogInformation("Task updated successfully: {EntityId}", task.EntityId);

                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating task {EntityId}", task.EntityId);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(Guid entityIdentifier)
        {
            try
            {
                using var context = dbContextFactory.CreateDbContext();
                var dbTask = await context.TaskDBs.SingleOrDefaultAsync(x => x.EntityId == entityIdentifier);

                if (dbTask == null)
                {
                    logger.LogWarning("Attempted to delete non-existent task: {EntityId}", entityIdentifier);

                    return false;
                }

                dbTask.IsCancelled = true;
                dbTask.CancelledDate = DateTime.UtcNow;
                dbTask.LastModifiedDate = DateTime.UtcNow;

                await context.SaveChangesAsync();

                logger.LogInformation("Task deleted: {EntityId}", entityIdentifier);

                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error deleting task {EntityId}", entityIdentifier);
                throw;
            }
        }
    }
}
