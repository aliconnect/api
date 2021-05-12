USE aim1
GO



/**
 * Aanmaken van Master Attribute met masterId van item als deze niet bestaat
 */
--INSERT attribute.dt (hostId,itemId,nameId,LinkId)
SELECT I.hostId, I.Id, 980, I.masterId--, V.masterId
FROM item.dv I
INNER JOIN item.vw V ON V.id = I.id
WHERE I.masterId > 0 AND V.masterID IS NULL--ISNULL(V.masterID,0) <> I.masterID
--AND I.HostID = 2347355








EXEC item.setAttribute @itemId=2409024, @NameID=980, @linkId=265090

EXEC item.setAttribute @itemId=2744819, @NameID=980, @linkId=265090

SELECT * FROM attribute.vw WHERE itemId=2741403


SELECT * FROM attribute.vw WHERE itemId=2409024
--SELECT * FROM attribute.dt WHERE itemId=2409024

--SELECT * FROM attribute.dt WHERE id=2409024
