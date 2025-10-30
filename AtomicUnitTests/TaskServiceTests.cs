using AtomicAPI.Models.Core;
using AtomicAPI.Services.Core;
using AtomicDB.AtomicDB;
using AtomicDB.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Task = AtomicAPI.Models.Core.Task;

namespace AtomicAPI.Tests.Services
{
    [TestFixture]
    public class TaskServiceTests
    {
        private IDbContextFactory<AtomicDBContext> _dbContextFactory;
        private Mock<ILogger<TaskService>> _mockLogger;
        private DbContextOptions<AtomicDBContext> _dbContextOptions;

        [SetUp]
        public void Setup()
        {
            _mockLogger = new Mock<ILogger<TaskService>>();

            _dbContextOptions = new DbContextOptionsBuilder<AtomicDBContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var mockFactory = new Mock<IDbContextFactory<AtomicDBContext>>();

            mockFactory.Setup(f => f.CreateDbContext())
                .Returns(() => new AtomicDBContext(_dbContextOptions));

            _dbContextFactory = mockFactory.Object;
        }

        private AtomicDBContext GetContext() => _dbContextFactory.CreateDbContext();

        [Test]
        public async System.Threading.Tasks.Task Create_ShouldAddTaskToDatabase()
        {
            var service = new TaskService(_dbContextFactory, _mockLogger.Object);
            var testGuid = Guid.NewGuid();
            var newTask = new Task
            {
                EntityId = testGuid,
                Title = "Test Task 1",
                CreatedDate = DateTime.UtcNow
            };

            var createdTask = await service.Create(newTask);

            Assert.That(createdTask, Is.Not.Null);

            using var assertContext = GetContext();

            var taskInDb = await assertContext.TaskDBs.SingleOrDefaultAsync(t => t.EntityId == createdTask.EntityId);

            Assert.That(taskInDb, Is.Not.Null, "Task must be found in the database.");
            Assert.That(taskInDb.Title, Is.EqualTo("Test Task 1"));
            Assert.That(await assertContext.TaskDBs.CountAsync(), Is.EqualTo(1));
        }

        [Test]
        public void GetAll_ShouldCorrectlyFilterBy_IsCompleted()
        {
            var service = new TaskService(_dbContextFactory, _mockLogger.Object);

            using var seedContext = GetContext();
            seedContext.TaskDBs.AddRange(
                new TaskDB { EntityId = Guid.NewGuid(), Title = "Completed Task", IsCompleted = true, CreatedDate = DateTime.UtcNow },
                new TaskDB { EntityId = Guid.NewGuid(), Title = "Incomplete Task", IsCompleted = false, CreatedDate = DateTime.UtcNow },
                new TaskDB { EntityId = Guid.NewGuid(), Title = "Completed Task 2", IsCompleted = true, CreatedDate = DateTime.UtcNow.AddMinutes(1) }
            );
            seedContext.SaveChanges();

            var results = service.GetAll(isCompleted: true, isCancelled: null, dueDateFrom: null, dueDateTo: null, pageNumber: null, pageSize: null, sortBy: null, sortOrder: null)
                .ToList();

            Assert.That(results.Count, Is.EqualTo(2), "Should only return 2 completed tasks.");

            Assert.That(results.All(t => t.IsCompleted), Is.True, "All returned tasks must be completed.");

            var titles = results.Select(t => t.Title).ToList();
            Assert.That(titles, Does.Contain("Completed Task"));
            Assert.That(titles, Does.Contain("Completed Task 2"));
        }
    }
}