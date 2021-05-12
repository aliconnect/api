USE [aim1]
GO

/** */
ALTER VIEW item.dv
AS
	SELECT * FROM item.dt WHERE DeletedDateTime IS NULL
GO

/** */
ALTER VIEW item.class
AS
	SELECT id,hostID,srcID,masterID,name,name class FROM item.dv WHERE srcID=masterID AND srcID=0
GO

/** */
ALTER VIEW attribute.dv
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

/** */
ALTER VIEW item.vw
AS
	SELECT
		I.[ID]
		--,S.name as [schema]
		,I.[schema]
		,I.[schema] as [typical]
		,'Company('+CAST(I.hostID AS VARCHAR(20))+')' as [Host]
	  ,I.[UID]
	  ,I.[Name]
	  ,I.[Title]
	  ,ISNULL(ISNULL(I.[Title],I.[Name]),I.[KeyName]) AS DisplayName
	  ,I.[Subject]
	  ,I.[Summary]
	  ,I.[Description]
	  ,I.[ClassID]
	  ,I.[InheritedID]
	  ,I.[DetailID]
	  ,I.[HostID]
	  ,I.[UserID]
	  --,I.[MasterID]
		,AM.[LinkID] AS [MasterID]
	  ,I.[SrcID]
	  ,I.[ParentID]
	  ,I.[KeyID]
	  ,I.[CreatedByID]
	  ,I.[OwnerID]
	  ,I.[DeletedByID]
	  ,I.[LastModifiedByID]
	  ,I.[CreatedDateTime]
	  ,I.[LastModifiedDateTime]
	  ,I.[DeletedDateTime]
	  ,I.[StartDateTime]
	  ,I.[EndDateTime]
	  ,I.[FinishDateTime]
	  ,I.[LastIndexDateTime]
	  ,I.[IsSelected]
	  ,I.[IsDisabled]
	  ,I.[IsPublic]
	  ,I.[IsClone]
	  ,I.[IsChecked]
	  ,I.[HasChildren]
	  ,I.[HasAttachements]
	  ,I.[MessageCount]
	  ,I.[ChildIndex]
	  ,I.[State]
	  ,I.[Categories]
	  ,I.[Tag]
	  ,I.[KeyName]
	  ,I.[GroupName]
	  ,I.[filterfields]
	  ,I.[Location]
	  ,I.[secret]
	  ,I.[server]
	  ,I.[secret_uid]
	  ,I.[Scope]
	  ,I.[Data]
	  ,I.[files]
		,'Contact('+CAST(I.CreatedByID AS VARCHAR(20))+')' [CreatedBy]
		,'Contact('+CAST(I.LastModifiedByID AS VARCHAR(20))+')' [LastModifiedBy]
		--,item.schemaName(I.InheritedID)+'('+CAST(I.InheritedID AS VARCHAR(20))+')' as [Inherited]
		,ISNULL(I.detailID,I.id) ItemID
		,CASE WHEN I.SrcID=I.MasterID THEN 1 ELSE 0 END AS IsClass
		,C.Title AS CreatedByTitle
	FROM
		item.dv I
		INNER JOIN item.dv S ON S.ID = I.ClassID
		LEFT OUTER JOIN item.dv C ON C.ID = I.CreatedByID
		LEFT OUTER JOIN attribute.dv AM ON AM.ItemID = I.ID AND AM.NameID = 980
GO

/** */
ALTER VIEW attribute.vw
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

/** */
ALTER VIEW account.vw
AS
	WITH email (email_id,userID,email,emailID,emailVerified,emailVerifiedDT,emailData,userUID,password,userName,mobile,mobileID,mobileVerified)  AS (
		SELECT E.id,U.id,E.value,E.AttributeID,CASE WHEN E.userID=E.itemID THEN 1 ELSE 0 END,E.LastModifiedDateTime,E.data,U.uid,U.password,I.title,M.value,M.AttributeId,CASE WHEN M.UserID=M.ItemID THEN 1 ELSE 0 END
		FROM attribute.vw E
		LEFT OUTER JOIN item.dt I ON I.id=E.ItemID
		LEFT OUTER JOIN account.dt U ON U.id=I.id
		LEFT OUTER JOIN attribute.vw M ON M.ItemID=I.id AND M.NameID=996
		WHERE E.NameID=30
	)
	SELECT
		E.*
		,A.hostID AS hostID
		,A.id accountID
		,A.uid accountUID
		,A.title accountName
		,H.uid hostUID
		,H.keyname AS hostName
		,H.keyname AS hostTitle
		,S.value AS scope
		,S.AttributeId AS scopeID
	FROM
		email E
		LEFT OUTER JOIN item.vw A ON A.classID=1004 AND A.srcID=E.userID
		LEFT OUTER JOIN item.vw H ON H.id=A.hostID
		LEFT OUTER JOIN attribute.vw S ON S.ItemID=A.id AND S.NameID=1994
GO

/**
 *
 */
ALTER PROCEDURE account.[delete_account] @Id INT
AS
	UPDATE item.dt SET DeletedDateTime=GETDATE() WHERE Id=@Id
GO

/**
 *
 */
ALTER PROCEDURE account.get
	@HostName VARCHAR(250) = 1
	,@AccountName VARCHAR(250) = NULL
	,@password VARCHAR(50) = ''
	,@code VARCHAR(50) = NULL
	,@nonce VARCHAR(50) = NULL
	,@IP VARCHAR(50) = NULL
	,@accountId INT = NULL OUTPUT
	,@Method VARCHAR(10) = NULL
	,@Url VARCHAR(8000) = NULL
AS
	SET NOCOUNT ON
	DECLARE @client_secret UNIQUEIDENTIFIER, @HostID BIGINT, @EmailID BIGINT

	-- Find accountID by phonenumber
	IF @accountId IS NULL AND ISNUMERIC(@accountName)=1 SELECT @accountId = I.ID FROM item.vw I INNER JOIN attribute.dv A ON I.HostID=1 AND I.ClassID=1004 AND A.ItemID=I.ID AND A.NameID=996 AND A.Value = CONVERT(VARCHAR(50), CONVERT (BIGINT, @accountName) )
	--IF @accountId IS NULL AND ISNUMERIC(@accountName)=1 SELECT @accountId = ID FROM item.dt WHERE Id = @accountName
	-- Find accountID by email
	IF @accountId IS NULL
		SELECT @accountId = I.ID, @EmailID = A.AttributeID
		FROM item.dv I
		INNER JOIN attribute.dv A ON
			I.HostID=1 -- the account item is saved on main host 1
			AND I.ClassID = 1004 -- the account item is of class Contact
			AND A.ItemID = I.ID -- Attributes are linked to this account
			AND A.NameID = 30 -- Only type email is selected
			AND A.Value = @accountName -- The value is equal to the accountname, emails equal to accountname
			AND A.UserID = A.ItemID -- Only verified emails are checked. After verification the userID of the attribute is linked to the accountid
	-- If account is not find, unverified emails are checked.
	IF @accountId IS NULL
		SELECT @accountId = I.ID, @EmailID = A.AttributeID
		FROM item.vw I
		INNER JOIN attribute.dv A ON
			I.HostID=1 -- the account item is saved on main host 1
			AND I.ClassID=1004 -- the account item is of class Contact
			AND A.ItemID=I.ID -- Attributes are linked to this account
			AND A.NameID=30 -- Only type email is selected
			AND A.Value = @accountName -- The value is equal to the accountname, emails equal to accountname
	IF @accountId IS NOT NULL AND @EmailID IS NULL
		SELECT @EmailID = A.AttributeID
		FROM attribute.dv A
		WHERE
			A.ItemID = @accountId
			AND A.NameID = 30
			AND A.UserID = @accountId

	IF ISNUMERIC(@HostName)=1 SELECT @HostID = ID, @client_secret=[secret] FROM item.vw WHERE ID=@HostName
	ELSE IF @HostName LIKE '%-%-%-%-%' SELECT @HostID = ID, @client_secret=[secret] FROM item.dt WHERE uid = @HostName
	--IF @HostID IS NULL AND @HostName like '%.%' SELECT @HostName = name, @HostID = ID, @client_id = client_id, @client_secret = client_secret FROM item.client WHERE id IN (SELECT hostID FROM item.hostname WHERE name=@HostName)
	ELSE SELECT @HostID = ID, @client_secret=[secret] FROM item.vw WHERE hostID=1 AND classID=1002 AND keyname = @HostName

	--IF @client_secret IS NULL AND @accountId IS NOT NULL AND @HostID IS NULL AND ISNUMERIC(@HostName) = 0
	--BEGIN
	--	SET @client_secret = newid()
	--	INSERT item.[dt] (hostID,classID,keyname,[secret],UserID) VALUES (1,1002,@HostName,@client_secret,@accountId)
	--	SET @HostID = scope_identity()
	--END
	IF @client_secret IS NULL AND @HostID IS NOT NULL
		UPDATE item.dt SET secret = newid() WHERE ID = @HostID

	--IF @Method IS NOT NULL
	--INSERT INTO aimhis.his.req (client_id,aud,sub,method,url)
	--VALUES (@HostID,@HostID,@accountId,@Method,@Url)

	SELECT
		H.ID AS ClientID
		,H.KeyName AS ClientName
		,H.DisplayName AS ClientDisplayName
		,lower(H.UID) AS client_id
		,lower(@client_secret) AS client_secret
		,ISNULL(H.OwnerID,H.ID) AS OwnerID
		,lower(A.UID) AS account_id
		,A.ID AS AccountID
		,A.Title AS AccountName
		,ISNULL(GS.Value + ' ','') + ISNULL(RS.Value, '') AS scope
		,N.nonce
		,N.SignInDateTime
		,N.SignOutDateTime
		,GS.Value AS scope_granted
		,RS.Value AS scope_requested
		,E.value email
		,CASE WHEN E.UserID=E.ItemID THEN 1 END email_verified
		,E.AttributeID email_id
		,M.value phone_number
		,CASE WHEN M.UserID=M.ItemID THEN 1 END phone_number_verified
		,M.AttributeID phone_number_id
		,PWDCOMPARE(ISNULL(@password,''),PW.Value) AS IsPasswordOk
		,IP.Value IP
		,PWDCOMPARE(@code,D.Value) IsCodeOk
		,D.LastModifiedDateTime CodeLastModifiedDateTime
		,C.HostID AS ContactHostID
		,C.SrcID AS ContactAccountID
		,C.ID AS ContactID
		,CASE WHEN RS.UserID=@accountId THEN 1 END IsScopeAccepted
		,pvt.*
		--,PD.value AS api
		,PR.Value AS PaymentRequired
	FROM
		-- Host
		item.vw H
		-- Account
		LEFT OUTER JOIN item.vw A ON A.ID = @accountId
		-- Account Email address
		--LEFT OUTER JOIN attribute.dt PD ON PD.ItemID=@HostID AND PD.NameID=2097
		LEFT OUTER JOIN attribute.dv PR ON PR.ItemID=@HostID AND PR.NameID=2098 AND PR.UserID = @accountId
		LEFT OUTER JOIN attribute.dv E ON E.AttributeID=@EmailID
		-- Account Password
		LEFT OUTER JOIN attribute.dv PW ON PW.ItemID=A.ID AND PW.NameID=516
		-- Account Mobile
		LEFT OUTER JOIN attribute.dv M ON M.ItemID=A.ID AND M.NameID=996
		-- Account IP Check Value
		LEFT OUTER JOIN attribute.dv IP ON IP.ItemID=A.ID AND IP.NameID=1604 AND IP.Value=@IP
		-- Account Data Value / code
		LEFT OUTER JOIN attribute.dv D ON D.ItemID=A.ID AND D.NameID=1823
		-- Account Contact on domain
		LEFT OUTER JOIN item.vw C ON C.HostID=@HostID AND C.ClassID=1004 AND ISNULL(C.SrcID,C.ID) = A.ID
		-- Account Contact Granted Scope
		LEFT OUTER JOIN attribute.dv GS ON GS.ItemID = C.ID AND GS.HostID=@HostID AND GS.NameID = 1994 AND GS.UserID = @HostID

		-- Account Contact Request Scope
		LEFT OUTER JOIN attribute.dv RS ON RS.NameID = 1994 AND RS.ItemID = ISNULL(C.ID,@accountId) AND RS.HostID=@HostID AND RS.UserID = @accountId

		-- Account nonce
		LEFT OUTER JOIN auth.nonce N ON N.nonce = @nonce AND N.sub = @accountId

		LEFT OUTER JOIN (SELECT ItemID, AttributeName, Value FROM attribute.vw WHERE ItemID = @accountId AND HostID=1) p
			PIVOT
			( MAX(Value) FOR AttributeName IN ( preferred_username, name, nickname, given_name, middle_name, family_name, unique_name, upn ) ) AS pvt ON pvt.ItemID = @accountId
	WHERE
		H.ID = @HostID
GO

-- exec account.get @hostname='schiphol'
-- exec account.get @hostname='c52aba40-11fe-4400-90b9-cee5bda2c5aa', @nonce=NULL
--exec account.get @accountname='max@alicon.nl'
--exec account.get @hostname='max@alicon.nl'



GO

/** */
ALTER PROCEDURE account.[patch] @email VARCHAR(500), @host VARCHAR(50)
AS
	DECLARE @userID INT,@hostID INT
	SELECT @userID=UserID FROM account.vw WHERE email=@email-- AND hostname=@host
	SELECT @UserID
GO

/**
 * Returns ClassID and creates Class if not exists
*/
ALTER PROCEDURE item.[getClassID] @schema VARCHAR(200), @classID INT OUTPUT
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

/** */
ALTER PROCEDURE item.[getTreeModel] @id INT
AS
	SET NOCOUNT ON
	;WITH P ( id,detailID,srcID,masterID,level,path) AS (
		SELECT id,detailID,srcID,null,1,CONVERT (VARCHAR (5000),'')
		FROM api.items
		WHERE id = @id AND selected=1
		UNION ALL
		SELECT I.id,I.detailID,I.srcID,P.id,level+1,CONVERT (VARCHAR (5000),path+STR (I.idx))
		FROM P
		INNER JOIN api.items I ON I.masterID = ISNULL (P.detailID,P.id) AND level<10 AND ISNULL (selected,1)=1--AND ISNULL (I.selected,1)=1
		INNER JOIN api.items D ON D.id = ISNULL (I.detailID,I.id)
	)
	SELECT I.id as itemID,I.name,I.title,P.masterID,item.schemaName (I.id) as [schema],P1.*--,P.level,I.idx
	FROM P
	INNER JOIN api.items I ON I.id = P.id
	INNER JOIN api.items D ON D.id=ISNULL (I.detailID,I.id)
	LEFT OUTER JOIN om.class C ON C.id = D.classID
	INNER JOIN (SELECT I.id,F.name,F.value FROM attribute.vw F INNER JOIN P I ON F.id IN (I.id,I.srcID)) X PIVOT (max (value) FOR name in (w,h,depth,x,y,z,r,rx,ry,rz,children,shape,geo,dx,dy,dz,fx,PowerKVA,Air,Water)) P1 ON P1.id=I.id
	where path is not null
	ORDER BY path
GO

/** */
ALTER PROCEDURE item.[post]
	@hostID INT=NULL,
	@userID INT=NULL,
	@accountId INT=NULL,
	@id INT=NULL OUTPUT,
	@schema VARCHAR (250)=NULL,
	@name VARCHAR (250)=NULL,
	@keyname VARCHAR (250)=NULL,
	@tag VARCHAR (250)=NULL,
	@title VARCHAR (250)=NULL,
	@subject VARCHAR (250)=NULL,
	@summary VARCHAR (250)=NULL,
	@filterfields VARCHAR (8000)=NULL,
	@value VARCHAR (8000)=NULL,
	@keyID VARCHAR (250)=NULL,
	@sourceID INT=NULL,
	@values VARCHAR (250)=NULL,
	@masterID INT=NULL,
	@classID INT=NULL,
	@clone BIT=NULL,
	@detailID INT = NULL,
	@modifiedByID INT = NULL,
	@idx INT = NULL,
	@srcID INT = NULL,
	@www BIT=null,
	--@classname VARCHAR (100)=NULL,
	@parentId INT = NULL,
	@host VARCHAR (50) = NULL,
	@FinishDateTime VARCHAR (50) = NULL,
	@StartDateTime VARCHAR (50) = NULL,
	@EndDateTime VARCHAR (50) = NULL,
	@sessionId VARCHAR (50) = NULL,
	@where VARCHAR (100) = NULL,
	@find BIT = NULL -- Geeft aan of gekeken moet worden naar keyid of keyname. Als deze worden gevonden dan niet toevoegen
AS
	SET NOCOUNT ON
	IF @id IS NOT NULL RETURN
	IF @classID IS NULL AND @schema IS NOT NULL EXEC item.getClassID @schema=@schema, @classID=@classID OUTPUT
	IF @id IS NULL AND @keyID IS NOT NULL SELECT @id=id FROM item.dt WHERE hostID=@hostID AND classID=@classID AND keyID=@keyID
	IF @id IS NULL AND @keyName IS NOT NULL SELECT @id=id FROM item.dt WHERE hostID=@hostID AND classID=@classID AND keyName=@keyName
	IF @id IS NULL AND @tag IS NOT NULL AND @masterID IS NOT NULL SELECT @id=id FROM item.dt WHERE masterID=@masterID AND classID=@classID AND tag=@tag

	--IF @find IS NOT NULL AND @keyID IS NOT NULL SELECT @id=id FROM api.items WHERE hostID=@hostID AND classID=@classID AND keyID=@keyID
	--IF @find IS NOT NULL AND @id IS NULL AND @keyName IS NOT NULL SELECT @id=id FROM api.items WHERE hostID=@hostID AND classID=@classID AND keyName=@keyName
	--IF @find IS NOT NULL AND @id IS NULL AND @tag IS NOT NULL SELECT @id=id FROM api.items WHERE hostID=@hostID AND classID=@classID AND tag=@tag

  	IF @id IS NOT NULL RETURN

	DECLARE @dt CHAR(10),@groupID INT,@moduserID INT,@nr INT,@fclassID INT,@childClassNr INT, @classNr INT
	IF @srcID IS NOT NULL AND @classID IS NULL SELECT @classID = classID FROM item.dt WHERE id = @srcID
	IF @srcID IS NOT NULL SELECT @schema = name FROM item.dt WHERE id = @srcID
	IF @schema IS NULL SELECT @schema = name FROM item.dt WHERE id = @classID

	IF @masterID IS NOT NULL
	BEGIN
		IF @idx IS NULL
		BEGIN
			SET @idx=1
			SELECT @idx=MAX(ISNULL(ChildIndex,0))+1 FROM item.dt WHERE masterID=@masterID
		END
		UPDATE item.dt SET HasChildren = 1 WHERE id=@masterID or id=@parentId
	END
	IF @masterID IS NOT NULL
	BEGIN
		IF @srcID<>@masterID
		BEGIN
			IF @srcID IS NULL
				SELECT @nr=MAX (CONVERT (INT,tag)) FROM item.dt WHERE tag IS NOT NULL AND ISNUMERIC (tag)=1 AND masterID=@masterID AND classID=@classID
			ELSE
				SELECT @nr=MAX (CONVERT (INT,tag)) FROM item.dt WHERE tag IS NOT NULL AND ISNUMERIC (tag)=1 AND masterID=@masterID AND srcID=@srcID
			SET @nr=ISNULL (@nr,0)+1
			--IF @nr<1000 SET @tag=right ('000'+convert (varchar (3),@nr),3) ELSE SET @tag=@nr
		END
	END
	ELSE
	BEGIN
		IF @srcID IS NULL
			SELECT @nr=MAX (CONVERT (INT,tag)) FROM item.dt WHERE tag IS NOT NULL AND ISNUMERIC (tag)=1 AND hostID=@hostID AND classID=@classID
		ELSE
			SELECT @nr=MAX (CONVERT (INT,tag)) FROM item.dt WHERE tag IS NOT NULL AND ISNUMERIC (tag)=1 AND hostID=@hostID AND srcID=@srcID
		--IF @nr IS NOT NULL SET @nr=right ('000',convert (varchar (3),@nr+1))
		IF @nr IS NOT NULL
		BEGIN
			SET @nr=ISNULL (@nr,0)+1
			--IF @nr<1000 SET @tag=right ('000'+convert (varchar (3),@nr),3) ELSE SET @tag=@nr
		END
	END

	DECLARE @i INT

	--INSERT item.dt (FinishDateTime,StartDateTime,EndDateTime,IsSelected,childClassNr,ClassNr,tag,masterID,parentId,detailID,idx,hostID,userID,createdById,ownerID,modifiedByID,classID,srcID,keyname,name,clone,www)--,files,state,categorie,StartDateTime,EndDateTime,FinishDateTime,filterfields)
	--VALUES (@FinishDateTime,@StartDateTime,@EndDateTime,CASE WHEN @classID=2107 AND @masterID<>ISNULL (@srcID,0) THEN 1 ELSE null END,@childClassNr,@ClassNr,@nr,@masterID,@parentId,@detailID,@idx,@hostID,ISNULL (@userID,0),@moduserID,@moduserID,@moduserID,@classID,@srcID,@keyname,@name,@clone,@www)

	INSERT item.dt (Title,Subject,Summary,FinishDateTime,StartDateTime,EndDateTime,IsSelected,Tag,masterID,parentId,detailID,ChildIndex,hostID,userID,CreatedByID,ownerID,LastModifiedByID,classID,srcID,keyname,name,IsClone,IsPublic)--,files,state,categorie,StartDateTime,EndDateTime,FinishDateTime,filterfields)
	VALUES (@Title,@Subject,@Summary,@FinishDateTime,@StartDateTime,@EndDateTime,CASE WHEN @classID=2107 AND @masterID<>ISNULL (@srcID,0) THEN 1 ELSE null END,@nr,@masterID,@parentId,@detailID,@idx,@hostID,ISNULL (@userID,0),@moduserID,@moduserID,@moduserID,@classID,@srcID,@keyname,@name,@clone,@www)

	SET @id = SCOPE_IDENTITY ()
	IF @srcID IS NOT NULL EXEC item.setAttribute @id=@id,@name='Source',@hostID=@hostID,@ItemID=@SrcID,@classID=@fclassid
	IF @masterID IS NOT NULL EXEC item.setAttribute @id=@id,@name='Master',@hostID=@hostID,@ItemID=@masterID,@classID=@fclassid
GO

/** */
ALTER PROCEDURE item.[postVisit] @id INT,@userID int--,@hostID int=NULL
AS
	IF NOT EXISTS (SELECT 0 FROM item.[visit] WHERE id=@id AND userID=@userID)
		INSERT item.[visit] (ID,UserID,FirstVisitDateTime,LastVisitDateTime,Cnt)
		VALUES (@id,@userID,GETUTCDATE(),GETUTCDATE(),0)
	ELSE
		UPDATE item.[visit] SET cnt=cnt+1,LastVisitDateTime=GETUTCDATE() WHERE ID=@id AND userID=@userID
GO


GO

--EXEC item.setAttribute @ItemID=3664305, @Name='Messages', @LinkID=3673902, @max=9999
--select * from attribute.vw where itemID = 3664305



/** */
ALTER PROCEDURE item.[setProperty] @id VARCHAR(50),@name VARCHAR(50), @value VARCHAR(500)
AS
	IF @value>'' SET @value=''''+@value+''''; ELSE SET @value='NULL'
	EXEC ('UPDATE item.dt SET ['+@name+']='+@value+' WHERE [ID]='+@id)
GO

/**
 * Verplaatst alle items van Host FromId naar ToId
 */
ALTER PROCEDURE dbo.[setHost] (@FromId BIGINT, @ToId BIGINT) AS
	SET NOCOUNT ON
	DECLARE @T TABLE (Id BIGINT);
	WITH P(Level,Id) AS (
		SELECT 0,I.ID
		FROM item.dt I
		WHERE I.id = @FromID
		UNION ALL
		SELECT Level+1,I.id
		FROM P INNER JOIN item.dt I ON I.masterId = P.ID and level<30
	)
	INSERT @T SELECT ID FROM P
	--SELECT * FROM @T
	UPDATE item.dt SET HostId=@ToId WHERE Id IN (SELECT Id FROM @T)
	UPDATE item.dt SET MasterID=@ToId WHERE MasterId=@FromId
	UPDATE attribute.dt SET HostId=@ToId WHERE ItemId IN (SELECT Id FROM @T)
	UPDATE attribute.dt SET LinkID=@ToId WHERE LinkId = @FromId
GO

/** */
ALTER FUNCTION item.[classID] ( @name VARCHAR(200) ) RETURNS BIGINT
AS
	BEGIN
		DECLARE @ClassID BIGINT
		SELECT @ClassID=ID FROM item.dt WHERE srcID=masterID AND srcID=0 AND name=@name
		RETURN @ClassID
	END
GO

/** */
ALTER FUNCTION item.[getId] (@selector VARCHAR(50)) RETURNS BIGINT
AS
BEGIN
	DECLARE @id BIGINT
	IF ISNUMERIC(@selector)=1 SET @id = @selector ELSE SELECT @id=id FROM item.dv WHERE uid=@selector
	RETURN @id
END
GO

/** */
ALTER FUNCTION item.[getAttribute] (@ItemID INT, @AttributeName VARCHAR(200)) RETURNS VARCHAR(MAX)
AS
	BEGIN
		DECLARE @Value VARCHAR(MAX)
		SELECT @Value=Value FROM attribute.vw WHERE ItemID=@ItemID AND AttributeName=@AttributeName
		RETURN @Value
	END
GO


/** */
ALTER FUNCTION [item].[schemaNameArray] (@id INT) RETURNS VARCHAR(250)
	BEGIN
		DECLARE @Value VARCHAR (MAX), @i TINYINT
		SET @i = 0
		WHILE @id IS NOT NULL AND @i<10
		BEGIN
			SELECT @Value = ISNULL(@Value + '","', '') + [schema], @id=ISNULL(inheritedId, srcId) FROM item.dt WHERE id=@id
			SET @i = @i + 1
		END
		RETURN '["' + @value + '"]'
	END
GO

--SELECT [item].[schemaNameArray](2641596)

/** */
ALTER FUNCTION item.[schemaName] (@id INT) RETURNS VARCHAR(250)
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

/** */
ALTER FUNCTION item.attributes(@ID INT) RETURNS TABLE
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

/** */
ALTER FUNCTION account.attribute (@userID INT, @HostID INT) RETURNS TABLE
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

/** */
ALTER FUNCTION account.item (@userID INT) RETURNS TABLE
AS
	RETURN
	(
		SELECT I.*,V.LastVisitDateTime,CASE WHEN V.LastVisitDateTime>LastModifiedDateTime THEN 1 ELSE 0 END AS IsRead
		FROM item.vw I
		LEFT OUTER JOIN item.visit V ON V.id=I.id AND V.userID=@userID
		WHERE ISNULL(I.UserID,I.HostID) IN (@UserID,I.HostID,0)
	)
GO

/** */
ALTER FUNCTION api.getDefinitionTable (@object_id INT) RETURNS VARCHAR (MAX) AS
	BEGIN
	DECLARE @SQL                                NVARCHAR (MAX) = N''
	DECLARE @GenerateFKs                        bit = 1;
	DECLARE @UseSourceCollation                 bit = 1;
	DECLARE @GenerateIdentity                   bit = 1;
	DECLARE @GenerateIndexes                    bit = 1;
	DECLARE @GenerateConstraints                bit = 1;
	DECLARE @GenerateKeyConstraints             bit = 1;
	DECLARE @AssignConstraintNameOfDefaults     bit = 1;
	DECLARE @AddDropIfItExists                  bit = 0;

	;WITH index_column AS
	(
		SELECT
			ic.[object_id]
			,ic.index_id
			,ic.is_descending_key
			,ic.is_included_column
			,c.name
		FROM sys.index_columns ic WITH (NOWAIT)
		JOIN sys.columns c WITH (NOWAIT) ON ic.[object_id] = c.[object_id] AND ic.column_id = c.column_id
		WHERE ic.[object_id] = @object_id
	),
	fk_columns AS
	(
		SELECT
			k.constraint_object_id
			,cname = c.name
			,rcname = rc.name
		FROM sys.foreign_key_columns k WITH (NOWAIT)
		JOIN sys.columns rc WITH (NOWAIT) ON rc.[object_id] = k.referenced_object_id AND rc.column_id = k.referenced_column_id
		JOIN sys.columns c WITH (NOWAIT) ON c.[object_id] = k.parent_object_id AND c.column_id = k.parent_column_id
		WHERE k.parent_object_id = @object_id and @GenerateFKs = 1
	)
	SELECT @SQL =
	    --------------------  DROP IF Exists --------------------------------------------------------------------------------------------------
	        CASE WHEN @AddDropIfItExists = 1
	        THEN
	            --Drop table if exists
	            CAST (
	                N'IF OBJECT_ID (''' + quotename (OBJECT_schema_name (@object_id)) + N'.' + quotename (OBJECT_NAME (@object_id)) + N''') IS NOT NULL DROP TABLE ' + quotename (OBJECT_schema_name (@object_id)) + N'.' + quotename (OBJECT_NAME (@object_id)) + N';' + NCHAR (13)
	            as nvarchar (max))
	            +
	            --Drop foreign keys
	            ISNULL ( ( (
	                SELECT
	                    CAST (
	                        N'ALTER TABLE ' + quotename (s.name) + N'.' + quotename (t.name) + N' DROP CONSTRAINT ' + RTRIM (f.name) + N';' + NCHAR (13)
	                    as nvarchar (max))
	                FROM sys.tables t
	                INNER JOIN sys.foreign_keys f ON f.parent_object_id = t.object_id
	                INNER JOIN sys.schemas      s ON s.schema_id = f.schema_id
	                WHERE f.referenced_object_id = @object_id
	                FOR XML PATH (N''), TYPE).value (N'.', N'NVARCHAR (MAX)'))
	            ,N'') + NCHAR (13)
	        ELSE
	            --Create if table not exists
	            CAST (
	                N'IF OBJECT_ID (''' + quotename (OBJECT_schema_name (@object_id)) + N'.' + quotename (OBJECT_NAME (@object_id)) + N''') IS NULL '
	            as nvarchar (max)) + NCHAR (13)
			END
	    +
	    --------------------- ALTER TABLE -----------------------------------------------------------------------------------------------------------------
	    CAST (
	            N'BEGIN ' + NCHAR (13)+ N'ALTER TABLE ' + quotename (OBJECT_schema_name (@object_id)) + N'.' + quotename (OBJECT_NAME (@object_id)) + NCHAR (13) + N' (' + NCHAR (13) + STUFF ( (
	            SELECT
	                CAST (
	                    NCHAR (9) + N',' + quotename (c.name) + N' ' +
	                    CASE WHEN c.is_computed = 1
	                        THEN N' AS ' + cc.[definition]
	                        ELSE UPPER (tp.name) +
	                            CASE WHEN tp.name IN (N'varchar', N'char', N'varbinary', N'binary', N'text')
	                                    THEN N' (' + CASE WHEN c.max_length = -1 THEN N'MAX' ELSE CAST (c.max_length AS NVARCHAR (5)) END + N')'
	                                    WHEN tp.name IN (N'nvarchar', N'nchar', N'ntext')
	                                    THEN N' (' + CASE WHEN c.max_length = -1 THEN N'MAX' ELSE CAST (c.max_length / 2 AS NVARCHAR (5)) END + N')'
	                                    WHEN tp.name IN (N'datetime2', N'time2', N'datetimeoffset')
	                                    THEN N' (' + CAST (c.scale AS NVARCHAR (5)) + N')'
	                                    WHEN tp.name = N'decimal'
	                                    THEN N' (' + CAST (c.[precision] AS NVARCHAR (5)) + N',' + CAST (c.scale AS NVARCHAR (5)) + N')'
	                                ELSE N''
	                            END +
	                            CASE WHEN c.collation_name IS NOT NULL and @UseSourceCollation = 1 THEN N' COLLATE ' + c.collation_name ELSE N'' END +
	                            CASE WHEN c.is_nullable = 1 THEN N' NULL' ELSE N' NOT NULL' END +
	                            CASE WHEN dc.[definition] IS NOT NULL THEN CASE WHEN @AssignConstraintNameOfDefaults = 1 THEN N' CONSTRAINT ' + quotename (dc.name) ELSE N'' END + N' DEFAULT' + dc.[definition] ELSE N'' END +
	                            CASE WHEN ic.is_identity = 1 and @GenerateIdentity = 1 THEN N' IDENTITY (' + CAST (ISNULL (ic.seed_value, N'0') AS NCHAR (1)) + N',' + CAST (ISNULL (ic.increment_value, N'1') AS NCHAR (1)) + N')' ELSE N'' END
	                    END + NCHAR (13)
	                AS nvarchar (Max))
	            FROM sys.columns c WITH (NOWAIT)
	                INNER JOIN sys.types tp WITH (NOWAIT) ON c.user_type_id = tp.user_type_id
	                LEFT JOIN sys.computed_columns cc WITH (NOWAIT) ON c.[object_id] = cc.[object_id] AND c.column_id = cc.column_id
	                LEFT JOIN sys.default_constraints dc WITH (NOWAIT) ON c.default_object_id != 0 AND c.[object_id] = dc.parent_object_id AND c.column_id = dc.parent_column_id
	                LEFT JOIN sys.identity_columns ic WITH (NOWAIT) ON c.is_identity = 1 AND c.[object_id] = ic.[object_id] AND c.column_id = ic.column_id
	            WHERE c.[object_id] = @object_id
	            ORDER BY c.column_id
	            FOR XML PATH (N''), TYPE).value (N'.', N'NVARCHAR (MAX)'), 1, 2, NCHAR (9) + N' ')
	    as nvarchar (max))
	    +

	    ---------------------- Key Constraints ----------------------------------------------------------------
	    CAST (
	        case when @GenerateKeyConstraints <> 1 THEN N'' ELSE
	            ISNULL ( (SELECT NCHAR (9) + N', CONSTRAINT ' + quotename (k.name) + N' PRIMARY KEY ' + ISNULL (kidx.type_desc, N'') + N' (' +
	                       (SELECT STUFF ( (
	                             SELECT N', ' + quotename (c.name) + N' ' + CASE WHEN ic.is_descending_key = 1 THEN N'DESC' ELSE N'ASC' END
	                             FROM sys.index_columns ic WITH (NOWAIT)
	                             JOIN sys.columns c WITH (NOWAIT) ON c.[object_id] = ic.[object_id] AND c.column_id = ic.column_id
	                             WHERE ic.is_included_column = 0
	                                 AND ic.[object_id] = k.parent_object_id
	                                 AND ic.index_id = k.unique_index_id
	                             FOR XML PATH (N''), TYPE).value (N'.', N'NVARCHAR (MAX)'), 1, 2, N''))
	                + N')' + NCHAR (13)
	                FROM sys.key_constraints k WITH (NOWAIT) LEFT JOIN sys.indexes kidx ON
	                    k.parent_object_id = kidx.object_id and k.unique_index_id = kidx.index_id
	                WHERE k.parent_object_id = @object_id
	                    AND k.[type] = N'PK'), N'') + N')'  + NCHAR (13)
	        END
	    as nvarchar (max))
	    +
	    --------------------- FOREIGN KEYS -----------------------------------------------------------------------------------------------------------------
	    CAST (
	        ISNULL ( (SELECT (
	            SELECT NCHAR (13) +
	             N'ALTER TABLE ' + + quotename (OBJECT_schema_name (@object_id)) + N'.' + quotename (OBJECT_NAME (@object_id)) + + N' WITH'
	            + CASE WHEN fk.is_not_trusted = 1
	                THEN N' NOCHECK'
	                ELSE N' CHECK'
	              END +
	              N' ADD CONSTRAINT ' + quotename (fk.name)  + N' FOREIGN KEY ('
	              + STUFF ( (
	                SELECT N', ' + quotename (k.cname) + N''
	                FROM fk_columns k
	                WHERE k.constraint_object_id = fk.[object_id]
	                FOR XML PATH (N''), TYPE).value (N'.', N'NVARCHAR (MAX)'), 1, 2, N'')
	               + N')' +
	              N' REFERENCES ' + quotename (SCHEMA_NAME (ro.[schema_id])) + N'.' + quotename (ro.name) + N' ('
	              + STUFF ( (
	                SELECT N', ' + quotename (k.rcname) + N''
	                FROM fk_columns k
	                WHERE k.constraint_object_id = fk.[object_id]
	                FOR XML PATH (N''), TYPE).value (N'.', N'NVARCHAR (MAX)'), 1, 2, N'')
	               + N')'
	            + CASE
	                WHEN fk.delete_referential_action = 1 THEN N' ON DELETE CASCADE'
	                WHEN fk.delete_referential_action = 2 THEN N' ON DELETE SET NULL'
	                WHEN fk.delete_referential_action = 3 THEN N' ON DELETE SET DEFAULT'
	                ELSE N''
	              END
	            + CASE
	                WHEN fk.update_referential_action = 1 THEN N' ON UPDATE CASCADE'
	                WHEN fk.update_referential_action = 2 THEN N' ON UPDATE SET NULL'
	                WHEN fk.update_referential_action = 3 THEN N' ON UPDATE SET DEFAULT'
	                ELSE N''
	              END
	            + NCHAR (13) + N'ALTER TABLE ' + + quotename (OBJECT_schema_name (@object_id)) + N'.' + quotename (OBJECT_NAME (@object_id)) + + N' CHECK CONSTRAINT ' + quotename (fk.name)  + N'' + NCHAR (13)
	        FROM sys.foreign_keys fk WITH (NOWAIT)
	        JOIN sys.objects ro WITH (NOWAIT) ON ro.[object_id] = fk.referenced_object_id
	        WHERE fk.parent_object_id = @object_id
	        FOR XML PATH (N''), TYPE).value (N'.', N'NVARCHAR (MAX)')), N'')
	    as nvarchar (max))
	    +
	    --------------------- INDEXES ----------------------------------------------------------------------------------------------------------
	    CAST (
	        ISNULL ( ( (SELECT
	             NCHAR (13) + N'CREATE' + CASE WHEN i.is_unique = 1 THEN N' UNIQUE ' ELSE N' ' END
	                    + i.type_desc + N' INDEX ' + quotename (i.name) + N' ON ' + + quotename (OBJECT_schema_name (@object_id)) + N'.' + quotename (OBJECT_NAME (@object_id)) + + N' (' +
	                    STUFF ( (
	                    SELECT N', ' + quotename (c.name) + N'' + CASE WHEN c.is_descending_key = 1 THEN N' DESC' ELSE N' ASC' END
	                    FROM index_column c
	                    WHERE c.is_included_column = 0
	                        AND c.index_id = i.index_id
	                    FOR XML PATH (N''), TYPE).value (N'.', N'NVARCHAR (MAX)'), 1, 2, N'') + N')'
	                    + ISNULL (NCHAR (13) + N'INCLUDE (' +
	                        STUFF ( (
	                        SELECT N', ' + quotename (c.name) + N''
	                        FROM index_column c
	                        WHERE c.is_included_column = 1
	                            AND c.index_id = i.index_id
	                        FOR XML PATH (N''), TYPE).value (N'.', N'NVARCHAR (MAX)'), 1, 2, N'') + N')', N'')  + NCHAR (13)
	            FROM sys.indexes i WITH (NOWAIT)
	            WHERE i.[object_id] = @object_id
	                AND i.is_primary_key = 0
	                AND i.[type] in (1,2)
	                and @GenerateIndexes = 1
	            FOR XML PATH (N''), TYPE).value (N'.', N'NVARCHAR (MAX)')
	        ), N'')
	    as nvarchar (max))
		+ NCHAR (13) + N'END' + NCHAR (13)
		RETURN CONVERT (TEXT,@sql)
	END
GO

/** */
ALTER TRIGGER item.after_delete ON item.[dt] AFTER DELETE
AS
	SET NOCOUNT ON;
	DELETE attribute.dt FROM deleted D WHERE attribute.dt.itemId = D.Id
	DELETE attribute.dt FROM deleted D WHERE attribute.dt.linkId = D.Id
	INSERT item.id SELECT ID FROM deleted
GO

/** */
ALTER TRIGGER item.itemsInsert ON item.[dt] AFTER INSERT
AS
	SET NOCOUNT ON;
	--INSERT auth.users   (id) SELECT id FROM inserted WHERE classId=1000
	--INSERT auth.host (id,name) SELECT id,name FROM inserted WHERE classId=1001
	--INSERT auth.hostDomain (id,domain) SELECT id,name+'.aliconnect.nl' FROM inserted WHERE classId=1001
GO

/** */
ALTER TRIGGER item.[update] ON item.[dt] AFTER INSERT,UPDATE
AS
	SET NOCOUNT ON;
	IF (UPDATE (ClassID))
		UPDATE item.dt
		SET [schema] = item.schemaName(I.id)
		FROM inserted I
		WHERE item.dt.id = I.id
GO

--UPDATE item.dt SET classId=1002 WHERE id=1
--SELECT TOP 1 [schema],* FROM item.dt

/*
DELETE attribute.dt WHERE ID IN (
SELECT MAX(ID) FROM attribute.dt WHERE NameID=980
GROUP BY itemId
HAVING COUNT(0)>1
)
*/


--EXEC item.setAttribute @itemId=2744819, @NameID=980, @linkId=265090, @UserId=265090, @HostID=2347355
--EXEC item.setAttribute @itemId=2744819, @NameID=980, @linkId=265090, @UserId=265090
--SELECT * FROM attribute.vw WHERE itemId=2744819



--2741403
GO


--UPDATE item.dt set deletedDateTime = null where id = 3673951
--UPDATE item.dt set finishDateTime = null where id = 3673951
/** */
ALTER PROCEDURE item.setAttribute
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

	SELECT @NameID RETURN


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
--;EXEC [item].[setAttribute] @HostID=2347321, @ItemID=2407536, @LinkID='265090',@Data='9',@AttributeName='Master'
--SELECT * FROM attribute.vw WHERE itemID = 2407536

EXEC item.setAttribute @itemId=3673951, @name='FinishDateTime', @value=NULL


SELECT * FROM attribute.vw where itemid = 3673951


