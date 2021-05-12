USE [aim1]
GO
ALTER FUNCTION [item].[schemaName] (@id INT) RETURNS VARCHAR(250)
	BEGIN
		DECLARE @Value VARCHAR (MAX)
		;WITH P(Level,ID,SrcID,MasterID,Name) AS (
			SELECT 0,I.ID,ISNULL(ISNULL(I.InheritedID,I.SrcID),I.ClassID),I.MasterID,I.Name
			FROM item.DT I
			WHERE ID = @id
			UNION ALL
			SELECT Level+1,I.ID,ISNULL(ISNULL(I.InheritedID,I.SrcID),I.ClassID),I.MasterID,I.Name
			FROM P
			INNER JOIN item.DT I ON I.ID = P.SrcID AND Level<10--AND P.Name IS NULL AND I.MasterID=I.SrcID
		)
		SELECT TOP 1 @Value = Name
		FROM P
		WHERE SrcID = MasterID AND Name IS NOT NULL
		ORDER BY Level
		RETURN @value
	END
GO
