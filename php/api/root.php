<?php
class domain {
  /**
  */
	public function get() {
		extract($_GET);
		if ($account = sqlsrv_fetch_object(aim()->query("EXEC [account].[get] @HostName='$domainname'"))) {
			if (!$account->OwnerID) {
				throw new Exception('Not Found', 404);
			}
			throw new Exception('OK', 200);
			return $account;
		}
		throw new Exception('Not Found', 404);
	}
  /**
  */
	public function post() {
		extract($_POST);
		$sub = AIM::$access->sub;
		if ($account = sqlsrv_fetch_object(aim()->query($q = "EXEC [account].[get] @HostName='$domainname'"))) {
			if ($account->OwnerID) {
				throw new Exception('Forbidden', 403);
			} else {
				$account = sqlsrv_fetch_object(aim()->query('UPDATE item.dt SET OwnerID = %1$d WHERE ID = %2$d;'.$q, AIM::$access->sub, $account->ClientID ));
			}
		} else {
			$account = sqlsrv_fetch_object(aim()->query("INSERT INTO item.dt (HostID,ClassID,KeyName,UserID,OwnerID) VALUES (1,1002,'$domainname',$sub,$sub);".$q));
		}
		// debug($account);

		/**
		* Als owner id bekend is en contact id niet dan moet contact aangemaakt worden met scope admin.readwrite
		*/
		$account = sqlsrv_fetch_object(aim()->query(
			'EXEC [account].[get] @HostName=%1$d, @AccountID=%2$d',
			$account->ClientID,
			$account->OwnerID
		));
		if (!$account->ContactID) {
			// aim()->query("INSERT INTO item.dt (HostID,ClassID,Title,SrcID) VALUES (%1,%2,'%3',%4)", $account->ClientID, 1004, AIM::$access->name, $account->OwnerID )
			$account = sqlsrv_fetch_object(aim()->query(
				'INSERT INTO item.dt (HostID,SrcID,ClassID,Title) VALUES (%1$d,%2$d,1004,\'%3$s\');
				EXEC [account].[get] @HostName=%1$d, @AccountID=%2$d',
				$account->ClientID,
				$account->OwnerID,
				AIM::$access->name
			));
		}
		$account = sqlsrv_fetch_object(aim()->query(
			'EXEC item.setAttribute @ItemID=%3$d,@NameID=1994,@value=\'admin.readwrite\',@hostID=%1$d,@userID=%1$d
			EXEC [account].[get] @HostName=%1$d, @AccountID=%2$d',
			$account->ClientID,
			$account->OwnerID,
			$account->ContactID
		));
		$root = $_SERVER['DOCUMENT_ROOT'].'/sites/'.$domainname;
		if (!file_exists($root)) {
			mkdir($root,0777,true);
		}
		if (!file_exists($root.'/config.yaml')) {
			file_put_contents($root.'/config.yaml', str_replace('domain',$domainname, file_get_contents($_SERVER['DOCUMENT_ROOT'].'/config.yaml')));
		}

		// debug($account,$q);
		return $account;
	}
}
