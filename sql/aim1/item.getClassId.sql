USE [aim1]
GO
ALTER PROCEDURE [item].[getClassID] @schema VARCHAR(200), @classID INT OUTPUT
AS
	IF @classID IS NULL AND @schema IS NOT NULL
	BEGIN
		SELECT @classID=id FROM item.class WHERE name=@schema
		IF @classID IS NULL
		BEGIN
			INSERT item.dt (MasterID,SrcID,ClassID,name) VALUES (0,0,0,@schema)
			SET @classID = scope_identity()
		END
	END
GO
