USE [aim1]
GO
ALTER procedure [item].[data]
	@host VARCHAR(50) = NULL,
	@hostId BIGINT = NULL,
	@userId BIGINT,
	@itemlist itemlist READONLY
AS
	DECLARE @hostitems itemlist
	IF @hostId IS NULL SELECT @hostId = id FROM item.dv WHERE hostId=1 AND classID=1002 AND keyname = @host
	INSERT @hostitems SELECT id FROM item.dt WHERE deletedDateTime IS NULL AND hostID = @hostId AND id IN (SELECT id FROM @itemlist)

	SELECT name as name,id AS _ID,* FROM item.vw WHERE id IN (SELECT id FROM @hostitems)
	SELECT * FROM attribute.vw WHERE hostId = @hostId AND itemid IN (SELECT id FROM @hostitems)
GO

--[item].[setAttribute] @itemID=3688025, @name='code', @value='25206', @encrypt=1
--exec account.get @accountname='test.twee@alicon.nl', @code='25206'
--select * from attribute.vw where itemid = 3688025

--select value,PWDCOMPARE('25206',value) from attribute.dt where id = 3096353


SET NOCOUNT ON;DECLARE @itemlist itemlist;
INSERT INTO @itemlist SELECT id FROM item.dv WHERE classId = 0 AND name in ('$keys');
EXECUTE item.data @hostId=3664251, @userId=265090, @itemlist=@itemlist


