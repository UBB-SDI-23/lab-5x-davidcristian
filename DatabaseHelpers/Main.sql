USE [store]
GO

-- Drop constraints
ALTER TABLE StoreShifts DROP CONSTRAINT FK_StoreShifts_StoreEmployees_StoreEmployeeId;
ALTER TABLE StoreShifts DROP CONSTRAINT FK_StoreShifts_Stores_StoreId;
ALTER TABLE StoreEmployees DROP CONSTRAINT FK_StoreEmployees_StoreEmployeeRoles_StoreEmployeeRoleId;
GO

TRUNCATE TABLE StoreShifts
TRUNCATE TABLE Stores
TRUNCATE TABLE StoreEmployees
TRUNCATE TABLE StoreEmployeeRoles
GO

-- BULK INSERT data from CSV files
BULK INSERT StoreEmployeeRoles
FROM '/home/mssql/csv/employee_roles.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 1, FIELDTERMINATOR = ',', ROWTERMINATOR = '\n');
GO

BULK INSERT StoreEmployees
FROM '/home/mssql/csv/employees.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 1, FIELDTERMINATOR = ',', ROWTERMINATOR = '\n');
GO

BULK INSERT Stores
FROM '/home/mssql/csv/stores.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 1, FIELDTERMINATOR = ',', ROWTERMINATOR = '\n');
GO

BULK INSERT StoreShifts
FROM '/home/mssql/csv/store_shifts.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 1, FIELDTERMINATOR = ',', ROWTERMINATOR = '\n');
GO

-- Recreate constraints
ALTER TABLE StoreEmployees
ADD CONSTRAINT FK_StoreEmployees_StoreEmployeeRoles_StoreEmployeeRoleId FOREIGN KEY (StoreEmployeeRoleId) REFERENCES StoreEmployeeRoles (Id);

ALTER TABLE StoreShifts
ADD CONSTRAINT FK_StoreShifts_Stores_StoreId FOREIGN KEY (StoreId) REFERENCES Stores (Id),
	CONSTRAINT FK_StoreShifts_StoreEmployees_StoreEmployeeId FOREIGN KEY (StoreEmployeeId) REFERENCES StoreEmployees (Id);
GO

SELECT COUNT(*) AS 'Roles' FROM StoreEmployeeRoles
SELECT COUNT(*) AS 'Employees' FROM StoreEmployees
SELECT COUNT(*) AS 'Stores' FROM Stores
SELECT COUNT(*) AS 'Shifts' FROM StoreShifts
