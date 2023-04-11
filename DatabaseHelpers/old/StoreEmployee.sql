USE [store]
GO

-- Procedure to insert 1,000,000 StoreEmployees records
CREATE OR ALTER PROCEDURE [InsertStoreEmployees]
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @i INT = 1;

    WHILE (@i <= 1000000)
    BEGIN
        DECLARE @gender INT = RAND() * 2;
        DECLARE @employmentDate DATETIME = DATEADD(DAY, -RAND() * 3650, GETDATE());
        DECLARE @terminationDate DATETIME = NULL;
        DECLARE @salary DECIMAL(18, 2) = RAND() * 100000 + 20000;

        IF (@i % 10 = 0)
        BEGIN
            SET @terminationDate = DATEADD(DAY, RAND() * 365, @employmentDate);
        END;

        INSERT INTO [StoreEmployees] ([FirstName], [LastName], [Gender], [EmploymentDate], [TerminationDate], [Salary], [StoreEmployeeRoleId])
        VALUES (CONCAT('First ', @i), CONCAT('Last ', @i), @gender, @employmentDate, @terminationDate, @salary, @i % 100000 + 1);

        SET @i = @i + 1;
    END;
END;

EXEC [InsertStoreEmployees]
GO

SET NOCOUNT OFF;
GO

SELECT TOP 50 * FROM [StoreEmployees]
