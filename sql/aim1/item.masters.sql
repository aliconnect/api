USE [aim1]
GO
ALTER FUNCTION [item].[masters](@id INT) RETURNS TABLE
	AS
	RETURN (
		WITH masters (Level,id,masterId) AS (
			SELECT 0, item.id, item.masterId
			FROM item.dt item
			WHERE id = @id
			UNION ALL
			SELECT Level+1, item.id, item.masterId
			FROM item.dt item
			INNER JOIN masters ON item.id = masters.masterId
		)
		select level,item.* from masters inner join item.dt item on item.id = masters.id
	)
GO
