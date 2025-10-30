using Task = AtomicAPI.Models.Core.Task;

namespace AtomicAPI.Services.Core
{
    public interface ITaskService
    {
        Task<Task> Create(Task task);
        Task? Get(Guid entityIdentifier);
        IEnumerable<Task> GetAll(bool? isCompleted, bool? isCancelled, DateTime? dueDateFrom, DateTime? dueDateTo, int? pageNumber, int? pageSize, string? sortBy, string? sortOrder);
        Task<bool> UpdateAsync(Task task);
        Task<bool> DeleteAsync(Guid entityIdentifier);
    }
}