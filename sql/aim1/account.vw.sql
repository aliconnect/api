USE [aim1]
GO
ALTER VIEW [account].[vw]
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
