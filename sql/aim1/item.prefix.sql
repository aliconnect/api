USE [aim1]
GO
ALTER FUNCTION [item].[prefix] (@id INT) RETURNS VARCHAR(250)
	BEGIN
		DECLARE @Value VARCHAR (MAX), @i TINYINT
		SET @i = 0
		WHILE @value IS NULL AND @id IS NOT NULL AND @id <> 0 AND @i<10
		BEGIN
			SELECT 
			@Value = prefix,
			@id = ISNULL(ISNULL(inheritedId, srcId),classId) 
			FROM item.dv
			WHERE id=@id
			SET @i = @i + 1
		END
		RETURN @Value
	END
GO
