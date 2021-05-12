USE [aim1]
GO
ALTER PROCEDURE [dbo].[setHost] (@FromId BIGINT, @ToId BIGINT) AS
	SET NOCOUNT ON
	DECLARE @T TABLE (Id BIGINT);
	WITH P(Level,Id) AS (
		SELECT 0,I.ID
		FROM item.dt I
		WHERE I.id = @FromID
		UNION ALL
		SELECT Level+1,I.id
		FROM P INNER JOIN item.dt I ON I.masterId = P.ID and level<30
	)
	INSERT @T SELECT ID FROM P
	--SELECT * FROM @T
	UPDATE item.dt SET HostId=@ToId WHERE Id IN (SELECT Id FROM @T)
	UPDATE item.dt SET MasterID=@ToId WHERE MasterId=@FromId
	UPDATE attribute.dt SET HostId=@ToId WHERE ItemId IN (SELECT Id FROM @T)
	UPDATE attribute.dt SET LinkID=@ToId WHERE LinkId = @FromId
GO
