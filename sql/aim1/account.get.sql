USE [aim1]
GO
ALTER PROCEDURE [account].[get]
	@HostName VARCHAR(250) = 1
	,@HostID BIGINT = NULL OUTPUT 
	,@ContactId BIGINT = NULL OUTPUT 
	,@AccountName VARCHAR(250) = NULL
	,@redirect_uri VARCHAR(250) = NULL
	,@password VARCHAR(50) = ''
	,@code VARCHAR(50) = NULL
	,@phone_number VARCHAR(50) = NULL
	,@nonce VARCHAR(50) = NULL
	,@IP VARCHAR(50) = NULL
	,@accountId INT = NULL OUTPUT
	,@Method VARCHAR(10) = NULL
	,@Url VARCHAR(8000) = NULL
AS
	SET NOCOUNT ON
	DECLARE @client_secret UNIQUEIDENTIFIER, @EmailID BIGINT
	-- Find accountID by phonenumber
	--IF @accountId IS NULL AND ISNUMERIC(@accountName)=1 SELECT @accountId = I.ID FROM item.vw I INNER JOIN attribute.dv A ON I.HostID=1 AND I.ClassID=1004 AND A.ItemID=I.ID AND A.NameID=996 AND A.Value = CONVERT(VARCHAR(50), CONVERT (BIGINT, @accountName) )
	IF @accountId IS NULL AND ISNUMERIC(@accountName)=1 SELECT @accountId = ID FROM item.dt WHERE Id = @accountName
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
	IF @accountId IS NULL AND ISNUMERIC(@phone_number)=1 SELECT @accountId = itemId FROM attribute.dt WHERE hostId=1 AND nameId=2178 and value=@phone_number
	IF ISNUMERIC(@HostName)=1 SELECT @HostID = ID, @client_secret=[secret] FROM item.dv WHERE ID=@HostName
	ELSE IF @HostName LIKE '%-%-%-%-%-%' SET @HostID = item.getId(@HostName)
	ELSE IF @HostName LIKE '%-%-%-%-%' SELECT @HostID = ID, @client_secret=[secret] FROM item.dv WHERE uid = @HostName
	--IF @HostID IS NULL AND @HostName like '%.%' SELECT @HostName = name, @HostID = ID, @client_id = client_id, @client_secret = client_secret FROM item.client WHERE id IN (SELECT hostID FROM item.hostname WHERE name=@HostName)
	ELSE SELECT @HostID = ID, @client_secret=[secret] FROM item.dv WHERE hostID=1 AND classID=1002 AND keyname = @HostName
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
	--return
	--;WITH items (id, uuid, keyname, displayName, ownerId, hostId, classId, srcId) AS (
	--	select id, lower(id)+'-'+lower(uid), keyname, ISNULL(ISNULL(Title,Name),KeyName), ownerId, hostId, classId, srcId
	--	from item.dt
	--	where deletedDateTime is null
	--	and hostId IS NOT NULL 
	--	AND hostId IN (1, @hostId)
	--	and classid in (1004,1002)
	--),
	--SELECT @ContactId = id FROM item.dt WHERE hostId=@HostID AND SrcID = @accountId
	SET @ContactId = @accountId
	SELECT @ContactId = linkId FROM attribute.dt WHERE itemId = @accountId and hostId = @hostId and nameId=12
	;with client (
		clientId, client_id, client_secret,
		client_name, client_title, ownerId
		--,ClientID, ClientName, ClientDisplayName, OwnerID
	) AS (
		SELECT id,lower(id)+'-'+lower(uid),lower(@client_secret),
		KeyName,header0 DisplayName,ISNULL(ownerId,ID)
		--,id,KeyName,DisplayName,ISNULL(OwnerID,ID)
		FROM item.dt WHERE id=@HostID
	),
	account (accountId, account_id) AS (
		SELECT id, lower(id)+'-'+lower(uid) 
		FROM item.dt 
		WHERE id=@accountId
	),
	contact (contactId,contact_id) AS (
		SELECT id,lower(id)+'-'+lower(uid) FROM item.dt WHERE id=@contactId
	)
	SELECT
		client.*
		,redirect_uri.value AS redirect_uri
		,account_host_values.*
		,account.*
		,account_host_values.*
		,account_values.*
		,CASE WHEN pwd.value IS NOT NULL THEN CASE WHEN @password>'' AND PWDCOMPARE(@password,pwd.value)=1 THEN 1 ELSE 0 END END AS password_ok
		--,CASE WHEN PWDCOMPARE(@code,code.Value)=1 THEN code.LastModifiedDateTime END code_ok
		,CASE WHEN @code = code.Value THEN code.LastModifiedDateTime END code_ok
		,nonce.value AS nonce
		,CASE WHEN nonce.userId = nonce.itemId THEN 1 END signin_ok
		,ip.Value ip
		,contact.*
		----host.*,
		----N.SignInDateTime sign_in,
		----N.SignOutDateTime sign_out,
	FROM
		client
		OUTER APPLY account
		OUTER APPLY contact
		LEFT OUTER JOIN (SELECT itemId, AttributeName, Value FROM (SELECT *,Row_NUmber()OVER(Partition by itemId, attributeName ORDER BY [lastModifiedDateTime] DESC) AS Rn FROM attribute.vw WHERE @accountId=itemId AND hostId=1) a WHERE Rn = 1) p PIVOT ( 
			MAX(Value) FOR AttributeName IN ( 
				accountname, email, email_verified, phone_number, phone_number_verified, preferred_username, name, nickname, given_name, middle_name, family_name, unique_name, upn 
			) 
		) AS account_values ON account_values.ItemID = @accountId
		LEFT OUTER JOIN (SELECT itemId, AttributeName, Value FROM (SELECT *,Row_NUmber()OVER(Partition by itemId, attributeName ORDER BY [lastModifiedDateTime] DESC) AS Rn FROM attribute.vw WHERE @accountId=itemId AND hostId=@hostId) a WHERE Rn = 1) p PIVOT ( 
			MAX(Value) FOR AttributeName IN ( 
				scope_granted, scope_requested, scope_accepted
			) 
		) AS account_host_values ON account_host_values.ItemID = @accountId
		LEFT OUTER JOIN (SELECT itemId, AttributeName, Value FROM (SELECT *,Row_NUmber()OVER(Partition by itemId, attributeName ORDER BY [lastModifiedDateTime] DESC) AS Rn FROM attribute.vw WHERE @hostId=itemId) a WHERE Rn = 1) p PIVOT ( 
			MAX(Value) FOR AttributeName IN ( 
				payment_required
			) 
		) AS host_values ON host_values.ItemID = @accountId
		LEFT OUTER JOIN attribute.vw pwd          ON @accountId=pwd.itemId AND pwd.attributeName='password'
		LEFT OUTER JOIN attribute.vw code         ON @accountId=code.itemId AND code.attributeName='code'
		LEFT OUTER JOIN attribute.vw nonce        ON @accountId=nonce.itemId AND nonce.attributeName='nonce' AND nonce.value=@nonce
		LEFT OUTER JOIN attribute.vw ip           ON @accountId=ip.itemId AND ip.attributeName='ip' AND ip.value=@IP
		LEFT OUTER JOIN attribute.vw redirect_uri ON @hostId=redirect_uri.itemId AND redirect_uri.attributeName='redirect_uri' AND redirect_uri.value=@redirect_uri
GO

select * from attribute.vw where itemid=265090 AND attributeName in ('nonce','phone_number_verified','phone_number','ip','code') order by attributename

select * from attribute.dt where nameid=2181 and value='E85861E9-C2B3-4F42-BED1-60FF00D8C5C6' 

--delete attribute.dt where id in (3115184, 3115185)


exec account.get @hostname='c52aba40-11fe-4400-90b9-cee5bda2c5aa'

exec item.attr @itemid=3664251, @name='redirect_uri', @value='http://localhost:8080', @max=9999
exec item.attr @itemid=3664251, @name='redirect_uri', @value='https://schiphol.aliconnect.nl', @max=9999
exec item.attr @itemid=3664251, @name='redirect_uri', @value=null, @linkId=null, @data=null


select * from attribute.vw where itemid=3664251



--delete attribute.dt where itemid=265090 and nameid in (2181)


--SELECT top 1 * FROM aimhis.item.attribute order by ts DESC



--Select * from (select *,Row_NUmber()Over(Partition by itemId, attributeName order by [lastModifiedDateTime] desc) as Rn From attribute.vw WHERE itemId=265090) a Where Rn = 1


--delete attribute.dt where id in (3115179)

--exec item.attr @itemid=1, @name='redirect_uri', @value='https://aliconnect.nl'


--select * from attribute.vw where itemid=265090 AND attributeName='password' order by attributename

--exec account.get @hostname='aliconnect', @accountname='max@alicon.nl', @password='Mjkmjkmjk0', @redirect_uri='https://aliconnect.nl'

--exec account.get @hostname='schiphol', @accountname='max@alicon.nl', @password='Mjkmjkmjk0', @redirect_uri='https://aliconnect.nl'
--exec account.get @hostname='schiphol', @accountname='max@alicon.nl', @password='Mjkmjkmjk0', @redirect_uri='https://aliconnect.nl'

--exec account.get @hostname='login', @accountname='max@alicon.nl', @password='Mjkmjkmjk0'


----delete attribute.dt where id = 3096352
--exec account.get @hostname='aliconnect'


--exec account.get @accountname='test.twee@alicon.nl', @password='Welkom1234', @code='97945'
--select * from attribute.vw where itemid = 3688026

--exec account.get @accountname='max@alicon.nl'
----select * from attribute.vw where itemid = 3688026

--exec item.attr @itemid=265090, @name='Class', @linkId=1004


--select * from item.vw where id = 265090
--select * from attribute.vw where itemid = 265090

--select * from item.dv where masterid = 2347354

--select * from item.dt where id = 2788872


--exec account.get @hostname='tata'
--exec item.attr @itemid=2816193, @name='Master', @linkId=265090, @hostId=2347354


----update item.dt set classid = i.classid from (
--select i.id, cn.id classid, c.name, c.id
--from item.dv i
--inner join item.dt c on i.hostid=2347354 and c.id = i.classid
--left outer join item.dt cn on cn.hostid=2347354 and cn.classid=0 and cn.name = c.name
----) i where item.dt.id = i.id

--select * from item.dt where id = 3310727
--select * from item.dt where id = 3684866
--exec item.attr @itemid=3684866, @name='Master', @linkId=null, @hostId=2347354


----update item.dt set classid=3684873 where classid=3688057



