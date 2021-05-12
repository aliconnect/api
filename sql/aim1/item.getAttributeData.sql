USE [aim1]
GO
ALTER FUNCTION [item].[getAttributeData] (@id BIGINT, @name VARCHAR(50)) RETURNS VARCHAR(MAX)
	BEGIN
		DECLARE @Value BIGINT, @i TINYINT, @stop BIT, @NameID INT
		SELECT @i = 0, @NameID = id FROM attribute.name WHERE name = @name
		WHILE @id IS NOT NULL AND @i<50 AND @stop IS NULL
		BEGIN 
			SELECT @stop = 0, @i = @i + 1
			SELECT @Value = Data FROM attribute.dt WHERE itemid = @id AND nameID = @NameID
			IF @Value IS NULL SELECT @stop = null, @id = ISNULL(ISNULL(inheritedId,srcID),classId) FROM item.dt WHERE id = @id
		END
		RETURN @Value
	END
GO
