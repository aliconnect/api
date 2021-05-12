USE [aim1]
GO
ALTER VIEW [attribute].[dv]
AS
	SELECT 
		A.ID AttributeID
		,A.ItemID
		,A.HostID
		,A.UserID
		,A.NameID
		,A.ClassID
		,A.LinkID
		,A.Value
		,A.CreatedDateTime
		,A.LastModifiedDateTime
		,A.LastModifiedByID
		,A.Scope
		,A.Data
	FROM 
		attribute.dt A
	WHERE 
		A.DeletedDateTime IS NULL 
GO
