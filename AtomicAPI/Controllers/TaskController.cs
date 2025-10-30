using AtomicAPI.Services.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Task = AtomicAPI.Models.Core.Task;

namespace AtomicAPI.Controllers.Core
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController(ITaskService taskService, ILogger<TaskController> logger) : ControllerBase
    {
        [HttpGet("{entityIdentifier:guid}")]
        public IActionResult Get(Guid entityIdentifier)
        {
            try
            {
                logger.LogInformation("Fetching task with EntityId: {EntityId}", entityIdentifier);
                var task = taskService.Get(entityIdentifier);

                if (task == null)
                {
                    logger.LogWarning("Task not found for EntityId: {EntityId}", entityIdentifier);

                    return NotFound();
                }

                return Ok(task);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred while retrieving task {EntityId}", entityIdentifier);

                return StatusCode(500, "An unexpected error occurred while retrieving the task.");
            }
        }

        [HttpGet]
        public IActionResult GetAll([FromQuery] bool? isCompleted, [FromQuery] bool? isCancelled, [FromQuery] DateTime? dueDateFrom, [FromQuery] DateTime? dueDateTo,
            [FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] string? sortBy = "CreatedDate", [FromQuery] string? sortOrder = "asc")
        {
            try
            {
                logger.LogInformation("Fetching all tasks with filters: isCompleted={IsCompleted}, isCancelled={IsCancelled}, sortBy={SortBy}, sortOrder={SortOrder}",
                    isCompleted, isCancelled, sortBy, sortOrder);

                var tasks = taskService.GetAll(isCompleted, isCancelled, dueDateFrom, dueDateTo, pageNumber, pageSize, sortBy, sortOrder);

                return Ok(tasks);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred while retrieving task list");

                return StatusCode(500, "An unexpected error occurred while retrieving tasks.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Task task)
        {
            if (task == null)
                return BadRequest("Task cannot be null.");

            try
            {
                logger.LogInformation("Creating new task: {Title}", task.Title);
                var created = await taskService.Create(task);

                return CreatedAtAction(nameof(Get), new { entityIdentifier = created.EntityId }, created);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred while creating task {Title}", task.Title);

                return StatusCode(500, "An unexpected error occurred while creating the task.");
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Task task)
        {
            if (task == null)

                return BadRequest("Task cannot be null.");

            try
            {
                logger.LogInformation("Updating task: {EntityId}", task.EntityId);
                var updated = await taskService.UpdateAsync(task);

                if (!updated)
                {
                    logger.LogWarning("Task not found for update: {EntityId}", task.EntityId);

                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred while updating task {EntityId}", task.EntityId);

                return StatusCode(500, "An unexpected error occurred while updating the task.");
            }
        }

        [HttpDelete("{entityIdentifier:guid}")]
        public async Task<IActionResult> Delete(Guid entityIdentifier)
        {
            try
            {
                logger.LogInformation("Deleting task: {EntityId}", entityIdentifier);
                var deleted = await taskService.DeleteAsync(entityIdentifier);

                if (!deleted)
                {
                    logger.LogWarning("Task not found for deletion: {EntityId}", entityIdentifier);

                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred while deleting task {EntityId}", entityIdentifier);

                return StatusCode(500, "An unexpected error occurred while deleting the task.");
            }
        }
    }
}
