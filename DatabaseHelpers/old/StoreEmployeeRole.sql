USE [store]
GO

-- Procedure to insert 1,000,000 StoreEmployeeRoles records
CREATE OR ALTER PROCEDURE [InsertStoreEmployeeRoles]
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @i INT = 1;

    WHILE (@i <= 1000000)
    BEGIN
        INSERT INTO [StoreEmployeeRoles] ([Name], [Description], [RoleLevel])
        VALUES (CONCAT('Role_', @i), CONCAT('Description_', @i), @i % 10);

        SET @i = @i + 1;
    END;
END;

EXEC [InsertStoreEmployeeRoles]
GO

SET NOCOUNT OFF;
GO

SELECT TOP 50 * FROM [StoreEmployeeRoles]
