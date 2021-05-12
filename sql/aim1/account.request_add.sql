USE [aim1]
GO
ALTER PROCEDURE [account].[request_add] @client_id VARCHAR(50)=NULL, @host VARCHAR(50)=NULL, @aud BIGINT=NULL, @sub BIGINT=NULL, @method VARCHAR(10), @url VARCHAR(8000), @id BIGINT = NULL
AS
	SET NOCOUNT ON
	INSERT INTO aimhis.his.req(host,client_id,aud,sub,method,url,id)
	VALUES(@host,@client_id,@aud,@sub,@method,@url,@id)
GO
