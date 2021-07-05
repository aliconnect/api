(function() {
  const aimApplication = new Aim.UserAgentApplication();
  console.log(1, aimApplication);

	const MIN_APP_WIDTH = 400;
	$.redirect_uri = document.location.search.split('redirect_uri=').pop().split('&').shift();
	function getProperties(data) {
		console.log('getProperties', data);
		let properties = {};
		for (let attributeName in data) {
			properties[attributeName] = {
				format: 'hidden',
				value: data[attributeName],
			}
		}
		return properties;
	}
  const searchParams=new URLSearchParams(document.location.search);
	$().on({
    async load() {

      $(document.documentElement).class('app');
      $(document.body).append(
				$('div').class('prompt shdw').id('prompt').open(' ').append(
					$('img').class("logo").src("/img/logo.png")
				),
        $('footer').statusbar().class('info')
        .prompts('terms_of_use','privacy_policy','cookie_policy')
			);
    },
		async ready() {
      function qr() {
        return $('img').attr('id', 'authcode').qr({
          text: $().ws().socket_id ? 'https://aliconnect.nl?s=' + $().ws().socket_id : '',
          width: 160,
          height: 160,
        })
      }
      function newform(prompt, title = '', options = {}) {
        return $().promptform($().url('/api/oauth'), ...arguments);
      }
      await $().translate();





      //
      //
      //
      // const authProvider = new $.AuthProvider({
      //   // scope: ["name", "email"],
      //   url: 'https://login.aliconnect.nl/api',
      //   // authorizationUrl: "https:/login.aliconnect.nl/api/oauth",
      //   // tokenUrl: "https://login.aliconnect.nl/api/token",
      // });
      //
      // // $().extend({
      // //   authProvider: {
      // //     auth: {
      // //       // clientId: "c52aba40-11fe-4400-90b9-cee5bda2c5aa"
      // //     }
      // //   },
      // //   ws: {
      // //     url: "wss://aliconnect.nl:444"
      // //   }
      // // });
      // await authProvider.login();
      // // await $().login();
      //
      //



      $().send({
        to: { sid: 'ssss' },
        path: '/?prompt=qrcode_ack',
      });
			if (window.screen.width > 600) {
				$(document.body).css('background-image', 'url("/shared/auth/i' + Math.round(new Date().getDay()/30 * 12) + '.jpg")');
			}
			$.prompt({
        consent() {
          $().prompt('login');
					// return $.request({query:{prompt:'login'}});
				},
        login() {
          const form = newform(this, arguments.callee.name, {
            description: aimApplication.Account && aimApplication.Account.name ? `Welkom ${aimApplication.Account.name}.` : '',
            properties: {
              accountname: {
                type: 'text',
                autocomplete: 'username',
                pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$',
                required: true,
                autofocus: true,
                tabindex:1,
                // blur() {
                //   this.form.password.value = '';
                // },
              },
              password: {
                format: 'hidden',
                type: 'password',
                autocomplete: 'password',
                tabindex:-1,
              },
              // keep_loggedin: {
              //   format: 'checkbox',
              //   title: 'Keep logged-in'
              // },
            },
            append: [
              $('div').append(
                'Geen account? ',
                $('a').text('Maak er een').href('#?prompt=create_account'),
              ),
              $('a').text('Aanmeldings opties').href('#?prompt=login_options'),
              $('a').text('Logout').href('#?prompt=logout'),
            ],
            btns: {
              next: { type:'submit', default: true, tabindex: 2 },
            },
          }).append(qr())
        },
        login_phone_number() {
          const form = newform(this, arguments.callee.name, {
            description: aimApplication.Account ? `Welkom ${aimApplication.Account.name}.` : '',
            properties: {
              phone_number: {
                format: 'tel',
                autofocus: true,
                required: true,
              },
            },
            btns: {
              next: { type:'submit', default: true },
            },
          })
        },
        login_options() {
          $('form').parent(this.is.text('')).class('col aco').append(
            $('h1').ttext('Kies een methode voor aanmelden'),
            $('a').ttext('Aanmelden met Windows account'),
            $('a').ttext('Aanmelden met Google account'),
            $('a').ttext('Aanmelden met Facebook account'),
          ).btns(
            { name: 'back', type:'button', href: '#?prompt=login' },
          )
        },
        password() {
          if (!$.sessionPost.accountname) $().prompt('login');
          const form = newform(this, arguments.callee.name, {
            properties: {
              password: {
                type:'password',
                // pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}',
                autocomplete:'password',
                required:true,
                autofocus:true,
                tabindex:2,
                title: 'Password'
              },
              // accountname: {
              //   format: 'hidden',
              //   autocomplete: 'username',
              //   value: $.sessionPost.accountname
              // },
              keep_loggedin: {
                format: 'checkbox',
                title: 'Keep logged-in'
              },
            },
            append: [
              // { label: 'Show password', onclick(event){ colpanel.password.type = colpanel.password.type != 'text' ? 'text' : 'password'; }},
              // { label: 'No password', href: '#?prompt=getEmailCode' },
              // { label: 'Other signin methods', href: '#?prompt=loginoptions' },
              $('a').text('No access to your account?').href('#?prompt=send_email_code'),
            ],
            btns: {
              back: { href: '#?prompt=login'},
              next: { type:'submit', default: true },
            }
          }).append(qr())
        },
        mobile() {
          console.log('Mobile');
          const state = $('div').ttext('Mobile');
          const form = newform(this, arguments.callee.name).append(
            state,
          ).btns({
            btns: {
              back: { type:'button', href: '#?prompt=login'},
            }
          });
          $().ws().reply('request_id_token').then(body => {
            if (body.id_token) {
              $().url('https://login.aliconnect.nl/api/oauth/')
              .query(document.location.search)
              .headers('Authorization', 'Bearer ' + body.id_token)
              .post()
              .then(event => {
                if (event.body.url) {
                  $.nav.reload(event.body.url);
                } else if (event.body.reply) {
                  // panel = $().prompt('scope_accept');//.show(body.par);
                  // console.log(panel);
                  // return;




                  $().ws().reply(event.body.reply).then(body => {
                    console.log(body);
                  })
                }
              })
            }
          });
        },
        id_token() {
          window.localStorage.setItem('id_token', $.sessionPost.id_token);
          const form = newform(this, arguments.callee.name, {
            properties: {
            },
            btns: {
              back: { href: '#?prompt=login'},
            }
          });
        },
        login_qr() {
          const searchParams=new URLSearchParams(document.location.search);
          const form = newform(this, arguments.callee.name, {
            properties: {
              socketid: {
                // format: 'hidden',
                // autocomplete: 'id',
                value: searchParams.get('s'),
              },
            },
            btns: {
              back: { href: '#?prompt=login'},
            }
          });
          $().ws().send({
      			to: { sid: searchParams.get('s') },
      			path: '/?prompt=login_qr_ack',
      		});
        },
        login_qr_ack() {
          const form = newform(this, arguments.callee.name, {
            properties: {
            },
            btns: {
              back: { href: '#?prompt=login'},
            }
          });
          $().ws().send({
      			to: { sid: searchParams.get('s') },
      			path: '/?prompt=login_qr_ack',
      		});
        },
        init() {
          $('div').parent(this.is.text('')).class('col aco').append(
            $('h1').ttext('init'),
            $('div').ttext('init description'),
          ).btns({
            cancel: { type:'button', href: '#?prompt=login' },
          })
        },
        create_account() {
          // if (!$.sessionPost) return $().prompt('login');
          const form = newform(this, arguments.callee.name, {
            properties: {
              // name: {
              //   title: 'Volledige voornaam en achternaam',
              //   type: 'text',
              //   pattern: '[A-Za-z-]+ [A-Za-z- ]+',
              //   value: $.sessionPost ? $.sessionPost.name || ($.sessionPost.accountname.split('@').shift().replace(/\./g,' ').replace(/^([a-z])|\b([a-z])(?=\w+$)/g,v=>v.toUpperCase())) : '',
              //   // autocomplete: 'off',
              //   autofocus: true,
              //   required: 1,
              // },
              accountname: {
                type: 'email',
                pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
                // autocomplete: 'off',
                // autofocus: true,//!accountname,
                autocomplete: 'username',
                value: $.sessionPost ? $.sessionPost.accountname : '',
                required: 1,
                info: 'Voer uw email adres in',
                // onchange: onchange,
              },
              // password: {
              //   type: 'password',
              //   pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}',
              //   autocomplete: 'new-password',
              //   required: true,
              //   // autofocus: true,
              //   // title: 'Password',
              //   info: 'Minimale lengte 8. Met hoofd-, kleine letters en cijfers',
              // },
              // phone_number: {
              //   type: 'tel',
              //   pattern: '[0-9]{10,11}',
              //   value: $.sessionPost ? $.sessionPost.phone_number : '',
              //   // autofocus: !phone_number,
              //   // required: 1,
              //   // onchange: onchange,
              // },
            },
            btns: {
              cancel: { type:'button', href: '#?prompt=login' },
              next: { type:'submit', default: true },
            },
          })
        },
        send_email_code() {
          const form = newform(this, arguments.callee.name).submit()
        },
        email_code(event) {
          const form = newform(this, arguments.callee.name, {
            properties: {
              code: {
                type: 'number',
                pattern: '[0-9]{5}',
                autocomplete:'off',
                required: true,
                // title: __('input_code'),
                autofocus: true
              },
              // keep_loggedin: {
              //   format: 'checkbox',
              //   title: 'Keep logged-in'
              // },
            },
            append: [
              $('a').text('Stuur nieuwe code').href('#?prompt=send_email_code'),
            ],
            btns: {
              // resend: { type:'button', href: '#?prompt=sms_code' },
              next: { type:'submit', default: true  },
            }
          });
          // .append(qr())
        },
        set_password(event) {
          const form = newform(this, arguments.callee.name, {
            properties: {
              password: {
                type: 'password',
                pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}',
                autocomplete: 'new-password',
                required: true,
                autofocus: true,
              },
            },
            btns: {
              next: { type:'submit', default: true  },
            }
          });
        },
        phone_number() {
          console.log('OPEN PHONE NUMBER')
          const form = newform(this, arguments.callee.name, {
            properties: {
              phone_number: {
                type: 'tel',
                pattern: '[0-9]{10,11}',
                required: true,
                autocomplete: 'off',
                autofocus: true,
              },
            },
            btns: {
              next: { type:'submit', default: true  },
            }
          });
				},
        send_sms_code() {
          const form = newform(this, arguments.callee.name).submit()
        },
        sms_code() {
          const form = newform(this, arguments.callee.name, {
            properties: {
              code: {
                type: 'number',
                pattern: '[0-9]{5}',
                autocomplete:'off',
                required: true,
                // title: __('input_code'),
                autofocus: true
              },
              keep_loggedin: {
                format: 'checkbox',
                title: 'Keep logged-in'
              },
            },
            append: [
              $('a').text('Stuur nieuwe code').href('#?prompt=send_sms_code'),
            ],
            btns: {
              // resend: { type:'button', href: '#?prompt=sms_code' },
              next: { type:'submit', default: true  },
            }
          })
        },
        accept() {
          const searchParams = new URLSearchParams(document.location.search);
          // const redirect_uri = searchParams.get('redirect_uri');
          // const url = new URL(redirect_uri);
          const scope = searchParams.get('scope').split(/ |,/);
          const properties = Object.fromEntries(scope.map(val => [val, {
            name: val,
            format: 'checkbox',
            checked: 1,
          }]))
          properties.expire_time = {format: 'number', value: 3600};
          const form = newform(this, arguments.callee.name, {
            properties: properties,
            btns: {
              deny: { name: 'accept', value:'deny', type:'button' },
              allow: { name: 'accept', value:'allow', type:'submit', default: true },
            }
          }).append(qr())
				},
        forbidden() {
          $('div').parent(this.is.text('')).class('col aco').append(
            $('h1').ttext('no_access'),
            $('div').ttext('no_access_description'),
          ).btns({
            cancel: { type:'button', href: '#?prompt=login' },
          })
        },

				logout(event) {
          aimApplication.logout();
					// console.log('PROMPT LOGOUT APP', event.type);
          // $().logout();
          // return;
					// $.auth.logout(event);

					// document.location.href = '/api/oauth' + new $.URLSearchParams(document.location.search).merge({prompt:'logout'}).toString();
				},
				request_access() {
					var form = {
						title: 'request_access',
						description: 'Geen aliconnect account. Ga op uw mobile naar https://login.aliconnect.nl. Maak een account aan en scan onderstaande code.',
						properties: [
							{ tagName: 'div', id: 'authcode' },
						],
						onload : function (event) {
							this.responses = {
								200: {description: 'successful operation' },
								404: {description: __('Email or phonenumber not found', this.accountname.value) },
							};
							$.checkResponse.call(this,event);
						}
					};
					(this.el = this.el || colpanel.createElement('form',{className:'col aco '})).appendForm(form);
					new QRCode('authcode', { text: $.ws.servers[0].socket_id, width: 140, height: 140 });
				},
				login_mse() {
					console.log('document.cookie', document.cookie);
					let minAppWidth = 400;
					var accountName = $.auth.name || '';
					// console.log('LOGIN');
					return colpanel.createElement('FORM', 'col aco', {
						action: $.config.$.config.auth.authorizationUrl + document.location.search,
						title: 'prompt_login_mse_title',
						description: 'prompt_login_mse_description',
						properties: {
							contacts: { type:'radio', options: {read:{}, readwrite:{} } },
							appointment: { type:'radio', options: {read:{}, readwrite:{} } },
							messages: { type:'radio', options: {read:{}, readwrite:{} } },
						},
						operations: {
							cancel: { type:'button', href: '#?prompt=login' },
							next: !$.auth.email || screen.width > minAppWidth ? { type:'submit', default: true, label: 'Next' } : null,
						},
						responses: {
							200: {description: 'successful operation' },
							404: {description: 'Email or phonenumber not found' },
						},
						onload: $.checkResponse
					});
				},
				noaccept() {
					return colpanel.createElement('DIV', 'col aco', [
						['DIV', [
							['A', 'abtn back', {href: '/?prompt=login'}],
							['SPAN', 'AccountName', $.sessionPost ? $.sessionPost.AccountName : $.config.$.userName ],
						]],
						['FORM', 'col aco ', {
							action: $.config.$.config.auth.authorizationUrl + document.location.search,
							title: 'Geen toegang tot domein',
							description:
							'De applicatie ' + decodeURIComponent(get.redirect_uri).split('//')[1].split('?')[0].split('/')[0] + ' wil toegang tot de volgende gegevens.' +
							'<ul><li>' + get.scope.split('+').join('</li><li>') + '</li></ul>' +
							'U heeft echter geen account. Neem contact op met de beheerder om een account aan te laten maken.'
							,
						}],
					]);
				},
				allow() {
					return;
					//if (!$.loginData) return $.nav({ prompt: 'login' });
					if (!this.innerHTML) this.innerHTML = `
					<div class="aco">
					<div><a class="abtn icn arrowLeft" href="#?prompt=login" tabindex="1"></a><span class="userName"></span></div>
					<h1>Uw toestemming is verwerkt.</h1>
					</div>
					`;
					$.ws.request({ to: { sid: $.ws.responseData.from }, prompt: 'reload' });
					document.location.href = decodeURIComponent(auth.redirect_uri) || document.location.href;
				},
				deny() {
					if (!this.innerHTML) this.innerHTML = `
					<div class="aco">
					<div><a class="abtn icn arrowLeft" href="#?prompt=login" tabindex="1"></a><span class="userName"></span></div>
					<h1>Uw weigering is verwerkt.</h1>
					</div>
					`;
					$.ws.request({ to: { sid: $.ws.responseData.from }, prompt: 'reload' });
					document.location.href = decodeURIComponent(auth.redirect_uri) || document.location.href;
				},
				account_options() {
					return colpanel.createElement('FORM', 'col aco', {
						title: 'prompt_account_options_title',
						description: 'prompt_account_options_description',
						hyperlinks: [
							{ label: 'Mobiel nummer invoeren', href: '#?prompt=set_phone_number' },
							{ label: 'Account verwijderen', href: '#?prompt=delete_account' },
						],
						operations: {
							cancel: { type:'button', label: 'Cancel', href: '#?prompt=login' },
						}
					});
				},
				requestNewPasswordByEmail() {
					(this.el = this.el || colpanel.createElement('form',{className:'col aco'})).appendForm({
						title: this.title,
						description: 'requestNewPasswordByEmailDescription',
						properties: [
							{ name: 'accountname', type:'email', autocomplete:'username', required:true, autofocus:true, title: 'E-mailadres' },
						],
						operations: [
							{ type:'submit', default: true, label: 'Next' },
						],
						onload : function (event) {
							$.prompt.login.data = event.data;
							if (event.target.status === 404) return this.showError('Email unknown', this.accountname.value);
							return $.request('?prompt=getEmailCode');
						}
					});
				},

				delete_account() {
					return colpanel.createElement('FORM', 'col aco', {
						action: $.config.$.config.auth.authorizationUrl + document.location.search,
						title: 'Delete account',
						description: [
							'Uw wilt uw account verwijderen.',
							'Hiermee wordt al uw data vernietigd binnen uw eigen omgeving en uw persoonlijke data bij alle aangesloten bedrijfsdomeinen.',
						].join('<br>'),
						properties: {
							email: {
								type: 'email',
								// autocomplete: 'off',
								autocomplete: 'username',
								pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
								required: true,
								autofocus: true,
							},
							phone_number: {
								type: 'tel',
								pattern: '[0-9]{10,11}',
								required: true,
								autocomplete: 'off',
							},
							password: {
								type: 'password',
								pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}',
								required: true,
								autocomplete: 'new-password',
							},
						},
						operations: {
							cancel: { type:'button', href: '#?prompt=login' },
							next: { type:'submit', default: true },
						},
						onload: $.checkResponse,
					});
				},

				phone_number_delete() {
					if (!$.auth.id_token) return $.request('?prompt=login');
					if (!$.auth.id.phone_number_verified) return $.request('?prompt=login');
					let formElement = colpanel.createElement('FORM', 'col aco', {
						action: $.config.$.config.auth.authorizationUrl + document.location.search,
						responses: {
							401: {description: 'Error safetycode invalid'},
							408: {description: 'Error safetycode timout'},
						},
						onload: $.checkResponse,
						onshow: event=> {
							formElement.innerText = '';
							formElement.createElement({
								title: 'current_phone_number_title',
								description: 'current_phone_number_description',
								properties: Object.assign(getProperties($.sessionPost), {
									phone_number: {
										type: 'tel',
										pattern: '[0-9]{10,11}',
										required: true,
										autocomplete: 'off',
									},
								}),
								operations: {
									next: { type:'submit', default: true  },
								},
							});
						},
					});
					return formElement;
				},
				verify_code() {
					if (!$.sessionPost) return $.request('?prompt=login');
					if ($.sessionPost.phone_number_verified) return $.request('?prompt=sms_code');
					return $.request('?prompt=email_code');
				},

				app_code_blur() {
					if (!$.sessionPost) return $.request('?prompt=login');
					let formElement = colpanel.createElement('FORM', 'col aco', {
						action: $.config.$.config.auth.authorizationUrl + document.location.search,
						responses: {
							401: {description: 'Error safetycode invalid'},
							408: {description: 'Error safetycode timout'},
						},
						title: 'app_code_blur_title',
						description: 'app_code_blur_description',
						properties: getProperties($.sessionPost),
						// onload: $.checkResponse,
						onshow(event) {
							new $.WebsocketRequest({
								to: { sid: $.sessionPost.body.socket_id },
								path: '/?prompt=app_code_phone'
							});
							$.app_codeTimeout = setTimeout(event => {
								new $.HttpRequest(
									'post',
									$.config.$.config.auth.authorizationUrl + document.location.search,
									formElement,
									$.checkResponse
								);
							},3000);
						},
					});
					return formElement;
				},
				app_code() {
					if (!$.sessionPost) return $.request('?prompt=login');
					let formElement = colpanel.createElement('FORM', 'col aco', {
						action: $.config.$.config.auth.authorizationUrl + document.location.search,
						responses: {
							401: {description: 'Error safetycode invalid'},
							408: {description: 'Error safetycode timout'},
						},
						onload: $.checkResponse,
						onshow: event=> {
							clearTimeout($.app_codeTimeout);
							formElement.innerText = '';
							formElement.createElement({
								title: 'app_code_title',
								description: 'app_code_description' + $.sessionPost.body.state,
								operations: {
									next: { type:'submit', default: true  },
								},
							});
							console.log('TO', $.sessionPost.body.socket_id);
						},
					});
					return formElement;
				},
				app_code_phone() {
					return colpanel.createElement('FORM', 'col aco', {
						action: $.config.$.config.auth.authorizationUrl + document.location.search,
						responses: {
							401: {description: 'Error safetycode invalid'},
							408: {description: 'Error safetycode timout'},
						},
						title: 'app_code_phone_title',
						description: 'app_code_phone_description',
						operations: {
							next: { type:'submit', default: true  },
						},
						onshow() {
							new $.WebsocketRequest({
								to: { sid: $.WebsocketClient.responseBody.from_id },
								body: {
									id_token: $.auth.id_token,
								},
								path: '/?prompt=app_code',
							});
						},
						onsubmit(event) {
							event.preventDefault();
							new $.WebsocketRequest({
								to: { sid: $.WebsocketClient.responseBody.from_id },
								path: '/?prompt=app_code_phone_accept'
							});
							$.request('?prompt=login');
						}
					});
				},
				reload() {
					document.location.reload();
				},
				ws_get_id_token() {
					console.log('ws_get_id_token', $.WebsocketClient.responseBody);
					if (!$.WebsocketClient.responseBody || !$.WebsocketClient.responseBody.from_id) {
						$.request('?prompt=login');
					}
					return colpanel.createElement('FORM', 'col aco', {
						client: $.config.$,
						action: $.config.$.config.auth.authorizationUrl + document.location.search,
						title: 'Login poging',
						description: 'U gaat inloggen in deze applicatie',
						operations: {
							cancel: {type: 'button', onclick() {
								return $.request('?prompt=login');
							}},
							next: {type: 'submit'},
						},
						onload(event) {
							// event.preventdefault();
							// return console.log(event);
							new $.WebsocketRequest({
								to: { sid: $.WebsocketClient.responseBody.from_id },
								path: '/?' + new URLSearchParams({
									prompt: 'ws_login_code',
									// code: event.body.code,
									// state: event.body.state,
								}).toString(),
								body: event.body,
							});
							return $.request('?prompt=login');
						},
					});
				},
				authapp_accept_done() {
					(this.el = this.el || colpanel.createElement('form',{className:'col aco', method:'post'})).appendForm({
						title: 'authapp_accept_done',
						description: 'Uw keuze wordt verwerkt.',
					});
				},
				authapp_send_id_token() {
					(this.el = this.el || colpanel.createElement('form',{ className:'col aco' })).appendForm({
						title: 'authapp_send_id_token',
						description: 'U wordt aangemeld.',
						// description: __('De applicatie %s wil toegang tot de volgende gegevens.',$.loginData ? $.loginData.hostTitle : ''),
					});
					$.ws.request({ to: { sid: get.sid }, path: new $.URLSearchParams(document.location.search).merge({ prompt:'authapp_accept_id_token', id_token:$.cookie.id_token }).toString() } );
				},
				authapp_accept_id_token() {
					$.ws.request({ to: { sid: $.ws.responseData.from }, path: '?prompt=login' } );
					if ($.prompt.request_access.el) {
						(this.el = this.el || colpanel.createElement('form',{className:'col aco', method:'post'})).appendForm({
							title: 'bedankt voor toegang tot uw gegevens',
							description: '',
						});
						setTimeout(function(event){ return $.request({query:{prompt:'request_access', id_token:null, sid:null }}); },3000);
					}
					else {
						document.location.href = '/api/oauth' + new $.URLSearchParams(document.location.search).merge({ prompt:'login' }).toString();
					}
				},
				requestfordata() {
					console.log('requestfordata', get.client);
					$.ws.request({ to: { client: get.client }, state: 'requestfordatashow' });
				},
				loginmobile() {
					this.el.appendForm({
						title: this.title,
						hyperlinks: [
							// { label: 'Verstuur een code via een email bericht', href:'#?prompt=getEmailCode' },
							// { label: 'Verstuur een code naar mijn mobiel', href:'#?prompt=getPhoneCode'  },
						],
						operations: [
							{ type:'button', label: 'Cancel', href: '#?prompt=login' },
							// { type:'submit', default: true, label: 'Next' },
						]
					});
				},
				authapp() {
					this.el.appendForm({
						title: this.title,
						properties: [
							// { name: 'access_token', type:'text', autocomplete:'off', title: 'access_token' },
						],
						operations: [
							{ type:'button', label: 'Back', href: '#?prompt=loginoptions' },
							{ type:'submit', label: 'Next', default: true },
						]
					});
				},
				accesstoken() {
					this.el.appendForm({
						title: this.title,
						properties: [
							{ name: 'access_token', type:'text', autocomplete:'off', title: 'access_token' },
						],
						operations: [
							{ type:'button', label: 'Back', href: '#?prompt=loginoptions' },
							{ type:'submit', label: 'Next', default: true },
						]
					});
				},
			});
      if (!searchParams.get('prompt')) {
        $().prompt('login');
      }
		},
		login() {
			if ($.get.socket_id && $.get.code) {
				$.auth.ws_send_code($.get.socket_id, $.get.code);
			}
			console.log('AUTH LOGIN', $.get.prompt, $.id.nonce);




			if ($.get.prompt === 'login') $.prompt($.get.prompt, true);
		},
		logout(event) {
			// alert(document.cookie);
			document.location.href='https://login.aliconnect.nl/api/oauth?prompt=logout';
			// document.location.reload();
		},
	});
})();
