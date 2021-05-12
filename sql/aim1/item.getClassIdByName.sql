USE [aim1]
GO
ALTER FUNCTION [item].[getClassIdByName] (@hostId BIGINT, @class VARCHAR(100)) RETURNS BIGINT
	BEGIN
		DECLARE @classId BIGINT
		SELECT @classId = id FROM item.dt WHERE deletedDateTime IS NULL AND hostID=@hostId AND classId=0 AND name=@class
		RETURN @classId
	END
GO
