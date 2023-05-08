using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Bogus;
using StoreAPI.Controllers;

namespace StoreAPI.Models
{
    public static class SeedData
    {
        // Add a nested class to use as a type argument for ILogger
        private class SeedDataLogger { }
        private const long STACK_OVERFLOW_LOOPS = 1_000_000;

        private const int MIN_ROLE_LEVEL = 1;
        private const int MAX_ROLE_LEVEL = 100;

        private const int EMPLOYEE_ROLES_COUNT = 1_000_0;
        private const int EMPLOYEES_COUNT = 1_000_0;
        private const int STORES_COUNT = 1_000_0;
        private const int STORE_SHIFTS_COUNT = 10_000_0;

        private const int USERS_COUNT = 10_0;
        private static readonly string PASSWORD = UsersController.HashPassword("a");
        private const AccessLevel ACCESS_LEVEL = AccessLevel.Regular;
        private const long PAGE_PREFERENCE = 5;

        public static async Task SeedUsersAndProfilesAsync(StoreContext context, int n)
        {
            if (await context.Users.AnyAsync()) return;
            //if (await context.UserProfiles.AnyAsync()) return;
            var existingUserIds = await context.Users.Select(u => u.Id).ToListAsync();
            var userNames = await context.Users.Select(u => u.Name).ToListAsync();

            // Generate users
            var users = new List<User>();
            var fakerUser = new Faker<User>()
                .RuleFor(u => u.Name, f => f.Internet.UserName())
                .RuleFor(u => u.Password, PASSWORD)
                .RuleFor(u => u.AccessLevel, ACCESS_LEVEL);

            // Loop n times and only add users with names that are not in the database
            for (int i = 0; i < n; i++)
            {
                var user = fakerUser.Generate();

                long current = 0;
                while (userNames.Contains(user.Name))
                {
                    if (current++ > STACK_OVERFLOW_LOOPS)
                        throw new Exception("Could not find a unique user name");

                    user = fakerUser.Generate();
                }

                users.Add(user);
                userNames.Add(user.Name);
            }

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();

            // Generate user profiles
            var newUserIds = await context.Users
                .Where(u => !existingUserIds.Contains(u.Id))
                .Select(u => u.Id).ToListAsync();

            var userProfiles = new List<UserProfile>();
            var fakerProfile = new Faker<UserProfile>()
                .RuleFor(up => up.Bio, f => string.Join("\n", f.Lorem.Paragraphs(3)))
                .RuleFor(up => up.Location, f => f.Address.City())
                .RuleFor(up => up.Birthday, f => f.Date.Between(DateTime.Now.AddYears(-60), DateTime.Now.AddYears(-18)))
                .RuleFor(up => up.Gender, f => f.PickRandom<Gender>())
                .RuleFor(up => up.MaritalStatus, f => f.PickRandom<MaritalStatus>())
                .RuleFor(up => up.PagePreference, PAGE_PREFERENCE);

            foreach (var userId in newUserIds)
            {
                var userProfile = fakerProfile.Generate();
                userProfile.UserId = userId;
                userProfiles.Add(userProfile);
            }

            await context.UserProfiles.AddRangeAsync(userProfiles);
            await context.SaveChangesAsync();
        }

        public static async Task SeedEmployeeRolesAsync(StoreContext context, int n)
        {
            if (await context.StoreEmployeeRoles.AnyAsync()) return;

            var userIds = await context.Users.Select(u => u.Id).ToListAsync();
            var randomUserId = new Func<long>(() => userIds[new Random().Next(userIds.Count)]);

            var faker = new Faker<StoreEmployeeRole>()
                .RuleFor(er => er.Name, f => f.Name.JobTitle())
                .RuleFor(er => er.Description, f => string.Join("\n", f.Lorem.Paragraphs(3)))
                .RuleFor(er => er.RoleLevel, f => f.Random.Int(MIN_ROLE_LEVEL, MAX_ROLE_LEVEL))
                .RuleFor(er => er.UserId, randomUserId());

            var employeeRoles = faker.Generate(n);

            await context.StoreEmployeeRoles.AddRangeAsync(employeeRoles);
            await context.SaveChangesAsync();
        }

        public static async Task SeedEmployeesAsync(StoreContext context, int n)
        {
            if (await context.StoreEmployees.AnyAsync()) return;

            var roleIds = await context.StoreEmployeeRoles.Select(er => er.Id).ToListAsync();
            var randomRoleId = new Func<long>(() => roleIds[new Random().Next(roleIds.Count)]);

            var userIds = await context.Users.Select(u => u.Id).ToListAsync();
            var randomUserId = new Func<long>(() => userIds[new Random().Next(userIds.Count)]);

            var faker = new Faker<StoreEmployee>()
                .RuleFor(e => e.FirstName, f => f.Name.FirstName())
                .RuleFor(e => e.LastName, f => f.Name.LastName())
                .RuleFor(e => e.Gender, f => f.PickRandom<Gender>())
                .RuleFor(e => e.EmploymentDate, f => f.Date.Between(DateTime.Now.AddYears(-10), DateTime.Now))
                .RuleFor(e => e.TerminationDate, (f, e) => e.EmploymentDate.HasValue && f.Random.Bool(0.2f) ? f.Date.Between(e.EmploymentDate.Value, DateTime.Now) : null)
                .RuleFor(e => e.Salary, f => Math.Round(f.Random.Double(30000, 120000), 2))
                .RuleFor(e => e.StoreEmployeeRoleId, randomRoleId())
                .RuleFor(e => e.UserId, randomUserId());

            var employees = faker.Generate(n);

            await context.StoreEmployees.AddRangeAsync(employees);
            await context.SaveChangesAsync();
        }

        public static async Task SeedStoresAsync(StoreContext context, int n)
        {
            if (await context.Stores.AnyAsync()) return;

            var userIds = await context.Users.Select(u => u.Id).ToListAsync();
            var randomUserId = new Func<long>(() => userIds[new Random().Next(userIds.Count)]);

            var faker = new Faker<Store>()
                .RuleFor(s => s.Name, f => $"{f.Company.CompanyName()} Store")
                .RuleFor(s => s.Description, f => string.Join("\n", f.Lorem.Paragraphs(3)))
                .RuleFor(s => s.Category, f => f.PickRandom<StoreCategory>())
                .RuleFor(s => s.Address, f => f.Address.StreetAddress())
                .RuleFor(s => s.City, f => f.Address.City())
                .RuleFor(s => s.State, f => f.Address.StateAbbr())
                .RuleFor(s => s.ZipCode, f => f.Address.ZipCode())
                .RuleFor(s => s.Country, f => f.Address.Country())
                .RuleFor(s => s.OpenDate, f => f.Date.Between(DateTime.Now.AddYears(-20), DateTime.Now))
                .RuleFor(s => s.CloseDate, (f, s) => s.OpenDate.HasValue && f.Random.Bool(0.1f) ? f.Date.Between(s.OpenDate.Value, DateTime.Now) : null)
                .RuleFor(s => s.UserId, randomUserId());

            var stores = faker.Generate(n);

            await context.Stores.AddRangeAsync(stores);
            await context.SaveChangesAsync();
        }

        private class StoreEmployeePair
        {
            public long StoreId { get; set; }
            public long EmployeeId { get; set; }
        }

        public static async Task SeedStoreShiftsAsync(StoreContext context, int n)
        {
            if (await context.StoreShifts.AnyAsync()) return;

            var storeIds = await context.Stores.Select(s => s.Id).ToListAsync();
            var employeeIds = await context.StoreEmployees.Select(e => e.Id).ToListAsync();

            var storeShifts = new List<StoreShift>();
            var faker = new Faker<StoreShift>()
                .RuleFor(ss => ss.StartDate, f => f.Date.Between(DateTime.Now.AddYears(-5), DateTime.Now))
                .RuleFor(ss => ss.EndDate, (f, ss) => ss.StartDate.HasValue ? f.Date.Between(ss.StartDate.Value, DateTime.Now) : null)
                .RuleFor(ss => ss.UserId, f => f.Random.Int(1, n));

            // store generated store and employee ID pairs in a list
            // to prevent duplicate store shifts
            var storeEmployeePairs = new List<StoreEmployeePair>();

            // Add all existing store shifts to the pairs list
            storeEmployeePairs.AddRange(await context.StoreShifts.Select(ss => new StoreEmployeePair { StoreId = ss.StoreId, EmployeeId = ss.StoreEmployeeId }).ToListAsync());

            // define lambda for random pair of store and employee that checks for duplicates
            var randomStoreEmployeePair = new Func<StoreEmployeePair>(() =>
            {
                var storeId = storeIds[new Random().Next(storeIds.Count)];
                var employeeId = employeeIds[new Random().Next(employeeIds.Count)];

                long current = 0;
                while (storeEmployeePairs.Any(p => p.StoreId == storeId && p.EmployeeId == employeeId))
                {
                    if (current++ > 1000)
                        throw new Exception("Could not find a unique pair of store and employee");

                    storeId = storeIds[new Random().Next(storeIds.Count)];
                    employeeId = employeeIds[new Random().Next(employeeIds.Count)];
                }
                var pair = new StoreEmployeePair { StoreId = storeId, EmployeeId = employeeId };
                return pair;
            });


            for (int i = 0; i < n; i++)
            {
                var storeShift = faker.Generate();

                // get a unique pair using the lambda
                var pair = randomStoreEmployeePair();
                storeShift.StoreId = pair.StoreId;
                storeShift.StoreEmployeeId = pair.EmployeeId;

                storeShifts.Add(storeShift);
            }

            await context.StoreShifts.AddRangeAsync(storeShifts);
            await context.SaveChangesAsync();
        }

        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using (var context = new StoreContext(serviceProvider.GetRequiredService<DbContextOptions<StoreContext>>()))
            {
                var logger = serviceProvider.GetRequiredService<ILogger<SeedDataLogger>>();
                logger.LogInformation("Seeding process started at {time}", DateTimeOffset.UtcNow);

                await SeedUsersAndProfilesAsync(context, USERS_COUNT);
                await SeedEmployeeRolesAsync(context, EMPLOYEE_ROLES_COUNT);
                await SeedEmployeesAsync(context, EMPLOYEES_COUNT);
                await SeedStoresAsync(context, STORES_COUNT);
                await SeedStoreShiftsAsync(context, STORE_SHIFTS_COUNT);

                logger.LogInformation("Seeding process finished at {time}", DateTimeOffset.UtcNow);
            }
        }
    }
}
