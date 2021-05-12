USE [aim1]
GO
ALTER FUNCTION [item].[attributevalue] (@id BIGINT, @name VARCHAR(50)) RETURNS VARCHAR(250)
	BEGIN
		DECLARE @Value VARCHAR (MAX), @i TINYINT, @stop BIT
		SELECT @i = 0, @id = masterID FROM item.dt WHERE id=@id
		WHILE @id IS NOT NULL AND @i<50 AND @stop IS NULL
		BEGIN 
			SET @stop = 1
			SELECT @stop = null, @i = @i + 1,@id = masterID,@Value = ISNULL(header0,name) + ISNULL('/' + @Value, '')  			
			FROM item.dt
			WHERE id = @id 
		END
		RETURN @value
	END
GO