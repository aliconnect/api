USE [aim1]
GO
ALTER VIEW [item].[dv]
AS
	SELECT * FROM item.dt 
	WHERE DeletedDateTime IS NULL 
GO
