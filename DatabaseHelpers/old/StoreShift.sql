USE [store]
GO

-- Procedure to insert 10,000,000 StoreShifts records
CREATE OR ALTER PROCEDURE [InsertStoreShifts]
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @i INT = 1;

	WHILE (@i <= 10000000)
	BEGIN
		DECLARE @storeId INT = RAND() * 1000000 + 1;
		DECLARE @storeEmployeeId INT = RAND() * 1000000 + 1;

		INSERT INTO [StoreShifts] ([StartDate], [EndDate], [StoreId], [StoreEmployeeId])
		VALUES (DATEADD(HOUR, -RAND() * 24, GETDATE()), DATEADD(HOUR, RAND() * 24, GETDATE()), @storeId, @storeEmployeeId);

		SET @i = @i + 1;
	END;
END;

EXEC [InsertStoreShifts]
GO

SET NOCOUNT OFF;
GO

SELECT TOP 50 * FROM [StoreShifts]
