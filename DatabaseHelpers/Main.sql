USE [store]
GO

-- Drop constraints
ALTER TABLE StoreShifts DROP CONSTRAINT FK_StoreShifts_Stores_StoreId;
ALTER TABLE StoreShifts DROP CONSTRAINT FK_StoreShifts_StoreEmployees_StoreEmployeeId;
ALTER TABLE StoreEmployees DROP CONSTRAINT FK_StoreEmployees_StoreEmployeeRoles_StoreEmployeeRoleId;

ALTER TABLE ConfirmationCodes DROP CONSTRAINT FK_ConfirmationCodes_Users_UserId;
ALTER TABLE UserProfiles DROP CONSTRAINT FK_UserProfiles_Users_UserId;

ALTER TABLE StoreShifts DROP CONSTRAINT FK_StoreShifts_Users_UserId;
ALTER TABLE Stores DROP CONSTRAINT FK_Stores_Users_UserId;
ALTER TABLE StoreEmployees DROP CONSTRAINT FK_StoreEmployees_Users_UserId;
ALTER TABLE StoreEmployeeRoles DROP CONSTRAINT FK_StoreEmployeeRoles_Users_UserId;
GO

TRUNCATE TABLE ConfirmationCodes
TRUNCATE TABLE UserProfiles
TRUNCATE TABLE Users

TRUNCATE TABLE StoreShifts
TRUNCATE TABLE Stores
TRUNCATE TABLE StoreEmployees
TRUNCATE TABLE StoreEmployeeRoles
GO

-- BULK INSERT data from CSV files
BULK INSERT Users
FROM '/home/mssql/csv/users.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 1, FIELDTERMINATOR = ',', ROWTERMINATOR = '\r\n');
GO

BULK INSERT UserProfiles
FROM '/home/mssql/csv/user_profiles.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 1, FIELDTERMINATOR = ',', ROWTERMINATOR = '\r\n');
GO

BULK INSERT StoreEmployeeRoles
FROM '/home/mssql/csv/employee_roles.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 1, FIELDTERMINATOR = ',', ROWTERMINATOR = '\r\n');
GO

BULK INSERT StoreEmployees
FROM '/home/mssql/csv/employees.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 1, FIELDTERMINATOR = ',', ROWTERMINATOR = '\r\n');
GO

BULK INSERT Stores
FROM '/home/mssql/csv/stores.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 1, FIELDTERMINATOR = ',', ROWTERMINATOR = '\r\n');
GO

BULK INSERT StoreShifts
FROM '/home/mssql/csv/store_shifts.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 1, FIELDTERMINATOR = ',', ROWTERMINATOR = '\r\n');
GO

-- Recreate constraints
ALTER TABLE StoreEmployees
ADD CONSTRAINT FK_StoreEmployees_StoreEmployeeRoles_StoreEmployeeRoleId FOREIGN KEY (StoreEmployeeRoleId) REFERENCES StoreEmployeeRoles (Id);

ALTER TABLE StoreShifts
ADD CONSTRAINT FK_StoreShifts_Stores_StoreId FOREIGN KEY (StoreId) REFERENCES Stores (Id),
	CONSTRAINT FK_StoreShifts_StoreEmployees_StoreEmployeeId FOREIGN KEY (StoreEmployeeId) REFERENCES StoreEmployees (Id);

ALTER TABLE UserProfiles
ADD CONSTRAINT FK_UserProfiles_Users_UserId FOREIGN KEY (UserId) REFERENCES Users (Id);
ALTER TABLE ConfirmationCodes
ADD CONSTRAINT FK_ConfirmationCodes_Users_UserId FOREIGN KEY (UserId) REFERENCES Users (Id);

ALTER TABLE StoreEmployeeRoles
ADD CONSTRAINT FK_StoreEmployeeRoles_Users_UserId FOREIGN KEY (UserId) REFERENCES Users (ID);
ALTER TABLE StoreEmployees
ADD CONSTRAINT FK_StoreEmployees_Users_UserId FOREIGN KEY (UserId) REFERENCES Users (ID);
ALTER TABLE Stores
ADD CONSTRAINT FK_Stores_Users_UserId FOREIGN KEY (UserId) REFERENCES Users (ID);
ALTER TABLE StoreShifts
ADD CONSTRAINT FK_StoreShifts_Users_UserId FOREIGN KEY (UserId) REFERENCES Users (ID);
GO

SELECT COUNT(*) AS 'Users' FROM Users
SELECT COUNT(*) AS 'UserProfiles' FROM UserProfiles

SELECT COUNT(*) AS 'Roles' FROM StoreEmployeeRoles
SELECT COUNT(*) AS 'Employees' FROM StoreEmployees
SELECT COUNT(*) AS 'Stores' FROM Stores
SELECT COUNT(*) AS 'Shifts' FROM StoreShifts

SELECT * FROM ConfirmationCodes
SELECT TOP 10 * FROM Users
GO

INSERT INTO Users([Name], [Password], [AccessLevel])
VALUES
	('a', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 3),
	('b', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 2),
	('c', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 1),
	('d', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 0)

GO

INSERT INTO UserProfiles([UserId], [Bio], [Location], [Birthday], [Gender], [MaritalStatus], [PagePreference])
VALUES
	(10001, 'bio a', 'location a', '2000-01-01 00:00:00.0000000', 0, 0, 5),
	(10002, 'bio b', 'location b', '2000-01-01 00:00:00.0000000', 1, 1, 5),
	(10003, 'bio c', 'location c', '2000-01-01 00:00:00.0000000', 2, 2, 5),
	(10004, 'bio d', 'location d', '2000-01-01 00:00:00.0000000', 0, 3, 5)
GO

SELECT * FROM Users WHERE [Name] IN ('a', 'b', 'c', 'd')
SELECT * FROM UserProfiles WHERE [UserId] IN (10001, 10002, 10003, 10004)
GO
