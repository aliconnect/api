USE [aim1]
GO
ALTER FUNCTION [item].[schemaPath] (@id INT) RETURNS VARCHAR(250)
	BEGIN
		DECLARE @Value VARCHAR (MAX), @i TINYINT
		--SET @Value = 'Item'
		SET @i = 0
		WHILE @id IS NOT NULL AND @id <> 0 AND @i<50
		BEGIN
			SELECT 
			@Value = CASE WHEN @i>0 AND I.classId=0 THEN ISNULL(@Value+ ':', '')  + name ELSE @Value END, 
			@id = COALESCE(inheritedId, classId, srcId)
			FROM item.dv I
			WHERE id=@id
			SET @i = @i + 1
		END
		RETURN isnull(@value,'Item')
	END
GO
