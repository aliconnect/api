USE AIM1
GO
ALTER PROCEDURE [admin].[fac] AS
	WITH 
	host (id,hostname) AS (
		SELECT id,keyname 
		FROM item.vw 
		WHERE hostID=1 AND classID=1002 AND keyname IS NOT NULL
	),
	req (hostname, periode, cnt) AS (
		SELECT R.host,R.periode,count(0)cnt 
		FROM aimhis.his.req R
		GROUP BY R.periode,R.host
	), 
	export (id, periode, cnt) AS (
		SELECT client_id,periode,COUNT(0) cnt 
		FROM aimhis.his.export 
		GROUP BY client_id,periode
	)

	SELECT H.hostname,R.periode,R.cnt AS request_count,E.cnt AS export_count
	FROM host H
	INNER JOIN req R ON R.hostname = H.hostname
	LEFT OUTER JOIN export E ON E.id = H.id AND E.periode = R.periode
GO
