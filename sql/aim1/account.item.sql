USE [aim1]
GO
ALTER FUNCTION [account].[item] (@userID INT) RETURNS TABLE
AS
	RETURN
	(
		SELECT I.*,V.LastVisitDateTime,CASE WHEN V.LastVisitDateTime>LastModifiedDateTime THEN 1 ELSE 0 END AS IsRead
		FROM item.vw I
		LEFT OUTER JOIN item.visit V ON V.id=I.id AND V.userID=@userID
		WHERE ISNULL(I.UserID,I.HostID) IN (@UserID,I.HostID,0)
	)
GO
