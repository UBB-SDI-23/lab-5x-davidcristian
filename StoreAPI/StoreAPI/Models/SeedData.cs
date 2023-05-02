using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;

namespace StoreAPI.Models;

public static class SeedData
{
    private static void SeedEmployeeRoles(StoreContext context)
    {
        if (context.StoreEmployeeRoles.Any())
            return;

        context.StoreEmployeeRoles.AddRange(
            new StoreEmployeeRole
            {
                Name = "Trainee",
                Description = "New employee",
                RoleLevel = 1
            },
            new StoreEmployeeRole
            {
                Name = "Warehouse Worker",
                Description = "More than 3 months tenure",
                RoleLevel = 2
            },
            new StoreEmployeeRole
            {
                Name = "Forklift Operator",
                Description = "More than 1 year tenure",
                RoleLevel = 3
            },
            new StoreEmployeeRole
            {
                Name = "Cashier",
                Description = "More than 3 years tenure",
                RoleLevel = 4
            },
            new StoreEmployeeRole
            {
                Name = "Assistant",
                Description = "More than 5 years tenure",
                RoleLevel = 5
            },
            new StoreEmployeeRole
            {
                Name = "Shift Manager",
                Description = "More than 10 years tenure",
                RoleLevel = 6
            },
            new StoreEmployeeRole
            {
                Name = "Store Manager",
                Description = "More than 15 years tenure",
                RoleLevel = 7
            },
            new StoreEmployeeRole
            {
                Name = "Regional Manager",
                Description = "More than 20 years tenure",
                RoleLevel = 8
            },
            new StoreEmployeeRole
            {
                Name = "CFO",
                Description = "More than 25 years tenure",
                RoleLevel = 9
            },
            new StoreEmployeeRole
            {
                Name = "CEO",
                Description = "More than 30 years tenure",
                RoleLevel = 10
            }
        );

        context.SaveChanges();
    }

    private static void SeedEmployees(StoreContext context)
    {
        if (context.StoreEmployees.Any())
            return;

        var storeEmployeeRoles = context.StoreEmployeeRoles.ToList();
        if (storeEmployeeRoles.Count == 0)
            throw new Exception("No employee roles found");

        Func<StoreEmployeeRole> randomRole = () => storeEmployeeRoles[new Random().Next(0, storeEmployeeRoles.Count)];

        // random day between 2015 and 2022
        Func<DateTime> randomDate = () => new DateTime(
            new Random().Next(2015, 2022),
            new Random().Next(1, 12),
            new Random().Next(1, 28));

        context.StoreEmployees.AddRange(
            new StoreEmployee
            {
                FirstName = "John",
                LastName = "Doe",
                Gender = Gender.Male,
                EmploymentDate = randomDate(),
                TerminationDate = null,
                StoreEmployeeRole = randomRole(),
                Salary = 1000
            },
            new StoreEmployee
            {
                FirstName = "Jane",
                LastName = "Smith",
                Gender = Gender.Female,
                EmploymentDate = randomDate(),
                TerminationDate = null,
                StoreEmployeeRole = randomRole(),
                Salary = 2000
            },
            new StoreEmployee
            {
                FirstName = "Oliver",
                LastName = "Karlsen",
                Gender = Gender.Male,
                EmploymentDate = randomDate(),
                TerminationDate = null,
                StoreEmployeeRole = randomRole(),
                Salary = 3000
            },
            new StoreEmployee
            {
                FirstName = "Jane",
                LastName = "Wilson",
                Gender = Gender.Female,
                EmploymentDate = randomDate(),
                TerminationDate = null,
                StoreEmployeeRole = randomRole(),
                Salary = 4000
            },
            new StoreEmployee
            {
                FirstName = "Alice",
                LastName = "White",
                Gender = Gender.Other,
                EmploymentDate = randomDate(),
                TerminationDate = null,
                StoreEmployeeRole = randomRole(),
                Salary = 5000
            },
            new StoreEmployee
            {
                FirstName = "Emma",
                LastName = "Brown",
                Gender = Gender.Female,
                EmploymentDate = randomDate(),
                TerminationDate = null,
                StoreEmployeeRole = randomRole(),
                Salary = 6000
            },
            new StoreEmployee
            {
                FirstName = "Mia",
                LastName = "Walker",
                Gender = Gender.Female,
                EmploymentDate = randomDate(),
                TerminationDate = null,
                StoreEmployeeRole = randomRole(),
                Salary = 7000
            },
            new StoreEmployee
            {
                FirstName = "Jack",
                LastName = "Evans",
                Gender = Gender.Male,
                EmploymentDate = randomDate(),
                TerminationDate = null,
                StoreEmployeeRole = randomRole(),
                Salary = 8000
            },
            new StoreEmployee
            {
                FirstName = "Charlie",
                LastName = "Gonzales",
                Gender = Gender.Other,
                EmploymentDate = randomDate(),
                TerminationDate = null,
                StoreEmployeeRole = randomRole(),
                Salary = 9000
            },
            new StoreEmployee
            {
                FirstName = "Henry",
                LastName = "Wood",
                Gender = Gender.Male,
                EmploymentDate = randomDate(),
                TerminationDate = null,
                StoreEmployeeRole = randomRole(),
                Salary = 10000
            }
        );

        context.SaveChanges();
    }

    private static void SeedStores(StoreContext context)
    {
        if (context.Stores.Any())
            return;

        // random day between 2000 and 2020
        Func<DateTime> randomDay = () => new DateTime(
            new Random().Next(2000, 2020),
            new Random().Next(1, 12),
            new Random().Next(1, 28));

        context.Stores.AddRange(
            new Store
            {
                Name = "Burger King",
                Description = "Fast food restaurant",
                Category = StoreCategory.Food,
                Address = "123 Main Street",
                City = "New York",
                State = "NY",
                ZipCode = "10001",
                Country = "USA",
                OpenDate = randomDay(),
                CloseDate = null,
            },
            new Store
            {
                Name = "McDonalds",
                Description = "Fast food restaurant",
                Category = StoreCategory.Food,
                Address = "456 Main Street",
                City = "New York",
                State = "NY",
                ZipCode = "10001",
                Country = "USA",
                OpenDate = randomDay(),
                CloseDate = null,
            },
            new Store
            {
                Name = "Wendy's",
                Description = "Fast food restaurant",
                Category = StoreCategory.Food,
                Address = "789 Main Street",
                City = "New York",
                State = "NY",
                ZipCode = "10001",
                Country = "USA",
                OpenDate = randomDay(),
                CloseDate = null,
            },
            new Store
            {
                Name = "Target",
                Description = "Department store",
                Category = StoreCategory.General,
                Address = "123 Main Street",
                City = "New York",
                State = "NY",
                ZipCode = "10001",
                Country = "USA",
                OpenDate = randomDay(),
                CloseDate = null,
            },
            new Store
            {
                Name = "Walmart",
                Description = "Department store",
                Category = StoreCategory.General,
                Address = "456 Main Street",
                City = "New York",
                State = "NY",
                ZipCode = "10001",
                Country = "USA",
                OpenDate = randomDay(),
                CloseDate = null,
            },
            new Store
            {
                Name = "Best Buy",
                Description = "Electronics store",
                Category = StoreCategory.Electronics,
                Address = "789 Main Street",
                City = "New York",
                State = "NY",
                ZipCode = "10001",
                Country = "USA",
                OpenDate = randomDay(),
                CloseDate = null,
            },
            new Store
            {
                Name = "Apple",
                Description = "Electronics store",
                Category = StoreCategory.Electronics,
                Address = "123 Main Street",
                City = "New York",
                State = "NY",
                ZipCode = "10001",
                Country = "USA",
                OpenDate = randomDay(),
                CloseDate = null,
            },
            new Store
            {
                Name = "Microsoft",
                Description = "Electronics store",
                Category = StoreCategory.Electronics,
                Address = "456 Main Street",
                City = "New York",
                State = "NY",
                ZipCode = "10001",
                Country = "USA",
                OpenDate = randomDay(),
                CloseDate = null,
            },
            new Store
            {
                Name = "Google",
                Description = "Electronics store",
                Category = StoreCategory.Electronics,
                Address = "789 Main Street",
                City = "New York",
                State = "NY",
                ZipCode = "10001",
                Country = "USA",
                OpenDate = randomDay(),
                CloseDate = null,
            },
            new Store
            {
                Name = "Amazon",
                Description = "Electronics store",
                Category = StoreCategory.Electronics,
                Address = "123 Main Street",
                City = "New York",
                State = "NY",
                ZipCode = "10001",
                Country = "USA",
                OpenDate = randomDay(),
                CloseDate = null,
            }
        );

        context.SaveChanges();
    }

    private static void SeedStoreShifts(StoreContext context)
    {
        if (context.StoreShifts.Any())
            return;

        var stores = context.Stores.ToList();
        if (stores.Count == 0)
            throw new Exception("No stores found");

        var employees = context.StoreEmployees.ToList();
        if (employees.Count == 0)
            throw new Exception("No employees found");


        // Store generated store and employee ID pairs in a list
        // to prevent duplicate store shifts
        var storeEmployeePairs = new List<(long, long)>();

        // define lambda for random pair of store and employee that checks for duplicates
        Func<(long, long)> randomStoreEmployeePair = () =>
        {
            (long, long) pair = (0, 0);

            do
            {
                var store = stores[new Random().Next(0, stores.Count)];
                var employee = employees[new Random().Next(0, employees.Count)];

                pair = (store.Id, employee.Id);

                if (!storeEmployeePairs.Contains(pair))
                {
                    storeEmployeePairs.Add(pair);
                    return pair;
                }

            } while (storeEmployeePairs.Contains(pair));

            return pair;
        };

        context.StoreShifts.AddRange(
            Enumerable.Range(0, 10).Select(_ =>
            {
                var (storeId, employeeId) = randomStoreEmployeePair();
                return new StoreShift
                {
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddHours(8),
                    StoreId = storeId,
                    StoreEmployeeId = employeeId,
                };
            })
        );

        context.SaveChanges();
    }

    public static void Initialize(IServiceProvider serviceProvider)
    {
        using (var context = new StoreContext(serviceProvider.GetRequiredService<DbContextOptions<StoreContext>>()))
        {
            return;

            SeedEmployeeRoles(context);
            SeedEmployees(context);

            SeedStores(context);

            SeedStoreShifts(context);
        }
    }
}