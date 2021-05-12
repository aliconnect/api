(function() {
  console.log('SAMPLE');
  const samples = [
    {
      header: 'login',
      // const config = {
      // 	ws: {
      // 		servers: [
      // 			{
      // 				url: 'wss://aliconnect.nl:444',
      // 			},
      // 		],
      // 	},
      // 	api: {
      // 		servers: [
      // 			{
      // 				url: 'https://aliconnect.nl/api',
      // 			},
      // 		],
      // 	},
      // 	auth: {
      // 		servers: [
      // 			{
      // 				url: 'https://login.aliconnect.nl/api',
      // 			},
      // 		],
      // 	},
      // };
      blocks: [
        {
          js() {
            config = {
              auth: {
                servers: [
                  {
                    url: 'https://login.aliconnect.nl/api',
                  },
                ],
              },
              api: {
                servers: [
                  {
                    url: 'https://aliconnect.nl/api',
                  },
                ],
              },
            };
          }
        },
        {
          js() {
            Aim.on('load', event => {
              console.debug('config', config);
              aim = Aim().client(config);
              document.body.createElement('button', 'abtn', 'Login', {
                onclick() {
                  me = aim.account();
                  console.debug('TEST', me);
                }
              })
              // me.login();
              // me.getApi();
            })
          },
        }
      ],
    },
  ];
  // const container = document.body;
  function createSample(sample) {
    // content.innerText='';
    content.createElement('h1', '', sample.header);
    let allcode = [];
    sample.blocks.forEach(sample => {
      let code = String(sample.js).replace(/^js\(\) \{|\}$/gs,'').split(/\n/).filter(line => line.trim());
      let ident = code.filter(line => line.trim())[0].search(/\S/);
      code = code.map(line => line.substr(ident)).join('\n');
      content.createElement('p', '', 'Javascript');
      const sampleJs = content.createElement('pre', 'code', code);
      allcode.push(code);
    })
    content.createElement('p', '', 'Creates following html');
    const sampleHtml = content.createElement('pre', 'code');
    content.createElement('p', '', 'sampleConsole');
    const sampleConsole = content.createElement('pre', 'code', {style: `height:100px;overflow:auto;font-family: consolas;font-size:0.8em;`});
    const elFrame = content.createElement('iframe', {style: 'width:100%;'});
    const doc = elFrame.contentWindow.document;

    content.createElement('p', '', 'Alle Javascript bij elkaar');
    const sampleJs = content.createElement('pre', 'code', allcode = allcode.join('\n'));

    console.log(allcode);
    doc.open();
    doc.write(`
    <script src="src/js/aim.js"></script>
    <script src="src/js/web.js"></script>
    <script>${allcode}</script>`);
    doc.close();
    elFrame.contentWindow.console.log = function (str) {
      sampleConsole.createElement('div', '', str).scrollIntoViewIfNeeded();
    }
    elFrame.onload = event => {
      sampleHtml.innerText = doc.body.innerHTML;
      // console.debug('GGGG', doc.head.innerHTML);
    }
    // elFrame.src =  'sampledemo.html';
  }

  Aim.on({
    load() {
      console.log('sample load');
      samples.forEach(createSample);
      setTimeout(event => {
        console.warn('HTML', content.innerHTML);
        let result = Aim().url('http://localhost/api/docs_save.php?doc=1')
        .input(content.innerHTML)
        .post()
        // .then(event => console.log('THEN', event.body))
        ;
      }, 1000);

    }
  })
})();
