const clients = [];

function debug(s) {
  if (typeof s === 'object') s = JSON.stringify(s,null,2);
  document.getElementById('console').innerText+='\n'+s;
  return s;
}
function reply(par1, par2) {
	// document.getElementById('reply').innerText = par + webSocketClient.from_id;
	webSocketClient.send(JSON.stringify({to: { sid: webSocketClient.from_id }, reply: par1, param: par2 }));
}
function send(param) {
  console.debug(debug(param));
  clients.forEach(function (from_id) { webSocketClient.send(JSON.stringify({to: { sid: from_id }, param: param })); } );
}
(function() {
	window.addEventListener('blur', function () {
		setTimeout(function () {
			external.hide();
		}, 100);
	});
	window.addEventListener('load', function() {
    document.getElementById('input').addEventListener('keydown', function (event) {
      console.log(event)
      if (event.ctrlKey && event.key === 'v') {

      } else {
        event.preventDefault();
      }
    });
		[
			// { title: 'Tabletmodes' },
			// { title: 'Netwerk' },
			// { title: 'Alle instellingen' },
			// { title: 'Vliegtuigstand' },
			// { title: 'Locatie' },
			// { title: 'Concentratie hulp' },
			// { title: 'VPN' },
			// { title: 'Projecteren' },
			// { title: 'Apparaten aansluiten' },
			// { title: 'Mobiele hotspot' },
		].forEach(function (btn) {
			buttonbar.innerHTML += '<button><span>'+btn.title+'</span></button>';
		});
    window.addEventListener('paste', function(event) {
      console.log('paste')
      event.preventDefault();
      let data = (event.clipboardData || window.clipboardData).getData("Text");
      if (data[0] === '{') {
        data = JSON.parse(data);
        if (data.sid) {
          webSocketClient.send(JSON.stringify({ to: { sid: data.sid }, aliconnector: 'online' }));
        }
      }
    });
		webSocketClient = new WebSocket('wss://aliconnect.nl:444');
		let nonce = window.localStorage.getItem('nonce');
    console.debug(debug(nonce));
		webSocketClient.onopen = function (event) {
			webSocketClient.send(JSON.stringify({ hostname: document.location.hostname, nonce:nonce }));
		};
		webSocketClient.onmessage = function (event) {
			try {
				// document.getElementById('socket_id').innerText = event.data;
				var data = JSON.parse(event.data);
        debug(JSON.stringify(data,null,2));
        // console.log(data);
        if (data.state === 'disconnect') {
          if (clients.indexOf(data.from_id) !== -1) {
            clients.splice(clients.indexOf(data.from_id), 1);
            debug(clients);
          }
        }

        if (data.path === 'sign_in') {
          nonce = data.nonce;
          clients.push(data.from_id);
          console.debug(debug(clients));
          console.log('clients', clients);
          webSocketClient.from_id = data.from_id;
          window.localStorage.setItem('nonce', nonce);
          webSocketClient.send(JSON.stringify({ to: { sid: data.from_id }, aliconnector: 'sign_in_ack' }));
        }
				if (data.external) {
					webSocketClient.from_id = data.from_id;
					for (var name in data.external) {
						var params = data.external[name];
						// document.getElementById('reply').innerText = 'START' + name + params[0];
						// return;
						// if (name === 'filedownload') {
						// 	url = 'https://aliconnect.nl/shared/test.docx';
						// 	document.getElementById('reply').innerText = 'START1' + url;
						// 	external.filedownload(url);
						// 	document.getElementById('reply').innerText = 'START2' + name;
						// 	return;
						// }
						if (params.length === 1) {
							external[name](params[0]);
						} else if (params.length === 2) {
							external[name](params[0], params[1]);
						} else if (params.length === 3) {
							external[name](params[0], params[1], params[2]);
						} else {
							external[name]();
						}
						// document.getElementById('reply').innerText = 'EXEC' + name;
					}
				}
				if (data.socket_id) {
          console.log(data.socket_id, nonce);
					// document.getElementById('socket_id').value = data.socket_id;
					webSocketClient.socket_id = data.socket_id;
					webSocketClient.send(JSON.stringify({ to: { nonce: nonce }, aliconnector: 'online' }));
				}
				if (data.signin) {
					webSocketClient.send(JSON.stringify({ to: { sid: data.signin }, aliconnector: 'online' }));
				}
			} catch (err) {
			}
		};

    (function checkdata() {
      const xhr = new XMLHttpRequest();
      xhr.open('get', 'https://aliconnect.nl/aim/v1/api/aliconnector/checksrvdata/?dt='+new Date().toISOString());
      xhr.onload = function (event) {
        try {
          const data = JSON.parse(event.target.responseText);
          var d = new Date();
  				var d = (new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000)).toISOString().replace(/[T|Z]/g, ' ').split('.').shift();
  				document.getElementById('state').innerText = d;
  				if (data.printjob) {
  					console.debug(debug('Print ' + (data.printjob.documentname || data.printjob.aid)));
  					try {
  						external.printurl('https://aliconnect.nl/aim/v1/api/aliconnector/printjob/' + data.printjob.aid);
  					} catch (err) {
  						console.debug(debug('Error: ' + err.message));
  					}
          }
        } catch(err) {
        }
        setTimeout(checkdata, 5000);
      }
      xhr.send();
    })();
	});
})();
