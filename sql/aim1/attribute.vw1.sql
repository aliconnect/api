USE [aim1]
GO
ALTER VIEW [attribute].[vw1] AS
	SELECT
	attributeID AS aid,
	itemId AS id,
	AttributeName AS name,
	value,
	hostID,
	CreatedDateTime AS createdDT,
	LastModifiedDateTime AS modDT,
	userID,
	nameid as fieldID,
	linkid as itemID
	FROM attribute.vw
GO
