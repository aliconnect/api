USE [aim1]
GO
ALTER VIEW [item].[host] AS
	SELECT * FROM item.vw WHERE hostID=1 AND classID=1002 AND keyname IS NOT NULL
GO
