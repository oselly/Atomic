using AtomicAPI.Services.Core;
using Microsoft.AspNetCore.Mvc;
using User = AtomicAPI.Models.Core.User;

namespace AtomicAPI.Controllers.Core
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(IUserService userService, ILogger<UserController> logger) : ControllerBase
    {
        [HttpGet("{entityIdentifier:guid}")]
        public IActionResult Get(Guid entityIdentifier)
        {
            try
            {
                var user = userService.Get(entityIdentifier);

                if (user == null)
                {
                    logger.LogWarning("User with EntityId {EntityId} not found.", entityIdentifier);

                    return NotFound();
                }

                logger.LogInformation("Fetched user {EntityId}.", entityIdentifier);

                return Ok(user);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error retrieving user with EntityId {EntityId}.", entityIdentifier);

                return StatusCode(500, "An error occurred while fetching the user.");
            }
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var users = userService.GetAll();
                logger.LogInformation("Fetched {Count} users.", users.Count());

                return Ok(users);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error retrieving all users.");

                return StatusCode(500, "An error occurred while fetching users.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] User user)
        {
            if (user == null)
            {
                logger.LogWarning("Attempted to create a null user.");

                return BadRequest("User cannot be null.");
            }

            try
            {
                var created = await userService.Create(user);
                logger.LogInformation("Created new user {EntityId}.", created.EntityId);

                return CreatedAtAction(nameof(Get), new { entityIdentifier = created.EntityId }, created);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error creating new user.");

                return StatusCode(500, "An error occurred while creating the user.");
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] User user)
        {
            if (user == null)

                return BadRequest("User cannot be null.");

            try
            {
                var updated = await userService.UpdateAsync(user);

                if (!updated)
                {
                    logger.LogWarning("Attempted to update non-existent user {EntityId}.", user.EntityId);
                    
                    return NotFound();
                }

                logger.LogInformation("Updated user {EntityId}.", user.EntityId);

                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating user {EntityId}.", user.EntityId);

                return StatusCode(500, "An error occurred while updating the user.");
            }
        }

        [HttpDelete("{entityIdentifier:guid}")]
        public async Task<IActionResult> Delete(Guid entityIdentifier)
        {
            try
            {
                var deleted = await userService.DeleteAsync(entityIdentifier);

                if (!deleted)
                {
                    logger.LogWarning("Attempted to delete non-existent user {EntityId}.", entityIdentifier);

                    return NotFound();
                }

                logger.LogInformation("Deactivated user {EntityId}.", entityIdentifier);

                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error deleting user {EntityId}.", entityIdentifier);

                return StatusCode(500, "An error occurred while deleting the user.");
            }
        }
    }
}
