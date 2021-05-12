USE [aim1]
GO
ALTER FUNCTION [account].[attribute] (@userID INT, @HostID INT) RETURNS TABLE
AS
	RETURN
	(
		WITH P (Level,RootID,SrcId) AS (
			SELECT 0,I.ID,I.ID
			FROM Item.VW I
			UNION ALL
			SELECT Level+1,P.RootID,ISNULL(ISNULL(I.InheritedID,I.SrcID),I.ClassID)
			FROM P INNER JOIN Item.VW I ON I.ID = P.SrcID AND level<10
		)
		SELECT
			A.*
			,P.*
		FROM
			P
			INNER JOIN attribute.VW A ON A.ItemID = P.SrcID
		WHERE
			A.HostID IN (@HostID,1)
			AND ISNULL(A.UserID,A.HostID) IN (@UserID,A.HostID,0)
	)
GO
