using Microsoft.AspNetCore.Mvc;
using Moq;
using Moq.EntityFrameworkCore;
using StoreAPI.Controllers;
using StoreAPI.Models;

namespace StoreAPITest
{
    [TestFixture]
    public class GetStoresByAverageEmployeeSalary
    {
        private Mock<StoreContext> _contextMock;

        [SetUp]
        public void Setup()
        {
            _contextMock = new Mock<StoreContext>();
        }

        [Test]
        public async Task GetStoresByAverageEmployeeSalary_ReturnsExpectedResult()
        {
            var roles = new List<StoreEmployeeRole>
            {
                new StoreEmployeeRole
                {
                    Id = 1,
                    Name = "Trainee",
                    Description = "New employee",
                    RoleLevel = 1
                },
            };

            var employees = new List<StoreEmployee>
            {
                new StoreEmployee
                {
                    Id = 1,
                    FirstName = "John",
                    LastName = "Doe",
                    Gender = Gender.Male,
                    EmploymentDate = DateTime.Now,
                    TerminationDate = null,
                    StoreEmployeeRoleId = 1,
                    Salary = 1000
                },
                new StoreEmployee
                {
                    Id = 2,
                    FirstName = "Jane",
                    LastName = "Smith",
                    Gender = Gender.Female,
                    EmploymentDate = DateTime.Now,
                    TerminationDate = null,
                    StoreEmployeeRoleId = 1,
                    Salary = 2000
                },
                new StoreEmployee
                {
                    Id = 3,
                    FirstName = "Oliver",
                    LastName = "Karlsen",
                    Gender = Gender.Male,
                    EmploymentDate = DateTime.Now,
                    TerminationDate = null,
                    StoreEmployeeRoleId = 1,
                    Salary = 3000
                },
            };

            var stores = new List<Store>
            {
                new Store
                {
                    Id = 1,
                    Name = "Burger King",
                    Description = "Fast food restaurant",
                    Category = StoreCategory.Food,
                    Address = "123 Main Street",
                    City = "New York",
                    State = "NY",
                    ZipCode = "10001",
                    Country = "USA",
                    OpenDate = DateTime.Now,
                    CloseDate = null,
                },
                new Store
                {
                    Id = 2,
                    Name = "McDonalds",
                    Description = "Fast food restaurant",
                    Category = StoreCategory.Food,
                    Address = "456 Main Street",
                    City = "New York",
                    State = "NY",
                    ZipCode = "10001",
                    Country = "USA",
                    OpenDate = DateTime.Now,
                    CloseDate = null,
                },
                new Store
                {
                    Id = 3,
                    Name = "Wendy's",
                    Description = "Fast food restaurant",
                    Category = StoreCategory.Food,
                    Address = "789 Main Street",
                    City = "New York",
                    State = "NY",
                    ZipCode = "10001",
                    Country = "USA",
                    OpenDate = DateTime.Now,
                    CloseDate = null,
                },
            };

            var storeShifts = new List<StoreShift>
            {
                new StoreShift
                {
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddHours(8),
                    StoreId = 2,
                    StoreEmployeeId = 1,
                },
                new StoreShift
                {
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddHours(8),
                    StoreId = 2,
                    StoreEmployeeId = 2,
                },
                new StoreShift
                {
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddHours(8),
                    StoreId = 3,
                    StoreEmployeeId = 3,
                },
            };

            _contextMock.Setup(c => c.StoreEmployeeRoles).ReturnsDbSet(roles);
            _contextMock.Setup(c => c.StoreEmployees).ReturnsDbSet(employees);
            _contextMock.Setup(c => c.Stores).ReturnsDbSet(stores);
            _contextMock.Setup(c => c.StoreShifts).ReturnsDbSet(storeShifts);

            var controller = new StoresController(_contextMock.Object);

            var shifts = await controller.GetStoresByAverageEmployeeSalary();

            Assert.That(shifts.Count, Is.EqualTo(3));
            Assert.That(shifts[0].Id, Is.EqualTo(3));
            Assert.That(shifts[1].Id, Is.EqualTo(2));
            Assert.That(shifts[2].Id, Is.EqualTo(1));
            Assert.That(shifts[0].AverageSalary, Is.EqualTo(3000d));
            Assert.That(shifts[1].AverageSalary, Is.EqualTo(1500d));
            Assert.That(shifts[2].AverageSalary, Is.EqualTo(0d));
        }
    }
}
