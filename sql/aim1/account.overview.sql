USE [aim1]
GO
ALTER PROCEDURE account.overview @Id INT
AS
	SELECT * FROM item.vw WHERE id=@id
	SELECT * FROM attribute.vw WHERE itemId=@id
GO
EXEC account.overview 265090
