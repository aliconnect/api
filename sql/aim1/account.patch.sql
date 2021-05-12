USE [aim1]
GO
ALTER PROCEDURE [account].[patch] @email VARCHAR(500), @host VARCHAR(50)
AS
	DECLARE @userID INT,@hostID INT
	SELECT @userID=UserID FROM account.vw WHERE email=@email-- AND hostname=@host
	SELECT @UserID
GO
