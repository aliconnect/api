USE [aim1]
GO
ALTER PROCEDURE [account].[delete_account] @Id INT
AS
	UPDATE item.dt SET DeletedDateTime=GETDATE() WHERE Id=@Id
GO
