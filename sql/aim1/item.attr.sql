USE [aim1]
GO
--ALTER PROCEDURE [item].[attr]
--	@id BIGINT=NULL OUTPUT -- ID of AttributeValue
--	,@attributeId BIGINT=NULL OUTPUT -- ID of AttributeValue
--	,@itemId BIGINT=NULL
--	,@name VARCHAR(MAX)=NULL
--	,@value NVARCHAR(MAX)=NULL -- Value of Attribute
--	,@encrypt BIT=NULL -- Defines if value must be encrypted such as passwords
--	,@hostId VARCHAR(50)=NULL -- Values are explicit for a specific host
--	,@schema VARCHAR(50)=NULL -- Synonim for @Class
--	,@attributeName VARCHAR(MAX)=NULL -- Attribute Name
--	,@nameId INT=NULL -- Attribute name ID
--	,@Date DATETIME=NULL -- Value of Attribute, in date format
--	,@Data VARCHAR(MAX)=NULL -- Meta Data related to attribute
--	,@Max INT=1 -- If max > 1 there values are added and not overwritten
--	,@IsPublic BIT=NULL -- Attribute is public and visible for all users
--	,@Host VARCHAR(50)=NULL -- Host name to find HostID
--	,@LinkID VARCHAR(10)=NULL -- Value of refered item ID
--	,@ClassID BIGINT=NULL -- SchemaID/ClassID of refered item, (omitted if LinkID is provided)
--	,@Class VARCHAR(50)=NULL -- Schema/ClassName to find ClassID (omitted if ClassID is provided)
--	,@KeyID INT=NULL -- Search KeyID for refered item, combined with class within active host (omitted if no ClassID is provided)
--	,@KeyName VARCHAR(50)=NULL -- Search KeyName for refered item, combined with class within active host (omitted if no ClassID is provided)
--	,@Tag VARCHAR(50)=NULL -- Search Tag for refered item, combined with class within children of passed MasterID
--	,@PropertyName VARCHAR(50)=NULL -- Related propertyname of item table, only specified if @PropertyName diverse form @AttributeName
--	,@CreatedDateTime DATETIME=NULL -- Explicit value for CreatedDateTime
--	,@LastModifiedDateTime DATETIME=NULL -- Explicit value for LastModifiedDateTime
--	,@LastModifiedByID BIGINT=NULL -- itemID of User who modified attribute
--	,@UserID BIGINT=NULL   -- itemID of User who has access to attribute, attribute will not be visible to other users
--	,@IsNull BIT=NULL -- If true, attribute must exists, attribute will not be created
--	,@Title VARCHAR(MAX)=NULL -- Depricated, Replaced by @AttributeName
--AS
--	SET NOCOUNT ON
--	DECLARE @itemclassID INT,@EmailAid INT,@personID INT,@ToID INT,@FromID INT,@SrcID INT,@email VARCHAR (200),@isProperty BIT
--	IF @attributeId IS NOT NULL 
--	BEGIN
--		IF @value IS NULL AND @LinkID IS NULL 
--		BEGIN
--			DELETE Attribute.dt WHERE ID = @attributeId
--			RETURN
--		END
--		SET @id=@attributeId
--	END
--	IF @HostID IS NOT NULL AND ISNUMERIC(@HostID)=0 SET @HostID = item.getId(@HostID)
--	IF @attributeName IS NOT NULL SET @name = @attributeName
--	IF @title IS NOT NULL SET @name = @title
--	IF @nameId IS NULL select @nameId = id FROM attribute.name WHERE name=@name
--	IF @nameId IS NULL AND @name IS NOT NULL
--	begin
--		INSERT attribute.name (name) VALUES (@name)
--		SET @nameId=scope_identity()
--	end
--	if @nameId is null return
--	IF @Schema IS NOT NULL SET @Class=@Schema
--	IF @classID IS NULL AND @Class IS NOT NULL
--	BEGIN
--		SELECT @ClassID=id FROM item.dt WHERE SrcID=MasterID AND SrcID=0 AND Name=@Class
--		IF @classID IS NULL
--		BEGIN
--			INSERT item.dt (MasterID,SrcID,ClassID,name) VALUES (0,0,0,@Class)
--			SET @ClassID = scope_identity()
--		END
--	END
-- 	--IF @HostID=1 SET @IsPublic=1
--	/* If HostID is ommited, host id is set to HostID of attribute item */
--	IF @HostID IS NULL SELECT @HostID=HostID FROM item.dt WHERE ID=@ItemID
----IF @LinkID IS NOT NULL AND @Class IS NULL SELECT @Class=[schema] FROM item.vw WHERE ID=@LinkID
--	/*
--	*	If link provided and no attributename, attribute name is set to classname if linked item
--	*	If link exists, exit update
--	*/
--	IF @LinkID IS NOT NULL
--	BEGIN
--		SELECT @Max=ISNULL(@Max,9999), @name=ISNULL(@name,[schema]), @Class=ISNULL(@Class,[schema]), @ClassID=ClassID, @Value=ISNULL(ISNULL(name,Title),[schema]) FROM item.vw WHERE ID=@LinkID
--		IF @Data IS NULL AND EXISTS(SELECT 0 FROM attribute.dv WHERE ItemID=@ItemID AND NameID=@NameID AND LinkID=@LinkID AND HostID=@HostID) RETURN
--	END
--	ELSE IF @ClassID IS NOT NULL BEGIN
--		/* If tag is set, serach for item with tag within children of master */
--		/* @todo */
--		IF @Tag IS NOT NULL SELECT @LinkID=ID,@Value=Title FROM item.dt WHERE HostID=@HostID AND ClassID=@ClassID AND Tag=@tag
--		/* If KeyID then search for KeyID within host and same class */
--		ELSE IF @KeyID IS NOT NULL SELECT @LinkID=id,@Value=ISNULL(@Value,name) FROM item.dt WHERE HostID=@HostID AND ClassID=@ClassID AND KeyID=@KeyID
--		/* If KeyName then search for KeyName within host and same class */
--		ELSE IF @KeyName IS NOT NULL SELECT @LinkID=id,@Value=ISNULL(@Value,name) FROM item.dt WHERE HostID=@HostID AND ClassID=@ClassID AND KeyName=@KeyName
--		-- Deprecated /* If KeyNR then search for KeyName within host and same class */
--		-- Deprecated ELSE IF @keyNr IS NOT NULL SELECT @LinkID=id,@Value=ISNULL(@Value,name) FROM item.dt WHERE HostID=@HostID AND ClassID=@ClassID AND Tag=@keyNr
--		/* ClassID with Value results in LinkID to item, If item not exists it will be created */
--		IF @Value IS NOT NULL BEGIN
--			/* check if item exists with key equal to @Value  */
--			SELECT @LinkID=ID, @Value=ISNULL(@Value,Name) FROM item.dt WHERE HostID=@HostID AND ClassID=@ClassID AND KeyName=@Value
--			/* If still not find then look for name equal to @Value */
--			IF @LinkID IS NULL SELECT @LinkID=id, @Value=ISNULL(@Value,name) FROM item.dt WHERE HostID=@HostID AND ClassID=@ClassID AND Name=@Value
--			/* If ClassID is acccount (class=1000) then do not ALTER object, also clear idname */
--			IF @LinkID IS NULL AND @ClassID IN (1000) SET @PropertyName = NULL
--			/* Stil object not found then ALTER */
--			ELSE IF @LinkID IS NULL BEGIN
--				INSERT item.dt(HostID,ClassID,Name,Tag,KeyID,keyName) SELECT @HostID,@ClassID,@Value,@Tag,@KeyID,ISNULL(@keyName,@Value)
--				SET @LinkID=scope_identity()
--			END
--		END
--	END
--	--SELECT @AttributeName,@LinkID,@Value,@Class,@ClassID
--	IF @Date IS NOT NULL SET @Value=CONVERT(VARCHAR(50),@Date,121)
--	--ELSE IF @Value IS NOT NULL AND ISDATE(@Value)=1 SET @Value=CONVERT(VARCHAR(50),CONVERT(DATETIME,@Value),121)
--	IF EXISTS(SELECT 1 FROM sys.columns WHERE Name = @name AND Object_ID = OBJECT_ID('item.dt')) SET @PropertyName = @name
--	IF EXISTS(SELECT 1 FROM sys.columns WHERE Name = @name + 'ID' AND Object_ID = OBJECT_ID('item.dt')) SET @PropertyName = @name + 'ID'
--	--IF @Value = 'NULL' SET @Value = NULL;
--	--select @PropertyName,@name
--	--return
--	IF @PropertyName IS NOT NULL
--	BEGIN
--		DECLARE @SQL VARCHAR(MAX)
--		SET @SQL = 'UPDATE item.[dt] SET ['+@PropertyName+']=' + CASE
--		WHEN @LinkID IS NOT NULL THEN @LinkID
--		WHEN @Value>'' THEN '''' + @Value + ''''
--		ELSE 'NULL'
--		END + ' WHERE[ID]='+CONVERT(VARCHAR(50),@ItemID)
--		EXEC(@SQL)
--	END
	
	
--	IF @Max=1
--	BEGIN
--		--SELECT @Max,@name,@LinkID,@Data
--		IF @ID IS NULL SELECT @ID=AttributeId FROM attribute.vw WHERE ItemID=@ItemID AND NameID=@NameID AND (HostID IS NULL OR HostID = @HostID) AND (UserID IS NULL OR UserID = @UserID)
--	--SELECT @ID
--		--IF @ID IS NULL SELECT @LinkID=ID FROM attribute.vw WHERE ItemID=@ItemID AND NameID=@NameID AND HostID=@HostID AND LinkID=@LinkID --AND HostID=@HostID ??
--		-- IF @ID IS NULL SELECT @ID=ID FROM attribute.vw WHERE ItemID=@ItemID AND NameID=@NameID AND HostID=@HostID AND ISNULL (UserID,0)IN (@userID,0) AND (rights IS NULL OR moduserID=@moduserID)
--	END
--	ELSE
--	BEGIN
--		IF @ID IS NULL SELECT @ID=AttributeId FROM attribute.vw WHERE ItemID=@ItemID AND NameID=@NameID AND (HostID IS NULL OR HostID = @HostID) AND (UserID IS NULL OR UserID = @UserID) AND Value = @Value AND LinkID=@LinkID
--	END



--	--SELECT @ID RETURN
--	IF @ID IS NOT NULL AND @IsNull=1 RETURN
----	SELECT 1, @ID, @Max,@name,@LinkID,@Data
--	IF @ID IS NULL AND @Max>1 SELECT @ID=AttributeId FROM attribute.vw WHERE ItemID=@ItemID AND NameID=@NameID AND (HostID IS NULL OR HostID = @HostID) AND (UserID IS NULL OR UserID = @UserID) AND Value=@Value AND LinkID=@LinkID

--	--SELECT 1, @ID, @Max,@name,@LinkID,@Data
--	IF @ID IS NOT NULL AND @Data IS NULL AND EXISTS(SELECT 0 FROM attribute.vw WHERE AttributeId=@ID AND Value = @Value AND LinkID = @LinkID) RETURN
--	ELSE IF @ID IS NOT NULL AND EXISTS(SELECT 0 FROM attribute.vw WHERE AttributeId=@ID AND Value=@Value AND LinkID = @LinkID AND Data = @Data) RETURN

--	IF @ID IS NULL BEGIN
--		INSERT attribute.dt (ItemID,NameID) VALUES (@ItemID,@NameID) SET @ID = scope_identity()
--	END
--	--IF @Encrypt=1 SET @Value = PWDENCRYPT(@Value)
--	SET @LastModifiedDateTime = ISNULL(@LastModifiedDateTime,GETDATE())
--	--SELECT @Value,@id RETURN

--	UPDATE attribute.dt SET
--		HostID = ISNULL(@HostID,HostID)
--		,LastModifiedByID = ISNULL(ISNULL(@LastModifiedByID,@userID),LastModifiedByID)
--		,UserID = @userID
--		,LastModifiedDateTime = @LastModifiedDateTime
--		,NameID = ISNULL(@NameID,NameID)
--		,Value = CASE WHEN @Encrypt IS NULL THEN @value ELSE PWDENCRYPT(@Value) END
--		,LinkId = ISNULL(@LinkID,LinkID)
--		,Data = ISNULL(@Data,Data)
--	WHERE
--		ID = @ID

--	UPDATE item.dt SET LastModifiedDateTime = @LastModifiedDateTime WHERE ID=@ItemID
--GO
--ALTER PROCEDURE [item].[attr]
--  @attributeId            BIGINT        = NULL OUTPUT -- Id of AttributeValue
--  ,@Id                    BIGINT        = NULL OUTPUT -- DEPRICATED, Id of AttributeValue
--  ,@itemId                BIGINT        = NULL -- Id of item
--  ,@attributeName         VARCHAR(MAX)  = NULL -- DEPRICATED, Attribute Name
--  ,@name                  VARCHAR(MAX)  = NULL -- Attribute Name
--  ,@host                  VARCHAR(50)   = NULL -- Host name to find HostId
--  ,@hostId                VARCHAR(50)   = NULL -- Values are explicit for a specific host
--  ,@propertyName          VARCHAR(50)   = NULL -- Related propertyname of item table, only specified if @PropertyName diverse form @AttributeName
--  ,@title                 VARCHAR(MAX)  = NULL -- DEPRICATED, Replaced by @AttributeName
--  ,@nameId                INT           = NULL -- Attribute name Id
--  ,@date                  DATETIME      = NULL -- Value of Attribute, in date format
--  ,@value                 NVARCHAR(MAX) = NULL -- Value of Attribute
--  ,@linkId                VARCHAR(10)   = NULL -- Value of refered item Id
--  ,@keyId                 INT           = NULL -- Search KeyId for refered item, combined with class within active host (omitted if no ClassId is provIded)
--  ,@keyName               VARCHAR(50)   = NULL -- Search KeyName for refered item, combined with class within active host (omitted if no ClassId is provIded)
--  ,@tag                   VARCHAR(50)   = NULL -- Search Tag for refered item, combined with class within children of passed MasterId
--  ,@encrypt               BIT           = NULL -- Defines if value must be encrypted such as passwords
--  ,@schema                VARCHAR(50)   = NULL -- DEPRICATED, Synonim for @Class
--  ,@class                 VARCHAR(50)   = NULL -- Schema/ClassName to find ClassId (omitted if ClassId is provIded)
--  ,@classId               BIGINT        = NULL -- SchemaId/ClassId of refered item, (omitted if LinkId is provIded)
--  ,@data                  VARCHAR(MAX)  = NULL -- Meta Data related to attribute
--  ,@max                   INT           = 1    -- If max > 1 there values are added and not overwritten
--  ,@isPublic              BIT           = NULL -- Attribute is public and visible for all users
--  ,@createdDateTime       DATETIME      = NULL -- Explicit value for CreatedDateTime
--  ,@lastModifiedDateTime  DATETIME      = NULL -- Explicit value for LastModifiedDateTime
--  ,@lastModifiedById      BIGINT        = NULL -- itemId of User who modified attribute
--  ,@userId                BIGINT        = NULL -- itemId of User who has access to attribute, attribute will not be visible to other users
--  ,@isNull                BIT           = NULL -- If true, attribute must exists, attribute will not be created
--AS
--  SET NOCOUNT ON
--  -- DEPRECATED
--  IF @id IS NOT NULL 
--    SET @attributeId = @id
--  IF @attributeName IS NOT NULL 
--    SET @name = @attributeName
--  IF @title IS NOT NULL 
--    SET @name = @title
--  IF @Schema IS NOT NULL 
--    SET @Class=@Schema
--  --
--  SET @LastModifiedDateTime = ISNULL(@LastModifiedDateTime,GETDATE())
--  IF @Date IS NOT NULL 
--    SET @Value=CONVERT(VARCHAR(50),@Date,121)
  
--  IF @hostId IS NOT NULL AND ISNUMERIC(@hostId)=0 
--    SET @HostId = item.getId(@hostId)
--  IF @HostId IS NULL 
--    SELECT @HostId=HostId FROM item.dt WHERE Id=@ItemId

--  IF @nameId IS NULL AND @name IS NULL 
--    RETURN
--  IF @nameId IS NULL 
--    SELECT @nameId = Id FROM attribute.name WHERE name=@name
--  IF @nameId IS NULL 
--    BEGIN
--    INSERT attribute.name (name) VALUES (@name)
--    SET @nameId=SCOPE_IdENTITY()
--    END

--  IF @class IS NOT NULL AND @classId IS NULL
--    BEGIN
--    SELECT @classId=Id FROM item.dv WHERE classId=0 AND hostId=@hostId AND Name=@Class
--    IF @classId IS NULL
--      BEGIN
--      INSERT item.dt (hostId,classId,name) VALUES (@hostId,0,@class)
--      SET @classId = SCOPE_IdENTITY()
--      END
--    END
--  IF @classId IS NOT NULL
--    BEGIN
--    IF @linkId IS NULL AND @tag IS NOT NULL 
--      SELECT @linkId=Id FROM item.dv WHERE hostId=@hostId AND classId=@classId AND tag = @tag
--    IF @linkId IS NULL AND @keyId IS NOT NULL 
--      SELECT @linkId=Id FROM item.dv WHERE hostId=@hostId AND classId=@classId AND keyId = @keyId
--    IF @linkId IS NULL AND @keyName IS NOT NULL 
--      SELECT @linkId=Id FROM item.dv WHERE hostId=@hostId AND classId=@classId AND keyName = @keyName
--    IF @linkId IS NULL AND @value IS NOT NULL
--      SELECT @linkId=Id FROM item.dv WHERE hostId=@hostId AND classId=@classId AND keyName = @value
--    IF @linkId IS NULL AND @value IS NOT NULL
--      SELECT @linkId=Id FROM item.dv WHERE hostId=@hostId AND classId=@classId AND name = @value
--    IF @linkId IS NULL AND @value IS NOT NULL
--      BEGIN
--      INSERT item.dt(HostId, ClassId, Name, Tag, KeyId, keyName) 
--      SELECT @HostId, @ClassId, @Value, @Tag, @KeyId, ISNULL(@keyName,@Value)
--      SET @LinkId = SCOPE_IdENTITY()
--      END
--    END
  
--  DECLARE @SQL VARCHAR(MAX)
--  IF @LinkId IS NOT NULL
--    BEGIN
--    IF EXISTS(SELECT 1 FROM sys.columns WHERE Name = @name + 'Id' AND OBJECT_Id = OBJECT_Id('item.dt')) 
--      SET @SQL = 'UPDATE item.[dt] SET ['+@name+'Id]='+ISNULL(@LinkId,'NULL')+' WHERE[Id]='+CONVERT(VARCHAR(50),@ItemId)
--    IF @attributeId IS NULL SELECT @attributeId=Id FROM attribute.dt WHERE itemId=@itemId AND hostId=@hostId AND nameId=@nameId AND LinkId=@LinkId
--    END
--  IF @Value IS NOT NULL
--    BEGIN
--    IF EXISTS(SELECT 1 FROM sys.columns WHERE Name = @name AND OBJECT_Id = OBJECT_Id('item.dt')) 
--      SET @SQL = 'UPDATE item.[dt] SET ['+@name+']='+ISNULL(''''+@value+'''','NULL')+' WHERE[Id]='+CONVERT(VARCHAR(50),@ItemId)
--    END
--  IF @SQL IS NOT NULL 
--    EXEC(@SQL)

--  IF @LinkId IS NULL AND @Value IS NULL AND @data IS NULL
--    BEGIN
--    IF @attributeId IS NOT NULL 
--      DELETE attribute.dt WHERE Id = @attributeId
--    RETURN
--    END

--  IF @attributeId IS NOT NULL AND @IsNull = 1 
--    RETURN

--  IF @attributeId IS NULL 
--    BEGIN
--    IF @Max=1 
--      SELECT @attributeId = attributeId 
--      FROM attribute.dv 
--      WHERE ItemId = @ItemId 
--        AND NameId = @NameId 
--        AND HostId = @HostId 
--        AND UserId = @UserId
--    ELSE
--      SELECT @attributeId = attributeId 
--      FROM attribute.dv 
--      WHERE ItemId = @ItemId 
--        AND NameId = @NameId 
--        AND HostId = @HostId 
--        AND UserId = @UserId 
--        AND Value  = @Value 
--        AND LinkId = @LinkId
--    END
--  IF @attributeId IS NULL 
--    BEGIN
--    INSERT attribute.dt (ItemId,NameId) VALUES (@ItemId,@NameId) 
--    SET @attributeId = SCOPE_IdENTITY()
--    END


--  UPDATE attribute.dt SET
--    HostId                = COALESCE(@HostId,HostId)
--    ,LastModifiedById     = COALESCE(@LastModifiedById,@userId,LastModifiedById)
--    ,UserId               = @userId
--    ,LastModifiedDateTime = @LastModifiedDateTime
--    ,NameId               = COALESCE(@NameId,NameId)
--    ,Value                = CASE WHEN @Encrypt IS NULL THEN @value ELSE PWDENCRYPT(@Value) END
--    ,LinkId               = COALESCE(@LinkId,LinkId)
--    ,Data                 = COALESCE(@Data,Data)
--  WHERE
--    Id = @attributeId

--  UPDATE item.dt 
--  SET LastModifiedDateTime = @LastModifiedDateTime 
--  WHERE Id=@ItemId
--GO
ALTER PROCEDURE [item].[attr]
  @attributeId            BIGINT        = NULL OUTPUT -- Id of AttributeValue
  ,@Id                    BIGINT        = NULL OUTPUT -- DEPRICATED, Id of AttributeValue
  ,@itemId                BIGINT        = NULL -- Id of item
  ,@attributeName         VARCHAR(MAX)  = NULL -- DEPRICATED, Attribute Name
  ,@name                  VARCHAR(MAX)  = NULL -- Attribute Name
  ,@host                  VARCHAR(50)   = NULL -- Host name to find HostId
  ,@hostId                VARCHAR(50)   = NULL -- Values are explicit for a specific host
  ,@propertyName          VARCHAR(50)   = NULL -- Related propertyname of item table, only specified if @PropertyName diverse form @AttributeName
  ,@title                 VARCHAR(MAX)  = NULL -- DEPRICATED, Replaced by @AttributeName
  ,@nameId                INT           = NULL -- Attribute name Id
  ,@date                  DATETIME      = NULL -- Value of Attribute, in date format
  ,@value                 NVARCHAR(MAX) = NULL -- Value of Attribute
  ,@linkId                BIGINT        = -1   -- Value of refered item Id
  ,@keyId                 INT           = NULL -- Search KeyId for refered item, combined with class within active host (omitted if no ClassId is provIded)
  ,@keyName               VARCHAR(50)   = NULL -- Search KeyName for refered item, combined with class within active host (omitted if no ClassId is provIded)
  ,@tag                   VARCHAR(50)   = NULL -- Search Tag for refered item, combined with class within children of passed MasterId
  ,@encrypt               BIT           = NULL -- Defines if value must be encrypted such as passwords
  ,@schema                VARCHAR(50)   = NULL -- DEPRICATED, Synonim for @Class
  ,@class                 VARCHAR(50)   = NULL -- Schema/ClassName to find ClassId (omitted if ClassId is provIded)
  ,@classId               BIGINT        = NULL -- SchemaId/ClassId of refered item, (omitted if LinkId is provIded)
  ,@data                  VARCHAR(MAX)  = NULL -- Meta Data related to attribute
  ,@max                   INT           = 1    -- If max > 1 there values are added and not overwritten
  ,@isPublic              BIT           = NULL -- Attribute is public and visible for all users
  ,@createdDateTime       DATETIME      = NULL -- Explicit value for CreatedDateTime
  ,@lastModifiedDateTime  DATETIME      = NULL -- Explicit value for LastModifiedDateTime
  ,@lastModifiedById      BIGINT        = NULL -- itemId of User who modified attribute
  ,@userId                BIGINT        = NULL -- itemId of User who has access to attribute, attribute will not be visible to other users
  ,@isNull                BIT           = NULL -- If true, attribute must exists, attribute will not be created
AS
  SET NOCOUNT ON
  -- DEPRECATED
  IF @id IS NOT NULL 
    SET @attributeId = @id
  IF @attributeName IS NOT NULL 
    SET @name = @attributeName
  IF @title IS NOT NULL 
    SET @name = @title
  IF @Schema IS NOT NULL 
    SET @Class=@Schema
  --

	IF @attributeId IS NOT NULL AND NULLIF(@LinkId,-1) IS NULL AND @Value IS NULL AND @data IS NULL
	BEGIN
		DELETE attribute.dt WHERE id = @attributeId 
		RETURN
	END

  SET @LastModifiedDateTime = ISNULL(@LastModifiedDateTime,GETDATE())
  IF @Date IS NOT NULL 
    SET @Value=CONVERT(VARCHAR(50),@Date,121)
  
  IF @hostId IS NOT NULL AND ISNUMERIC(@hostId)=0 
    SET @HostId = item.getId(@hostId)
  IF @HostId IS NULL AND @LinkId IS NOT NULL
    SELECT @HostId=HostId FROM item.dt WHERE Id=@LinkId
  IF @HostId IS NULL 
    SELECT @HostId=HostId FROM item.dt WHERE Id=@ItemId

  IF @nameId IS NULL AND @name IS NULL 
    RETURN
  IF @nameId IS NULL 
    SELECT @nameId = Id FROM attribute.name WHERE name=@name
  IF @nameId IS NULL 
    BEGIN
    INSERT attribute.name (name) VALUES (@name)
    SET @nameId=SCOPE_IdENTITY()
    END

  IF @class IS NOT NULL AND @classId IS NULL
    BEGIN
    SELECT @classId=Id FROM item.dv WHERE classId=0 AND hostId=@hostId AND Name=@Class
    IF @classId IS NULL
      BEGIN
      INSERT item.dt (hostId,classId,name) VALUES (@hostId,0,@class)
      SET @classId = SCOPE_IdENTITY()
      END
    END
  IF @classId IS NOT NULL
    BEGIN
    IF @linkId=-1 AND @tag IS NOT NULL 
      SELECT @linkId=Id FROM item.dv WHERE hostId=@hostId AND classId=@classId AND tag = @tag
    IF @linkId=-1 AND @keyId IS NOT NULL 
      SELECT @linkId=Id FROM item.dv WHERE hostId=@hostId AND classId=@classId AND keyId = @keyId
    IF @linkId=-1 AND @keyName IS NOT NULL 
      SELECT @linkId=Id FROM item.dv WHERE hostId=@hostId AND classId=@classId AND keyName = @keyName
    IF @linkId=-1 AND @value IS NOT NULL
      SELECT @linkId=Id FROM item.dv WHERE hostId=@hostId AND classId=@classId AND keyName = @value
    IF @linkId=-1 AND @value IS NOT NULL
      SELECT @linkId=Id FROM item.dv WHERE hostId=@hostId AND classId=@classId AND name = @value
    IF @linkId=-1 AND @value IS NOT NULL
      BEGIN
      INSERT item.dt(HostId, ClassId, Name, Tag, KeyId, keyName) 
      SELECT @HostId, @ClassId, @Value, @Tag, @KeyId, ISNULL(@keyName,@Value)
      SET @LinkId = SCOPE_IdENTITY()
      END
    END

  DECLARE @SQL VARCHAR(MAX)
  IF ISNULL(@LinkId,0) <> -1 -- LinkID is ingevuld
    BEGIN
    IF @max=1 AND EXISTS(SELECT 1 FROM sys.columns WHERE Name = @name + 'Id' AND OBJECT_Id = OBJECT_Id('item.dt')) 
			BEGIN
      SET @SQL = 'UPDATE item.[dt] SET ['+@name+'Id]='+ISNULL(CONVERT(VARCHAR(50),@LinkId),'NULL')+' WHERE[Id]='+CONVERT(VARCHAR(50),@ItemId)
			--SELECT @SQL RETURN
			END
		IF @attributeId IS NULL
			BEGIN
			IF @max=1
				BEGIN
				IF @LinkId IS NULL
					BEGIN
					DELETE attribute.dt WHERE itemId=@itemId AND hostId=@hostId AND nameId=@nameId
					END
				ELSE
					BEGIN
					DELETE attribute.dt WHERE itemId=@itemId AND hostId=@hostId AND nameId=@nameId AND linkID <> @linkId
					SELECT @attributeId=Id FROM attribute.dt WHERE itemId=@itemId AND hostId=@hostId AND nameId=@nameId
					END
				END
			ELSE
				BEGIN
				SELECT @attributeId=Id FROM attribute.dt WHERE itemId=@itemId AND hostId=@hostId AND nameId=@nameId AND linkId=@linkId
				END
		  END
		END
  ELSE IF @Value IS NOT NULL
    BEGIN
    IF @max=1 
			BEGIN
			SELECT @attributeId=Id FROM attribute.dt WHERE itemId=@itemId AND hostId=@hostId AND nameId=@nameId
			IF EXISTS(SELECT 1 FROM sys.columns WHERE Name = @name AND OBJECT_Id = OBJECT_Id('item.dt')) 
				SET @SQL = 'UPDATE item.[dt] SET ['+@name+']='+ISNULL(''''+@value+'''','NULL')+' WHERE[Id]='+CONVERT(VARCHAR(50),@ItemId)
			END
		ELSE
			BEGIN
			SELECT @attributeId=Id FROM attribute.dt WHERE itemId=@itemId AND hostId=@hostId AND nameId=@nameId AND value=@value
			END
    END
  IF @SQL IS NOT NULL 
    EXEC(@SQL)

	IF NULLIF(@LinkID,-1) IS NULL AND @value IS NULL AND @data IS NULL
		RETURN

  IF @attributeId IS NOT NULL AND @IsNull = 1 
    RETURN

  IF @attributeId IS NULL 
    BEGIN
    INSERT attribute.dt (ItemId,NameId) VALUES (@ItemId,@NameId) 
    SET @attributeId = SCOPE_IdENTITY()
    END

  UPDATE attribute.dt SET
    HostId                = COALESCE(@HostId,HostId)
    ,LastModifiedById     = COALESCE(@LastModifiedById,@userId,LastModifiedById)
    ,UserId               = @userId
    ,LastModifiedDateTime = @LastModifiedDateTime
    ,NameId               = COALESCE(@NameId,NameId)
    ,Value                = CASE WHEN @Encrypt IS NULL THEN @value ELSE PWDENCRYPT(@Value) END
    ,LinkId               = NULLIF(@LinkId,-1)
    ,Data                 = COALESCE(@Data,Data)
  WHERE
    Id = @attributeId

  UPDATE item.dt 
  SET LastModifiedDateTime = @LastModifiedDateTime 
  WHERE Id=@ItemId
GO

--exec item.attr @itemId=1, @name='redirect_uri', @value='https://aliconnect.nl/', @max=999
--select * from attribute.vw where itemid=1 and nameid=2214
--select * from attribute.vw where attributeid=3113799


-- geeft error
--EXEC item.attr @itemID=3677286,@name='Class',@Value='ControlModule'

--exec item.attr @itemid=2745119, @name='Master', @linkID=265090
--select * from item.vw where id=2745119
--select * from attribute.vw where itemid=2745119
