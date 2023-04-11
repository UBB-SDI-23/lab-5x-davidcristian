USE [store]
GO

-- Procedure to insert 1,000,000 Stores records
CREATE OR ALTER PROCEDURE [InsertStores]
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @i INT = 1;

    WHILE (@i <= 1000000)
    BEGIN
        DECLARE @category INT = RAND() * 4;
        DECLARE @openDate DATETIME = DATEADD(DAY, -RAND() * 3650, GETDATE());
        DECLARE @closeDate DATETIME = NULL;

        IF (@i % 10 = 0)
        BEGIN
            SET @closeDate = DATEADD(DAY, RAND() * 365, @openDate);
        END;

        INSERT INTO [Stores] ([Name], [Description], [Category], [Address], [City], [State], [ZipCode], [Country], [OpenDate], [CloseDate])
        VALUES (CONCAT('Store ', @i), CONCAT('Description ', @i), @category, CONCAT('Address ', @i), CONCAT('City ', @i), CONCAT('State ', @i), CONCAT('Zip ', @i), CONCAT('Country ', @i), @openDate, @closeDate);

        SET @i = @i + 1;
    END;
END;

EXEC [InsertStores]
GO

SET NOCOUNT OFF;
GO

SELECT TOP 50 * FROM [Stores]
