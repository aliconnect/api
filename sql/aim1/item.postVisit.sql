USE [aim1]
GO
ALTER PROCEDURE [item].[postVisit] @id INT,@userID int--,@hostID int=NULL
AS
	IF NOT EXISTS (SELECT 0 FROM item.[visit] WHERE id=@id AND userID=@userID)
		INSERT item.[visit] (ID,UserID,FirstVisitDateTime,LastVisitDateTime,Cnt)
		VALUES (@id,@userID,GETUTCDATE(),GETUTCDATE(),0)
	ELSE
		UPDATE item.[visit] SET cnt=cnt+1,LastVisitDateTime=GETUTCDATE() WHERE ID=@id AND userID=@userID
GO
