USE [aim1]
GO
CREATE schema attribute
GO
CREATE schema item
GO
/****** Object:  Table [attribute].[dt]    Script Date: 12-11-2020 16:03:52 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [attribute].[dt](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[ItemID] [bigint] NULL,
	[NameID] [int] NULL,
	[HostID] [bigint] NULL,
	[CreatedDateTime] [datetime] NULL CONSTRAINT [DF_attribute_CreatedDateTime]  DEFAULT (getutcdate()),
	[LastModifiedDateTime] [datetime] NULL,
	[LastModifiedByID] [bigint] NULL,
	[UserID] [bigint] NULL,
	[LinkID] [bigint] NULL,
	[ClassID] [bigint] NULL,
	[Scope] [varchar](500) NULL,
	[Data] [varchar](max) NULL,
	[Value] [nvarchar](max) NULL,
	[DeletedDateTime] [datetime] NULL,
 CONSTRAINT [PK_attribute] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

USE [aim1]
GO

/****** Object:  StoredProcedure [item].[setAttribute]    Script Date: 12-11-2020 16:05:03 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
DROP PROCEDURE [item].[setAttribute]
GO


--UPDATE item.dt set deletedDateTime = null where id = 3673951
--UPDATE item.dt set finishDateTime = null where id = 3673951
/** */

CREATE PROCEDURE [item].[setAttribute]
	@ID BIGINT=NULL OUTPUT -- ID of AttributeValue
	,@ItemID BIGINT=NULL
	,@AttributeName VARCHAR(MAX)=NULL -- Attribute Name
	,@NameID INT=NULL -- Attribute name ID
	,@Value NVARCHAR(MAX)=NULL -- Value of Attribute
	,@Date DATETIME=NULL -- Value of Attribute, in date format
	,@Data VARCHAR(MAX)=NULL -- Meta Data related to attribute
	,@Max INT=1 -- If max > 1 there values are added and not overwritten
	,@IsPublic BIT=NULL -- Attribute is public and visible for all users
	,@Encrypt BIT=NULL -- Defines if value must be encrypted such as passwords

	,@HostID VARCHAR(50)=NULL -- Values are explicit for a specific host
	,@Host VARCHAR(50)=NULL -- Host name to find HostID
	,@LinkID VARCHAR(10)=NULL -- Value of refered item ID
	,@ClassID BIGINT=NULL -- SchemaID/ClassID of refered item, (omitted if LinkID is provided)
	,@Class VARCHAR(50)=NULL -- Schema/ClassName to find ClassID (omitted if ClassID is provided)
	,@Schema VARCHAR(50)=NULL -- Synonim for @Class
	,@KeyID INT=NULL -- Search KeyID for refered item, combined with class within active host (omitted if no ClassID is provided)
	,@KeyName VARCHAR(50)=NULL -- Search KeyName for refered item, combined with class within active host (omitted if no ClassID is provided)
	,@Tag VARCHAR(50)=NULL -- Search Tag for refered item, combined with class within children of passed MasterID

	,@PropertyName VARCHAR(50)=NULL -- Related propertyname of item table, only specified if @PropertyName diverse form @AttributeName
	,@CreatedDateTime DATETIME=NULL -- Explicit value for CreatedDateTime
	,@LastModifiedDateTime DATETIME=NULL -- Explicit value for LastModifiedDateTime
	,@LastModifiedByID BIGINT=NULL -- itemID of User who modified attribute
	,@UserID BIGINT=NULL   -- itemID of User who has access to attribute, attribute will not be visible to other users
	,@IsNull BIT=NULL -- If true, attribute must exists, attribute will not be created

	,@Name VARCHAR(MAX)=NULL -- Depricated, Replaced by @AttributeName
	,@Title VARCHAR(MAX)=NULL -- Depricated, Replaced by @AttributeName
AS
	SET NOCOUNT ON
	DECLARE @itemclassID INT,@EmailAid INT,@personID INT,@ToID INT,@FromID INT,@SrcID INT,@email VARCHAR (200),@isProperty BIT
	IF @HostID IS NOT NULL AND ISNUMERIC(@HostID)=0 SET @HostID = item.getId(@HostID)

	/* Depricated settings */
	IF @Name IS NOT NULL SET @AttributeName = @Name
	IF @Title IS NOT NULL SET @AttributeName = @Title
	/* END Depricated settings */

	IF @Schema IS NOT NULL SET @Class=@Schema
	IF @classID IS NULL AND @Class IS NOT NULL
	BEGIN
		SELECT @ClassID=id FROM item.dt WHERE SrcID=MasterID AND SrcID=0 AND Name=@Class
		IF @classID IS NULL
		BEGIN
			INSERT item.dt (MasterID,SrcID,ClassID,name) VALUES (0,0,0,@Class)
			SET @ClassID = scope_identity()
		END
	END

	/*
	* If no attribute name or ID is set exit update
	*/
	IF @NameID IS NULL AND NOT @AttributeName>'' RETURN
	IF @NameID IS NULL SELECT @NameID=ID FROM attribute.name WHERE Name=@AttributeName
	IF @NameID IS NULL
	BEGIN
		INSERT attribute.name (name) VALUES (@AttributeName)
		SET @NameID=scope_identity()
	END

 	--IF @HostID=1 SET @IsPublic=1
	/* If HostID is ommited, host id is set to HostID of attribute item */
	IF @HostID IS NULL SELECT @HostID=HostID FROM item.dt WHERE ID=@ItemID
--IF @LinkID IS NOT NULL AND @Class IS NULL SELECT @Class=[schema] FROM item.vw WHERE ID=@LinkID
	/*
	*	If link provided and no attributename, attribute name is set to classname if linked item
	*	If link exists, exit update
	*/
	IF @LinkID IS NOT NULL
	BEGIN
		SELECT @Max=ISNULL(@Max,9999), @AttributeName=ISNULL(@AttributeName,[schema]), @Class=ISNULL(@Class,[schema]), @ClassID=ClassID, @Value=ISNULL(ISNULL(name,Title),[schema]) FROM item.vw WHERE ID=@LinkID
		IF @Data IS NULL AND EXISTS(SELECT 0 FROM attribute.vw WHERE ItemID=@ItemID AND NameID=@NameID AND LinkID=@LinkID) RETURN
	END
	ELSE IF @ClassID IS NOT NULL BEGIN
		/* If tag is set, serach for item with tag within children of master */
		/* @todo */
		IF @Tag IS NOT NULL SELECT @LinkID=ID,@Value=Title FROM item.dt WHERE HostID=@HostID AND ClassID=@ClassID AND Tag=@tag
		/* If KeyID then search for KeyID within host and same class */
		ELSE IF @KeyID IS NOT NULL SELECT @LinkID=id,@Value=ISNULL(@Value,name) FROM item.dt WHERE HostID=@HostID AND ClassID=@ClassID AND KeyID=@KeyID
		/* If KeyName then search for KeyName within host and same class */
		ELSE IF @KeyName IS NOT NULL SELECT @LinkID=id,@Value=ISNULL(@Value,name) FROM item.dt WHERE HostID=@HostID AND ClassID=@ClassID AND KeyName=@KeyName
		-- Deprecated /* If KeyNR then search for KeyName within host and same class */
		-- Deprecated ELSE IF @keyNr IS NOT NULL SELECT @LinkID=id,@Value=ISNULL(@Value,name) FROM item.dt WHERE HostID=@HostID AND ClassID=@ClassID AND Tag=@keyNr

		/* ClassID with Value results in LinkID to item, If item not exists it will be created */
		IF @Value IS NOT NULL BEGIN
			/* check if item exists with key equal to @Value  */
			SELECT @LinkID=ID, @Value=ISNULL(@Value,Name) FROM item.dt WHERE HostID=@HostID AND ClassID=@ClassID AND KeyName=@Value
			/* If still not find then look for name equal to @Value */
			IF @LinkID IS NULL SELECT @LinkID=id, @Value=ISNULL(@Value,name) FROM item.dt WHERE HostID=@HostID AND ClassID=@ClassID AND Name=@Value
			/* If ClassID is acccount (class=1000) then do not create object, also clear idname */
			IF @LinkID IS NULL AND @ClassID IN (1000) SET @PropertyName = NULL
			/* Stil object not found then create */
			ELSE IF @LinkID IS NULL BEGIN
				INSERT item.dt(HostID,ClassID,Name,Tag,KeyID,keyName) SELECT @HostID,@ClassID,@Value,@Tag,@KeyID,ISNULL(@keyName,@Value)
				SET @LinkID=scope_identity()
			END
		END
	END

	--SELECT @AttributeName,@LinkID,@Value,@Class,@ClassID
	IF @Date IS NOT NULL SET @Value=CONVERT(VARCHAR(50),@Date,121)
	--ELSE IF @Value IS NOT NULL AND ISDATE(@Value)=1 SET @Value=CONVERT(VARCHAR(50),CONVERT(DATETIME,@Value),121)

	IF EXISTS(SELECT 1 FROM sys.columns WHERE Name = @AttributeName AND Object_ID = OBJECT_ID('item.dt')) SET @PropertyName = @AttributeName


	--IF @Value = 'NULL' SET @Value = NULL;

	IF @PropertyName IS NOT NULL
	BEGIN
		DECLARE @SQL VARCHAR(MAX)
		SET @SQL = 'UPDATE item.[dt] SET ['+@PropertyName+']=' + CASE
		WHEN @LinkID IS NOT NULL THEN @LinkID
		WHEN @Value>'' THEN '''' + @Value + ''''
		ELSE 'NULL'
		END + ' WHERE[ID]='+CONVERT(VARCHAR(50),@ItemID)
		EXEC(@SQL)
	END

	--SELECT @PropertyName
	--RETURN



	IF @Max=1
	BEGIN
		--SELECT @Max,@AttributeName,@LinkID,@Data
		IF @ID IS NULL SELECT @ID=AttributeId FROM attribute.vw WHERE ItemID=@ItemID AND NameID=@NameID AND (HostID IS NULL OR HostID = @HostID) AND (UserID IS NULL OR UserID = @UserID)
	--SELECT @ID
		--IF @ID IS NULL SELECT @LinkID=ID FROM attribute.vw WHERE ItemID=@ItemID AND NameID=@NameID AND HostID=@HostID AND LinkID=@LinkID --AND HostID=@HostID ??
		-- IF @ID IS NULL SELECT @ID=ID FROM attribute.vw WHERE ItemID=@ItemID AND NameID=@NameID AND HostID=@HostID AND ISNULL (UserID,0)IN (@userID,0) AND (rights IS NULL OR moduserID=@moduserID)
	END
	ELSE
	BEGIN
		IF @ID IS NULL SELECT @ID=AttributeId FROM attribute.vw WHERE ItemID=@ItemID AND NameID=@NameID AND (HostID IS NULL OR HostID = @HostID) AND (UserID IS NULL OR UserID = @UserID) AND Value = @Value AND LinkID=@LinkID
	END

	--SELECT @ID RETURN

	IF @ID IS NOT NULL AND @IsNull=1 RETURN
--	SELECT 1, @ID, @Max,@AttributeName,@LinkID,@Data
	IF @ID IS NULL AND @Max>1 SELECT @ID=AttributeId FROM attribute.vw WHERE ItemID=@ItemID AND NameID=@NameID AND (HostID IS NULL OR HostID = @HostID) AND (UserID IS NULL OR UserID = @UserID) AND Value=@Value AND LinkID=@LinkID
	--SELECT 1, @ID, @Max,@AttributeName,@LinkID,@Data
	IF @ID IS NOT NULL AND @Data IS NULL AND EXISTS(SELECT 0 FROM attribute.vw WHERE AttributeId=@ID AND Value = @Value) RETURN
	ELSE IF @ID IS NOT NULL AND EXISTS(SELECT 0 FROM attribute.vw WHERE AttributeId=@ID AND Value=@Value AND Data = @Data) RETURN
	IF @ID IS NULL BEGIN
		INSERT attribute.dt (ItemID,NameID) VALUES (@ItemID,@NameID) SET @ID = scope_identity()
	END
	IF @Encrypt=1 SET @Value = PWDENCRYPT(@Value)
	SET @LastModifiedDateTime = ISNULL(@LastModifiedDateTime,GETDATE())

	--SELECT @Value,@id RETURN


	UPDATE attribute.dt SET
		HostID = ISNULL(@HostID,HostID)
		,LastModifiedByID = ISNULL(ISNULL(@LastModifiedByID,@userID),LastModifiedByID)
		,UserID = @userID
		,LastModifiedDateTime = @LastModifiedDateTime
		,NameID = ISNULL(@NameID,NameID)
		,Value = @Value
		,LinkId = ISNULL(@LinkID,LinkID)
		,Data = ISNULL(@Data,Data)
	WHERE
		ID = @ID
	UPDATE item.dt SET LastModifiedDateTime = @LastModifiedDateTime WHERE ID=@ItemID


GO

CREATE TABLE [attribute].[name](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NOT NULL,
	[IsProperty] [bit] NULL,
	[idx] [int] NULL,
 CONSTRAINT [PK_classField] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

CREATE TABLE [item].[dt](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[UID] [uniqueidentifier] NULL CONSTRAINT [item_UID]  DEFAULT (newid()),
	[Name] [varchar](500) NULL,
	[Title] [varchar](500) NULL,
	[Subject] [varchar](8000) NULL,
	[Summary] [varchar](8000) NULL,
	[Description] [varchar](max) NULL,
	[ClassID] [bigint] NULL CONSTRAINT [item_ClassID]  DEFAULT ((0)),
	[InheritedID] [bigint] NULL,
	[DetailID] [bigint] NULL,
	[HostID] [bigint] NULL CONSTRAINT [item_HostID]  DEFAULT ((0)),
	[UserID] [bigint] NULL CONSTRAINT [item_UserID]  DEFAULT ((0)),
	[MasterID] [bigint] NULL,
	[SrcID] [bigint] NULL,
	[ParentID] [bigint] NULL,
	[KeyID] [bigint] NULL,
	[CreatedByID] [bigint] NULL,
	[OwnerID] [bigint] NULL,
	[DeletedByID] [bigint] NULL,
	[LastModifiedByID] [bigint] NULL,
	[CreatedDateTime] [datetime] NULL CONSTRAINT [item_CreatedDateTime]  DEFAULT (getdate()),
	[LastModifiedDateTime] [datetime] NULL CONSTRAINT [DF_dt_LastModifiedDateTime]  DEFAULT (getdate()),
	[DeletedDateTime] [datetime] NULL,
	[StartDateTime] [datetime] NULL,
	[EndDateTime] [datetime] NULL,
	[FinishDateTime] [datetime] NULL,
	[LastIndexDateTime] [datetime] NULL,
	[IsSelected] [tinyint] NULL,
	[IsDisabled] [tinyint] NULL,
	[IsPublic] [bit] NULL,
	[IsClone] [bit] NULL,
	[IsChecked] [bit] NULL,
	[HasChildren] [int] NULL,
	[HasAttachements] [bit] NULL,
	[MessageCount] [int] NULL,
	[ChildIndex] [int] NULL,
	[State] [varchar](500) NULL,
	[Categories] [varchar](500) NULL,
	[Tag] [varchar](100) NULL,
	[KeyName] [varchar](500) NULL,
	[GroupName] [varchar](50) NULL,
	[filterfields] [varchar](8000) NULL,
	[Location] [varchar](50) NULL,
	[secret] [uniqueidentifier] NULL,
	[server] [uniqueidentifier] NULL,
	[secret_uid] [uniqueidentifier] NULL,
	[Scope] [varchar](500) NULL,
	[Data] [varchar](max) NULL,
	[files] [text] NULL,
	[schema] [varchar](500) NULL,
 CONSTRAINT [PK_item] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/** */
CREATE VIEW [item].[dv]
AS
	SELECT * FROM item.dt WHERE DeletedDateTime IS NULL
GO


/** */
CREATE VIEW [attribute].[dv]
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


CREATE VIEW [attribute].[vw]
AS
	SELECT
		F.Name AttributeName
		,A.*
		,I.[schema]
		,I.ID
		FROM attribute.dv A
		INNER JOIN attribute.name F ON F.id = A.NameID
		LEFT OUTER JOIN item.dv I ON I.ID = A.LinkID
GO



EXEC item.setAttribute @itemID=4, @name='Test', @value='JA'
EXEC item.setAttribute @itemID=5, @name='Test', @value='JA'

SELECT * FROM attribute.dt




