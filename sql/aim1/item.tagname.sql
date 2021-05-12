USE [aim1]
GO
ALTER FUNCTION [item].[tagname](@id BIGINT) RETURNS VARCHAR(250)
	BEGIN
		DECLARE @Value VARCHAR (MAX), @Prefix VARCHAR (MAX), @Tag VARCHAR (MAX), @i TINYINT, @stop BIT
		SELECT @i = 0
		WHILE @id IS NOT NULL AND @i<50 AND @stop IS NULL
		BEGIN 
			SET @stop = 1
			SELECT @stop = null, @i = @i + 1, @prefix = item.getattributevalue(@id, 'Prefix'), @tag = item.getattributevalue(@id, 'Tag'), @id = masterId, @Value = case when @prefix is not null or @tag is not null then isnull(@prefix,'')+isnull(@tag,'') + ISNULL('.' + @Value, '') else @value end 
			--SELECT @stop = null, @i = @i + 1, @Value = ISNULL( ISNULL(item.getattributevalue(@id, 'Prefix'), '') + ISNULL(item.getattributevalue(@id, 'Tag'),item.getattributevalue(@id, 'Name')) + ISNULL('.' + @Value, ''), @Value), @id = masterId
			FROM item.dt
			WHERE id = @id 
		END
		RETURN @Value
	END
GO
