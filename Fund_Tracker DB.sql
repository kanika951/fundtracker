CREATE DATABASE [gtdFund]
GO

USE [gtdFund]
GO


CREATE TABLE [Role]
( 
    [Id] SMALLINT NOT NULL, 
    [Name] VARCHAR(50) NOT NULL,
	CONSTRAINT [PK_Roles] PRIMARY KEY 
	(
		[Id]
	)
)
GO

 CREATE TABLE [User]
 (
    [Id] INT NOT NULL IDENTITY(1, 1),
	[Email] NVARCHAR(50) NOT NULL,
	[Verified] BIT NOT NULL,
	[UserName] NVARCHAR(100) NOT NULL,
	[FullName] NVARCHAR(100) NOT NULL,
	[PasswordHash] VARBINARY(2000) NOT NULL,
	[PasswordSalt] VARBINARY(2000) NOT NULL,
	[PhoneNumber] VARCHAR(50) NOT NULL,
	[JoiningDate] DATETIME NOT NULL,
	[Designation] VARCHAR(100) NOT NULL,
	[Gender] VARCHAR(20) NOT NULL,
	[PendingAmount] DECIMAL(7, 2) NOT NULL,
	[Status] NVARCHAR(30) NOT NULL,
	CONSTRAINT [PK_Users] PRIMARY KEY 
	(
		[Id]
	)
 )

 ALTER TABLE [User] ADD CONSTRAINT [UQ_User_UserName] UNIQUE([UserName])
 ALTER TABLE [User] ADD CONSTRAINT [CHK_User_Status] CHECK ([Status] IN ('Active', 'In-Active'))
 ALTER TABLE [User] ADD CONSTRAINT [CHK_User_PhoneNumber] CHECK(LEN([PhoneNumber]) >= 10)
 ALTER TABLE [User] ADD CONSTRAINT [CHK_User_Gender] CHECK ([Gender] IN ('Female', 'Male', 'Other'))
 GO

 CREATE TABLE [UserRole]
 (
	[UserId] INT NOT NULL,
	[RoleId] SMALLINT NOT NULL,
	CONSTRAINT [PK_UserRole] PRIMARY KEY 
	(
		[UserId],
		[RoleId]
	)
 )

 ALTER TABLE [UserRole] ADD CONSTRAINT [FK_UserRole_User] FOREIGN KEY (UserId) REFERENCES [User](Id)
 GO

 CREATE TABLE [Contribution]
 (
	[Id] INT NOT NULL IDENTITY(1, 1), 
    [UserId] INT NOT NULL,
	[Amount] DECIMAL(5,2) NOT NULL,
	[ContributionDate] DATETIME NOT NULL,
	[CreatedDate] DATETIME NOT NULL,
	[Status] VARCHAR(20) NOT NULL,
	[Remarks] NVARCHAR(200) NOT NULL
	CONSTRAINT [PK_Contribution] PRIMARY KEY
	(
		[Id]
	)
 )

 ALTER TABLE [Contribution] ADD CONSTRAINT FK_Contribution_User FOREIGN KEY (UserId) REFERENCES [User](Id)
 ALTER TABLE [Contribution] ADD CONSTRAINT CHK_Contribution_Status CHECK ([Status] IN ('Pending', 'Denied', 'Accepted'))
 GO

 CREATE TABLE [Spending]
 (
    [Id] INT NOT NULL IDENTITY(1, 1),
	[SpendDate] DATETIME NOT NULL,
	[Amount] DECIMAL(7,2) NOT NULL,
	[UserId] INT NOT NULL,
	[UsedFor] NVARCHAR(200) NOT NULL
	CONSTRAINT [PK_Spending] PRIMARY KEY
	(
	  [Id]
	)
 )

 ALTER TABLE [Spending] ADD CONSTRAINT FK_Spending_User FOREIGN KEY (UserId) REFERENCES [User](Id)
 GO

CREATE OR ALTER PROCEDURE sp_add_contribution (@userId INT, @status VARCHAR(20), @amount DECIMAL(5,2), @contributionDate DATETIME)
AS
BEGIN
  INSERT INTO [Contribution] ([UserId], [Amount], [Status], [Remarks], [ContributionDate], [CreatedDate])
  VALUES (@userId, @amount, @status, '-', @contributionDate, GETUTCDATE())
END
GO

CREATE OR ALTER PROCEDURE sp_add_spending (@spendingDate DATETIME, @amount DECIMAL(7,2), @userId INT, @usedFor NVARCHAR(200))
AS
BEGIN
   INSERT INTO [Spending] ([SpendDate], [Amount], [UserId], [UsedFor])
   VALUES (@spendingDate, @amount, @userId, @usedFor)
END
GO

 