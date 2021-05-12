(function(){
  // let console_debug = console.debug;
  // console.debug = function () {
  //   console_debug(...arguments);
  //   // const args = [...arguments].map(arg => typeof arg === 'object' ? JSON.stringify(arg).replace(/"|{|}/g,'') : arg);
  //   // document.getElementById('log').innerText += args.join(' ') + '\n';
  // }
  Webcam = function (sender) {
    let from_id = null;
		let connections = {};
    let webcam = this;
    let cams = this.cams = [];
    let streams = this.streams = [];
    const MESSAGE_TYPE = {
      SDP: 'SDP',
      CANDIDATE: 'CANDIDATE',
    };
    const signaling = AIM.WebsocketClient.conn;
    const send = this.send = (message_type, content, to) => {
      console.debug('SEND_TO', message_type, to, content);
      signaling.send(JSON.stringify({
        message_type: message_type,
        content: content,
        to: to || ''
      }));
    };
    const showCam = (options) => {
      selectElement.value = options.target || selectElement.value;
      let config = channels.find(config => config.id === selectElement.value);
      let cam = cams[options.cam];
      if (cam.stream) {
        if (config.video) {
          config.barElement.innerText = `CAM ${options.cam}`;
          config.video.srcObject = cam.stream;
        }
      } else {
        console.debug(options, cam);
        send ('GETOFFER', {}, cam.from);
      }
    };
    function Connection (connection_id, senderoptions) {
      const from_id = senderoptions.from;
			console.debug('CREATE Connection', from_id, senderoptions);
      this.senderoptions = senderoptions;

			let connectionElement = null;

			this.close = () => {
        console.debug('CLOSE', AIM(from_id), cams[senderoptions.cam]);
				if (AIM(from_id) && AIM(from_id).parentElement) {
          // console.debug('CLOSE', AIM(from_id), cams[senderoptions.cam]);
					AIM(from_id).remove();
          // options.startElement
				}
        if (cams[senderoptions.cam]) {
          cams[senderoptions.cam].startElement.remove();
        }
				peerConnection.close();
				connections[connection_id] = null;
			};

			const createPeerConnection = signaling => {
				const peerConnection = new RTCPeerConnection({
					iceServers: [{ urls: 'stun:stun4.l.google.com:19302' }],
				});
				peerConnection.onconnectionstatechange  = async (event) => {
					console.error('onconnectionstatechange', event.target.connectionState);
          if (event.target.connectionState === 'disconnected') {
						this.close();
					}
          if (event.target.connectionState === 'connected') {
            console.log(this.senderoptions);
            showCam(this.senderoptions);
					}
				};
				peerConnection.onnegotiationneeded = async (event) => {
					console.debug('onnegotiationneeded', event);
					await createAndSendOffer(signaling, peerConnection);
				};
				peerConnection.onicecandidate = (iceEvent) => {
					console.debug('onicecandidate', event);
					if (iceEvent && iceEvent.candidate) {
						send( MESSAGE_TYPE.CANDIDATE, iceEvent.candidate, from_id );
					}
				};
				peerConnection.ontrack = event => {
          console.debug(event.streams.length);

          let stream = this.stream = cams[senderoptions.cam].stream = event.streams[0];
          this.record = event => {
            console.debug('START recording', senderoptions);
            let recordElement = document.body.createElement('DIV', '', 'Recording camera ' + senderoptions.cam).createElement('SPAN');
            var recordedChunks = [];
      			var stream = this.stream;//window.recordStream;
      			// console.debug(stream);
      			var options = { mimeType: "video/webm; codecs=vp9" };
      			let mediaRecorder = new MediaRecorder(stream, options);
      			mediaRecorder.ondataavailable = handleDataAvailable;
      			mediaRecorder.start();
            mediaRecorder.startDateTime = new Date();
      			let filename = [senderoptions.cam,new Date().toISOString().replace(/\.|-|:/g,'')].join('_');
      			let i=1;
      			function handleDataAvailable(event) {
      			  // console.debug("data-available");
      			  if (event.data.size > 0) {
      			    recordedChunks.push(event.data);
      			    // console.debug(recordedChunks);
      			    download();
      			  } else {
      			    // ...
      			  }
      			}
      			const RESET_TIME = 10000;
            const setTimer = () => {
              mediaRecorder.resetTimeout = setTimeout(() => {
        				mediaRecorder.stop();
        				recordedChunks=[];
                mediaRecorder.lastStartDateTime = mediaRecorder.startDateTime;
                mediaRecorder.startDateTime = new Date();
                mediaRecorder.duration = mediaRecorder.startDateTime.valueOf() - mediaRecorder.lastStartDateTime.valueOf();
        				mediaRecorder.start();
        			}, RESET_TIME);
            };
            setTimer();
      			const download = () => {
      				clearTimeout(mediaRecorder.resetTimeout);
      			  var blob = new Blob(recordedChunks, { type: "video/webm" });
      				reader = new FileReader();
              var timeOfDate = function (date) {
                console.debug([date.valueOf(), date.getMilliseconds()]);
                return date.valueOf() * 1000 + date.getMilliseconds();
              };
              // var now = new Date();
              // now = now.valueOf() * 1000 + now.getMilliseconds();
              // console.debug(now.valueOf(), now.getMilliseconds());
              // var duration = timeOfDate(new Date()) - timeOfDate(mediaRecorder.startDateTime);
              // var duration = new Date().valueOf() - mediaRecorder.startDateTime.valueOf();
              // mediaRecorder.startDateTime = new Date();
              console.debug('duration', mediaRecorder.duration);
              reader.onload = event => {
                new AIM.HttpRequest('post', '/api', {
                  videorecorder: 'add',
                  cam_id: senderoptions.cam,
                  start: mediaRecorder.lastStartDateTime.toISOString(),
                  duration: mediaRecorder.duration,
                  name: filename + '_'+(i++) + '.webm',
                }, event.target.result, event => {
                  if (mediaRecorder.state === 'recording') {
                    setTimer();
                  }
                });
              };
              reader.readAsDataURL(blob);
              recordElement.innerText = ` ${i} ${mediaRecorder.lastStartDateTime.toLocaleString()} ${mediaRecorder.duration}ms`;
      				return;

      			  var url = URL.createObjectURL(blob);
      			  var a = document.createElement("a");
      			  pageElement.appendChild(a);
      			  a.style = "display: none";
      			  a.href = url;
      			  a.download = "test.webm";
      			  a.click();
      			  window.URL.revokeObjectURL(url);
      			};
          };
          if (webcam.recorder) return this.record();
					pageElement.style = '';
          let config = channels.find(config => config.id === selectElement.value);
          // document.body.createElement('video', {
          //   srcObject : event.streams[0],
          //   width:100,
          //   height:100,
          //   autoplay: true,
          //   playsinline: true,
          // });
          senderoptions.streamId = senderoptions.streamId || senderoptions.cam;
          streams[senderoptions.streamId] = stream;
          const setchannels = channels.filter (channel => channel.camId == senderoptions.streamId);
          // console.error(senderoptions.streamId, channels, setchannels);
          setchannels.forEach(channel => {
            channel.video.srcObject = stream;
            channel.barElement.innerText = `CAM ${senderoptions.streamId}`;
          });
          senderoptions.streamId++;
          // if (config.video) {
          //   config.barElement.innerText = `CAM ${senderoptions.cam}`;
          //   config.video.srcObject = this.stream = event.streams[0];
          // }
				};
				return peerConnection;
			};
			const createAndSendOffer = async () => {
        console.debug('createAndSendOffer');
				const offer = await peerConnection.createOffer();
        Object.assign(offer, sender);
				await peerConnection.setLocalDescription(offer);
				send( MESSAGE_TYPE.SDP, offer, from_id );
			};
			this.onmessage = async function (message_type, content) {
				console.debug('onmessage', message_type, content);
        // this.cam = content.cam;
        // this.wall = content.wall;

				if (message_type === 'GETOFFER') {
					// if (!window.localStream) return;
          if (window.streams) {
            console.debug('ADDING STREAMS window.streams');
            window.streams.forEach(stream => {
              stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream)
              } );
            })
          } else if (window.localStream) {
            console.debug('ADDING STREAMS window.localStream');
            window.localStream.getTracks().forEach(track => {
              peerConnection.addTrack(track, window.localStream)
            } );
          }
          // var canvas = document.querySelector('canvas');
          // window.localStream.getTracks().forEach(track => {
					// 	peerConnection.addTrack(track, canvas.captureStream(125))
					// } );
				} else if (message_type === MESSAGE_TYPE.CANDIDATE && content) {
					await peerConnection.addIceCandidate(content);

				} else if (message_type === MESSAGE_TYPE.SDP) {
					if (content.type === 'offer') {
						await peerConnection.setRemoteDescription(content);
						const answer = await peerConnection.createAnswer();
						await peerConnection.setLocalDescription(answer);
						send( MESSAGE_TYPE.SDP, answer, from_id );
					} else if (content.type === 'answer') {
						await peerConnection.setRemoteDescription(content);
						// console.debug('ANSWER', from_id, connections[from_id].stream, connections[from_id]);
						return;
						// DEBUG: Code uitvoeren zodat alle clients zich aanmelden
						if (!connections[connection_id].stream) {
							send ('GETOFFER', {}, from_id);
						}
					} else {
						console.error('Unsupported SDP type.');
					}
				}
			};
			const peerConnection = createPeerConnection(signaling);
		}

    signaling.addEventListener('message', async (message) => {
      const data = JSON.parse(message.data);
      // console.debug(data);
      if (!data) return;
      if (data.message_type) {
        try {
          const { message_type, content, to, from, options } = data;
          options.from = from;
          options.connection_id = from + (options.cam || '');
          console.debug('MESSAGE_FROM', options.connection_id, from, to, message_type, content);

          if (message_type === 'OPTIONS' && sender.cam) {
            send( 'CAMERA_EVAIL', sender, from);
          }
          if (message_type === 'SETWALL' && !sender.cam && !('control' in sender)) {
            selectElement.value = content.target;
            cams[content.cam].startElement.click();
          }
          if (message_type === 'CAMERA_EVAIL') {
            // console.debug(message_type, options, from);
            const cam = cams[options.cam];// || cams[options.from];
            if (cam) {
              if (connections[options.connection_id]) {
                connections[options.connection_id].close();
              }
              if (cam.startElement) {
                cam.startElement.remove();
              }
            }
            cams[options.cam] = options;
            if ('recorder' in sender) {
              send ('GETOFFER', {}, options.from);
              return;
            }
            options.startElement = btnbar.createElement('BUTTON', '', 'CAM_' + options.cam, {onclick() {
              if (!('control' in sender)) {
                showCam(content);
                // if (cams[content.cam].stream) {
                //   let config = channels.find(config => config.id === selectElement.value);
                //   if (config.video) {
                //     config.barElement.innerText = `CAM ${content.cam}`;
                //     config.video.srcObject = cams[content.cam].stream;
                //   }
                // } else {
                //   send ('GETOFFER', {}, options.from);
                // }
              } else {
                send('SETWALL', {target: selectElement.value, cam:options.cam } );
              }
            }});
            return;
          }
          if (message_type === 'GETOFFER') {
            if (connections[from]) {
              connections[from].close();
            }
          }
          connections[options.connection_id] = connections[options.connection_id] || new Connection(options.connection_id, options);
          connections[options.connection_id].onmessage(message_type, content);
        } catch (err) {
          console.error(err);
        }
      }
    });
    this.startChat = async function (sender) {
      console.debug(sender);
      document.title = document.location.search;
      if (sender.cam) {
        const w = 50;
        const h = 100;
        const size1 = `width:${w}%;height:${h}%;`;
        const size2 = `width:${w*2}%;height:${h*2}%;`;
        let l = 0;
        let t = 0;
        channels = [
          { id: 'LA', style: `top:${t=0};left:${l=0};` + size1 },
          // { id: 'LB', style: `top:${t};left:${l+=w}%;` + size1 },
        ];
      } else {
        const w = 16.66;
        const h = 25;
        const size1 = `width:${w}%;height:${h}%;`;
        const size2 = `width:${w*2}%;height:${h*2}%;`;
        let l = 0;
        let t = 0;
        channels = [
          { id: 'LA', style: `top:${t=0};left:${l=0};` + size1 },
          { id: 'LB', style: `top:${t};left:${l+=w}%;` + size1 },
          { id: 'LC', style: `top:${t};left:${l+=w}%;` + size1 },
          { id: 'LD', style: `top:${t};left:${l+=w}%;` + size1 },
          { id: 'LE', style: `top:${t};left:${l+=w}%;` + size1 },
          { id: 'LF', style: `top:${t};left:${l+=w}%;` + size1 },

          { id: 'LG', style: `top:${t+=h}%;left:0;` + size1 },
          { id: 'LH', style: `top:${t+=h}%;left:0;` + size1 },

          { id: 'LI', style: `top:${h}%;left:${w}%;` + size2 },

          { id: 'RA', style: `top:${t=3*h}%;left:${l=0};` + size1 },
          { id: 'RB', style: `top:${t}%;left:${l+=w}%;` + size1 },
          { id: 'RC', style: `top:${t}%;left:${l+=w}%;` + size1 },
          { id: 'RD', style: `top:${t}%;left:${l+=w}%;` + size1 },
          { id: 'RE', style: `top:${t}%;left:${l+=w}%;` + size1 },
          { id: 'RF', style: `top:${t}%;left:${l+=w}%;` + size1 },

          { id: 'RG', style: `top:${t=h}%;left:${l=5*w}%;` + size1 },
          { id: 'RH', style: `top:${t+=h}%;left:${l}%;` + size1 },

          { id: 'RI', style: `top:${h}%;left:${3*w}%;` + size2 },
        ];
        channels.forEach((channel,i) => channel.camId = i + 100);
      }
      selectElement = btnbar.createElement('SELECT');
      const wallElement = 'control' in sender ? null : document.body.createElement('DIV', 'wall aco');
      console.debug(wallElement);
      channels.forEach(config => {
        selectElement.createElement('OPTION', '', config.id, { value:config.id} );
        if (!('control' in sender)) {
          config.element = wallElement.createElement('DIV', 'frame', config);
          config.video = config.element.createElement('VIDEO', {
            autoplay: true,
            playsinline: true,
            onclick: event => {
              selectElement.value = config.id;
            }
          } );
          config.barElement = config.element.createElement('DIV', 'bar', config.id);
        }
      });
      if (sender.cam) {
        try {
          options = {
            audio: false,
            video: {
              facingMode: sender.facingMode || 'environment',//'user',//shouldFaceUser ? 'user' : 'environment'
            },
          };

          if (!window.streams) {
            cams.local = {
              // stream: window.recordStream = window.localStream = window.localStream || await navigator.mediaDevices.getUserMedia(options),
              stream: window.recordStream = window.localStream = await navigator.mediaDevices.getUserMedia(options),
            };
            showCam({cam: 'local'});
          }


          // cams.local1 = {
          //   stream: window.recordStream = window.localStream = window.localStream || await navigator.mediaDevices.getUserMedia(options),
          // };
          send('CAMERA_EVAIL', sender);

          // DEBUG: SHOW LOCAL CAM
          // showCam({cam: 'local1'});

          // var stream = window.recordStream = window.localStream = await navigator.mediaDevices.getUserMedia(options);
          // console.debug('createLocalVideo');
          // video.srcObject = stream;
          // video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
          // video.play();
          //
          // pageElement.style = '';
          // caminfo.innerText = 'Your local camera';
        } catch (err) {
          console.error(err);
        }
        // document.title = 'CAM ' + sender.cam;
        // caminfo = pageElement.createElement('DIV', 'caminfo' );
        // video = pageElement.createElement('VIDEO', '', {
        //   style: 'width:100%;',
        //   style: 'width:100%;max-width:400px;',
        //   autoplay: true,
        //   playsinline: true,
        //   onclick() {
        //     console.debug('SNAP', this.paused);
        //     if (this.paused) {
        //       this.play();
        //     } else {
        //       this.pause();
        //     }
        //   }
        // });
      }
    };
    const play = event => {
      new AIM.HttpRequest(`/api/?request_type=camfile&camId=${playCam.value}&startDateTime=${playStartDate.value} ${playStartTime.value}`, event => {
        console.debug(event.body);
        if (!event.body) alert('No data');
        let [camId,fileName,nr] = event.body.filename.split('.')[0].split('_');
        var fileStartDate = new Date(event.body.startDateTime);
        var startDateTime = new Date(playStartDate.value + ' ' + playStartTime.value);
        let startTime = startDateTime.valueOf() - fileStartDate.valueOf();
        console.debug(startTime);
        // let fileName = playCam.value + '_' + (playStartDate.value + 'T' + playStartTime.value + 'Z').replace(/-|:/g,'');
        // console.debug(fileName);
        // console.debug(startDate);
        // console.debug(new Date(startDate.getTime() + 5000));

        var mimeCodec = "video/webm; codecs=vp9";
        // var assetURL = `https://aliconnect.nl/shared/videorecorder/1_20201019T230320100Z_`;
        var assetURL = `https://aliconnect.nl/shared/videorecorder/${camId}_${fileName}_`;
        // for (var i=nr, urls = []; i<=145; i++) {
        //   urls.push(assetURL + i + '.webm');
        // }
        if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
          var mediaSource = new MediaSource();
          let channel = channels.find(config => config.id === selectElement.value);
          let title = channel.barElement;
          let video = channel.video;
          video.src = URL.createObjectURL(mediaSource);
          mediaSource.addEventListener('sourceopen', event => {
            mediaSource.duration = 0;
            function get (url, cb) {
              if (!url) return;
              var xhr = new XMLHttpRequest;
              xhr.open('get', url);
              // info.innerText = url;
              console.debug('GET',url);
              xhr.responseType = 'arraybuffer';
              xhr.onload = event => {
                if (event.target.status === 200) {
                  cb (xhr.response);
                  // return mediaSource.endOfStream();
                }
                // console.debug(event);
              };
              xhr.send();
            }
            let sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
            sourceBuffer.mode = 'sequence';
            sourceBuffer.addEventListener('updateend', event => {
              console.debug('updateend', mediaSource.readyState, mediaSource.duration);
                          // if (!urls.length) mediaSource.endOfStream();
            });
            video.addEventListener('canplay', event => {
              console.debug('canplay', video.currentTime);
              if (startTime) {
                video.currentTime = startTime/1000;
                startTime = 0;
              }
            });
            video.addEventListener('timeupdate', event => {
              title.innerText=`${nr} ${new Date(fileStartDate.getTime() + video.currentTime * 1000).toLocaleString()}`;
              if (mediaSource.duration - video.currentTime < 1) {
                get (assetURL + (nr++) + '.webm', response => sourceBuffer.appendBuffer(response));
              }
            });
            // video.addEventListener('canplay', event => video.play());
            get (assetURL + (nr++) + '.webm', response => sourceBuffer.appendBuffer(response))
          });

        } else {
          console.error('Unsupported MIME type or codec: ', mimeCodec);
        }
        console.debug(event.body, event.target.responseText);
      })
    };
    const dt = '2020-10-19T23:03:30Z';
    btnbar.createElement('INPUT', {id: 'playStartDate', type: 'date', value: new Date(dt).toISOString().substr(0,10)});
    btnbar.createElement('INPUT', {id: 'playStartTime', type: 'time', value: new Date(dt).toISOString().substr(11,8)});
    btnbar.createElement('SELECT', {id: 'playCam', type: 'number'}, [
      ['OPTION', '', 1],
      ['OPTION', '', 2],
      ['OPTION', '', 3],
      ['OPTION', '', 4],
      ['OPTION', '', 5],
      ['OPTION', '', 6],
      ['OPTION', '', 7],
    ]);
    playCam.value = 2;
    btnbar.createElement('BUTTON','','Play', play);
    pageElement = document.body;
    // pageElement = pageElement.createElement('DIV', 'col aco', {style: 'height:50px;'} );
    send( 'OPTIONS', sender );
  }
})();
