USE [aim1]
GO
ALTER FUNCTION [api].[getDefinitionTable] (@object_id INT) RETURNS VARCHAR (MAX) AS
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
	            --ALTER if table not exists
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
