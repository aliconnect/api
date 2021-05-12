USE [aim1]
GO
ALTER FUNCTION [item].[attributes](@ID INT) RETURNS TABLE
	AS
	RETURN (
		WITH P (Level,ID,SrcId) AS (
			SELECT 0,I.ID,I.ID
			FROM Item.VW I
			WHERE ID = @ID
			UNION ALL
			SELECT Level+1,P.ID,ISNULL(ISNULL(I.InheritedID,I.SrcID),I.ClassID)
			FROM P INNER JOIN Item.VW I ON I.ID = P.SrcID AND level<10
		)
		SELECT P.ID AS ParentID,A.*,A.AttributeName name
		FROM P INNER JOIN attribute.VW A ON A.ItemID = P.SrcID
	)
GO
