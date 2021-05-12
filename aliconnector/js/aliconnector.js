const clients = [];

function reply(par1, par2) {
	// document.getElementById('reply').innerText = par + webSocketClient.from_id;
	webSocketClient.send(JSON.stringify({to: { sid: webSocketClient.from_id }, reply: par1, param: par2 }));
}
function send(param) {
  cons.innerText = JSON.stringify(param,null,2);
  clients.forEach(function (from_id) { webSocketClient.send(JSON.stringify({to: { sid: from_id }, param: param })); } );
}
(function() {
	window.addEventListener('blur', function () {
		setTimeout(function () {
			// external.hide();
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
			{ title: 'Tabletmodes' },
			{ title: 'Netwerk' },
			{ title: 'Alle instellingen' },
			{ title: 'Vliegtuigstand' },
			{ title: 'Locatie' },
			{ title: 'Concentratie hulp' },
			{ title: 'VPN' },
			{ title: 'Projecteren' },
			{ title: 'Apparaten aansluiten' },
			{ title: 'Mobiele hotspot' },
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
		// const uid = document.getElementById('uid');
		let nonce = window.localStorage.getItem('nonce');
    console.log(nonce);
		// uid.onchange = function (event) {
		// 	window.localStorage.setItem('uid', event.target.value);
		// 	document.location.reload();
		// };
		webSocketClient.onopen = function (event) {
			webSocketClient.send(JSON.stringify({ hostname: document.location.hostname, nonce:nonce }));
		};
		webSocketClient.onmessage = function (event) {
			try {
				// document.getElementById('socket_id').innerText = event.data;
				var data = JSON.parse(event.data);
        cons.innerText = JSON.stringify(data,null,2);
        // console.log(data);
        if (data.state === 'disconnect') {
          if (clients.indexOf(data.from_id) !== -1) {
            clients.splice(clients.indexOf(data.from_id), 1);
            cons.innerText = clients;
          }
        }

        if (data.path === 'sign_in') {
          nonce = data.nonce;
          clients.push(data.from_id);
          cons.innerText = clients;
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
	});
	//console.log('ALICONNECTOR v0.2 aliconnect', aliconnect);



	return;
	var app, to = null;
	console.log = console.log || function () { };
	//aim.client.device = aim.device = { id: aim.device.id = get.deviceID || aim.device.id || '', uid: aim.device.uid = get.deviceUID || aim.device.uid || '' };
	var get = window.get || {}, api = window.api || { item: {}};
	aim.client = aim.client || {};
	aim.appScript = get.script || aim.appScript || '';
	//Object.assign(aim, get);
	//console.log(aim);
	aim.client.app = 'aliconnector';
	//aim.name = 'aliconnector';
	aim.api.item[aim.deviceID] = {};
	setchecksrvdata = function (tmsec) {
		if (to) clearTimeout(to);
		to = setTimeout(checksrvdata, tmsec);
	}
	printurldone = function (par) {
		//setchecksrvdata(5000);
	}
	//Data ontvangen 2019-05-06 09:42:52undefinedhttps://aliconnect.nl/aliconnect/aliconnector/checksrvdata{"count":0,"value":[]}
	checksrvdata = function () {
		//return;
		setchecksrvdata(5000);


		//console.log('checksrvdata', aim.client, aim.config.access_token);

		http.request({
			src: 'https://aliconnect.nl/aim/' + aim.version + '/api/aliconnector/checksrvdata/?dt='+new Date().toISOString(), onload: function (event) {
				//elStatus.appendTag('div',{innerText:this.src});
				var d = new Date();
				var d = (new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000)).toISOString().replace(/[T|Z]/g, ' ').split('.').shift();
				elCheckServerData.innerHTML = 'Data ontvangen ' + d + this.responseText;
				//console.log(this.data);
				if (this.data && this.data.printjob) {
					elCheckServerData.innerHTML += '<br>Printing ' + (this.data.printjob.documentname || this.data.printjob.aid);
					// aim.Element.FramePrint = aim.Element.FramePrint || document.body.appendTag('iframe', {
					// 	onload: function () {
					// 		aim.Element.FramePrint.focus();
					// 		aim.Element.FramePrint.contentWindow.print();
					// 		setchecksrvdata(4000);
					// 	}
					// });
					// aim.Element.FramePrint.src = 'https://aliconnect.nl/aliconnect/aliconnector/printjob/' + this.data.printjob.aid;
					try {
						external.printurl('https://aliconnect.nl/aim/' + aim.version + '/api/aliconnector/printjob/' + this.data.printjob.aid);
					} catch (err) {
						elCheckServerData.innerHTML += '<br>Error: ' + err.message;
					}
					setchecksrvdata(5000);
				}
				//else setchecksrvdata(15000);
			}
		});
	}
	focusapp = function () {
		document.body.focus();
	}
	activitytracker = function () {
		if (aliconnector.toActivitytracker) clearTimeout(aliconnector.toActivitytracker);
		//alert(JSON.stringify(aim.location));

		if (aliconnector.state != 'focus') {
			//aliconnector.state = 'focus';
			ws.send({ msg: { state: aliconnector.state = 'focus', ip: aim.location.ip } });
		}
		aliconnector.toActivitytracker = setTimeout(function () {
			//aliconnector.state = 'online';
			ws.send({ msg: { state: aliconnector.state = 'online', ip: aim.location.ip } });
		}, 5000);
	}
	//console.log(document.location,get);
	AIM.extend(aliconnector = {
		//scripts:[],
		on: {
			load: function () {
				//console.log(aim.scripts);
				if (aim.scripts.length){
					document.head.appendTag('script', { type: "text/javascript", charset: "UTF-8", src: aim.scripts.shift(), onload:arguments.callee.bind(this) });
					return;
				}
				//console.log('ALICONNECT ONLOAD11');
				with (document.body) {
					elName = appendTag('div', { innerText: '' });
					body = appendTag('div', { className: 'aco oa pages' });
					menubtns = appendTag('div', { className: 'row menubtns' });
				}
				if (get && get.username) {
					window.addEventListener('blur', function () {
						setTimeout(function () {
							external.hide();
						}, 100);
					});
				}
				//console.log(aim);
				//console.log(Host);
				//if (aim.appScript) {
				//	var a = aim.appScript.split(';');
				//	script = { src: a.shift(), method: a.shift() };
				//	console.log(script);
				//	//var fnName = aim.appScript.split(':')[1];
				//	document.head.appendTag('script', {
				//		src: script.src, method: script.method, onload: function () {
				//			console.log('loaded', aim[this.method]);
				//			if (aim.aliconnector) Object.assign(aliconnector.panels, aim.aliconnector);//  && aim[this.method].init) aim[this.method].init();
				//			//if (fnName) {
				//			//	if (('Host' in window) && (fnName in Host)) { if ('init' in Host[fnName]) Host[fnName].init(); else Host[fnName](); }
				//			//	else if (fnName in window) window[fnName]();
				//			//}
				//			aliconnector.show();
				//		}
				//	});
				//}
				aliconnector.show();

				aim.messenger.to = { deviceUID: aim.deviceUID };


			},
			//blur: aliconnector.statemessage,
			//focus: aliconnector.statemessage,
		},
		// setVar: setVar = function (par) {
		// 	var values = {};
		// 	var field = opc.values[par.itemId]; //.value = par.value;
		// 	field.value = par.value;
		// 	var item = { id: field.id, values: {} };
		// 	if (field && field.name && par && par.value) item.values[field.name] = par.value;
		// 	aim.messenger.send({ to: [aim.access.aud], value: [item] });
		// 	//source: 'aliconnector', id: property.id, values: values, to: { key: aim.key } });
		// },
		messenger: {
			onreceive: function (event) {
				var data=this.data;
				//var data = this.data, msg = data.msg;
				//console.log('onreceive', this.data);
				//elStatus.innerText=JSON.stringify(this.data);
				if(data.device && confirm('Link connector to active browser?')){
					aim.elDeviceID.value=data.device.uid;
					aim.elFormSettings.submit();
				}
				if(data.state && data.from.app=='om' && data.from.device==aim.client.device.id){
					if (data.state=='disconnected') {
						document.body.style.color='red';
					}
					if (data.state=='connected') {
						document.body.style.color='green';
						if(!data.ack) aim.messenger.send({to:{client:data.from.client},state:'connected',ack:1});
					}
				}


				if (this.data.alert) alert(this.data.alert);
				return;

				if (msg) {
					if (data.client.app == 'app' && data.client.deviceUID == aim.messenger.sender.deviceUID) {
						if (msg.state == 'connected') aim.messenger.send({ to: { deviceUID: aim.messenger.sender.deviceUID }, msg: { state: aliconnector.state = 'connected', ack: true } });
						//if (msg.userName) { elName.innerText = msg.userName; aliconnector.statemessage(); }
						if (msg.userName) { elName.innerText = msg.userName; activitytracker(); }
						if (msg.userUID) { aim.messenger.sender.userUID = msg.userUID }
						return;
					}
					if (data.target == 'rci' && data.id && data.values && window.opc && aim.api.item[data.id] && aim.api.item[data.id].values) for (var name in data.values) {
						//console.log(name, aim.api.item[data.id].values);
						if (aim.api.item[data.id].values[name] && aim.api.item[data.id].values[name].opcItemID) {
							//console.log('RCI', aim.api.item[data.id].values[name].opcItemID, data.values[name]);
							//document.body.appendTag('div', {innerText: aim.api.item[data.id].values[name].opcItemID+'='+data.values[name]});
							external.opcSet(aim.api.item[data.id].values[name].opcItemID, data.values[name]);
						}
					}
					if (msg.editfile) try { external.filedownload(msg.editfile); } catch (err) { if (elStatus) elStatus.innerText = 'Error: ' + err.message; }
					if (msg.deviceUID == aim.deviceUID || (msg.appUID && aim.appUID && (msg.appUID == aim.appUID))) {
						if (msg.printurl) {
							elStatus.innerText = msg.printurl;
							try { external.printurl(msg.printurl); } catch (err) { if (elStatus) elStatus.innerText = 'Error: ' + err.message; }
						}
					}
					if (msg.deviceUID && aim.deviceUID && msg.deviceUID == aim.deviceUID) {
						if (msg.exec == 'mailimport') external.mailimport(App.sessionID, msg.hostID, msg.userID);
						if (msg.exec == 'contactimport') external.contactimport(App.sessionID, msg.hostID, msg.userID);
						if (msg.EditFile) external.EditFile(msg.fileId, msg.userID, msg.filename, msg.uid, msg.ext, msg.edituid);
					}
				}
			},
		},
		elStatus: elStatus = {},
		panels: panels = {
			admin: {
				title: 'Alle instellingen',
				init: function () {
					// 			iframesubmit=document.body.appendTag('iframe',{name:'submit',onload:function(){
					// console.log('IFRAME LOAD');
					// 				//document.location.reload();
					// 			}});
					//if(document.getElementById('submit'))document.getElementById('submit').onload=function(){
					//	//console.log('IFRAME LOAD');
					//				document.location.reload();
					//			}

					with (this.el) {
						elStatus = elCheckServerData = appendTag('div', { innerText: 'STATUS' });
						with (aim.elFormSettings = appendTag('div').appendTag('form', { method: 'post', action: '/api/' + aim.version + '/aliconnector?redirect_uri=' + encodeURIComponent(document.location.href), className: 'init' })) {
							appendTag('label', { innerText: 'Login' });
							var labels = { IP: aim.location.ip }
							if (aim.location.ref && aim.location.ref.get) Object.assign(labels, { Userdomain: aim.location.ref.get.userdomain, Username: aim.location.ref.get.username, Computername: aim.location.ref.get.computername, Serial: aim.location.ref.get.serial });
							for (var name in labels) if (labels[name]) appendTag('div', { className: 'label', innerText: name }).appendTag('div').appendTag('input', { attr: { value: labels[name] || '', readonly: true } });
							aim.elDeviceID = appendTag('div', { className: 'label', innerText: 'Device' }).appendTag('div').appendTag('input', { attr: { name: 'deviceUID', placeholder: 'Device' } });
							appendTag('div', { className: 'label', innerText: 'Key' }).appendTag('div').appendTag('input', { attr: { name: 'key', placeholder: 'Key', value: aim.key || '' } });
							appendTag('div', { className: 'label', innerText: 'Script' }).appendTag('div').appendTag('input', { attr: { name: 'appScript', placeholder: 'Script', value: aim.appScript} });
							appendTag('button', { innerText: 'Opslaan' });
						}
						appendTag('button', { innerText: 'Logout', onclick:function(){
							document.location.href= '/aim/' + aim.version + '/api/auth/logout?redirect_uri=' + document.location.href;
						}});
					}
					checksrvdata();
				}
			}
		},
		// add: function (panel) {
		// 	aliconnector.panels.push(panel);
		// },
		show: function () {
			with (menubtns) {
				console.log(aliconnector.panels);
				for (var name in aim.panels){
					var pnl = aim.panels[name];
					pnl.name = name;
					pnl.el = body.appendTag('div', { className: 'panel' });
					pnl.elTitle = pnl.el.appendTag('label', { innerText: pnl.title });
					pnl.btn = appendTag('button', {
						pnl: pnl, onclick: pnl.show = function () {
							//var pnl = this.pnl || this;
							//console.log(aliconnector.panels,this.pnl);
							for (var name in aim.panels) aim.panels[name].el.style.display = 'none';
							//var c = pnl.el.parentElement.children;
							//for (var i = 0, e; e = c[i]; i++) e.style.display = 'none';
							this.pnl.el.style.display = '';
						}
					}).appendTag('div', { className: 'icn ' + pnl.name, innerText: pnl.title, });
					pnl.init();
				};
			}
			//aim.messenger.connect();
			//aim.messenger.send({to:{user:aim.userID,app:'om'},aliconnector:'start',ip:aim.ip});
		},
	});
	if (aim.appScript) {
		var a = aim.appScript.split(';');
		script = { src: a.shift(), method: a.shift() };
		//console.log(script);
		//var fnName = aim.appScript.split(':')[1];
		//alert('ja');
		aim.scripts.push(script.src);

		//document.body.appendTag('script', { type: "text/javascript", charset: "UTF-8", src: script.src, onload:aliconnector.show });

		//document.head.appendTag('script', {
		//	src: script.src, method: script.method, onload: function () {
		//		console.log('loaded', aim[this.method]);
		//		if (aim.aliconnector) Object.assign(aliconnector.panels, aim.aliconnector);//  && aim[this.method].init) aim[this.method].init();
		//		//if (fnName) {
		//		//	if (('Host' in window) && (fnName in Host)) { if ('init' in Host[fnName]) Host[fnName].init(); else Host[fnName](); }
		//		//	else if (fnName in window) window[fnName]();
		//		//}
		//		aliconnector.show();
		//	}
		//});
	}
	if (aim.location && aim.location.ref && aim.location.ref.get && aim.location.ref.get.rci) panels.push({
		name: 'rci',
		title: 'RCI TMS',
		show: function () {
			panels.rci = this;
			//elTitle.innerText = 'RCI TMS ' + aim.deviceID;
			aim.table = body.appendTag('table');
		}
	});
	if (aim.beforeLoad) aim.beforeLoad();
	//onload = function () { document.body.innerText = 'seeedfgs'; }
})();
