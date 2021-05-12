USE [aim1]
GO
ALTER FUNCTION [item].[schemaNameArray] (@id INT) RETURNS VARCHAR(250)
	BEGIN
		DECLARE @Value VARCHAR (MAX), @i TINYINT
		SET @i = 0
		WHILE @id IS NOT NULL AND @i<10
		BEGIN
			SELECT @Value = ISNULL(@Value + '","', '') + [schema], @id=ISNULL(inheritedId, srcId) FROM item.dt WHERE id=@id
			SET @i = @i + 1
		END
		RETURN '["' + @value + '"]'
	END
GO
