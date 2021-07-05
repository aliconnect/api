eol = '\n';
(function(){
  const isModule = typeof module === "object" && typeof exports === "object";
  window = isModule ? global : window;
  document = window.document;
  console.msg = console.msg || console.info;
  today = new Date();
  dstart = 0;
  maxdate = 0;
  const meshitems = [];
  const AUTHORIZATION_URL = 'https://login.aliconnect.nl/api/oauth';
  const TAGNAMES = [
    'a',
    'abbr',
    'address',
    'area',
    'article',
    'aside',
    'audio',
    'b',
    'base',
    'bdi',
    'bdo',
    'blockquote',
    'body',
    'br',
    'button',
    'canvas',
    'caption',
    'cite',
    'code',
    'col',
    'colgroup',
    'data',
    'datalist',
    'dd',
    'del',
    'details',
    'dfn',
    'dialog',
    'div',
    'dl',
    'dt',
    'em',
    'embed',
    'fieldset',
    'figcaption',
    'figure',
    'footer',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'head',
    'header',
    'hgroup',
    'hr',
    'html',
    'i',
    'iframe',
    'img',
    'input',
    'ins',
    'kbd',
    'label',
    'legend',
    'li',
    'link',
    'main',
    'map',
    'mark',
    'menu',
    'meta',
    'meter',
    'nav',
    'noscript',
    'object',
    'ol',
    'optgroup',
    'option',
    'output',
    'p',
    'param',
    'picture',
    'pre',
    'progress',
    'q',
    'rp',
    'rt',
    'ruby',
    's',
    'samp',
    'script',
    'section',
    'select',
    'slot',
    'small',
    'source',
    'span',
    'strong',
    'style',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'template',
    'textarea',
    'tfoot',
    'th',
    'thead',
    'time',
    'title',
    'tr',
    'track',
    'u',
    'ul',
    'var',
    'video',
    'wbr',
  ];
	const zoneMappings = {
	  "Dateline Standard Time": "Etc/GMT+12",
	  "UTC-11": "Etc/GMT+11",
	  "Aleutian Standard Time": "America/Adak",
	  "Hawaiian Standard Time": "Pacific/Honolulu",
	  "Marquesas Standard Time": "Pacific/Marquesas",
	  "Alaskan Standard Time": "America/Anchorage",
	  "UTC-09": "Etc/GMT+9",
	  "Pacific Standard Time (Mexico)": "America/Tijuana",
	  "UTC-08": "Etc/GMT+8",
	  "Pacific Standard Time": "America/Los_Angeles",
	  "US Mountain Standard Time": "America/Phoenix",
	  "Mountain Standard Time (Mexico)": "America/Chihuahua",
	  "Mountain Standard Time": "America/Denver",
	  "Central America Standard Time": "America/Guatemala",
	  "Central Standard Time": "America/Chicago",
	  "Easter Island Standard Time": "Pacific/Easter",
	  "Central Standard Time (Mexico)": "America/Mexico_City",
	  "Canada Central Standard Time": "America/Regina",
	  "SA Pacific Standard Time": "America/Bogota",
	  "Eastern Standard Time (Mexico)": "America/Cancun",
	  "Eastern Standard Time": "America/New_York",
	  "Haiti Standard Time": "America/Port-au-Prince",
	  "Cuba Standard Time": "America/Havana",
	  "US Eastern Standard Time": "America/Indianapolis",
	  "Turks And Caicos Standard Time": "America/Grand_Turk",
	  "Paraguay Standard Time": "America/Asuncion",
	  "Atlantic Standard Time": "America/Halifax",
	  "Venezuela Standard Time": "America/Caracas",
	  "Central Brazilian Standard Time": "America/Cuiaba",
	  "SA Western Standard Time": "America/La_Paz",
	  "Pacific SA Standard Time": "America/Santiago",
	  "Newfoundland Standard Time": "America/St_Johns",
	  "Tocantins Standard Time": "America/Araguaina",
	  "E. South America Standard Time": "America/Sao_Paulo",
	  "SA Eastern Standard Time": "America/Cayenne",
	  "Argentina Standard Time": "America/Buenos_Aires",
	  "Greenland Standard Time": "America/Godthab",
	  "Montevideo Standard Time": "America/Montevideo",
	  "Magallanes Standard Time": "America/Punta_Arenas",
	  "Saint Pierre Standard Time": "America/Miquelon",
	  "Bahia Standard Time": "America/Bahia",
	  "UTC-02": "Etc/GMT+2",
	  "Azores Standard Time": "Atlantic/Azores",
	  "Cape Verde Standard Time": "Atlantic/Cape_Verde",
	  "UTC": "Etc/GMT",
	  "GMT Standard Time": "Europe/London",
	  "Greenwich Standard Time": "Atlantic/Reykjavik",
	  "Sao Tome Standard Time": "Africa/Sao_Tome",
	  "Morocco Standard Time": "Africa/Casablanca",
	  "W. Europe Standard Time": "Europe/Berlin",
	  "Central Europe Standard Time": "Europe/Budapest",
	  "Romance Standard Time": "Europe/Paris",
	  "Central European Standard Time": "Europe/Warsaw",
	  "W. Central Africa Standard Time": "Africa/Lagos",
	  "Jordan Standard Time": "Asia/Amman",
	  "GTB Standard Time": "Europe/Bucharest",
	  "Middle East Standard Time": "Asia/Beirut",
	  "Egypt Standard Time": "Africa/Cairo",
	  "E. Europe Standard Time": "Europe/Chisinau",
	  "Syria Standard Time": "Asia/Damascus",
	  "West Bank Standard Time": "Asia/Hebron",
	  "South Africa Standard Time": "Africa/Johannesburg",
	  "FLE Standard Time": "Europe/Kiev",
	  "Israel Standard Time": "Asia/Jerusalem",
	  "Kaliningrad Standard Time": "Europe/Kaliningrad",
	  "Sudan Standard Time": "Africa/Khartoum",
	  "Libya Standard Time": "Africa/Tripoli",
	  "Namibia Standard Time": "Africa/Windhoek",
	  "Arabic Standard Time": "Asia/Baghdad",
	  "Turkey Standard Time": "Europe/Istanbul",
	  "Arab Standard Time": "Asia/Riyadh",
	  "Belarus Standard Time": "Europe/Minsk",
	  "Russian Standard Time": "Europe/Moscow",
	  "E. Africa Standard Time": "Africa/Nairobi",
	  "Iran Standard Time": "Asia/Tehran",
	  "Arabian Standard Time": "Asia/Dubai",
	  "Astrakhan Standard Time": "Europe/Astrakhan",
	  "Azerbaijan Standard Time": "Asia/Baku",
	  "Russia Time Zone 3": "Europe/Samara",
	  "Mauritius Standard Time": "Indian/Mauritius",
	  "Saratov Standard Time": "Europe/Saratov",
	  "Georgian Standard Time": "Asia/Tbilisi",
	  "Volgograd Standard Time": "Europe/Volgograd",
	  "Caucasus Standard Time": "Asia/Yerevan",
	  "Afghanistan Standard Time": "Asia/Kabul",
	  "West Asia Standard Time": "Asia/Tashkent",
	  "Ekaterinburg Standard Time": "Asia/Yekaterinburg",
	  "Pakistan Standard Time": "Asia/Karachi",
	  "Qyzylorda Standard Time": "Asia/Qyzylorda",
	  "India Standard Time": "Asia/Calcutta",
	  "Sri Lanka Standard Time": "Asia/Colombo",
	  "Nepal Standard Time": "Asia/Katmandu",
	  "Central Asia Standard Time": "Asia/Almaty",
	  "Bangladesh Standard Time": "Asia/Dhaka",
	  "Omsk Standard Time": "Asia/Omsk",
	  "Myanmar Standard Time": "Asia/Rangoon",
	  "SE Asia Standard Time": "Asia/Bangkok",
	  "Altai Standard Time": "Asia/Barnaul",
	  "W. Mongolia Standard Time": "Asia/Hovd",
	  "North Asia Standard Time": "Asia/Krasnoyarsk",
	  "N. Central Asia Standard Time": "Asia/Novosibirsk",
	  "Tomsk Standard Time": "Asia/Tomsk",
	  "China Standard Time": "Asia/Shanghai",
	  "North Asia East Standard Time": "Asia/Irkutsk",
	  "Singapore Standard Time": "Asia/Singapore",
	  "W. Australia Standard Time": "Australia/Perth",
	  "Taipei Standard Time": "Asia/Taipei",
	  "Ulaanbaatar Standard Time": "Asia/Ulaanbaatar",
	  "Aus Central W. Standard Time": "Australia/Eucla",
	  "Transbaikal Standard Time": "Asia/Chita",
	  "Tokyo Standard Time": "Asia/Tokyo",
	  "North Korea Standard Time": "Asia/Pyongyang",
	  "Korea Standard Time": "Asia/Seoul",
	  "Yakutsk Standard Time": "Asia/Yakutsk",
	  "Cen. Australia Standard Time": "Australia/Adelaide",
	  "AUS Central Standard Time": "Australia/Darwin",
	  "E. Australia Standard Time": "Australia/Brisbane",
	  "AUS Eastern Standard Time": "Australia/Sydney",
	  "West Pacific Standard Time": "Pacific/Port_Moresby",
	  "Tasmania Standard Time": "Australia/Hobart",
	  "Vladivostok Standard Time": "Asia/Vladivostok",
	  "Lord Howe Standard Time": "Australia/Lord_Howe",
	  "Bougainville Standard Time": "Pacific/Bougainville",
	  "Russia Time Zone 10": "Asia/Srednekolymsk",
	  "Magadan Standard Time": "Asia/Magadan",
	  "Norfolk Standard Time": "Pacific/Norfolk",
	  "Sakhalin Standard Time": "Asia/Sakhalin",
	  "Central Pacific Standard Time": "Pacific/Guadalcanal",
	  "Russia Time Zone 11": "Asia/Kamchatka",
	  "New Zealand Standard Time": "Pacific/Auckland",
	  "UTC+12": "Etc/GMT-12",
	  "Fiji Standard Time": "Pacific/Fiji",
	  "Chatham Islands Standard Time": "Pacific/Chatham",
	  "UTC+13": "Etc/GMT-13",
	  "Tonga Standard Time": "Pacific/Tongatapu",
	  "Samoa Standard Time": "Pacific/Apia",
	  "Line Islands Standard Time": "Pacific/Kiritimati"
	};
  // var apiroot = '/v1/api';
  var apiroot = 'https://aliconnect.nl/v1/api';
  const pageHtml = `<!DOCTYPE HTML><html><head><link href="${apiroot}/css/web_debug.css" rel="stylesheet"/><script src="${apiroot}/js/aim_debug.js" libraries="web"></script></head><body></body></html>`;

  minimist = function (args, opts){
    if (!opts) opts = {};
    var flags = { bools: {}, strings: {}, unknownFn: null };
    if (typeof opts['unknown'] === 'function'){
      flags.unknownFn = opts['unknown'];
    }
    if (typeof opts['boolean'] === 'boolean' && opts['boolean']){
      flags.allBools = true;
    } else {
      [].concat(opts['boolean']).filter(Boolean).forEach(function (key){
        flags.bools[key] = true;
      });
    }
    var aliases = {};
    Object.keys(opts.alias || {}).forEach(function (key){
      aliases[key] = [].concat(opts.alias[key]);
      aliases[key].forEach(function (x){
        aliases[x] = [key].concat(aliases[key].filter(function (y){
          return x !== y;
        }));
      });
    });
    [].concat(opts.string).filter(Boolean).forEach(function (key){
      flags.strings[key] = true;
      if (aliases[key]){
        flags.strings[aliases[key]] = true;
      }
    });
    var defaults = opts['default'] || {};
    // var argv = { _: [] };
    var argv = { };
    // var argv = {};//{ _: [] };
    Object.keys(flags.bools).forEach(function (key){
      setArg(key, defaults[key] === undefined ? false : defaults[key]);
    });
    var notFlags = [];
    if (args.indexOf('--') !== -1){
      notFlags = args.slice(args.indexOf('--') + 1);
      args = args.slice(0, args.indexOf('--'));
    }
    function argDefined(key, arg){
      return (flags.allBools && /^--[^=]+$/.test(arg)) ||
      flags.strings[key] || flags.bools[key] || aliases[key];
    }
    function setArg(key, val, arg){
      if (arg && flags.unknownFn && !argDefined(key, arg)){
        if (flags.unknownFn(arg) === false) return;
      }
      var value = !flags.strings[key] && !isNaN(val)
      ? Number(val) : val
      ;
      setKey(argv, key.split('-'), value);
      (aliases[key] || []).forEach(function (x){
        setKey(argv, x.split('-'), value);
      });
    }
    function setKey(obj, keys, value){
      var o = obj;
      keys.slice(0, -1).forEach(function (key){
        if (o[key] === undefined) o[key] = {};
        o = o[key];
      });
      var key = keys[keys.length - 1];
      if (o[key] === undefined || flags.bools[key] || typeof o[key] === 'boolean'){
        o[key] = value;
      }
      else if (Array.isArray(o[key])){ o[key].push(value); }
      else {
        o[key] = [o[key], value];
      }
    }
    function aliasIsBoolean(key){
      return aliases[key].some(function (x){
        return flags.bools[x];
      });
    }
    for (var i = 0; i < args.length; i++){
      var arg = args[i];
      if (/^--.+=/.test(arg)){
        // Using [\s\S] instead of . because js doesn't support the
        // 'dotall' regex modifier. See:
        // http://stackoverflow.com/a/1068308/13216
        var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
        var key = m[1];
        var value = m[2];
        if (flags.bools[key]){
          value = value !== 'false';
        }
        setArg(key, value, arg);
      }
      else if (/^--no-.+/.test(arg)){
        var key = arg.match(/^--no-(.+)/)[1];
        setArg(key, false, arg);
      }
      else if (/^--.+/.test(arg)){
        var key = arg.match(/^--(.+)/)[1];
        var next = args[i + 1];
        if (next !== undefined && !/^-/.test(next)
        && !flags.bools[key]
        && !flags.allBools
        && (aliases[key] ? !aliasIsBoolean(key) : true)){
          setArg(key, next, arg);
          i++;
        }
        else if (/^(true|false)$/.test(next)){
          setArg(key, next === 'true', arg);
          i++;
        }
        else {
          setArg(key, flags.strings[key] ? '' : true, arg);
        }
      }
      else if (/^-[^-]+/.test(arg)){
        var letters = arg.slice(1, -1).split('');
        var broken = false;
        for (var j = 0; j < letters.length; j++){
          var next = arg.slice(j + 2);
          if (next === '-'){
            setArg(letters[j], next, arg);
            continue;
          }
          if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)){
            setArg(letters[j], next.split('=')[1], arg);
            broken = true;
            break;
          }
          if (/[A-Za-z]/.test(letters[j])
          && /-?\d+(\.\d*)?(event-?\d+)?$/.test(next)){
            setArg(letters[j], next, arg);
            broken = true;
            break;
          }
          if (letters[j + 1] && letters[j + 1].match(/\W/)){
            setArg(letters[j], arg.slice(j + 2), arg);
            broken = true;
            break;
          }
          else {
            setArg(letters[j], flags.strings[letters[j]] ? '' : true, arg);
          }
        }
        var key = arg.slice(-1)[0];
        if (!broken && key !== '-'){
          if (args[i + 1] && !/^(-|--)[^-]/.test(args[i + 1])
          && !flags.bools[key]
          && (aliases[key] ? !aliasIsBoolean(key) : true)){
            setArg(key, args[i + 1], arg);
            i++;
          }
          else if (args[i + 1] && /true|false/.test(args[i + 1])){
            setArg(key, args[i + 1] === 'true', arg);
            i++;
          }
          else {
            setArg(key, flags.strings[key] ? '' : true, arg);
          }
        }
      }
      else {
        if (!flags.unknownFn || flags.unknownFn(arg) !== false){
          // argv._.push(
          // 	flags.strings['_'] || isNaN(arg) ? arg : Number(arg)
          // );
        }
        if (opts.stopEarly){
          argv._.push.apply(argv._, args.slice(i + 1));
          break;
        }
      }
    }
    Object.keys(defaults).forEach(function (key){
      if (!hasKey(argv, key.split('.'))){
        setKey(argv, key.split('.'), defaults[key]);
        (aliases[key] || []).forEach(function (x){
          setKey(argv, x.split('.'), defaults[key]);
        });
      }
    });
    if (opts['--']){
      argv['--'] = new Array();
      notFlags.forEach(function (key){
        argv['--'].push(key);
      });
    }
    else {
      notFlags.forEach(function (key){
        argv._.push(key);
      });
    }
    return argv;
  };
  function createParam (param, splitter){
    var result = {};
    if (param) param.split(splitter || '&').forEach(function (val){
      var val = val.split('='), name = val.shift(), val = val.shift();
      result[name] = val ? decodeURIComponent(val) : val;
    });
    return result;
  };
  function dateText(date){
    const dateTime = new Date(date);
    dateTime.setHours(0,0,0,0);
    const now = new Date();
    now.setHours(0,0,0,0);
    const days = Math.round((dateTime.valueOf() - now.valueOf())/1000/60/60/24);
    if (days<-730) return '2 years ago';
    if (days<-365) return '1 year ago';
    if (days<-60) return '2 months ago';
    if (days<-30) return '1 month ago';
    if (days<-14) return '2 weeks ago';
    if (days<-7) return '1 weeks ago';
    if (days<-2) return 'last week';
    if (days<-1) return 'yesterday';
    if (days<0) return 'today';
    if (days>730) return 'after 2 years';
    if (days>365) return 'after 1 year';
    if (days>60) return 'after 2 months';
    if (days>30) return 'after 1 month';
    if (days>14) return 'over 2 weeks';
    if (days>7) return 'next week';
    if (days>1) return 'day after tomorrow';
    if (days>0) return 'tomorrow';
  }
  function handleEvent(event){
    if (event){
      if (event.body){
        console.error('handleEvent', event.body);//JSON.parse(event.target.responseText));
        // console.error('CONNECT API', connectState, event.body);
        $.extend(event.body);
        // Ophalen localhost web applicatie config file
        if ($.config_url){
          let res = new XMLHttpRequest();
          res.open('get', $.config_url);
          res.onload = event => $.url('https://aliconnect.nl/v1beta1/api?request_type=yamlToJson', event.target.response).post().then(handleEvent);
          res.send();
          $.config_url = null;
          return;
        }
        $().emit('config');
        new $.WebsocketRequest();
      }
      if (event.type === 'connect' && event.socket_id && $.temp.cookie.id_token){
        uploadState({ type: 'focus' });
      }
    }
    connectState++;
    if (connectState === 2){
      if (window.addEventListener){
        window.addEventListener('focus', uploadState);
        window.addEventListener('blur', uploadState);
      }
      $.auth.init();
      if ($.webinit){
        $.webinit();
      }
    }
  };
  function setPrototype(fn, prototype, properties){
    Object.assign(fn.prototype, prototype);
    for (let [name, property] of Object.entries(properties)){
      Object.defineProperty(fn.prototype, name, property);
    }
  }
  function uploadState(event){
    $.url('https://login.aliconnect.nl/api')
    .path('/oauth')
    .query({
      response_type: 'socket_id',
      state: event.type,
      socket_id: $.WebsocketClient.socket_id,
      id_token: $.temp.cookie.id_token,
      // origin: document.location.href,
    })
    .get();
  };
  function validSchemaName(schemaName){
    if (!schemaName) throw 'invalid schemaname';
    // TODO: Location illegal schema name
    return String(schemaName)
    .replace(/^\d|\.|\s|-|\(|\)|,/g,'')
    .replace(/\bLocation\b/,'Loc')
  }
  function aDate(d) {
    if (!d) return new Date();
    var resdate = new Date(d);
    //// //console.debug('new date 1', d, resdate.toLocaleString());
    if (d.length === 10) resdate.setTime(resdate.getTime() + resdate.getTimezoneOffset() * 60 * 1000);
    //// //console.debug('new date 2', d, resdate.toLocaleString());
    //// //console.debug(['new date 2', d, res.toDateTimeStr(), res.toLocaleString(), res.toGMTString(), res.toISOString(), res.toLocal(), res.getTimezoneOffset()].join(';'));
    return resdate;
  }
  function authSubmit(event) {
    $()
    .url(AUTHORIZATION_URL + document.location.search)
    .post(event.target)
    .then(checkResponse);
    return false;
  }
  function checkPath(event) {
    let elem;
    if (elem = event.path.find(elem => elem.item)) {
      event.itemElement = elem;
      event.item = event.itemElement.item;
    }
  }
  function checkkey(event) {
    const path = $.temp.clickEvent ? [...$.temp.clickEvent.path] : [];
    path.push($);
    path.forEach(elem => {
      // const onkey = elem['on' + event.type];
      // // //console.log(event, elem, onkey);
      // if (onkey) {
      // 	onkey.call(elem, event);
      // }
      const keys = elem[event.type];
      if (keys && keys[event.keyPressed]) {
        keys[event.keyPressed].call(elem, event);
      }
    })
  }
  function dateTime0 (date, days) {
    date = new Date(date);
    date.setHours(0,0,0,0);
    if (days) {
      date.setDate(date.getDate() + days);
    }
    return date;
  }
  function eventKeyState (event) {
    return event ? (event.shiftKey && event.ctrlKey ? 'link' : (event.shiftKey ? 'move' : (event.ctrlKey ? 'copy' : 'default'))) : 'default';
  }
  function focusSection(event, offset) {
    if (event.clickEvent && document.activeElement === document.body) {
      const currentSection = event.clickEvent.path.find(elem => elem.tagName === 'SECTION');
      const children = [...document.body.getElementsByTagName('SECTION')];
      const index = children.indexOf(currentSection);
      const nextSection = children[index + offset];
      if (nextSection) {
        nextSection.click();
      }
      event.preventDefault();
    }
  }
  function importXlsFile(file) {
    // new $.HttpRequest($.config.$, '/')
    const basePath = document.location.pathname.split(/\/(api|docs|om)/)[0];
    const sub = $.access.sub;
    const path = `/${sub}/config.json`;
    const config = {app:{nav:{items:{List:{items:{}}}}}};
    // //console.error(importXlsFile);
    // //console.error('IMPORT XLS', XLSX, file.name);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = event => {
      //console.error(XLSX, jszip);
      const components = config.components = config.components || {};
      const schemas = components.schemas = components.schemas || {};
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      function importSheet(sheetname) {
        const wbsheet = workbook.Sheets[sheetname];
        const schema = schemas[sheetname] = schemas[sheetname] || {};
        const properties = schema.properties = schema.properties || {};
        // const $.temp = wbsheet['!$.temp'].split(':').pop();
        const [start,end] = wbsheet['!ref'].split(':');
        const [end_colstr] = end.match(/[A-Z]+/);
        const col_index = XLSX.utils.decode_col(end_colstr);
        const types = {
          s: 'string',
        };
        for (var c=0;c<=col_index;c++) {
          var cellstr = XLSX.utils.encode_cell({c:c,r:0});
          var cell = wbsheet[cellstr];
          if (!cell || !cell.v) {
            break;
          }
          properties[cell.v] = properties[cell.v] || { type: types[cell.t] || 'string' }
          // //console.log(cellstr, cell);
        }
        // var irows = Number($.temp.match(/\d+/g));
        // //console.log(sheetname, wbsheet, ref, irows);
      }
      for (let sheetname in workbook.Sheets) {
        importSheet(sheetname);
        config.app.nav.items.List.items[sheetname] = {
          title: sheetname,
          href: '#/' + sheetname,
        }
      }
      //console.log(config);
      // $().url($.config.$).post('/').input(config).res(event => {
      // 	//console.log(event.target.responseText);
      // 	// $.SampleWindow('/om/?prompt=config_edit');
      // }).send();
      new $.HttpRequest($.config.$, 'post', '/').query({append: true}).input(config).send().onload = event => {
        //console.log(event.target.responseText);
      };
    }
  }
  function getIanaFromWindows(windowsZoneName) {
    return zoneMappings[windowsZoneName] || "Etc/GMT";
  }
  function _gotDevices(mediaDevices) {
    select.innerHTML = '';
    select.appendChild(document.createElement('option'));
    let count = 1;
    mediaDevices.forEach(mediaDevice => {
      if (mediaDevice.kind === 'videoinput') {
        const option = document.createElement('option');
        option.value = mediaDevice.deviceId;
        const label = mediaDevice.label || `Camera ${count++}`;
        const textNode = document.createTextNode(label);
        option.appendChild(textNode);
        select.appendChild(option);
      }
    });
  }
  function handleData(targetItem, event) {
    if(document.activeElement.isContentEditable || ['INPUT'].includes(document.activeElement.tagName)) {
      return;
    }
    console.log('web.js.handleData', event, event.view === window);
    if (targetItem) {
      console.log(targetItem);
      const eventData = event.dataTransfer || event.clipboardData;
      const type = $.temp.keyEvent && $.temp.keyEvent.shiftKey ? 'link' : event.type;
      let data;
      if (eventData.types.includes('Files')) {
        event.preventDefault();
        event.stopPropagation();
        const files = [...eventData.files];
        const xls = files.find(file => file.name.includes('.xls'));
        if (xls) {
          return importXlsFile(xls);
        }
        files.forEach(targetItem.elemFiles.appendFile)
      } else if (data = eventData.getData("aim/items")) {
        data = JSON.parse(data);
        data.type = data.type || (event.ctrlKey ? 'copy' : 'cut');
        data.target = targetItem.tag;
        if (data.value) {
          const targetItem = Item.get(data.target);
          console.log(data, targetItem, data.value);
          if (data.type === 'cut') {
            const parent = targetItem;
            // return;
            // data.value.forEach(item => targetItem.append($(item.tag)));
            data.value.forEach(item => $.link({
              name: 'Master',
              item: item,
              to: targetItem,
              current: item.Master,
              index: 99999,
              action: 'move',
            }));
          } else if (data.type === 'copy') {
            const items = [];
            (async function copy (item) {
              if (item) items.push(item);
              const source = data.value.shift();
              if (source) return await $().copyFrom(source, targetItem).then(copy);
              item = items.shift();
              //console.log(item, $().tree());
              $().tree().setFocusElement(item.elemTreeLi.elem);
              item.edit();
            })();
          }
        }
        // TODO: files cut copy uitwerken
        if (data.files) {
          if (type === 'cut') {
            data.files.forEach(ofile => {console.warn('cut', ofile);} );
          } else if (type === 'copy') {
            data.files.forEach(ofile => {console.warn('copy', ofile);} );
          }
        }
        event.preventDefault();
        event.stopPropagation();
      } else if (data = eventData.getData("text/html")) {
        // //console.debug('HTML', html);
        // importeer html img if pasted
        var tmpStr = data.match("<!--StartFragment-->(.*)<!--EndFragment-->");
        var fragment = tmpStr[1];
        // //console.debug('FRAGMENT', fragment);
        if (fragment.substr(0, 3) == '<a>') {
          console.debug('REF', fragment);
        }
        else if (fragment.substr(0, 5) == '<img ') {
          console.debug('IMG', fragment);
        }
        //return;
      } else if (data = eventData.getData("text")) {
        if (data.substr(0, 4) == 'http') {
          //console.debug('URL', data);
        }
      }
    }
    $.clipboard.dragItems = [];
  }
  // function initConfigCss() {
  //   // const config = $.config || {};
  //   // const css = config.css || {};
  //   // for (let [name, value] of Object.entries(css)) {
  //   //   new $.css(name, value);
  //   // }
  // }
  function loadStoredCss() {
    const css = JSON.parse(window.localStorage.getItem('css')) || {};
    for (let [id, param] of Object.entries(css)) {
      let selector = id === '_body' ? document.body : document.getElementById(id);
      if (selector) {
        selector.style.cssText += Object.entries(param).map(entry => entry.join(':')).join(';');
      }
    }
  }
  function onkey(event) {
    window.event = event;
    event.keyPressed = [
      event.ctrlKey ? 'ctrl_' : '',
      event.shiftKey ? 'shift_' : '',
      event.altKey ? 'alt_' : '',
      event.code,
    ].join('');
    $.temp.keyEvent = null;
    clearTimeout($.temp.keydownTimeout);
    clearTimeout($.temp.keyupTimeout);
    clearTimeout($.temp.keybufferTimeout);
    $.temp.keybufferTimeout = setTimeout(() => $.temp.keybuffer = [], 300);
    $.temp.keybuffer = $.temp.keybuffer || [];
    $.temp.keybuffer.push(event.key);
    event.keybuffer = $.temp.keybuffer;
    // if (document.activeElement !== document.body) {
    // 	event.keyPressed += '_edit';
    // }
    // 	key = key.replace('Arrow', '').replace('Escape', 'Esc');
    checkPath(event);
    if ($.temp.clickEvent) {
      event.itemElement = event.itemElement || $.temp.clickEvent.itemElement;
      event.item = event.item || $.temp.clickEvent.item;
      event.clickEvent = $.temp.clickEvent;
    }
  }
  function pageClose() {
    colpage.innerText = '';
    $.history.replaceUrl(document.location.href.replace(/\/id\/([^\?]*)/, ''));
  }
  function stopMediaTracks(stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  function swipedetect(el, callback) {
    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 150, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 300, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir) { };
    touchsurface.addEventListener('touchstart', function(event) {
      var touchobj = event.changedTouches[0],
      swipedir = 'none',
      dist = 0,
      startX = touchobj.pageX,
      startY = touchobj.pageY,
      startTime = new Date().getTime(); // record time when finger first makes contact with surface
      event.preventDefault();
    }, false);
    touchsurface.addEventListener('touchmove', function(event) {
      event.preventDefault(); // pre scrolling when inside DIV
    }, false);
    touchsurface.addEventListener('touchend', function(event) {
      var touchobj = event.changedTouches[0],
      distX = touchobj.pageX - startX, // get horizontal dist traveled by finger while in contact with surface
      distY = touchobj.pageY - startY, // get vertical dist traveled by finger while in contact with surface
      elapsedTime = new Date().getTime() - startTime; // get time elapsed
      if (elapsedTime <= allowedTime) { // first condition for awipe met
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
          swipedir = (distX < 0) ? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
        }
        else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
          swipedir = (distY < 0) ? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
        }
      }
      handleswipe(swipedir);
      event.preventDefault();
    }, false);
  }
  function getId(id){
    return Number(id.split('-').shift());
  }
  function getUid(id){
    return id.replace(/^\d+-/,'')
  }
  function replaceOutsideQuotes(codeString, callback, pre = '<span class=hl-string>', post = '</span>') {
    const a = codeString.split(/((?<![\\])['"`])((?:.(?!(?<![\\])\1))*.?)\1/);
    return a.map((s,i) => i%3===0 ? (callback ? callback(s) : s) : i%3===2 ? `${a[i-1]}${pre}${s}${post}${a[i-1]}` : '').join('');
  }
  function url_string(s) {
    return s.replace(/%2F/g, '/');
  }

  Object.assign(Array.prototype, {
    unique() {
      return this.filter((e,i,arr) => arr.indexOf(e) === i)
    },
    // delete(selector){
    //   return this.splice(this.indexOf(selector), 1);
    // },
  });
  Object.assign(Date.prototype, {
    adddays(i){
      var day = new Date(this);
      day.setDate(this.getDate() + i);
      return day;
    },
    getWeek(){
      var d = new Date(+this);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 4 - (d.getDay() || 7));
      return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
    },
    getWeekday(){
      return (this.getDay() + 6) % 7;
    },
    monthDays(){
      var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
      return d.getDate();
    },
    toDateText(full){
      // return this.toDateString();
      let res = '';
      if (this){
        const now = new Date();
        let dagen = Math.ceil((this.getTime() - now.getTime()) / 24 / 60 / 60 / 1000);
        let dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saterday', 'Sunday'];
        let monthNames = ['Januari', 'Februari', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];
        const time = this.toLocaleTimeString();
        return [
          __(dagen===0 ? 'Today' : dagen === -1 ? 'Yesterday' : dayNames[this.getDay()-1]),
          this.getDate(),
          __(monthNames[this.getMonth()-1]),
          this.getFullYear(),
          time === '00:00:00' ? '' : time.substr(0,5),
          __('week'),
          this.getWeek(),
        ].filter(Boolean).join(' ');
        // res += '-'+this.toISOString();
        //var t = this.toLocaleTimeString().substr(0, 5);
        //if (t != '00:00') res += ' ' + t;
      }
      return res;
    },
    toDateTimeText(full){
      var res = this.toDateText();
      if (this.getHours() || this.getMinutes()) res += this.toLocaleTimeString().substr(0, 5);
    },
    toDateTimeStr(length){
      //    return this.getDate().pad(2) + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getFullYear() + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + '.' + this.getMilliseconds().pad(3);
      var s = this.getFullYear() + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getDate().pad(2);
      if (this.getHours() != 0 && this.getMinutes() != 0 && this.getSeconds() != 0)
      s += ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2); + '.' + this.getMilliseconds().pad(3);
      return s.substring(0, length);
    },
    toDateTimeStringT(){
      //    return this.getDate().pad(2) + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getFullYear() + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + '.' + this.getMilliseconds().pad(3);
      return this.getFullYear() + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getDate().pad(2) + 'T' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + '.' + this.getMilliseconds().pad(3);
    },
    toDateTimeString(){
      //    return this.getDate().pad(2) + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getFullYear() + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + '.' + this.getMilliseconds().pad(3);
      return this.getFullYear() + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getDate().pad(2) + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + '.' + this.getMilliseconds().pad(3);
    },
    toLocal(){
      this.setTime(this.getTime() - this.getTimezoneOffset() * 60 * 1000);
      return this;
    },
    toLocalDBString(){
      this.setTime(this.getTime() - this.getTimezoneOffset() * 60 * 1000);
      return this.toISOString().replace(/T|Z/g, ' ');
    },
    toShortStr(){
      return this.getDate().pad(2) + '-' + (this.getMonth() + 1).pad(2) + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2);
    },
    toWeekDay(){
      return this.getFullYear() + '-' + this.getWeek() + ' ' + day[this.getDay()];
    },
  });
  Object.assign(Number.prototype, {
    formatMoney(c, d, t){
      var n = this,
      c = isNaN(c = Math.abs(c)) ? 2 : c,
      d = d == undefined ? ', ' : d,
      t = t == undefined ? '.' : t,
      s = n < 0 ? '-' : '',
      i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '',
      j = (j = i.length) > 3 ? j % 3 : 0;
      return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
    },
    pad(size){
      var s = String(this);
      while (s.length < (size || 2)){
        s = '0' + s;
      }
      return s;
    },
  });
  Object.assign(String.prototype, {
    capitalize(){
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    stripTags() {
      return this.replace(/(<([^>]+)>)/gi, "");
    },
  });
  Object.assign(JSON, {
    stringifyReplacer (data) {
      const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null){
            if (seen.has(value)){
              return;
            }
            seen.add(value);
          }
          return value;
        };
      };
      return JSON.stringify(data, getCircularReplacer());
    },
  });
  Object.assign(Object, {

  });
  YAML = {
    stringify(selector) {
      return JSON.stringify(selector, null, 2)
      .replace(/^\{|^  /gm, '')
      .replace(/,\n/gs, '\n')
      .replace(
        /\[(.*?)\]/gs, (s, p1) => p1
        .replace(/^(.*?)"(.*?)": "(.*?)"$/gm, '$1$2: $3')
        .replace(/^(.*?)"(.*?)":/gm, '$1$2:')
        .replace(/(.*?)\{(.*?)(\w+)/gs, '$1- $3')
        .replace(/^(.*?)"(.*?)"$/gm, '$1- "$2"')
      )
      .replace(/(\},|\}|\{|\])(?=\n|$)/gs, '')
      .replace(/"(.*?)":/g, '$1:')
      .replace(/: "(.+?)"/g, ': $1')
      .replace(/- "(.+?)"/g, '- $1')
      .replace(/^\s*\n/gms, '')
    },
  };

  __ = function(){
    const translate = $.temp.translate || new Map();
    // console.debug(arguments, translate);
    // return '';
    return [].concat(...arguments).map(text => {
      // console.log([text, translate[text]]);
      if (translate.has(text)) return translate.get(text);
      text = String(text||'').replace(/^\w/,v => v.toUpperCase()).replace(/([a-z])([A-Z])/g, (v,p1,p2) => p1+' '+p2.toLowerCase()).replace(/_/g, ' ');
      return text && translate.has(text) ? translate.get(text) : (text || '');
    }).join(' ');
  };
  Crypto = {
    base64_encode: function (obj){
      return this.btoajson(JSON.stringify(obj));
    },
    jwt_signature: function (base64_header, base64_payload, secret){
      var message = [base64_header, base64_payload].join('.');
      var signature = this.btoaToJson(CryptoJS.HmacSHA256(message, secret).toString(CryptoJS.enc.Base64));
      //var signature = this.btoaToJson(crypto.createHmac('sha256', secret).update(message).digest('base64'));//.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
      // console.debug("signature", base64_header, base64_payload, secret, signature);
      return signature;
    },
    jwt_encode: function (payload, secret){
      var base64_header = this.base64_encode({ typ: "JWT", alg: "sha256" });
      var base64_payload = this.base64_encode(payload);
      return [base64_header, base64_payload, this.jwt_signature(base64_header, base64_payload, secret)].join('.');
    },
    btoajson: function (s){
      return this.btoaToJson(btoa(s));
    },
    btoaToJson: function (s){
      return s.replace(
        /\+/g,
        '-'
      ).replace(
        /\=/g,
        ''
      ).replace(
        /\//g,
        "_"
      );
    },
    decodeId: function (Id){
      if (!Id) return {};
      var a = Id.split('.');
      return JSON.parse(atob(a[1] || a[0]));
    },
  };
  function Request(url){
    this.url(...arguments);
    // $.prototype.args.call(this, ...arguments);
  }
  Request.prototype = {
    delete(){
      this.method = 'delete';
      return this.http();
    },
    accept(selector){
      return this.headers('Accept', selector);
    },
    exec(){
      for ([key, value] of this.URL.searchParams) {
        // console.log(key, value);
        if (typeof $[key] === 'function'){
          // $.history.replaceUrl(new $().url().query(req.query).toString());
          // console.error('EXEC', key, value);
          return $[key].apply($, value ? value.split(', ') : []) || true;
        }
      };
      console.error('EXEC', this.URL.pathname);
      // return;
      const getPathname = path => {
        var [dummy, basePath, folder, sep, id] = path.match(/(.*?\/om|\/api|^)(\/.*?)(\/id\/|$)(.*)/);
        return [basePath, folder, sep, id];
      };
      var basePath, path, sep, id, newPath = [basePath, path, sep, id] = getPathname(this.URL.pathname);
      if (path && path !== '/') {
        var [root, tag, propertyName, attr] = path.match(/.*?\/(\w+\(\d+\))\/([\w_]+?)\((\.*?)\)/)||[];
        // console.log(tag, $.map.has(tag));
        const item = $.map.get(tag)||{};
        if (item[propertyName]) {
          return item[propertyName].apply(item, attr.split(','));
        }
        if ($().paths) {
          const paths = $().paths;
          // console.debug('this.paths2', [basePath, path, sep, id]);
          let replaceLocation = false;
          if (id) {
            replaceLocation = true;
            try {
              [id] = atob($.id = id.replace(/(\/.*)/, '')).match(/\/\w+\(.+?\)/);
              // console.error($(id));
              // dms.api(id).get().then(event => $('view').show(event.body));
              $(id).details().then(item => $('view').show(item));
            } catch (err){
              return console.error('Illegal requestPath.id', id, paths);
            }
          }
          const method = this.method || 'get';
          const folderTag = path.replace(/\(.*?\)/g,'()');
          let pathKey = Object.keys(paths).find(key => key.replace(/\(.*?\)/g,'()') === folderTag);
          let apiPath = paths[pathKey];
          if (apiPath && apiPath.get){
            replaceLocation = true;
            $().list([], path);
            if (this.URL.searchParams.has('$search') && !this.URL.searchParams.get('$search')){
              console.error('NO SEARCH');
              // return;
            }
            $.client.api(path).query(this.URL.searchParams.toString())
            .get().then(async event => {
              if (event.body){
                const items = event.body.value || await event.body.children;
                $().list(items);
              }
            });
          }
          if (replaceLocation && typeof document !== 'undefined'){
            if (document.location.protocol === 'file:'){
              var currentPath = getPathname(document.location.hash.substr(1));
              [basePath, path, sep, id] = currentPath.map((value,i) => newPath[i] || value);
              var replacePath = ['#', path, sep, id];
            } else {
              var currentPath = getPathname(document.location.pathname);
              var replacePath = currentPath.map((value,i) => newPath[i] || value);
            }
            const search = this.URL.searchParams.toString();
            var replacePath = replacePath.join('') + (search ? '?' + search : '');
            // console.debug(
            // 	currentPath.join(''),
            // 	replacePath,
            // );
            $.history.replaceUrl( replacePath);
          }
        }
        if (this.paths_){
          // console.debug(req.path, pathKey);
          var args = [];
          let pathKey = path.replace(/\((.+?)\)/g, '()');
          pathKey = Object.keys($.paths).find(key => key.replace(/\(([^\)]+)\)/g,'()') === pathKey);
          if (pathKey){
            const def = $.paths[pathKey][req.method.toLowerCase()] || $.paths[pathKey][req.method.toUpperCase()];
            console.error('pathKey', pathKey, def);
            if (!def){
              return console.error(req.method.toUpperCase(), req.toString(), 'Method not allowed');
            }
            if (req.search){
              req.search.forEach((value, key) => req.path = req.path.replace(key, value));
            }
            var args = path.match(/\(([^\)]+)\)/g);
            for (var i=0, arr = def.operationId.split(/\/|\./), name, obj; name = arr[i]; i++){
              var objName = name.split('(').shift();
              console.error('objName', objName, obj, window[objName]);
              var parentObj = obj ? obj : (window[objName] ? window : ( $.operations && $.operations[objName] ? $.operations : Item.items ));
              // console.error('objName', objName, parentObj, obj);
              console.error('parentObj', objName, parentObj);
              var nextArgument = args ? args.shift() : null;
              var param = nextArgument ? nextArgument.replace(/\(|\)/g, '').split(', ') : [];
              if (typeof parentObj[objName] === 'function'){
                obj = parentObj[objName](...param);
              } else {
                obj = parentObj[objName];
              }
            }
            if (obj){
              console.debug('obj', obj);
              return obj;
            }
          }
        }
      }
      return;
      return this;
    },
    filter(){
      return this.query('$filter', ...arguments);
    },
    get(){
      this.method='get';
      return this.http();
    },
    getPath (path){
      path = path || (this.URL ? this.URL.pathname : '');
      // console.debug([path])
      var [dummy, basePath, folder, sep, id] = path.match(/(.*?\/om|\/api|^)(\/.*?)(\/id\/|$)(.*)/) || [];
      return [basePath, folder, sep, id];
    },
    headers(selector, context){
      if (typeof selector === 'object'){
        Object.assign(this.URL.headers, selector)
      } else {
        this.URL.headers[selector] = context;
      }
      return this;
    },
    http(){
      return $.promise('http', (resolve,reject) => typeof XMLHttpRequest !== 'undefined' ? this.web(resolve,reject) : this.node(resolve,reject));
    },
    body(callback){
      this.promise.then(event => callback(event.body));
      return this;
    },
    item(callback){
      this.promise.then(event => callback(event.body));
      return this;
    },
    data(callback){
      this.promise.then(event => callback(JSON.parse(event.target.responseText)));
      return this;
    },
    input(param, formData){
      if (!param) {
        return this.input.data;
      } else if (param instanceof window.Element) {
        this.input.data = new FormData(param);
      } else if (param.elem instanceof window.Element) {
        this.input.data = new FormData(param.elem);
      } else if (param instanceof FormData || param instanceof File){
        this.input.data = param;
      } else if (param instanceof Event){
        param.preventDefault();
        this.input.data = new FormData(param.target);
        if (param.submitter){
          this.input.data.append(param.submitter.name, param.submitter.value);
        };
      } else if (param.constructor){
        console.log('param.constructor.name', param.constructor.name);
        if (['Object','Array'].includes(param.constructor.name)){
          if (formData) {
            this.input.data = new FormData();
            Object.entries(param).forEach(entry => this.input.data.append(...entry));
          } else {
            this.headers('Content-Type', 'application/json');
            this.input.data = JSON.stringifyReplacer(param);
          }
        } else if (this[param.constructor.name]) {
          return this[param.constructor.name](param);
        } else {
          this.input.data = param;
          // console.error(param);
        }
      } else {
        this.input.data = param;
      }
      return this;
    },
    setmethod(method) {
      this.method = method;
      return this;
    },
    node(resolve){
      this.resolve = resolve;
      const input = this.input();
      if (input){
        this.headers('Content-Length',input.length);
      }
      const options = {
        method: this.method,
        hostname: this.URL.hostname,
        // path: req.pathname,//[req.basePath, req.path, req.searchParams.toString()].filter(Boolean).join(''),
        path: this.URL.pathname+'?'+this.URL.searchParams.toString(),
        headers: this.URL.headers,
        patch: input,
      };
      // console.debug(this.URL.headers);
      const url = this.URL.toString();
      // const handleTag = this.method + url;
      const protocol = url.split(':').shift();
      // const path = [req.params.basePath, req.params.path, req.params.search].filter(Boolean).join('');
      // const HTTP = window[protocol] = window[protocol] || require(protocol);
      const HTTP = require(protocol);
      // console.debug('NODE SEND');
      // let options = req.options;
      // { method: req.method, hostname:req.hostname, path: req.pathname, headers:req.headers};
      // console.debug('OPTIONS', req.options);
      const xhr = HTTP.request(options, event => {
        event.target = xhr;
        event.target.request = this;
        event.target.responseText = '';
        event.on('data', function (data){
          // console.debug('data', data);
          event.target.responseText += data;
        }).on('end', () => {
          // console.debug('end', Object.keys(xhr));
          event.status = event.statusCode;
          event.statusText = event.statusMessage;
          try {
            // console.debug(event.headers['content-type'], event.data);
            event.body = event.headers['content-type'].includes('application/json')
            ? JSON.parse(event.target.responseText)
            : event.target.responseText;
            event.response = event.body = event.body; // deprecated
          } catch(err){
            console.debug('ERROR JSON', err, event.target.responseText.substr(0,1000));
            // throw event.target.responseText;
          }
          resolve(event);
          // if (req.params.then){
          // 	req.params.then.call(event.target, event);
          // }
        });
      }).on('error', event => {
        console.debug('ERROR');
      });
      if (input){
        xhr.write(input);
      }
      xhr.startTime = new Date();
      xhr.end();
      return xhr;
    },
    onerror(event){
      console.msg('HTTP ON ERROR', event)
    },
    onload(event){
      ((event.body||{}).responses || [event]).forEach(res => res.body = $().evalData(res.body));
      if (this.statusElem){
        this.statusElem.remove();
      }
      if ($.config.debug && event.target.status < 400 || isModule){
        console.debug (
          // event.target.sender,
          this.method.toUpperCase(),
          this.URL.toString(),
          event.target.status,
          event.target.statusText,
          event.target.responseText.length, 'bytes',
          new Date().valueOf() - event.target.startTime.valueOf(), 'ms',
          // [event.target.responseText],
          // event.body || this.responseText,
        );
      }
    },
    onprogress(event){
      console.debug('onprogressssssssssssssssssssss', event.type, event);
      var msg = `%c${this.method} ${this.responseURL} ${this.status} (${this.statusText}) ${this.response.length} bytes ${new Date().valueOf() - this.startTime.valueOf()}ms`;
      if (this.elStatus){
        this.elStatus.innerText = decodeURIComponent(this.msg) + ' ' + event.loaded + 'Bytes';
      }
    },
    order(){
      return this.query('$order', ...arguments);
    },
    post(param){
      this.method = 'post';
      if (param){
        this.input(param, true);
      }
      return this.http();
    },
    patch(data){
      this.method='post';
      this.input(data);
      return this.http();
    },
    query(selector, context){
      this.url();
      if (selector instanceof Object){
        Object.entries(selector).forEach(entry => this.query(...entry));
      } else if (arguments.length === 1){
        const search = new URLSearchParams(selector);
        search.forEach((value,key) => this.URL.searchParams.set(key,value));
        // this.URL.search = selector;
      } else {
        this.URL.searchParams.set(...arguments);
      }
      return this;
    },
    setParam(name, value){
      this.props = this.props || [];
      this.props[name] = value;
    },
    servers(servers){
      if (servers && servers.length){
        url(servers[0].url);
      }
    },
    select(){
      return this.query('$select', ...arguments);
    },
    toString(){
      return this.URL.toString();
    },
    top(){
      return this.query('$top', ...arguments);
    },
    url(url){
      this.URL = this.URL || new URL(url || '', window.document ? document.location.href : 'https://aliconnect.nl');
      this.URL.headers = this.URL.headers || {};
      this.input.data = null;
    },
    web(resolve,reject){
      // console.log('AAAAA',resolve,reject,this);
      // this.resolve = resolve;
      const xhr = new XMLHttpRequest();
      xhr.request = this;
      const url = this.URL.toString();
      xhr.open(this.method, url);
      xhr.addEventListener('error', event => {
        console.error(`${xhr.method} ${xhr.src} ${xhr.status} ERROR ${xhr.statusText}`); // responseText is the server
      });
      xhr.addEventListener('load', event => {
        if (xhr.elLoadlog){
          xhr.elLoadlog.appendTag('span', '', new Date().toLocaleString() );
        }
        if (xhr.waitfolder){
          window.collist.setAttribute('wait', Number(window.collist.getAttribute('wait')) - 1);
        }
        if (xhr.status !== 200) {
          return reject(xhr.status);
          // throw 'FOUTJE';
          // reject('STATUS', xhr.status);
        }
        try {
          event.body = xhr.responseText;
          if (xhr.getResponseHeader('content-type').includes('application/json')){
            event.body = JSON.parse(event.body);
          }
        } catch(err){
          console.error('JSON error', xhr, xhr.responseText.substr(0,5000));
        }
        this.onload(event);
        resolve(event);
      });
      if ($.elem.statusbar) {
        xhr.total = xhr.loaded = 0;
        xhr.addEventListener('loadend', event => {
          $().progress(-xhr.loaded,-xhr.total);
        });
        if (xhr.upload) {
          xhr.addEventListener('progress', event => {
            const loaded = event.loaded - xhr.loaded;
            xhr.loaded = event.loaded;
            if (!xhr.total){
              $().progress(0, xhr.total = event.total);
            }
            $().progress(loaded)
          });
        }
      }
      Object.entries(this.URL.headers).forEach(entry => xhr.setRequestHeader(...entry));
      xhr.startTime = new Date();
      xhr.send(this.input.data);
      // return xhr;
      // $().status('main', url);
      // xhr.withCredentials = url.includes(document.location.origin);
      // xhr.setCharacterEncoding("UTF-8");
      // xhr.overrideMimeType('text/xml; charset=iso-8859-1');
    },
  };
  function WebSocket(){
    $(this).extend(...arguments);
    this.clients = new Map();
    // return this.connect(...arguments)
  }
  WebSocket.prototype = {
    connect(){
      return $.promise( 'connect', resolve => {
        this.setState('CONNECTING', `Connecting ${this.url}`);
        if (this.WebSocket) return resolve(this);
        this.resolve = resolve;
        // console.debug('connect', this.url);
        Object.assign(this.WebSocket = new window.WebSocket(this.url), {
          messages: [],
          requests: {},
          message: message => {
            // alert('SEND'+JSON.stringify(message));
            // console.debug('MESSAGE', ws.readyState, webSocket, this.ws, this);
            webSocket.send(message);
            if ($.wsServer && $.wsServer){
              $.wsServer.forEach(ws => ws.send(message))
            }
          },
          // onconnect: event => {
          // 	console.debug('onconnect', ws, event.target);
          // },
          onmessage: event => this.onmessage(event),
          onopen: event => {
            this.setState('OPEN');
            this.WebSocket.send(JSON.stringify({
              hostname: this.hostname || 'aliconnect',
              nonce: this.nonce,
              PHPSESSID: this.PHPSESSID,
              headers: $.authProvider.getAccessToken()
              ? {
                Authorization:'Bearer ' + $.authProvider.getAccessToken()
              }
              : null
            }));
            // console.debug('ONOPEN', event.target, webSocket, this.ws);
            // resolve(webSocket);
          },
          onclose: event => {
            this.setState('DISCONNECTED');
            this.WebSocket = null;
            setTimeout(() => this.connect(), 5000);
            // clearTimeout(this.pingTimeout);
            //this.pingTimeout=setTimeout(function, 1000);
            // $().emit('wscClose');
          },
          onerror: event => {
            this.setState('ERROR');
            // $().emit('wscClose');
          },
        });
        return this;
      })
    },
    login(access_token){
      return $.promise( 'Socket login', resolve => {
        // console.debug('WS LOGIN', access_token);
        this.resolve = resolve;
        if (!access_token || !this.WebSocket) return resolve(this);
        this.WebSocket.send(JSON.stringify({
          headers: {
            authorization: 'Bearer '+access_token,
          }
        }));
      })
    },
    message(par){
      console.error('$.WebsocketRequest', par);
      let message='';
      if (par){
        // let req=par;
        // const request = new $().url(...arguments);
        // const res = request.req.res;
        // message = request.message;
        console.error('WebsocketRequest', par);
        // return;
        // if (req.message_id){
        // 	message.message_id = req.message_id;
        // }
        // if (res){
        // 	message.id = req.id = req.id || new Date().valueOf();
        // 	$.WebsocketClient.requests[message.id] = res;
        // }
        message = JSON.stringify(par);
        $.WebsocketClient.messages.push(message);
        // req.device_id = $.temp.cookie ? $.temp.cookie.device_id : 'test_max';
      }
      if (!$.WebsocketClient.conn){
        // console.debug('STARTCONNECT',$.WebsocketClient);
        return $.WebsocketClient.connect();
      }
      // console.debug('SERVER REQUEST', message);
      if ($.WebsocketServer){
        // console.debug('SERVER REQUEST', message);
        $.WebsocketServer.clients.forEach(wsChild => wsChild.send(message));
      }
      if ($.WebsocketClient.conn.readyState !== 1){
        return;
      }
      while (message = $.WebsocketClient.messages.shift()){
        $.WebsocketClient.send(message);
      }
    },
    onmessage(event){
      // console.debug('ws.onmessage', event.data);
      const ws = event.target;
      // return;
      const config = this.config;
      let data = event.data;
      try {
        this.data = data = JSON.parse(data);
        // $().status('ws', `${new Date().toLocaleString()} ${data.from_id || ''}`);
      } catch (err){
        return $().status('wsm', 'error');
        // return console.error('ws.onmessage error', data.substr(0,1000));
      }
      if (data.body) {
        if (data.body.notify) {
          console.log('NOTIFY', window.document.hasFocus());
          if (!window.document.hasFocus()) {
            if ("Notification" in window) {
              if (Notification.permission === "granted") {
                // var notification = new Notification(...Object.values(data.body.notify));
                // notification.onclick = function(e) {
                //   window.focus();
                //   console.log('CLICKED', data.body.notify);
                // }
                new $().sw.showNotification(...Object.values(data.body.notify));
                // `test modified SW`, {
                //   body: `Bla Bla`,
                //   icon: 'https://aliconnect.nl/favicon.ico',
                //   image: 'https://aliconnect.nl/shared/265090/2020/07/09/5f0719fb8fa69.png',
                //   data: {
                //     url: document.location.href,
                //   },
                //   actions: [
                //     {
                //       action: 'new',
                //       title: 'New',
                //       // icon: 'https://aliconnect.nl/favicon.ico',
                //     },
                //     {
                //       action: 'open',
                //       title: 'Open',
                //       // icon: 'https://aliconnect.nl/favicon.ico',
                //     },
                //     // {
                //     //   action: 'gramophone-action',
                //     //   title: 'gramophone',
                //     //   icon: '/images/demos/action-3-128x128.png'
                //     // },
                //     // {
                //     //   action: 'atom-action',
                //     //   title: 'Atom',
                //     //   icon: '/images/demos/action-4-128x128.png'
                //     // }
                //   ]
                // });
              }
            }
          }
        }
        if (data.body.accept) {
          $().prompt('accept').accept_scope(data.body.accept.scopes, data.from_id);
          // console.log($().prompt('accept_scope'), $.map.get('accept_scope'));
        }
      }
      if (data.state === 'disconnect') {
        console.log('disconnect', $().aliconnector_id, data.from_id);
        // return;
        if ($().aliconnector_id === data.from_id) {
          $().status('aliconnector', 'offline');
          $().aliconnector_id = null;
        }
      }
      console.error(data);
      if (data.id_token) {
        const id = JSON.parse(atob(data.id_token.split('.')[1]));
        console.log(id, getId(id.sub), getUid(id.sub), $.authProvider.sub);
        if (getId(id.sub) !== getId($.authProvider.sub)) {
          return $().logout();
        }
      }
      // console.debug('ws.onmessage', data);
      if (this.clients.has(data.from_id)){
        console.log('REPLY FROM', data.from_id);
        this.clients.get(data.from_id)(data.body);
        this.clients.delete(data.from_id);
        return
      }
      if (data.from_id === $().aliconnector_id) {
        if (data.param) {
          if (data.param.filedownload) {
            console.log('filedownload', data.param.filedownload);
          }
          if (data.param.fileupload) {
            console.log('fileupload', data.param.fileupload);
          }
        }
      }
      if ('userstate' in data){
        console.debug('userstate', data);
        console.debug(Item.items, Item.items.filter(item => item.ID == data.sub));
        Item.items
        .filter(item => item.ID == data.sub)
        .forEach(item => item.elements.forEach(element => element.hasAttribute('userstate') ? element.setAttribute('userstate', data.userstate) : null))
      }
      if ('socket_id' in data){
        // console.warn(this, 'socket_id', data);
        this.socket_id = data.socket_id;
        let currentState = ws.state;
        if (data.socket_id === 1){
          this.setState('UNAUTHORIZED');
        } else if (data.payload){
          this.setState('AUTHORIZED');
          setState = (state) => {
            this.setState(state);
            // broadcast message with state
            // op ws server bijhouden alle connecties van gebruiker,
            // alleen als alle connecties offline zijn dan bericht sturen.
            // timeout opnemen in geval van omschakelen naar andere app
          }
          // window.addEventListener('focus', event => setTimeout(() => setState('focussed')))
          // window.addEventListener('blur', event => setTimeout(() => setState('online')))
        } else {
          this.setState('CONNECTED');
          // ws.login();
        }
        this.resolve(this);
        data.type = 'connect';
        if (currentState === 'CONNECTING'){
          $().emit('connect', data);
        }
        while (message = ws.messages.shift()){
          console.debug('MESSAGE', message);
          ws.send(message);
        }
      } else {
        $.handleData(data);
      }
      return;
      if (data.aliconnector) {
        console.log(data);
        if (data.aliconnector === 'online') {
          $().status('aliconnector', 'online');
          this.sendto($().aliconnector_id = data.from_id, { path: 'sign_in' });
        }
        // console.debug('aliconnector', data, data.from_id);
        // $.Aliconnector.state = 'online';
        // if (ws.infoElement){
        //   ws.infoElement.innerText = ws.state + '+';
        // }
      }
      // if ('reply' in data){
      //   $.Aliconnector.reply(data.reply);
      // }
      // if ('signin' in data){
      //   console.debug('SIGNIN', data);
      //   const sub = config.id ? config.id.sub : (config.access ? config.access.sub : null);
      //   if (data.access.sub != sub){
      //     $.clipboard.reload();
      //   }
      // }
      return;
      if (((data.ref && data.ref.itemsModified) || data.forward) && data.from_id && this.wsServer){
        this.wsServer.forward(data, event.data, ws);
      }
      // return;
    },
    reply(message){
      console.debug('repl', message);
      return this.sendto(this.data.from_id, {body: message});
    },
    send(message){
      // console.debug('send', message);
      if (!this.WebSocket) return;
      $().status('ws', 'ACTIVE');
      setTimeout(() => {
        $().status('ws', this.state);
      },100);
      message = JSON.stringifyReplacer(message);
      this.WebSocket.send(message);
      if ($.server) {
        $.server.clients.forEach(ws => ws.send(message));
      }
    },
    sendto(sid, message = {}){
      console.debug('send to', this.state);
      $().status('ws', 'ACTIVE');
      message.to = { sid: sid };
      return $.promise( 'send to', resolve => {
        $().status('ws', this.state);
        this.clients.set(sid, resolve);
        this.send(message);
      });
    },
    setState(state, message){
      $().status('ws', this.state = state);
      // if (window.document){
      //   this.procstate = this.procstate || $().procstate();
      //   this.procstate.text(message || '');
      // }
    },
  };
  const clients = new Map();

  Aim = function Aim (selector, context){
    if(selector instanceof Elem) return selector;
    if(!(this instanceof $)) return new $(...arguments);
    // if (!selector) return new $('$');
    if (selector){
      if (selector instanceof Item){
        return selector;
      }
      this.selector = selector;
    }
    selector = selector || 'aim';
    if (['string','number'].includes(typeof selector)){
      if ($.map.has(selector)){
        selector = $.map.get(selector);
        if (context) $(selector).extend(context);
        return selector;
      } else if (window.document){
        // selector = TAGNAMES.includes(selector) ? document.createElement(selector) : (document.getElementById(selector) || selector)
        const element = document.getElementById(selector);
        selector = element ? element : (TAGNAMES.includes(selector) ? document.createElement(selector) : selector);
      }
    }
    if (window.Element && selector instanceof window.Element){
      if ($.map.has(selector.id)) return $.map.get(selector.id);
      selector = new Elem(selector, ...[...arguments].slice(1));
      if (selector.elem.id){
        $.map.set(selector.elem.id, selector);
      }
      return selector;
    }
    // if(!(this instanceof $)) return new $(...arguments);
    if (typeof selector === 'string'){
      if (selector.match(/\w+\(\d+\)/)){
        return Item.get(selector);
      } else {
        this.id(selector)
      }
    } else if (selector instanceof Item) {
      return selector;
    } else if (typeof Window !== 'undefined' && selector instanceof Window) {
      return this;
    } else if (selector.ID || selector.LinkID || selector.tag) {
      return Item.get(selector);
    }
    this.extend(context)
  };
  $ = aim = Aim;
  Aim.prototype = {
    // info: {
    //   title: 'Object Manager',
    // },
    pdfpages(selector) {
      return $.promise('pdf-pages', resolve => {
        let pages=[];
        function read_pages(pdf) {
          // pagesProgress.max = pdf.numPages;
          $().progress(0, pdf.numPages);
          (function getPage(pageNumber) {
            // console.log(pageNumber);
            pdf.getPage(pageNumber).then(function(page) {
              page.getTextContent({
                normalizeWhitespace: true,
                disableCombineTextItems: false,
              }).then(item => {
                pages.push(item.items);
                if (pageNumber < pdf.numPages) {
                  $().progress(pageNumber);
                  setTimeout(() => getPage(++pageNumber),0);
                } else {
                  resolve(pages);
                }
              });
            });
          })(1);
        }
        if (selector instanceof File) {
          console.log('is file', selector);
          var fileReader = new FileReader();
          fileReader.onload = function(e){
            const array = new Uint8Array(e.target.result);
            pdfjsLib.getDocument({data: array}).promise.then(read_pages);
          };
          fileReader.readAsArrayBuffer(selector);
        } else {
          pdfjsLib.getDocument(selector).promise.then(read_pages);
        }
      });
    },
    access_token(){
      return this.set('access_token', ...arguments);
    },
    // authProvider(context){
    //   // console.error(context);
    //   return this.get(AuthProvider, context);
    // },
    auth(context){
      console.error('AUTH', context);
      return this.get(AuthProvider, {auth: context});
    },
    copyFrom(source, master, index) {
      return $.promise( 'copyFrom', resolve => {
        // return;
        const [s,schemaName,sourceId] = source.tag.match(/(\w+)\((\d+)\)/);
        console.warn(schemaName, source, master);
        const item = {
          // schema: source.schema,
          header0: source.header0,
          Src: {
            LinkID: sourceId,
          },
          Class: {
            LinkID: !source.Class || !source.Class.LinkID === 0 ? sourceId : source.Class.LinkID,
          },
        };
        if (master) {
          master.attr('HasChildren', 1, true);
          item.Master = {
            LinkID: master.data.ID,
            Data: index === undefined ? (master.items ? master.items.length : 0) : index,
          }
        }
        console.debug('COPY START', item);
        $.client.api(`/${schemaName}`).input(item).post().then(event => {
          // console.debug('COPY DONE', event.target.responseText);
          const item = event.body;
          item.details().then(async item => {
            console.debug('COPY START', item);
            await item.clone();
            if (master) {
              if (master.items) {
              master.items.push(item);
              // master.emit('change');
              await master.reindex();
              if (master.elemTreeLi.elem.open) {
                master.elemTreeLi.emit('toggle')
              } else {
                master.elemTreeLi.elem.open = true;
              }
              // if (index !== undefined) {
              //   console.debug('INDEX', index);
              //   item.movetoidx(master,index);
              // }
            }
            }
            console.debug('COPY END', item);
            // item.emit('change');
            resolve(item);
          })
        })
      });
    },
    clone(obj){
      // console.error('clone', obj);
      return JSON.parse(JSON.stringify(obj));
    },
    components(components){
      return this.extend(components)
    },
    setconfig(context){
      $().extend(context);
    },
    connector(){
      Object.assign(this, {
        external(name, args, callback){
          let params = {to: { sid: $.Aliconnector.connector_id }, external: {} };
          // let args = [...arguments];
          params.external[name] = Array.isArray(args) ? args : (args ? [args] : []);
          $.Aliconnector.callback = callback;
          wsClient.send(JSON.stringify(params));
        },
        reply(par){
          if ($.Aliconnector.callback){
            $.Aliconnector.callback(par);
          }
          $.Aliconnector.callback = null;
          // console.debug('ALICONNECTOR REPLY', par);
        },
        printurl(url){
          this.external('printurl', url, par => {
            console.debug('PRINT REPLY', par);
          });
        },
        hide(){
          this.external('hide', null, par => {
            console.debug('HIDE REPLY', par);
          });
        },
        show(){
          this.external('show', null, par => {
            console.debug('SHOW REPLY', par);
          });
        },
        // writelnfile(){
        // 	this.external('show', null, par => {
        // 		console.debug('SHOW REPLY', par);
        // 	});
        // },
        // writefile(){
        // 	this.external('show', null, par => {
        // 		console.debug('SHOW REPLY', par);
        // 	});
        // },
        // readfile(){
        // 	this.external('show', null, par => {
        // 		console.debug('SHOW REPLY', par);
        // 	});
        // },
        // readfilearray(){
        // 	this.external('show', null, par => {
        // 		console.debug('SHOW REPLY', par);
        // 	});
        // },
        // EditFile(){
        // 	this.external('show', null, par => {
        // 		console.debug('SHOW REPLY', par);
        // 	});
        // },
        filedownload(par){
          this.external('filedownload', "http://alicon.nl" + par, par => {
            console.debug('SHOW REPLY', par);
          });
        },
        mailimport(){
          this.external('show', null, par => {
            console.debug('SHOW REPLY', par);
          });
        },
        contactimport(){
          this.external('show', null, par => {
            console.debug('SHOW REPLY', par);
          });
        },
        // opcSetVar(){},
        // opcSet(){},
        // opcConnect(){},
        // opcDisconnect(){},
        // geturl(){},
        // getHtml(){},
      });
    },
    create(){
      this.selector = this.selector.createElement(...arguments);
      return this;
    },
    // client(options){
    //   this.get(Client, options ? Object.assign(options,{authProvider: options.authProvider || this.authProvider()}) : null);
    //   return this;
    // },
    client_get(){
      return clients;
    },
    css(selector, context) {
      if (document) {
        if (selector instanceof Object) {
          Object.entries(selector).forEach(entry => arguments.callee(...entry))
        } else {
          document.querySelector('html').style.setProperty('--' + selector, context);
        }
      }
      return this;
      //
      //
      // let style = [...document.getElementsByTagName('style')].pop() || $('style').parent(document.head).elem;
      // const sheet = style.sheet;
			// function addRule(selector, context) {
			// 	if ('insertRule' in sheet) {
			// 		sheet.insertRule(selector + "{" + context + "}", sheet.cssRules.length);
			// 	} else if ('addRule' in sheet) {
			// 		sheet.addRule(selector, context);
			// 	}
			// }
			// if (selector instanceof Object) {
			// 	Object.entries(selector).forEach(entry => addRule(...entry))
			// } else {
			// 	addRule(...arguments);
			// }
      // return this;
		},
    data(data){
      Item.get(data);
      return this;
    },
    doc:{
      value: new Doc(),
    },
    document(mainElem, buttons){
      $('doc').append(
        this.pageElem = $('div').class('col doc').append(
          $('div').class('row top stickybar').append(
            $('span').class('aco'),
            $('button').class('abtn pdf').on('click', async e => {
              const html = '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>'+this.docElem.elem.innerHTML;
              $().url('https://aliconnect.nl/api/?request_type=pdf').post(html).then(e => {
                const elem = $('div').parent(this.pageElem).class('col abs').append(
                  $('div').class('row top btnbar').append(
                    $('button').class('abtn close').on('click', e => elem.remove()),
                  ),
                  $('iframe').class('aco').src(e.body.src)
                )
              })
            }),
            $('button').class('abtn close').on('click', event => this.pageElem.remove()),
          ),
          $('div').class('row aco').append(
            this.leftElem = $('div').class('mc-menu left np oa').append(),
            $('div').class('aco col').on('click', event => {
              const href = event.target.getAttribute('href');
              if (href && href.match(/^http/)) {
                event.stopPropagation();
                event.preventDefault();
                window.history.pushState('page', '', '?l='+url_string(href));
                const panel = $('div').parent(elem.docElem).class('col abs').append(
                  elem.elemBar = $('div').class('row top abs btnbar').append(
                    $('span').class('aco'),
                    $('button').class('abtn close').on('click', e => panel.remove()),
                  ),
                  $('iframe').src(href),
                );
              }
            }).append(
              $('nav').class('row docpath').append($('small').id('navDoc')),
              this.docNavTop = $('nav').class('row dir'),
              this.docElem = mainElem.class('doc-content aco'),
            ),
            $('div').class('mc-menu right np oa').append(
              $('div').class('ac-header').text('Table of contents'),
              this.indexElem = $('ul').index(this.docElem)
            ),
          ),
        )
      );
      // $(document.body).on('scroll', e => this.scrollTop.set(this.src, e.target.scrollTop));
      // this.doc.indexElem.index(this.doc.docElem)
      this.pageElem.elem.doc = this;
      return this;
    },
    async emit(type, context){
      const selector = this.elem || this.selector || this;
      // if (type === 'change') console.debug('emit', type, context, selector);
      if (selector.addEventListener){
        let event;
        if (typeof (Event) === 'function'){
          event = new Event(type);
        } else {
          event = document.createEvent('Event');
          event.initEvent(selector, true, true);
        }
        if (typeof context === 'object'){
          delete context.path;
          Object.assign(event, context);
        }
        await selector.dispatchEvent(event);
      } else {
        if (selector.eventListeners && selector.eventListeners.has(type)){
          const eventListener = selector.eventListeners.get(type);
          for (const i in eventListener){
            // console.debug('EMIT', type, eventListener[i]);
            await eventListener[i](context || {});
          }
        }
      }
      return this;
    },
    evalData(data){
      // console.debug('evalData', data);
      // keys = ['components'];
      // const cfg = ['components'].map(key => data[key]);
      if (data instanceof Object){
        // const keys = ['components','info'].filter(key => key in data);
        // const config = keys.reduce((result, key) => ({ ...result, [key]: data[key] }), {});
        //
        // // console.debug(data,config);
        //
        // this.extend(config);
        // console.debug('evalDataevalDataevalDataevalData', data);
        if (Array.isArray(data.value)){
          data.value = data.value.map(data => Item.get(data));
        } else if (data['@id']){
          data = Item.get(data);
        }
        // console.debug('A', data.body);
      }
      return data;
    },
    eventHandle: {
      value: null,
    },
    elements:{
      get(){
        if (isModule){
          return [];
        }
        return this.props && (this.props[0] instanceof Object)
        ? Object.values(this.props[0]).filter(value => value instanceof Element)
        : [];
      },
    },
    extend(){
      $.extend(this.elem || this.selector || this, ...arguments);
      return this;
    },
    execQuery(selector, context, replace){
      $.url = $.url || new URL(document.location.origin);
      var url = new URL(document.location);
      if (typeof selector === 'object') {
        Object.entries(selector).forEach(entry => url.searchParams.set(...entry));
      } else {
        url.searchParams.set(selector, context);
      }


      // console.error('execQuery', url_string($.url.href), url_string(url.href));
      if (url_string($.url.href) !== url_string(url.href)) {
        this.execUrl(url_string(url.href));
        // if (url.searchParams.get('l')) {
        //   url.searchParams.set('l', decodeURIComponent(url.searchParams.get('l')));
        //   console.log(url.searchParams.get('l'));
        //
        // }
        // var href = url.href;
        // console.log(href);
        if (replace) {
          // console.error('REPLACE');
          window.history.replaceState('page', '', url_string(url.href));
        } else {
          // console.error('PUSH');
          window.history.pushState('page', '', url_string(url.href));
        }
      }
      return this;
    },
    execUrl(url){
      console.warn('execUrl', url);
      $.url = $.url || new URL(document.location.origin);
      var url = new URL(url, document.location);
      // console.log(url.hash, url.searchParams.get('l'), $.url.searchParams.get('l'));
      if (url.hash) {
        if (this.execUrl(url.hash.substr(1))) {
          $.history.mergeState(url.hash.substr(1));
          return;
        }
        // if ($[url.hash.substr(1)]) {
        //   return $[url.hash.substr(1)]();
        // }
        // this.execUrl(url.hash.substr(1));
      }
      // console.log(url.searchParams.get('l'));
      if (url.searchParams.get('l') && url.searchParams.get('l') !== $.url.searchParams.get('l')) {

        var documentUrl = new URL(document.location);
        // url.searchParams.forEach((value, key) => console.log(key, value));
        url.searchParams.forEach((value, key) => documentUrl.searchParams.set(key, value));
        documentUrl.hash = '';
        // window.history.replaceState('page', '', documentUrl.href.replace(/%2F/g, '/'));



        // window.history.replaceState('page', '', url.href.replace(/%2F/g, '/'));
        $.url.searchParams.set('l', url.searchParams.get('l'));
        var refurl = new URL(url.searchParams.get('l'), document.location);
        if (refurl.pathname.match(/^\/api\//)) {
          const client = clients.get(refurl.hostname) || $();
          // console.log('CLIENT',client,refurl.hostname);
          refurl.pathname += '/children';
          client
          .api(refurl.href)
          .filter('FinishDateTime eq NULL')
          .select($.config.listAttributes)
          .get().then(async event => {
            if (event.body){
              const items = event.body.value || await event.body.children;
              $().list(items);
            }
          });
        } else {
          return $('list').load(url.searchParams.get('l'));
        }
      }
      if (url.searchParams.get('v') && url.searchParams.get('v') !== $.url.searchParams.get('v')) {
        $.url.searchParams.set('v', url.searchParams.get('v'));
        if (url.searchParams.get('v')) {
          var refurl = new URL(url.searchParams.get('v'), document.location);
          if (refurl.pathname.match(/^\/api\//)) {
            const client = clients.get(refurl.hostname) || $();
            client.api(refurl.href).get().then(async event => $('view').show(event.body));
          }
        } else {
          $('view').text('');
        }
      }
      for ([key, value] of url.searchParams) {
        if (typeof $[key] === 'function'){
          return $[key].apply($, value ? value.split(', ') : []) || true;
        }
      };
      // if (!$().url(document.location.hash ? document.location.hash.substr(1) : document.location.href).exec()) {
      //   if (url.searchParams.get('p')) {
      //     return $('list').load(url.searchParams.get('p'));
      //   }
      // }
      // if (url.searchParams.get('id')) {
      //   var refurl = new URL(atob(url.searchParams.get('id')));
      //   if (refurl.pathname.match(/^\/api\//)) {
      //     $().url(refurl.href).get().then(async event => {
      //       $('view').show(event.body);
      //     });
      //   }
      // }
      // return;
      // console.log('POPSTATE2', document.location.pathname);
    },
    forEach(selector, context, fn){
      if (selector instanceof Object){
        Object.entries(selector).forEach(entry => fn.call(this, ...entry));
      } else {
        fn.call(this, selector, context)
      }
      return this;
    },
    get(selector, options) {
      this.props = this.props || new Map();
      if (!selector) return this.props;
      const name = selector.name || selector;
      if (!this.props.has(name)){
        options = typeof options === 'string' ? $(options) : options;
        // console.log(selector);
        this.props.set(name, typeof selector === 'function' && selector.prototype ? new selector(options) : options)
      }
      return this.props.get(name)
      // let prop = (this.props = this.props || new Map()).get(name);
      // if (options){
      //   if (!prop){
      //     options = Array.isArray(options) ? options.shift() : options;
      //     options = typeof options === 'string' ? $(options) : options;
      //     options = typeof selector === 'function' ? new selector(options) : options;
      //     prop = this.props.set(name, options).get(name)
      //     prop.key = this.key;
      //   } else {
      //     $(prop).extend(options)
      //     if (prop.init){
      //       prop.init();
      //     }
      //   }
      // }
      // return prop
    },
    getApi(url){
      return $.promise(
        'getApi',
        resolve => this
        .url(url)
        .get()
        .then(event => {
          console.debug('GET', JSON.parse(event.target.responseText));
          $(this).extend(event.body);
          resolve(event);
        })
      )
    },
    getObject(name, constructor, args) {
      const props = this.props = this.props || new Map();
      if (!props.has(name)) {
        props.set(name, new constructor(...args))
      } else if (!args.length) {
        return props.get(name);
      } else {
        props.get(name).show(...args);
      }
      return this;
    },
    has(selector){
      return this.props && this.props.has(selector);
    },
    id(selector){
      this.key = selector; // deprecated
      this.set('id', selector);
      $.map.set(selector, this);
      return this;
    },
    async login(){
      // const url = new URL(this.server.url, document.location);
      var url = new URL(this.server ? this.server.url : '/api', 'https://aliconnect.nl');
      if (this.authProvider().access && this.authProvider().access.iss) {
        url.hostname = this.authProvider().access.iss;
      }
      // console.debug( url );
      // return;
      //
      // var url = new URL(this.server ? this.server.url : this.authProvider().access.iss, 'https://aliconnect.nl/api');
      //
      // console.debug( this.authProvider().access.iss, url );
      // return;
      clients.set(url.hostname, this);
      // return console.debug(this.ws());
      // clients.set()
      if (this.ws().url){
        await this.ws().connect()
      }
      if (this.authProvider()){
        await this.authProvider().login(...arguments);
        if (this.ws()){
          await this.ws().login(this.authProvider().getAccessToken())
        }
      }
      return this;
    },
    // logout(){
    //   $.authProvider.logout();
    // },
    list(selector) {
      return this.getObject(arguments.callee.name, Listview, [...arguments]);
    },
    message: {
      get(){
        const [basePath, folder, sep, id] = this.getPath();
        // console.debug(basePath, folder, sep, id, this);
        return {
          method: this.req.method,
          url: [folder, this.URL.searchParams.toString()].filter(Boolean).join(''),
          body: this.req.input,
          to: this.to,
        }
      },
    },
    msa() {
			return $.msa = $.msa || new Msa(...arguments);
		},
    nav() {
			return nav;
		},
    notify(title, options) {
      // $().sw.active.postMessage({
      //   test: 'ja',
      // })
      return;
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          // $().sw.showNotification(title, {
          //   body: `Bla Bla`,
          //   // url: 'https://moba.aliconnect.nl',
          //   icon: 'https://aliconnect.nl/favicon.ico',
          //   image: 'https://aliconnect.nl/shared/265090/2020/07/09/5f0719fb8fa69.png',
          //   // data: {
          //   //   href: document.location.href,
          //   //   url: 'test',
          //   // },
          //   actions: [
          //     {
          //       action: 'coffee-action',
          //       title: 'Coffee',
          //       icon: '/images/demos/action-1-128x128.png'
          //     },
          //     {
          //       action: 'doughnut-action',
          //       title: 'Doughnut',
          //       icon: '/images/demos/action-2-128x128.png'
          //     },
          //     {
          //       action: 'gramophone-action',
          //       title: 'gramophone',
          //       icon: '/images/demos/action-3-128x128.png'
          //     },
          //     {
          //       action: 'atom-action',
          //       title: 'Atom',
          //       icon: '/images/demos/action-4-128x128.png'
          //     }
          //   ]
          // })
          //
          // return;
          //
          options = {
            body: `Bla Bla`,
            url: 'https://moba.aliconnect.nl?test=1',
            icon: 'https://aliconnect.nl/favicon.ico',
            image: 'https://aliconnect.nl/shared/265090/2020/07/09/5f0719fb8fa69.png',
            // data: 'https://moba.aliconnect.nl?test=1',
            data: {
              href: document.location.href,
              url: document.location.href,
            },
          //   actions: [
          //     {
          //       action: 'open-action',
          //       title: 'Open',
          //       icon: 'https://aliconnect.nl/favicon.ico',
          //     },
          //     // {
          //     //   action: 'doughnut-action',
          //     //   title: 'Doughnut',
          //     //   icon: '/images/demos/action-2-128x128.png'
          //     // },
          //     // {
          //     //   action: 'gramophone-action',
          //     //   title: 'gramophone',
          //     //   icon: '/images/demos/action-3-128x128.png'
          //     // },
          //     // {
          //     //   action: 'atom-action',
          //     //   title: 'Atom',
          //     //   icon: '/images/demos/action-4-128x128.png'
          //     // }
          //   ]
          };
          var notification = new Notification(title, options);
          notification.onclick = function(e) {
            console.log('CLICKED', options);
            // window.open("http://www.stackoverflow.com");
            // window.location.href = 'https://aliconnect.nl';
          }
        }
      }
    },
    noPost(fn){
      $.temp.noPost = true;
      fn();
      $.temp.noPost = false;
    },
    on(type, context, useCapture){
      const selector = this.elem || this.selector || this;
      this.forEach(type, context, (type, context) => {
        if (selector.addEventListener){
          selector.addEventListener(type, context, useCapture);
        } else {
          // if (type === 'change') console.debug('on', type, context, selector);
          const eventListeners = selector.eventListeners = selector.eventListeners || new Map();
          if (!eventListeners.has(type)) eventListeners.set(type, []);
          const eventListener = eventListeners.get(type);
          if (!eventListener.includes(context)){
            eventListener.push(context);
          }
        }
      });
      return this;
    },
    onload(event){
      // console.error(this, event.target);
      if ($.config.debug && event.target.status < 400 || isModule){
        console.debug (
          // event.target.sender,
          this.props('method').toUpperCase(),
          this.props('url').toString(),
          event.target.status,
          event.target.statusText,
          event.target.responseText.length, 'bytes',
          new Date().valueOf() - this.startTime.valueOf(), 'ms',
          // event.target.responseText,
          // event.body || this.responseText,
        );
      }
      // if (event.status >= 400) document.body.appendTag('DIV', {className:'errorMessage', innerHTML:this.responseText });
      // this.getHeader = this.getHeader || this.getResponseHeader;
      // var contentType = event.headers ? event.headers['content-type'] : this.getHeader('content-type');
      (event.body.responses || [event]).forEach((res, i) => {
        if (res && res.body){
          // res.body = $.evalData(res.body);
        }
        // console.debug('BODY', res.body);
      });
      // this.body = event.body;
      // this.resolve(this);
      this.resolve(event);
      // this.resolve({
      // 	body: event.body,
      // 	json(){
      // 		return event.body;
      // 	}
      // });
    },
    origin: window.document ? document.currentScript.src.replace(/\/lib.*/,'') : '',
    panel() {
      return $('div').panel();
    },
    procstate(selector) {
      return $('div').class('procstate').text(selector);
    },
    progress(value = 0, max = 0) {
      if ($.elem.statusbar) {
        value = $.elem.statusbar.progress.elem.value = ($.elem.statusbar.progress.elem.value || 0) + value;
        max = $.elem.statusbar.progress.elem.max = ($.elem.statusbar.progress.elem.max || 0) + max;
        $.elem.statusbar.progress
        .max(max)
        .value(value || null)
        .attr('proc', max ? Math.round(value / max * 100) : null)
      }
    },
    popupmenuitems(item) {
			return;
			var itemmenu = $.menuitems;
			if (item.attributes && item.attributes.state && item.attributes.state.options) {
				//item.attributes.state.options.onclick = function() {
				//	// //console.debug('SET STATE', this.item);
				//	this.item.set({ state: $.Object.findFieldValue(this.item.attributes.state.options, 'Title', this.menuitem.Title) });
				//};
				itemmenu.state.menu = item.attributes.state.options;
			}
			return itemmenu;
		},
    prompt(selector, context) {
      const is = $.map.has('prompt') ? $('prompt') : $('section').parent(document.body).class('prompt').id('prompt').append(
        $('button').class('abtn abs close').attr('open', '').on('click', event => $().prompt(''))
      );
      // if (!is.elem) return;
      const promptSelector = 'prompt-'+selector;
			if (context) {
        $.map.set(promptSelector, $('div')
        .parent(is)
        .class('col', selector)
        // .attr('id', selector)
        .on('open', typeof context === 'function' ? context : function () {
          // console.log('OPEN', this, selector);
          this.is.text('').append(
            $('h1').ttext(selector),
            $('form').class('col')
            .properties(context.properties)
            .btns(context.btns),
          )
        }));
        return;
			}
      if (selector instanceof Object) {
        return Object.entries(selector).forEach(entry => arguments.callee(...entry));
			}
      console.log('prompt', selector)
			is.attr('open', selector ? selector : null);
			$.history.replaceUrl('prompt', selector);
      const dialog = selector && $.map.has(promptSelector) ? $.map.get(promptSelector) : null;
      const dialogElem = dialog ? dialog.elem : null;
      const index = dialog ? [...is.elem.children].indexOf(dialog.elem) : 0;
      [...is.elem.children].filter(elem => elem !== dialogElem && elem.innerText).forEach(elem => setTimeout(() => elem.innerText = '', 100));
      [...is.elem.children].forEach((elem, i) => $(elem).attr('pos', i < index ? 'l' : 'r'));
      if (dialog && dialog.attr) {
        setTimeout(() => dialog.attr('pos', 'm'));
        // console.warn(selector, context);
        dialog.emit('open');
        return dialog;
      }
      return this;
		},
    promptform(url, prompt, title = '', options = {}){
      options.description = options.description || $.temp.translate.get('prompt-'+title+'-description') || '';
      title = $.temp.translate.get('prompt-'+title+'-title') || title;
      console.log([title, options.description]);
      options.properties = options.properties || {};
      // Object.entries($.sessionPost).forEach(([key,value])=>Object.assign(options.properties[key] = options.properties[key] || {type:'hidden'}, {value: value, checked: ''}));
      $.sessionPost = $.sessionPost || {};
      //console.log('$.sessionPost', $.sessionPost);
      Object.entries($.sessionPost).forEach(([selector,value])=>Object.assign(selector = (options.properties[selector] = options.properties[selector] || {type:'hidden'}), {value: selector.value || value, checked: ''}));
      return prompt.form = $('form').parent(prompt.is.text('')).class('col aco').append(
        $('h1').ttext(title),
        prompt.div = $('div').md(options.description),
      )
      .properties(options.properties)
      .append(options.append)
      .btns(options.btns)
      .on('submit', event => url.query(document.location.search).post(event).then(event => {
        console.log(event.body);
        window.sessionStorage.setItem('post', JSON.stringify($.sessionPost = event.body));
        // return;
        // return console.log('$.sessionPost', $.sessionPost);
        if ($.sessionPost.id_token) {
          window.localStorage.setItem('id_token', $.sessionPost.id_token);
          $().send({ to: { nonce: $.sessionPost.nonce }, id_token: $.sessionPost.id_token });
        }
        if ($.sessionPost.prompt) prompt = $().prompt($.sessionPost.prompt);
        if ($.sessionPost.msg && prompt && prompt.div) prompt.div.text('').html($.sessionPost.msg);
        if ($.sessionPost.socket_id) return $().send({to:{sid:$.sessionPost.socket_id}, body:$.sessionPost});
        if ($.sessionPost.url) document.location.href = $.sessionPost.url;
        // return;
        // // //console.log(event.target.responseText);
        // if (!event.body) return;
        // $.sessionPost = event.body;
        // $.responseProperties = Object.fromEntries(Object.entries($.sessionPost).map(([key,value])=>[key,{format:'hidden',value:value}]));
        //
        // // //console.log('$.sessionPost', $.sessionPost);
        // [...document.getElementsByClassName('AccountName')].forEach((element)=>{
        //   element.innerText = $.sessionPost.AccountName;
        // });
        // if (event.body.msg) {
        //   event.target.formElement.messageElement.innerHTML = event.body.msg;
        //   //console.log(event.target.formElement.messageElement);
        // } else if (event.body.socket_id) {
        //   //console.log('socket_id', event.body);
        //   // return;
        //   $.WebsocketClient.request({
        //     to: { sid: event.body.socket_id },
        //     body: event.body,
        //   });
        //   window.close();
        // } else if (event.body.url) {
        //   // return //console.error(event.body.url);
        //   // if ()
        //
        //   document.location.href = event.body.url;
        // } else {
        //   //console.log(event.body);
        //   // document.location.href = '/api/oauth' + document.location.search;
        // }
      }))
    },
    schemas (selector, context){
      if (!selector) return this.get('schemas');
      if (selector instanceof Object){
        return Object.entries(selector).forEach(entry => this.schemas(...entry));
      } else {
        const schemas = this.get('schemas') || this.set('schemas', new Map()).get('schemas');
        // console.log(selector, context, this.has('schemas'), schemas);
        selector = validSchemaName(selector);
        if (!schemas.has(selector)){
          if (!window[selector]){
            eval(`${selector} = function(){}`);
          } else {
            // console.debug(`${selector} exists`);
          }
          // console.log(selector);
          const constructor = window[selector];
          // if (selector !== 'Item') {
          Object.values(context.properties = context.properties || {}).forEach(property => {
            if (property.enum && typeof property.enum === 'object') {
              property.options = property.enum;
            }
            if (property.options) {
              property.options = Object.fromEntries(Object.entries(property.options).map(([optionName,option])=>[optionName,typeof option === 'object' ? option : {title: option}]));
              property.enum = Object.keys(property.options);
              if (property.enum.length === 2 && Object.values(property.options).filter(Boolean).length === 1) {
                property.format = 'checkbox';
              }
            }
          });
          // const allOf = [selector];
          context.allOf=context.allOf||['Item'];
          const allContext = {};
          // for (let name of context.allOf) {
          //   console.log(name,Object.keys(schemas.get(selector).properties).join(','))
          //   context.allOf.concat((schemas.get(selector)||{}).allOf);
          // }
          // // context.allOf.forEach(selector => context.allOf.concat((schemas.get(selector)||{}).allOf));
          // console.log(selector, context.allOf);
          //
          context.allOf.forEach(selector => $.extend(allContext, schemas.has(selector) ? JSON.parse(JSON.stringify(schemas.get(selector))) : null));
          schemas.set(selector, this.schemas[selector] = context = $.extend(allContext, context));
          //
          //
          // context.allOf = (function getAllOf(allOf) {
          //   allOf.concat().forEach(selector => if (schemas.has(selector)))
          //   // console.log(allOf);
          //   // (context.allOf||[]).forEach(allOfSelector => {
          //   //   allOf.unshift(allOfSelector);
          //   // });
          //   // return $.extend(allContext, context);
          //   return allOf;
          // })(context.allOf||[]);
          // console.log(selector, Object.keys(context.properties).join(','));
          if (constructor !== Item) {
            constructor.prototype = Object.assign(Object.create(Item.prototype), constructor.prototype);
          }
          // const items = new Map();
          Object.assign(constructor.prototype, {
            schema: context,
            schemaName: selector,
            // clear() { return items.clear(); },
            // deleteItem() { return items.delete(...arguments); },
            // entries() { return items.entries(...arguments); },
            // // forEach() { return items.forEach(...arguments); },
            // getItem() { return items.get(...arguments); },
            // hasItem() { return items.has(...arguments); },
            // keys() { return items.keys(...arguments); },
            // setItem() { return items.set(...arguments); },
            // values() { return items.values(...arguments); },
          });
          for (let [propertyName, property] of Object.entries(context.properties||{})) {
            property.name = propertyName;
            if (!constructor.prototype.hasOwnProperty(propertyName)){
              Object.defineProperty(constructor.prototype, propertyName, typeof property.value === 'function' ? {
                value: new Function(property.value.replace(/^value\(\) \{|\}$/g,''))
              } : {
                get(){
                  // if (property.get){
                  //   if (typeof property.get === 'function'){
                  //     return property.get.call(this);
                  //   } else {
                  //     const names = property.get.split(',');
                  //     return Object.entries(this.schema.properties)
                  //     .filter(entry => names.includes(entry[0]))
                  //     .filter(entry => entry[0] in this.data)
                  //     .map(entry => (this.data[entry[0]] ? this.data[entry[0]].Value || this.data[entry[0]] : '') )
                  //     .join(' ')
                  //     // 	console.debug('headerValue', attributeName, index, v, this.data, this.schemaName, this.schema.properties);
                  //
                  //   }
                  // }
                  // console.debug(propertyName, this);
                  return this.getValue(propertyName);
                  // if (this.data && this.data[propertyName]){
                  //   return typeof this.data[propertyName] === 'object' ? this.data[propertyName].Value : this.data[propertyName];
                  // }
                },
                set(value){
                  this.attr(propertyName, value, true);
                }
              });
            }
          }
          // }
          if (context.operations){
            for (let [operationName, operation] of Object.entries(context.operations)){
              // console.debug(operationName);
              operationName = operationName.replace(/(\(.*)/,'');
              if (constructor.prototype[operationName]){
                let operation = constructor.prototype[operationName];
                // console.debug('OPEREATION', operationName, String(operation));
                console.debug('OPERATION', selector, operationName);
                constructor.prototype[operationName] = function (){
                  $.forward = null;
                  operation.apply(item, arguments);
                }
              } else {
                if (typeof operation === 'function'){
                  constructor.prototype[operationName] = operation;
                } else {
                  constructor.prototype[operationName] = function(){
                    let args = [...arguments];
                    if ($.forward) return;
                    // console.error('Send',tag,operationName,args);
                    // return;
                    let path = `/${tag}/${operationName}(${args.join(', ')})`;
                    new $.WebsocketRequest({
                      to: { aud: $.auth.access.aud },
                      path: path,
                      method: 'post',
                      forward: $.forward || $.WebsocketClient.socket_id,
                    });
                  };//.bind({ path: '/' + tag + '/' + operationName  });
                }
              }
            }
          }
          const item = Item.get(context);
          item.isSchema = true;
        }
      }
      return this;
    },
    send(context){
      // console.debug(context, this.ws());
      this.ws().send(context);
      // if ($.ws){
      // 	$.ws.message(JSON.stringify(context));
      // }
    },
    set(selector, context){
      (this.props = this.props || new Map()).set(selector, context);
      return this;
    },
    setState(state){
      Object.values($.client).forEach(client => client.setUserstate(state));
    },
    state(){},
    storage(selector, context, type){
      // cookieSettings = window.localStorage.getItem('cookieSettings');
      const cookieSettings = {
        session: true,
        functional: true,
        tracking: true,
        cookie: true,
      };
      $.temp.cookie = $.temp.cookie || new Map(window.document ? document.cookie.split("; ").map(val => val.split('=')) : null);
      // console.debug($.temp.cookie.get('id_token'));
      if (arguments.length === 1){
        const value =
        $.temp.cookie.get(selector) ||
        (window.sessionStorage ? window.sessionStorage.getItem(selector) : null) ||
        (window.localStorage ? window.localStorage.getItem(selector) : null) ||
        '';
        // console.warn(selector,value);
        try {
          return JSON.parse(value);
        } catch (err){
          return value;
        }
      } else if (context === null){
        console.debug('remove', selector);
        window.sessionStorage.removeItem(selector);
        window.localStorage.removeItem(selector);
        document.cookie = `${selector}= ;path=/; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
        $.temp.cookie.delete(selector);
        // console.debug(document.cookie);
        // console.debug('delete', selector, window.localStorage.getItem(selector));
      } else {
        type = type || 'functional';
        context = JSON.stringify(context);
        // console.warn('SET', selector, context);
        if (type === 'cookie'){
          $.temp.cookie(selector, context);
          document.cookie = `${selector}=${context} ;path=/; SameSite=Lax`;
        } else if (type === 'session'){
          if (window.sessionStorage){
            window.sessionStorage.setItem(selector, context);
          }
        } else if (cookieSettings[type]){
          if (window.localStorage){
            window.localStorage.setItem(selector, context);
          }
          // console.debug('set', selector, context, window.localStorage.getItem(selector));
        }
      }
      return this;
    },
    status(selector, context){
      if ($.elem.statusbar && $.elem.statusbar[selector]){
        $.elem.statusbar[selector].attr('context', context);
      } else {
        // console.debug(selector, context);
      }
      return this;
    },
    translate(){
      return this.url('https://aliconnect.nl/api')
      .query('request_type','translate')
      .query('lang','nl')
      .get()
      .then(event => {
        $.temp.translate = new Map(Object.entries(event.body))
      });
    },
    tree(selector) {
      return this.getObject(arguments.callee.name, Treeview, [...arguments]);
		},
    url(selector){
      return new Request(...arguments);
      // return this.props('url', this.props('url') || new URL(selector || '/', document.location));
      // this.props('url', this.props('url') || new Request(...arguments));
    },
    userName(){
      return $.auth && $.auth.id ? $.auth.id.name : ''
    },
    ws(options){
      return this.get(WebSocket, options ? Object.assign(options,{authProvider: options.authProvider || $.client.authProvider}) : null);
    },
    _sendNotification() {
      ws.send({
        to: this.item.users,
        Notification: {
          Title: this.put.Subject,
          options: {
            body: "Bericht geplaatst door " + this.get.from,
            url: "https://aliconnect.nl/tms/app/om/#id=" + this.get.id,
            icon: "https://aliconnect.nl/favicon.ico",
            //image: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
            data: {
              href: '#?id=' + this.get.id
            },
          }
          //api: this.api, get: this.get, put: this.put
        }
      });
    },
    cam() {
      const elem = document.head.appendChild(document.createElement('script'));
      elem.setAttribute('src', $.config.apiPath + '/js/cam.js');
    },
    extendConfig(yaml){
      // console.log(yaml);
      return $.client.api('/').query('extend', true).post({config: yaml});
    },
    dashboard() {
      const panel = $('div').panel();
      $.client.api('/').query('request_type', 'personal_dashboard_data_domain').get().then(event => {
        panel.elemMain.class('dashboard').append(
          $('div').class('row wrap').append(
            ...event.body.map(row => $('div').class('col').append(
              $('h1').text(row.schemaPath),
              ...row.items.map(item => $('a').text(item.header0).on('click', event => $('view').show($(`${row.schemaPath}(${item.id})`)) ))
            )),
            ...[0,0,0,0,0,0,0,0,0].map(a => $('div').class('ghost')),
          )
        );
      })
    },
    signin(){
      $().on({
        async load() {
          $().server.url = $().server.url || document.location.origin;
          await $().url($().server.url+'/api.json').get().then(event => $().extend(event.body));
          await $().login();
        }
      });
    },
    cookies() {
      console.log('COOKIES');
      $().on({
        async load() {
          if (!window.localStorage.getItem('cookieSettings')) {
            const elem = $('div')
            .parent(document.body)
            .class('cookieWarning')
            .text('Opslag van uw gegevens')
            .append(
              $('button')
              .text('Werkende website')
              .on('click', event => {
                window.localStorage.setItem('cookieSettings', 'session');
                elem.remove();
              }),
              $('button')
              .text('Allen voor u persoonlijk')
              .on('click', event => {
                window.localStorage.setItem('cookieWarning', 'private');
                elem.remove();
              }),
              $('button')
              .text('Delen met onze organisatie')
              .on('click', event => {
                window.localStorage.setItem('cookieWarning', 'shared');
                elem.remove();
              }),
              $('a').text('Cookie beleid').href('#?l=//aliconnect.nl/aliconnect/wiki/Explore-Legal-Cookie-Policy')
            )
          }
          return this;
        }
      })
    },
    account_config(config, extend, save) {
      const panel = $('form').class('col')
      .style('position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;background-color:white;z-index:200;')
      .parent($('list'));
      const tabControl = $('div').parent(panel).class('row top btnbar');
      const pageControl = $('div').parent(panel).class('row aco').style('height:100%;');
      function upload() {
        // console.log('UPLOAD', page);
        configInput.elem.value = configText.elem.innerText;
        $.client.api('/').post(panel).then(event => {
          console.debug("API", event.target.responseText );
        });
        // $.client.api(url).post(page).query({
        //   base_path: document.location.protocol === 'file:' ? '/' : document.location.pathname.split(/\/(api|docs|om)/)[0],
        // }).input(this.value).post().then(event => {
        //   console.debug("API", event.target.responseText );
        // });
      }
      const page = $('div').parent(pageControl)
      .class('aco oa col')
      .css('margin:auto;position:absolute;top:0;bottom:0;left:0;right:0;')
      .css('background-color:var(--bg);');
      const configText = $('pre').parent(page)
      .class('aco')
      .css('margin:0;padding:0 10px;outline:none;')
      .text(config.replace(/^---\n/, '').replace(/\n\.\.\./, '').trim())
      .contenteditable('')
      .spellcheck(false)
      .on('keydown', event => {
        if (event.key === "s" && event.ctrlKey) {
          event.preventDefault();
          upload();
        }
        if (event.key == 'Tab' && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          document.execCommand('insertHTML', false, '&#009');
          event.preventDefault()
        }
      });
      const configInput = $('input').parent(page).name('config').type('hidden');
      function focus () {
        [...pageControl.elem.children].forEach(elem => elem.style.display = 'none');
        page.elem.style.display = '';
      }
      function close () {
        page.remove();
        tab.remove();
        if (!tabControl.elem.innerText) {
          panel.remove();
        }
      }
      const tab = $('div').parent(tabControl).append(
        $('span').text('config.yaml').on('click', focus),
        $('input').type('checkbox').name('extend').id('expand').checked(extend),
        $('label').text('extend').for('expand'),
        $('button').class('abtn close').on('click', close),
      );
      focus();
      if (save) upload();
      // open($.client.api('/').accept('yaml'));
    },
    analytics() {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', {
        trackingId: 'UA-28018977-1',
        cookieDomain: 'auto',
        // name: 'schiphol',
        // userId: '12345'
      });
      ga('send', 'pageview');
    },
    ga(){
      if (window.ga) {
        ga(arguments);
      }
      return this;
    },
  };
  Object.assign(Aim, {
    start() {
      // console.log('START');
      return;
      if ($.user) $().dashboard();
      else $().home();
    },
    // libraries(selector) {
    //   // console.log(selector);
    //   selector.split(',').forEach(selector => this[selector] ? this[selector]() : null);
    //   // console.log('LIBRARIES', ...arguments);
    // },
    sw() {
      // return;
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', event => {
          console.log('MESSAGE', event);
          if (event.data && event.data.url) {
            const url = new URL(event.data.url);
            document.location.href = '#' + url.pathname + url.search;
          }
          // alert('sadfasdfa');
          // window.focus();
        });
    		navigator.serviceWorker.register('sw.js', { scope: '/' }).then(function(registration) {
    			// console.log('Registration successful, scope is:', registration.scope, navigator.serviceWorker);
          $().sw = registration;
          return;
          // registration.showNotification('sfasdfa');
    			registration.pushManager
          .subscribe({ userVisibleOnly: true })
          .then(function(sub) {
            // From your client pages:
            const channel = new BroadcastChannel('sw-messages');
            channel.addEventListener('message', event => {
              console.log('Received', event.data);
            });
    				console.log('SW', sub);
            // $().sw = registration.active;
    				$().sw.active.postMessage(
    					JSON.stringify({
    						hostname: document.location.hostname,
    						// device_id: $.temp.cookie.device_id,
    						// access_token: $.temp.cookie.access_token,
    						// id_token: $.temp.cookie.id_token,
    						// refresh_token:$.temp.cookie.refresh_token,
    					}),
    				);
    				// //console.log("Posted message");
    			});
    		})
    		.catch(function(error) {
    			// //console.log('Service worker registration failed, error:', error);
    		});
    	}
    },
    web() {
      // console.log('WEB');
      // const el = document.createElement('link');
      // el.rel = 'stylesheet';
      // el.href = 'https://aliconnect.nl/v1/api/css/web.css';
      // document.head.appendChild(el);
      // function require(){};
      $.temp.openItems = $.temp.openItems ? $.temp.openItems.split(',') : [];
    	window.console = window.console || { log: function() { } };
    	window.Object = window.Object || {
    		assign: function(dest) {
    			for (var i = 1, source; source = arguments[i]; i++) for (var name in source) dest[name] = source[name];
    			return dest;
    		},
    		values: function(obj) {
    			var arr = [];
    			for (var name in obj) arr.push(obj[name]);
    			return arr;
    		}
    	};
    	(function(arr) {
    		arr.forEach(function(item) {
    			if (item.hasOwnProperty('append')) {
    				return;
    			}
    			Object.defineProperty(item, 'append', {
    				configurable: true,
    				enumerable: true,
    				writable: true,
    				value: function append() {
    					const argArr = Array.prototype.slice.call(arguments);
    					const docFrag = document.createDocumentFragment();
    					argArr.forEach(function(argItem) {
    						const isNode = argItem instanceof Node;
    						docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
    					});
    					this.appendChild(docFrag);
    				}
    			});
    		});
    	})([Element.prototype, Document.prototype, DocumentFragment.prototype]);
    	let match = document.location.pathname.match(/(.*)(api|docs|omd|om)(?=\/)/);
    	if (match) {
    		$.basePath = match[0];
    	}
      localAttr.set = function(id, selector, context) {
        localAttr[id] = localAttr[id] || {};
        if (context === null) {
          delete localAttr[id][selector];
        } else {
          localAttr[id][selector] = context;
        }
        window.localStorage.setItem('attr', JSON.stringify(localAttr));
      };
    	$(document.documentElement).attr('lang', navigator.language);
      $().on('ready', async event => {
        //console.log('web ready');
        $.prompt({
          menu() {
            $('div').class('menu').parent(this.is.text('')).append(
              $('div').class('col')
              .append(
                $('a').class('abtn icn dark').dark(),
                $('a').text('abtn icn dark'),
              )
              .prompts(...$.const.prompt.menu.prompts)
              .append(
                $.elem.account = $('a').class('abtn account').caption('Account').href('#?prompt=account').draggable(),
              ),
            )
          },
          account() {
            if ($.authProvider.sub) {
              $('div').class('menu').parent(this.is.text('')).append(
                $('h1').text('Account'),
                $('div').class('col')
                .prompts(...[
                  'login_consent',
                  'logout',
                  // 'account_delete',
                  'account_beheer',
                  // 'account_domain_delete',
                ])//.concat(...(((($.const||{}).prompt||{}).account||{}).prompts||[])))
              )
            }
            // console.log($.const)
            //  else {
            //   $('div').class('menu').parent(this.is.text('')).append(
            //     $('h1').text('Account'),
            //     $('div').class('col').prompts(
            //       'login',
            //     ),
            //   )
            // }
          },
          help() {
            this.searchHelp = async function (search) {
              search = search.toLowerCase();
              $().url($().ref.home + '/_Sidebar.md').get().then(event => {
                // const match = event.target.responseText.match(/\[.*?\]\(.*?\)/g).map(s => s.match(/\[(.*?)\]\((.*?)\)/));
                const match = event.target.responseText.match(/\[.*?\]\(.*?\)/g).filter(s => s.toLowerCase().includes(search));
                this.resultList.text('').append(
                  event.target.responseText
                  .match(/\[.*?\]\(.*?\)/g)
                  .filter(s => s.toLowerCase().includes(search))
                  .map(s => $('a').text(s.replace(/\[(.*)\].*/,'$1')).href(`#/?l=${s.replace(/.*\((.*)\)/,$().ref.home + '/$1')}`))
                )
                // console.log(match, event.target.responseText);
              })
              // return;
              // const docs = await $().docs();
              // this.resultList.text('').append(...docs.find(search).map(item => $('a').text(item[0]).href('#?src='+item[1])))
            };
            $('form')
            .class('col')
            .parent(this.is.text(''))
            // .assign('onsubmit', event => event.preentDefault || (()=>{})())
            .assign('onsubmit', event => {
              event.preventDefault();
              this.searchHelp(event.target.search.value);
              event.target.search.select();
            })
            .append(
              $('h1').text('Help'),
            )
            .properties({
              search: {
                format: 'text',
                autocomplete: 'off',
                required: '1',
                autofocus: true,
              },
            })
            .append(
              $('button').class('abtn icn').text('ok').type('submit').tabindex(-1).default(''),
              this.resultList = $('div')
              .class('col')
              // $('div')
              .append(
                $().contract.documents.map(doc => $('li').append(
                  $('a').text(doc.title).href('#/?l=' + doc.url))
                )
              )
            )
          },
          config() {
            $('div').class('menu').parent(this.is.text(''))
            .append(
              $('h1').text('Settings'),
              this.divElem = $('div').class('col').prompts(...$.const.prompt.config.prompts).prompts('domain'),
            )
          },
          domain() {
            $('prompt').attr('open', null);
            return;
            // console.log();
            $('list').text('').append(
              $('div').class('col').append(
                $('h1').text('Settings'),
                $('form').append(
                  $('input').value(document.location.hostname.split(/\./)[0]),
                  $('input').type('submit').value('Rename'),
                ),
              ),
            );
            // setTimeout(() => $('prompt').attr('open', null), 100);
          },
          account_beheer() {
            const config = {
              Title: {
                config: { info:{ title: $.config.info.title || '' } }
              },
              Description: {
                config: { info:{ description: $.config.info.description || '' } }
              },
              Version: {
                config: { info:{ version: $.config.info.version || '' } }
              },
              Contact: {
                config: { info:{ contact: $.config.info.contact || { email: '' } } }
              },
              License: {
                config: { info:{ license: $.config.info.license || { email: '', url: '' } } }
              },
              "Base background color": {
                config: { css:{ basebg: $.config.css.basebg } }
              },
              "Base foreground color": {
                config: { css:{ basefg: $.config.css.basefg } }
              },
              "Data Management Server": { config: { client: $.config.client } },
              "Scope": { config: { scope: $.config.scope } },
              // "Test": { config: { client: {
              //   servers: [
              //     {
              //       url : "fsdfgsdfgsdfgdgfs: gjhg",
              //       n: 2,
              //       b: 'sdfgsdfgs',
              //       c: 'sd : fgsdfgs'
              //     },
              //     { url : 1, n: 2} ,
              //     { url : 1, n: 2} ,
              //     { url : 1, n: 2},
              //     'asdfa: sd',
              //     'asdfasd',
              //     { url : 1, n: 2},
              //   ],
              //   top: [
              //     'a',
              //     'a dfgs dfg s',
              //     'a',
              //   ]
              // } } },
            }
            const blockString = 'width:10px;height:10px;border-radius:10px;display:inline-block;margin:0 5px;';

            $().document(
              $('main').append(
                $('details').append(
                  $('summary').append($('h1').text('Config')),
                  $('div'),
                ).on('toggle', e => e.target.lastChild.innerText ? null : $(e.target.lastChild).append(
                  ...Array.from(Object.entries(config)).map(([key, field]) => [
                    $('details')
                    .append(
                      $('summary').text(key),
                      $('div'),
                    )
                    .on('toggle', event => event.target.lastChild.innerText ? null : $(event.target.lastChild).append(
                      $('div').class('code-header row').attr('ln', 'yaml').append(
                        $('span').class('aco').text('YAML'),
                        $('button').class('abtn edit').on('click', event => $(event.target.parentElement.nextElementSibling).editor('yaml')),
                        $('button').class('abtn view').on('click', event => {
                          $.client.api('/').post({
                            config:event.target.parentElement.nextElementSibling.innerText,
                            extend:1,
                          }).then(event => {
                            console.log(event.target.responseText);
                            document.location.reload();
                          })
                        }),
                      ),
                      $('div').class('code treecode').html($.string.yaml(YAML.stringify(field.config))),
                    )),
                  ]),
                )),

                // $('div').class('code').html($.string.yaml(YAML.stringify($.config)).split(/\n/).map(l => `<div level=${l.search(/\S/)}>${l}</div>`).join('')),
                // this.elCode = $('div').class('code treecode').html(YAML.stringify($.config).split(/\n/).map(l => `<div class=l${l.search(/\S/)}>${l}</div>`).join('')).contenteditable(''),
                this.elCode = $('div').on('keydown', e => {
                  // console.log(e);
                  if (e.keyPressed === 'ctrl_KeyS') {
                    const content = Array.from(e.target.children).map(el => el.innerText.replace(/\n/, '')).join('\n').trim();
                    console.log(content);
                    e.preventDefault();
                    $.client.api('/').post({
                      config: content,
                    }).then(event => {
                      console.log(event.target.responseText);
                      // document.location.reload();
                    })
                  }
                }).editor('yaml'),

                // $('h1').text('Config'),
                // $('h2').text('info'),
                $('h1').text('Domein'),
                $('details')
                .append(
                  $('summary').append($('h2').text('Verbruik')),
                  $('div').text('Gegevens worden verzameld'),
                )
                .on('toggle', detailsEvent => {
                  if (detailsEvent.target.open) {
                    $.client.api('/?request_type=account_verbruik').get().then(event => {
                      console.log(event.body);
                      const data = event.body;
                      var max_request_count;
                      function calc_max_request_count(max_request_count, value) {
                        return Math.max(max_request_count, Math.ceil(value/max_request_count)*max_request_count);
                      }
                      function bar(entries) {
                        var start = 0;
                        var s='background-image: linear-gradient(90deg, ';
                        entries.forEach(([color,size], i) => {
                          s+=`${color} ${start += size}%, `;
                          s+=entries[i+1] ? `${entries[i+1][0]} ${start}%, ` : `var(--trans3) ${start}%, var(--trans3) 100%);`;
                        })
                        return s;
                      }
                      function meter(data) {
                        const decimals = 0;
                        const max=data.max_count
                        const value = data.dir_size + data.item_count + data.request_count;
                        const tot = (data.dir_size + data.item_count + data.attribute_count + data.request_count).toFixed(decimals);
                        return $('div').append(
                          $('div').class('row').append(
                            $('span').text(data.periode),
                            $('small').style('margin-left:auto;').text(`${tot} MB van ${data.max_count} MB gebruikt`),
                          ),
                          $('div').style(`height:20px;border-radius:5px;`+bar([
                            ['var(--red)', data.dir_size/data.max_count*100],
                            ['var(--blue)', data.item_count/data.max_count*100],
                            ['var(--green)', data.attribute_count/data.max_count*100],
                            ['var(--yellow)', data.request_count/data.max_count*100],
                          ])),
                        );
                      }
                      $(detailsEvent.target.lastChild).text('').append(
                        ...data.periode.map(
                          periode => [
                            meter({
                              periode: periode.periode,
                              dir_size: Number(periode.dir_size/1024/1024),
                              item_count: Number(periode.item_count/1000),
                              attribute_count: Number(periode.attribute_count/1000),
                              request_count: Number(periode.request_count/1000),
                              max_count: data.max_count,
                            }),
                          ]
                        ),
                        $('div').append(
                          $('span').style(blockString+'background:var(--red);'),$('small').text(`Opslag`),
                          $('span').style(blockString+'background:var(--blue);'),$('small').text(`Items`),
                          $('span').style(blockString+'background:var(--green);'),$('small').text(`Attributes`),
                          $('span').style(blockString+'background:var(--yellow);'),$('small').text(`Traffic`),
                        ),
                      )
                    })
                  }
                }),
                $('details')
                .append(
                  $('summary').append($('h1').text('Domain accounts')),
                  $('div').text('Gegevens worden verzameld'),
                )
                .on('toggle', detailsEvent => {
                  if (detailsEvent.target.open) {
                    $.client.api('/?request_type=account_beheer').get().then(event => {
                      console.log(event.body);
                      $(detailsEvent.target.lastChild).text('').append(
                        // $('h1').text('Domain accounts'),
                        ...event.body.domain_accounts.map(row => $('li').text(row.host_keyname))
                      )
                    });
                  }
                  // $('p').text('Domain accounts'),
                }),
                $().contract && $().contract.verantwoordelijke ? [
                  $('h1').text('Verantwoordelijke'),
                  $('h1').text('Verwerkingsregister'),
                  $('a').text('Verwerkingsregister').href('#').on('click', e => {
                    $().url('https://aliconnect.nl/sdk/wiki/Verwerkingsregister.md').get().then(e => {
                      var content = e.target.responseText;
                      const gdpr = {};
                      const list = ['gdpr_type', 'category', 'involved', 'basis', 'target', 'processor', 'processor_location', 'term_days', 'encrypt'];
                      for (let [schemaName,schema] of $().schemas()) {
                        for (let [propertyName,property] of Object.entries(schema.properties)) {
                          if (property.gdpr_type) {
                            var obj = gdpr;
                            list.forEach(name => {
                              // console.log(name);
                              obj = obj[property[name]] = obj[property[name]] || {};
                            })
                          }
                        }
                      }
                      function listitem ([name,obj], level) {
                        // console.log(level);
                        content += '  '.repeat(level) + `- ${list[level]}: ${name}\n`;
                        if (obj) Object.entries(obj).forEach(entry => listitem(entry, level+1))
                      }
                      for (let [name,obj] of Object.entries(gdpr)) {
                        content += `# Verwerkingsactiviteiten van ${name}\n`;
                        Object.entries(obj).forEach(entry => listitem(entry, 0))
                      }
                      // console.log(content);
                      const elem = $('div').parent(promptElem).class('col abs').append(
                        $('div').class('row top abs btnbar').append(
                          $('span').class('aco'),
                          $('button').class('abtn close').on('click', event => elem.remove()),
                        ),
                        $('main').class('aco oa doc-content counter').md(content),
                      );
                    })
                  }),
                ] : null,
                $().contract && $().contract.verwerker ? [
                  $('h1').text('Verwerkers'),
                  $().contract.verwerker.map((verwerker, i) => [
                    $('h2').text(verwerker.bedrijfsnaam),
                    $('a').text('Verwerkers contract').href('#').on('click', e => {
                      $().url('https://aliconnect.nl/sdk/wiki/Verwerkers-overeenkomst.md').get().then(e => {
                        const content = e.target.responseText.replace(/-0-/, `-${i}-`);
                        $().document(
                          $('main').md(content)
                        );
                      })
                    }),
                  ]),
                ] : null,
              )
            )


            // this.elCode = $('pre').parent($(document.body).text('')).editor();

            $()
            .api(`/../config/${$.authProvider.sub}/config.yaml`)
            .get()
            .then(event => this.elCode.text(event.target.responseText.trim().replace(/\n\n/gs, '\n')));
          },
          account_profile() {},
          contact_profile() {},
          account_page() {},
          share_item() {
            const item = ItemSelected;
            if (!item) return $().prompt('');
            this.is.text('').append(
              $('h1').ttext('prompt-share_item-title'),
              $('div').ttext('prompt-share_item-description'),
              $('form').class('col').properties({
                accountname: { },
                accountname: { value: 'test.alicon@alicon.nl'},
                readonly: { format: 'checkbox', title: 'Alleen lezen', checked: true },
                // scope_granted: { value: (item.schemaName + '.read').toLowerCase() },
                scope_requested: { type: 'hidden', value: ($().scope||[]).join(' ') },
                tag: { type: 'hidden', value: item.tag },
              }).btns({
                next: { type:'submit', default: true, tabindex: 2 },
              }).on('submit', event => $.client.api('/' + item.tag).query('prompt', 'share_item').post(event).then(event => {
                // return console.log(event.body);
                this.is.text('').append(
                  $('h1').ttext('prompt-share_item-done-title'),
                  $('ol').append(
                    event.body.msg.map(msg => $('li').ttext(msg)),
                  ),
                  $('form').class('col').btns({
                    close: { type:'submit', default: true, tabindex: 2 },
                  }).on('submit', event => {
                    $().prompt('');
                    return false;
                  }),
                )
              }))
            );
          },
          account_delete() {
            this.is.text('').append(
              $('h1').ttext('prompt-account_delete-title'),
              $('div').ttext('prompt-account_delete-description'),
              $('form').class('col').properties({
                password: {
                  autocomplete: 'new-password',
                  type: 'password',
                  required: true,
                  title: 'Current password'
                },
              }).btns({
                next: { type:'submit', default:1 },
              }).on('submit', event => $.client.api('/').query('prompt', 'account_delete').post(event).then(event => {
                console.log(event.body);
                if (event.body === 'code_send') {
                  this.is.text('').append(
                    $('h1').ttext('prompt-sms_verification_code-title'),
                    $('div').ttext('prompt-sms_verification_code-description'),
                    $('form').class('col').properties({
                      code: {
                        required: true,
                        title: 'code'
                      },
                    }).btns({
                      next: { type:'submit', default: true, tabindex: 2 },
                    }).on('submit', event => $.client.api('/').query('prompt', 'account_delete').post(event).then(event => {
                      $().logout();
                      document.location.href = '/';
                      return;
                      this.is.text('').append(
                        $('h1').ttext('prompt-account_delete-done-title'),
                        $('div').ttext('prompt-account_delete-done-description'),
                        event.body.msg.map(msg => $('li').ttext(msg)),
                        $('form').class('col').btns({
                          next: { type:'submit', default: true, tabindex: 2 },
                        }).on('submit', event => {
                          $().prompt('');
                          return false;
                        }),
                      )
                    }))
                  )
                }
              }))
            )
          },
          account_delete_domain() {
            this.is.text('').append(
              $('h1').ttext('prompt-account_delete_domain-title'),
              $('div').ttext('prompt-account_delete_domain-description'),
              $('form').class('col').properties({
                password: {
                  autocomplete: 'new-password',
                  type: 'password',
                  required: true,
                  title: 'Current password'
                },
              }).btns({
                next: { type:'submit', default:1 },
              }).on('submit', event => $.client.api('/').query('prompt', 'account_delete_domain').post(event).then(event => {
                console.log(event.body);
                if (event.body === 'code_send') {
                  this.is.text('').append(
                    $('h1').ttext('prompt-sms_verification_code-title'),
                    $('div').ttext('prompt-sms_verification_code-description'),
                    $('form').class('col').properties({
                      code: {
                        required: true,
                        title: 'code'
                      },
                    }).btns({
                      next: { type:'submit', default: true, tabindex: 2 },
                    }).on('submit', event => $.client.api('/' + item.tag).query('prompt', 'account_delete_domain').post(event).then(event => {
                      this.is.text('').append(
                        $('h1').ttext('prompt-account_delete_domain-done-title'),
                        $('div').ttext('prompt-account_delete_domain-done-description'),
                        event.body.msg.map(msg => $('li').ttext(msg)),
                        $('form').class('col').btns({
                          next: { type:'submit', default: true, tabindex: 2 },
                        }).on('submit', event => {
                          $().prompt('');
                          return false;
                        }),
                      )
                    }))
                  )
                }
              }))
            )
          },
          account_domain() {
            const searchParams = new URLSearchParams(document.location.search);
            this.is.text('').append(
              $('h1').ttext('Account domain'),
              $('p').ttext(`The domain ${searchParams.get('domain')||''} is not registered.`),
            );
            if ($.authProvider.sub) {
              this.is.text('').append(
                $('p').ttext(`If you want to register this domain select next?`),
                $('p').ttext(`You agree our ...?`),
                this.elemMessage = $('div').class('msg'),
                $('form').class('col').properties({
                  domain_name: { value: (searchParams.get('domain')||'').split(/\./)[0]},
                }).btns({
                  next: { type:'submit', default:1 },
                }).on('submit', event => $.client.api('/account/account_domain').post(event).then(event => {
                  const data = event.body;
                  this.elemMessage.html(data.msg || '');
                  if (data.url) {
                    // return console.error(data.url, data);
                    const url = $()
                    .url('https://login.aliconnect.nl/')
                    .query({
                      prompt: 'login',
                      response_type: 'code',
                      client_id: data.client_id,
                      redirect_uri: data.url,
                      // state: state,
                      scope: $().scope,//('all'),
                      // socket_id: data.socket_id,
                    });
                    return document.location.href = url.toString();
                    // return document.location.href = data.url;
                  }
                  console.log('DONE', data);
                  // this.is.text('').append(
                  //   $('h1').ttext('Domain created')
                  // );
                }))
              )
            }
          },
          account_domain_delete() {
            const searchParams = new URLSearchParams(document.location.search);
            this.is.text('').append(
              $('h1').ttext('Account domain delete'),
              $('p').ttext(`Delete the domain ${searchParams.get('domain')||''}.`),
            );
            if ($.authProvider.sub) {
              this.is.text('').append(
                $('p').ttext(`If you want to delete this domain select next?`),
                this.elemMessage = $('div').class('msg'),
                $('form').class('col').properties({
                  // domain_name: { value: (searchParams.get('domain')||'').split(/\./)[0]},
                })
                .btns({
                  next: { type:'submit', default:1 },
                })
                .on('submit', event => $.client.api('/account/account_domain_delete').post(event).then(event => {
                  const data = event.body;
                  if (data.url) {
                    return document.location.href = data.url;
                  }
                  return console.error(data);
                }))
              )
            }
          },
          account_overview() {
            $().prompt('');
            const panel = $('div').panel();
            console.log('account_overview', panel);
            $.client.api('/').query('prompt', 'account_overview').get().then(event => {
              const account = event.body;
              console.log('ACCOUNT OVERVIEW', account);
              panel.elemMain.append(
                $('h1').text([].concat(account.Name).shift().Value),
              );
            })
          },
          account_config() {
            $()
            .prompt('')
            .api('/')
            .query('account','')
            .accept('yaml')
            .get().then(event => $().account_config(event.body))
          },
          set_customer(event) {
            $('a').ttext('set_customer').on('click', $().shop.setCustomer());
          },
          account_password() {
            this.is.text('').append(
              $('h1').ttext('Change password'),
              // $('div').ttext('Create account description'),
              $('form').class('col').properties({
                accountname: {
                  type: 'text',
                  autocomplete: 'username',
                  pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
                  // required: true,
                  autofocus: true,
                  title: 'Username'
                },
                password: {
                  autocomplete: 'current-password',
                  autocomplete: 'new-password',
                  type: 'password',
                  // required: true,
                  title: 'Current password'
                },
                password1: {
                  autocomplete: 'new-password',
                  type: 'password',
                  // required: true,
                  title: 'New password'
                },
                password2: {
                  autocomplete: 'new-password',
                  type: 'password',
                  // required: true,
                  title: 'New password repeat'
                },
              }).btns({
                next: { type:'submit', default:1 },
              }).on('submit', event => $().url('/api/account/password').post(event).then(event => this.is.text('').append(
                $('h1').ttext('Password changed')
              )))
            )
          },
          account_mobile() {
            this.is.text('').append(
              $('h1').ttext('Account mobile'),
              $('form').class('col').properties({
                mobilenumber: {
                  title: 'Mobile_number',
                  required: true,
                  type: 'tel',
                  min:1000000000,
                  max:9999999999,
                },
              }).btns({
                next: { type:'submit', default:1 },
              }).on('submit', event => $().url('/api/account/phone').post(event).then(event => this.is.text('').append(
                $('h1').ttext('SMS verification code'),
                $('form').class('col').properties({
                  code: {
                    type: 'number',
                  },
                }).btns({
                  next: { type:'submit', default:1 },
                }).on('submit', event => $().url('/api/account/phone').post(event).then(event => this.is.text('').append(
                  $('h1').ttext('Email changed')
                )))
              )))
            )
          },
          account_email() {
            this.is.text('').append(
              $('h1').ttext('Account email'),
              $('form').class('col').properties({
                email: {
                  required: true,
                  type: 'email',
                },
              }).btns({
                next: { type:'submit', default:1 },
              }).on('submit', event => $().url('/api/account/email').post(event).then(event => this.is.text('').append(
                $('h1').ttext('Email verification code'),
                $('form').class('col').properties({
                  code: {
                    type: 'number',
                  },
                }).btns({
                  next: { type:'submit', default:1 },
                }).on('submit', event => $().url('/api/account/email').post(event).then(event => this.is.text('').append(
                  $('h1').ttext('Password changed')
                )))
              )))
            )
          },
          login_consent() {
            $.authProvider.login({
              scope: 'name email phone_number',
              prompt: 'consent',
            });
            // $().nav().reload($.authProvider.loginUrl('consent'))
          },
          login() {
            document.location.href = $().loginUrl().toString();
            return;
            console.log('PROMPT LOGIN', $())
            $.authProvider.login({
              scope: $.config.scope || "",//'name email phone_number',
              redirect_uri: document.location.origin+document.location.pathname,
            });
            // $().nav().reload($.authProvider.loginUrl())
          },
          logout() {
            $.authProvider.logout();
            return;
            event = event || window.event;
            if ($.temp.cookie.id_token) {
              if (event.type !== 'message') {
                new $.WebsocketRequest({
                  to: {
                    nonce: $.auth.id.nonce,
                  },
                  path: '/?prompt=logout',
                });
              }
              // $().emit('logout');
            }
            // alert('LOGOUT');
            $.temp.cookie = {
              id_token: $.auth.id_token = null,
              access_token: $.auth.access_token = null,
              refresh_token: $.auth.refresh_token = null,
            };
            if (document.location.protocol === 'file:') {
              $.history.replaceUrl( '#');
              return $.reload();
            }
            // let url = 'https://login.aliconnect.nl/api/oauth?' + new URLSearchParams({
            //   prompt: 'logout',
            //   redirect_uri: document.location.origin + document.location.pathname,
            // }).toString();
            // $.reload(url);
          },
          login_msa() {
            $().msa().signIn(msaRequest)
          },
          terms_of_use() {
            // ['termsOfUse', 'https://aliconnect.aliconnect.nl/docs/index/1-Explore/9-TermsOfUse'],
          },
          privacy_policy() {
            // ['Privacy policy', 'https://aliconnect.nl/docs/index/1-Explore/9-TermsOfUse/Privacypolicy'],
          },
          cookie_policy() {
            // ['Cookie policy', 'https://aliconnect.nl/docs/index/1-Explore/9-TermsOfUse/Cookiepolicy'],
          },
          upload_datafile() {
            // $('a').ttext('Upload datafile').href('#/Upload/show()'),
          },
          import_outlook_mail() {
            // $('a').ttext('Importeer geselcteerde mail uit outlook').href('#/outlook/import/mail()'),
          },
          import_outlook_contact() {
            // $('a').ttext('Importeer contacten uit outlook').href('#/outlook/import/mail()'),
          },
          sitemap() {
          },
          get_api_key() {
          },
          get_aliconnector_key() {
            $.clipboard.copyToClipboard({
              sid: $().ws().socket_id,
            });
            $().prompt('');
          },
          shop() {
            $('form').parent(this.is.text('')).append(
              $('h1').text('Shop'),
            )
          },
          task() {
            $('form').parent(this.is.text('')).append(
              $('h1').text('Tasks'),
            )
          },
          msg() {
            $('form').parent(this.is.text('')).append(
              $('h1').text('Messages'),
            )
          },
          chat() {
            $('form').parent(this.is.text('')).append(
              $('h1').text('Chat'),
            )
          },
          lang() {
            $('form').parent(this.is.text('')).append(
              $('h1').text('Language'),
            )
          },
          scope_accept() {
            // this.n='ooo';
            $('form')
            .class('col')
            .parent(this.is.text(''))
            .append(
              $('h1').text('JA', document.location.search),
            );
            // this.on('open', event => {
            //   alert('OPEN');
            // });
            // this.show = par => {
            //   alert('SHOW');
            // };
            // return;
  				},

          // DEBUG: verwijderen, is opgenomen in account_admin
          verwerkingsregister() {
            $().prompt();
            $('list').load('https://aliconnect.nl/sdk/wiki/Verwerkingsregister.md', content => {
              const gdpr = {};
              const list = ['gdpr_type', 'category', 'involved', 'basis', 'target', 'processor', 'processor_location', 'term_days', 'encrypt'];
              for (let [schemaName,schema] of $().schemas()) {
                for (let [propertyName,property] of Object.entries(schema.properties)) {
                  if (property.gdpr_type) {
                    var obj = gdpr;
                    list.forEach(name => {
                      // console.log(name);
                      obj = obj[property[name]] = obj[property[name]] || {};
                    })
                  }
                }
              }
              function listitem ([name,obj], level) {
                console.log(level);
                content += '  '.repeat(level) + `- ${list[level]}: ${name}\n`;
                if (obj) Object.entries(obj).forEach(entry => listitem(entry, level+1))
              }
              for (let [name,obj] of Object.entries(gdpr)) {
                content += `# Verwerkingsactiviteiten van ${name}\n`;
                Object.entries(obj).forEach(entry => listitem(entry, 0))
              }
              console.log(gdpr);
              return content;
            });
          },
          async schema_design() {
            $().prompt();
            // await $('list').load('https://aliconnect.nl/sdk/wiki/Verwerkingsregister.md');
            $('list').docElem.text('').append(
              ...Array.from($().schemas()).map(([schemaName,schema]) => [].concat(
                $('h1').text(schemaName),
                $('h2').text('Properties'),
                ...Object.entries(schema.properties).map(([propertyName,property]) => [
                  $('div').text(propertyName),
                  $('ul').append(
                    ...Object.entries(property).map(([metaName,meta]) => $('li').append(
                      $('code').text(metaName),
                      $('span').text(`: ${meta}`),
                    )),
                  )
                ]),
              ))
            )
            // console.log('aaaaaa', $('list').docElem.text());

          },


          // accept() {
          //   return;
          //   const searchParams = new URLSearchParams(document.location.search);
          //   // const redirect_uri = searchParams.get('redirect_uri');
          //   // const url = new URL(redirect_uri);
          //   const scope = searchParams.get('scope').split(' ');
          //   const properties = Object.fromEntries(scope.map(val => [val, {
          //     name: val,
          //     format: 'checkbox',
          //     checked: 1,
          //   }]))
          //   properties.expire_time = {format: 'number', value: 3600};
          //   const form = newform(this, arguments.callee.name, {
          //     properties: properties,
          //     btns: {
          //       deny: { name: 'accept', value:'deny', type:'button' },
          //       allow: { name: 'accept', value:'allow', type:'submit', default: true },
          //     }
          //   }).append(qr())
          // },
          ws_socket_id() {
            //console.log('ws_socket_id', $.WebsocketClient.responseBody, $.auth.request);
            // return;
            if (!$.WebsocketClient.responseBody || !$.WebsocketClient.responseBody.from_id) {
              //console.warn('No websocket data in last received websocket response');
              $.request('?prompt=init');
              return;
            }
            if ($.auth.request) {
              new $.WebsocketRequest({
                to: { sid: $.WebsocketClient.responseBody.from_id },
                path: '/?prompt=accept&client_id=' + $().client_id,
                body: {
                  scope: $.auth.request,
                  url: document.location.href,
                },
              });
            } else {
              new $.WebsocketRequest({
                to: { sid: $.WebsocketClient.responseBody.from_id },
                path: '/?prompt=ws_get_id_token&client_id=' + $().client_id,
              });
            }
          },
          ws_set_id_token() {
            if (!$.WebsocketClient.responseBody || !$.WebsocketClient.responseBody.from_id) {
              return $.request('?prompt=init');
            }
            $.auth.login({scope: $.auth.scope, id_token: $.WebsocketClient.responseBody.body.id_token  });
          },
          ws_login_code() {
            // return //console.log($.WebsocketClient.responseBody.body, $.auth.login.callback);
            // let body = $.WebsocketClient.responseBody.body;
            $.WebsocketClient.responseBody.body.client_id = $().client_id;
            $.WebsocketClient.responseBody.body.redirect_uri = document.location.origin + document.location.pathname;
            // return //console.debug('https://login.aliconnect.nl/api/oauth?' + new URLSearchParams($.WebsocketClient.responseBody.body).toString());
            document.location.href = 'https://login.aliconnect.nl/api/oauth?' + new URLSearchParams($.WebsocketClient.responseBody.body).toString();
          },
          ws_auth_code() {
            // return //console.log($.WebsocketClient.responseBody.body, $.auth.login.callback);
            $.auth.get_access_token($.WebsocketClient.responseBody.body, $.auth.login.callback);
          },
          app_response_access_token() {
            if (!$.WebsocketClient.responseBody || !$.WebsocketClient.responseBody.from_id) {
              //console.warn('No websocket data in last received websocket response');
              $.request('?prompt=init');
              return;
            }
            //console.log('app_response_access_token', $.WebsocketClient.responseBody);
            $().emit('access_token', $.WebsocketClient.responseBody.body.access_token);
          },
          qrscan() {
            const video = $('video').elem;
            const state = $('div');
            this.is.text('').append(
              state,
              video.is,
            ).btns({
              back: { href: '#?prompt=login'}
            });
            (async function () {
              // console.log($.config.apiPath + '/js/qrscan.js');
              // console.log(1,window.jsQR);
              await $.script.import($.config.apiPath + '/js/qrscan.js');
              // console.log(2,window.jsQR);
              // return;
              video.is.attr('playsinline', '');
              const canvasElement = $('canvas').style('display:none').elem;
              const canvas = canvasElement.getContext("2d");
              function drawLine(begin, end, color) {
                canvas.beginPath();
                canvas.moveTo(begin.x, begin.y);
                canvas.lineTo(end.x, end.y);
                canvas.lineWidth = 4;
                canvas.strokeStyle = color;
                canvas.stroke();
              }
              navigator.mediaDevices.getUserMedia({
                video: {
                  facingMode: "environment",
                  frameRate: {
                    ideal: 5,
                    max: 10
                  }
                }
              }).then(function (stream) {
                // navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function (stream) {
                videostream = video.srcObject = stream;
                video.is.attr("playsinline", true); // required to tell iOS safari we don't want fullscreen
                video.play();
                requestAnimationFrame(tick);
              });
              function tick() {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                  canvasElement.hidden = false;
                  canvasElement.height = video.videoHeight;
                  canvasElement.width = video.videoWidth;
                  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
                  var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
                  var code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert", });
                  if (code && code.data) {
                    if (code.data.includes('aliconnect.nl')) {
                      videostream.getTracks().forEach(track => track.stop());
                      canvas.clearRect(0, 0, canvasElement.width, canvasElement.height);
                      canvasElement.hidden = true;
                      canvasElement.style.display = 'none';
                      $().ws().sendto(code.data.split('s=').pop(), {
                        path: '/?prompt=mobile',
                      }).then(body => {
                        if (body === 'request_id_token') {
                          $().ws().reply({
                            id_token: window.localStorage.getItem('id_token'),
                          }).then(body => {
                            if (body.prompt) {
                              panel = $().prompt(body.prompt);//.show(body.par);
                              panel.append(
                                $('div').text('JA NU LUKT HET, VRAAG OM ACCEPT'),
                              )
                            } else {
                              $().prompt('');
                            }
                          });
                        }
                      });
                    }
                  }
                }
                requestAnimationFrame(tick);
              }
            }())
          },
        });
        // await $().emit('ready');
        // //console.log('web ready2',$(), $().ws());
        // $.prompt('TEST', event => {
        // 	alert(1);
        // });
        // $.prompt('TEST');
        // return;
        // initConfigCss();
        loadStoredCss();
        // loadStoredAttr();
        // initAllSeperators()
        if (document.getElementById('colpage')) {
          Object.assign(document.getElementById('colpage'), {
            cancel(event) {
              //console.log('PAGE CANCEL', this);
            },
            keydown: {
              F2(event) {
                if (this.item) {
                  this.item.PageEditElement()
                }
              }
            },
          });
        }
        // //console.log('AFTER READY', document.location.hostname);
        // setTimeout(() => {
        //   //console.log('web after ready')
        //   $(window).emit('popstate');
        //   $(window).emit('focus');
        // })
        //console.log('web ready done')
      });
      // this.sw();
    },
    _om() {
      // console.error('OM');
      function childObject(object, schemaname) {
        // console.log(schemaname);
        if (object) {
          const obj = Object.fromEntries(Object.entries(object).filter(([name, obj]) => typeof obj !== 'object'));
          obj.children = Object
          .entries(object)
          .filter(([name, obj]) => typeof obj === 'object')
          .map(([name, obj]) => Item.get(Object.assign({
            schema: schemaname,
            name: name,
            title: name.replace(/^\d+[-| ]/,'')
          }, childObject(obj, schemaname))));
          return obj;
        }
      }
      $().on({
        async load() {
          ($().server = $().server || {}).url = $().server.url || ('//' + document.location.hostname.split('.')[0] + '.aliconnect.nl/api');
          if (!$().client_id) {
            await $().url($().server.url+'/').get().then(event => {
              $.config = event.body;
              $.temp.api_parameters = {};
              (function loadpar(arr, path = '') {
                if (arr) {
                  for (let [key,value] of Object.entries(arr)) {
                    if (typeof value === 'object') {
                      loadpar(value, `${path}${key}-`);
                    } else {
                      // console.log(`%${path}${key}%`,value);
                      $.temp.api_parameters[`%${path}${key}%`] = value;
                    }
                  }
                }
              })(event.body);
            }).catch(console.error);
            // console.warn(1, $.client.api('/').toString());
            // await $().url($().server.url+'/').get().then(event => console.log(JSON.stringify(JSON.parse(event.target.responseText),null,2).replace(/"(\w+)"(?=: )/gs,'$1'))).catch(console.error);
          }
          $(document.documentElement).class('app');
          $(document.body).class('col aim om bg').id('body').append(
            $.elem.navtop = $('header').id('navtop').class('row top bar noselect np').append(
              $.elem.menu = $('a').class('abtn icn menu').on('click', event => {
                if ($.elem.menuList && $.elem.menuList.style()) {
                  $.elem.menuList.style('');
                } else {
                  if ($.elem.menuList) $.elem.menuList.style('display:none;');
                  $(document.body).attr('tv', document.body.hasAttribute('tv') ? $(document.body).attr('tv')^1 : 0)
                }
              }),
              $('a').class('title').id('toptitle').on('click', event => $().start() ),
              $('form').class('search row aco')
              .on('submit', event => {
                const value = $.searchValue = event.target.search.value;
                var result = value
                ? [...$.props.values()]
                .filter(item => item instanceof Item)
                .unique()
                .filter(item => item.header0 && value.split(' ').every(value => [item.header0,item.name].join(' ').match(new RegExp(`\\b${value}\\b`, 'i'))))
                : [];
                $().list(result);
                return false;
              })
              .append(
                $('input').name('search').autocomplete('off').placeholder('zoeken'),
                $('button').class('abtn icn search fr').title('Zoeken'),
              ),
              $('a').class('abtn icn dark').dark(),
            ),
            $('section').id('section_main').class('row aco main section_main').append(
              $('section').tree().id('tree').css('max-width', $().storage('tree.width') || '200px'),
              // .append(
              //   this.elemToggleButtonTreeview = $('div').class('toggle-button left').append(
              //     $('div').class('toggle-button-inner left').append(
              //       $('span').class('icon icon-shevron-left')
              //     ).on('click', event => {
              //       $(document.body).attr('tv', $(document.body).attr('tv')^1);
              //     })
              //   )
              // )
              // .on('mouseenter', event => {
              //   console.log('mouseenter');
              //   clearTimeout(this.to);
              //   this.elemToggleButtonTreeview.attr('visible', '')
              // })
              // .on('mouseleave', event => {
              //   this.to = setTimeout(() => this.elemToggleButtonTreeview.attr('visible', null), 1000);
              //   // $(event.target).
              //   // $('div').class('toggle-button-visible')
              // }),
              $('div').seperator(),
              $('section').id('list').list(),
              $('div').seperator('right'),
              $('section').id('view').class('col aco apv printcol').css('max-width', $().storage('view.width') || '600px'),
              $('section').id('preview').class('col aco apv info'),
              $('section').class('row aco doc').id('doc'),
              $('section').class('prompt').id('prompt').tabindex(-1).append(
                $('button').class('abtn abs close').attr('open', '').tabindex(-1).on('click', event => $().prompt(''))
              ),
            ),
            $('footer').statusbar(),
          );
          $(document.body).messagesPanel();
          // console.log(document.location.hostname.split('.')[0]);
          // console.warn($().server.url, $());
          await $().translate();
          // await $().getApi(document.location.origin+'/api/');
          await $().login();
          // $().extend($.config);
          // console.log($.authProvider);
          if ($.authProvider.sub) {
            await $().url($().server.url+`/../config/${$.authProvider.sub}/config.json`).get().then(event => {
              $($.config).extend($.api_user = event.body);
            }).catch(err => {
              $.api_user = {};
            });
            $().extend($.config);
            // await $().url($().server.url+`/config/${$.authProvider.sub}/api.json`).get().then(event => $().extend(event.body));
            if ('Notification' in window) {
              var permission = Notification.permission;
              // const notificationPermission = Notification.permission.toString();
              // console.log('Notification', permission);
              if (Notification.permission === 'default') {
                $.elem.navtop.append(
                  $('a').class('abtn').text('Notifications').on('click', event => Notification.requestPermission())
                )
              }
              // if (!['denied','granted'].includes(Notification.permission)) {
              //   this.elemNavtop.append(
              //     // $('a').class('abtn').test('Notifications').on('click', event => Notification.requestPermission())
              //   )
              // }
            }
            $.elem.navtop
            .prompts(...$.const.prompt.menu.prompts)
            .append(
              $.elem.account = $('a').class('abtn account').caption('Account').href('#?prompt=account').draggable(),
            );
            if ($().menu) {
              $().menuChildren = childObject($().menu).children;
              $().tree(...$().menuChildren);
            }
            if ($.aud = await $(`/Company(${$.authProvider.aud})`).details()) {
              $().tree($.aud)
            }
            if ($.user = await $(`/Contact(${$.authProvider.sub})`).details()) {
              $().tree($.user);
              await $.client.api(`/`).query('request_type','visit').get().then(event => $().history = event.body);
              $.elem.account.item($.user, 'accountElem');
              $.user.emit('change');
              if ($.user.data.mse_access_token) {
                $()
                .schemas('msaEvent', {
                  properties: {
                    title: {
                      get() {
                        // console.log(this);
                        return this.data.start ? `${this.data.start.dateTime} ${this.data.start.endTime}` : '';
                      },
                    },
                    subject: {},
                    summary: {
                      get(){
                        // console.log(this);
                        return `${this.data.organizer.emailAddress.name} (${this.data.organizer.emailAddress.address})`;
                      },
                    },
                    // "@odata.etag": {},
                    // id: {},
                    start: {},
                    end: {},
                    organizer: {}
                  }
                })
                .schemas('msaContact', {
                  // title() {
                  //   return this.combine('displayName');
                  // },
                  // subject() {
                  //   return this.combine('givenName,firstName,middleName,lastName,companyName');
                  // },
                  header: [
                    ['DisplayName'],
                    ['GivenName','FirstName','MiddleName','LastName','CompanyName'],
                    [],
                  ],
                  // filterfieldnames: 'Surname,CompanyName',
                  properties: {
                    // "@odata.etag": {},
                    // id: {},
                    // createdDateTime: {},
                    // lastModifiedDateTime: {},
                    // changeKey: {},
                    // parentFolderId: {},
                    // fileAs: {},
                    // categories: {},
                    DisplayName: {
                      legend: 'Personalia',
                    },
                    Initials: {
                    },
                    GivenName: {
                    },
                    MiddleName: {
                    },
                    Surname: {
                    },
                    Title: {
                    },
                    nickName: {
                    },
                    // yomiGivenName: {},
                    // yomiSurname: {},
                    // yomiCompanyName: {},
                    // imAddresses: {},
                    companyName: {
                      legend: 'Business',
                    },
                    department: {
                    },
                    officeLocation: {
                    },
                    profession: {
                    },
                    jobTitle: {
                    },
                    assistantName: {
                    },
                    manager: {
                    },
                    businessHomePage: {
                    },
                    emailAddresses: {
                      legend: 'Contact',
                    },
                    mobilePhone: {
                    },
                    businessPhones: {
                    },
                    businessAddress: {
                    },
                    otherAddress: {
                    },
                    homePhones: {
                      legend: 'Personal',
                    },
                    homeAddress: {
                    },
                    birthday: {
                    },
                    spouseName: {
                    },
                    children: {
                    },
                    generation: {
                    },
                    personalNotes: {
                    },
                  }
                })
                .schemas('msaMessage', {
                  title() {
                    return this.data.from ? (this.data.from.emailAddress.name ? this.data.from.emailAddress.name : this.data.from.emailAddress.address) : '';
                  },
                  subject() {
                    return this.data.subject;
                  },
                  bodyPreview() {
                    return this.data.bodyPreview;
                  },
                  properties: {
                    // "@odata.etag": {},
                    // createdDateTime: {},
                    // lastModifiedDateTime: {},
                    // id: {},
                    // changeKey: {},
                    // hasAttachments: {},
                    // isDeliveryReceiptRequested: {},
                    // isReadReceiptRequested: {},
                    // isRead: {},
                    // isDraft: {},
                    // flag: {},
                    // bodyPreview: {},
                    // parentFolderId: {},
                    // conversationId: {},
                    // conversationIndex: {},
                    // internetMessageId: {},
                    // receivedDateTime: {},
                    // sentDateTime: {},
                    // importance: {},
                    // inferenceClassification: {},
                    // from: {},
                    // sender: {},
                    // toRecipients: {},
                    // ccRecipients: {},
                    // bccRecipients: {},
                    // replyTo: {},
                    // webLink: {},
                    // categories: {},
                    subject: {},
                    body: {},
                  }
                })
                .schemas('msaNotebook', {
                  properties: {
                    title: {
                      get: 'displayName',
                    },
                    summary: {
                      get() {
                        return `${this.data.lastModifiedDateTime} ${this.data.lastModifiedBy.user.displayName}`
                      },
                    },
                    // createdDateTime: {},
                    // createdBy: {},
                    // lastModifiedDateTime: {},
                    // lastModifiedBy: {},
                    // id: {},
                    isDefault: {},
                    isShared: {},
                    self: {},
                    displayName: {},
                    userRole: {},
                    sectionsUrl: {},
                    sectionGroupsUrl: {},
                    links: {}
                  }
                });
                $().tree(...childObject({
                  Outlook: {
                    Contacts: {
                      onclick: event => $().msa().getContacts(),
                    },
                    Events: {
                      onclick: event => $().msa().getEvents(),
                    },
                    Messages: {
                      onclick: event => $().msa().getMessages(),
                    },
                    Notes: {
                      onclick: event => $().msa().getNotes(),
                    },
                  }
                }).children);
              }
            }
            // $().url('https://aliconnect.nl/api/').query('request_type', 'build_doc').get().then(event => {
            //   console.log('DOCBUILD', event.body);
            //   $($).extend(event.body);
            //   $().tree(...childObject($.docs, 'Chapter').children);
            // });
          } else {
            $().extend($.config);
            $.elem.navtop
            .append(
              $('a').class('abtn login').text('Aanmelden').href($().loginUrl().query('prompt', 'login').toString()),
            );
            // $(document.documentElement).class('site');
            //
            // $('navtop').append(
            //   $.elem.menu = $('a').class('abtn icn menu').on('click', event => {
            //     if ($.elem.menuList && $.elem.menuList.style()) {
            //       $.elem.menuList.style('');
            //     } else {
            //       if ($.elem.menuList) $.elem.menuList.style('display:none;');
            //     }
            //   }),
            //   $('a').class('title').href('/').id('toptitle'),
            //   $('form').class('search row aco'),
            //   $('a').class('abtn icn dark').dark(),
            //   $.elem.account = $('a').class('abtn account').caption('Account').href('#?prompt=account').draggable(),
            // );
            //
            // $('section_main').append(
            //   $('section').id('list').list(),
            //   $('div').seperator('right'),
            //   $('section').id('view').class('col aco apv printcol').css('max-width', $().storage('view.width') || '600px'),
            //   $('section').id('preview').class('col aco apv info'),
            //   $('section').class('row aco doc').id('doc'),
            //   $('section').class('prompt').id('prompt').append(
            //     $('button').class('abtn abs close').attr('open', '').on('click', event => $().prompt(''))
            //   ),
            // );
            //
          }
          // return;
          // if ($().schemas()) {
          //   const itemItem = $().schemas().get('Item');
          //   if (itemItem) {
          //     itemItem.HasChildren = true;
          //     [...$().schemas().values()].forEach(item => {
          //       if (item !== itemItem) {
          //         if (!item.Master || !item.Master.LinkID) {
          //           $(item).Master = { LinkID: itemItem.ID };
          //         }
          //         // console.log(item.name, item.SrcID, item.MasterID);
          //         if (!item.SrcID || item.SrcID !== item.MasterID) {
          //           $(item).Src = { LinkID: item.MasterID };
          //         }
          //       }
          //     });
          //     $().tree($().schemas().get('Item'));
          //   }
          //   if ($().schemas().has('Equipment')) {
          //     $.client.api(`/Equipment`).select($.config.listAttributes).top(10000).filter('keyID IS NOT NULL').get()
          //   }
          // }
          if ($().aud) {
            // console.log($().aud, $({tag: `Company(${$().aud})`}));
            $.elem.menu.showMenuTop($({tag: `Company(${$().aud})`}));
          }
          if ($().info) {
            $('toptitle').text(document.title = $().info.title).title([$().info.description,$().info.version,$().info.lastModifiedDateTime].join(' '));
          }
          // console.log(document.location.application_path);
          $().application_path = $().application_path || '/';
          // var url = new URL(document.location);
          // $().pageHome = $().pageHome || '//' + document.location.hostname.replace(/([\w\.-]+)\.github\.io/, 'github.com/$1/$1.github.io') + '/wiki/Home';
          $().ref = $().ref || {};
          $().ref.home = $().ref.home || '//aliconnect.nl/sdk/wiki';
          console.log($().ref.home);

          if (!document.location.search) {
            window.history.replaceState('page', '', '?l='+url_string($().ref.home));
            // $().execQuery('l', $().ref.home, true );
            // $().execQuery('l', document.location.origin);
          }
          // if (document.location.pathname === $().application_path && !document.location.search) {
          //   window.history.replaceState('page', 'PAGINA', '?p='+($().ref && $().ref.home ? $().ref.home : document.location.origin));
          //   // $(window).emit('popstate');
          // }
          // $(document.body).cookieWarning();
          function response(event) {
            console.log(event.target.responseText);
          }
        },
        async ready() {
          // alert('om ready');
          // console.log($());
          // const msalConfig = {
          //   auth: {
          //     clientId: '4573bb93-5012-4c50-9cc5-562ac8f9a626',
          //     clientId: '24622611-2311-4791-947c-5c1d1b086d6c',
          //     redirectUri: 'https://aliconnect.nl/graph/',
          //     redirectUri: 'http://localhost:8080',
          //     redirectUri: 'https://aliconnect.nl'
          //   }
          // };
          // const msaRequest = {
          //   scopes: [
          //     'User.Read',
          //     'Mailboxsettings.Read',
          //     'Calendars.ReadWrite',
          //     'Contacts.ReadWrite',
          //     'Mail.Read',
          //     'Notes.ReadWrite.All',
          //   ]
          // }
          // $().msa(msalConfig);
          // console.log($.msa);
          // $().msa().api('/me/contacts').top(900).get().then(response => {
    			// 	response.value.forEach(item => aim.Item.toItem(item, 'msaContact'));
    			// 	// aim().list(response.value)
    			// }).catch(error => {
    			// 	console.error(error, error);
    			// });
          // if ($().schemas().has('Equipment')) {
          //   $.client.api(`/Equipment`).select($.config.listAttributes).top(10000).filter('keyID IS NOT NULL').get()
          // }
          // .then(event => console.log('Equipment', event.body))
        },
        logout() {
          // document.location.href='/om/?prompt=logout';
        },
        newlogin() {
          // document.location.reload();
        },
        init() {
          console.log('OM INIT');
          return;
          $().extend({
            menu: {
              account: {
                My_account_profile: { href: `#/Account(${$().auth.id ? $().auth.id.sub : null})` },
                My_contact_profile: { href: `#/Contact(${$().auth.id ? $().auth.id.sub : null})` },
                Logout: { href: '#?prompt=logout' },
                Print: { onclick() {
                  $().Aliconnector.printurl('https://aliconnect.nl');
                } },
                Show: { onclick() {
                  $().Aliconnector.show();
                } },
                Hide: { onclick() {
                  $().Aliconnector.hide();
                } },
                filedownload: { onclick() {
                  $().Aliconnector.filedownload('http://alicon.nl/shared/test/test.docx');
                } },
              },
              config: {
                Upload_datafile: { href: '#?prompt=upload' },
                // $().Upload ? { label: 'Upload datafile', href: '#/Upload/show()' } : null,
                // { label: 'Test', onclick: function(event) {
                // 	new $().HttpRequest($().config.$, {path:'/test/tester()'}, function(event){console.log(event.responseText);})
                // } },
                // { label: 'Test1', onclick: function(event) {
                // 	new $().HttpRequest($().config.$, {path:'/test1/tester()'}, function(event){console.log(event.responseText);})
                // } },
                // { label: 'Test2', onclick: function(event) {
                // 	new $().HttpRequest($().config.$, {path:'/test2/tester()'}, function(event){console.log(event.responseText);})
                // } },
                Importeer_geselecteerde_mail_uit_outlook : $().aliconnectorIsConnected ? { href: '#/outlook/import/mail()' } : null,
                Importeer_contacten_uit_outlook: $().aliconnectorIsConnected ? { href: '#/outlook/import/mail()' } : null,
                Create_user: { href: '#?prompt=createAccount' },
                // { label: 'Create_domain', href: '#?prompt=createDomain' },
                Configuration: 1 || $().Account.scope.split(' ').includes('admin:write') ? { href: '#?prompt=config_edit' } : null,
                Sitemap: 1 || $().Account.scope.split(' ').includes('admin:write') ? { href: '#?prompt=sitemap' } : null,
                Get_API_Key: { href: '#?prompt=getapikey' },
                Get_Aliconnector_Key: { href: '#?prompt=Get_Aliconnector_Key' },
              }
            },
          });
          // if (!$().auth.id) document.location.href='?prompt=logout';
          // new $().NavLeft();
        },
        click(event) {
          // if ($().get.prompt && !$('colpanel').contains(event.target)) {
          //   $().request('?prompt=clean');
          // }
        }
      });
    },
    om() {
      console.log('AOM');
      function childObject(object, schemaname) {
        // console.log(schemaname);
        if (object) {
          const obj = Object.fromEntries(Object.entries(object).filter(([name, obj]) => typeof obj !== 'object'));
          obj.children = Object
          .entries(object)
          .filter(([name, obj]) => typeof obj === 'object')
          .map(([name, obj]) => Item.get(Object.assign({
            schema: schemaname,
            name: name,
            title: name.replace(/^\d+[-| ]/,'')
          }, childObject(obj, schemaname))));
          return obj;
        }
      }
      $().on({
        async load() {
          $.extend({
            config: {
              cache: {
                cacheLocation: "sessionStorage",
                cacheLocation: "localStorage",
                storeAuthStateInCookie: false,
                forceRefresh: false
              },
              auth: {
                client_id: $.client_id,
                redirect_uri: $.redirect_uri,
                scope: $.scope,
              },
              loginRequest: {
                scopes: [
                  'openid',
                  'profile',
                  'user.read',
                  'calendars.read'
                ]
              },
              authOptions: {
                scopes: [
                  'user.read',
                  'calendars.read'
                ]
              },
              // dms: {
              //   servers: [
              //     {
              //       url: 'https://schiphol.aliconnect.nl/api',
              //     }
              //   ]
              // }
            }
          })
          console.log(333);
          const aimApplication = new Aim.UserAgentApplication();
          console.log(111111, aimApplication, $.api);
          return;




          // initial login to check query code from login callback
          await aimApplication.login().catch(console.error).then(console.warn);

          // console.log(aimApplication);

          const authProvider = $.authProvider = new Aim.AuthenticationProvider(aimApplication, $.config.authOptions);
          const aimClient = $.client = Aim.DataProvider.initWithMiddleware({authProvider}, $.dms);
          const hostClient = $.client = Aim.DataProvider.initWithMiddleware({authProvider}, $.dms);

          console.log(aimApplication);
          console.log(authProvider);
          console.log(hostClient);
          return;

          // $.prototype.test = function () {
          //   console.log('TEST')
          // }
          // Aim.initUserAgentApplication({});
          // console.log(Aim.test());
          // return;
          // // const authProvider = new Aim.AuthProvider();
          //
          //
          // $.init();
          // console.log($.config);
          // console.log($.account);
          // console.log($.clients);
          // console.log($.servers);
          // // $.api('https://aliconnect.nl/api/Contact(265090)').get().catch(console.error).then(e => {
          // //   console.log(e.body);
          // // });
          // // console.log($.getClient('https://aliconnect.nl/api/Contact(265090)'));
          //
          // return;
          //
          // const config = {
          //   aim: {
          //     auth: {
          //       client_id: $.client_id,
          //       redirect_uri: $.redirect_uri,
          //       scope: $.scope,
          //     },
          //     cache: {
          //       cacheLocation: "sessionStorage",
          //       cacheLocation: "localStorage",
          //       storeAuthStateInCookie: false,
          //       forceRefresh: false
          //     },
          //   },
          //   loginRequest: {
          //     scopes: [
          //       'openid',
          //       'profile',
          //       'user.read',
          //       'calendars.read'
          //     ]
          //   },
          //   authOptions: {
          //     scopes: [
          //       'user.read',
          //       'calendars.read'
          //     ]
          //   },
          //   // dms: {
          //   //   servers: [
          //   //     {
          //   //       url: 'https://schiphol.aliconnect.nl/api',
          //   //     }
          //   //   ]
          //   // }
          // };




          // return;



          // const client = $.client = new $.Client($.client);
          // await client.configGet();
          // const authProvider = client.authProvider = new $.AuthProvider($.auth);
          // await authProvider.login();



          // console.warn(client);
          // return;
          //
          // ($.client.server = $.client.server || {}).url = $().server.url || ('//' + document.location.hostname.split('.')[0] + '.aliconnect.nl/api');
          // if (!$().client_id) {
            // await $().url($.client.server.url+'/../config.json').get().then(e => {
            //   $.extend(config, e.body);
            //   // $.config = event.body;
            //   (function loadpar(arr, path = '') {
            //     if (arr) {
            //       for (let [key,value] of Object.entries(arr)) {
            //         if (typeof value === 'object') {
            //           loadpar(value, `${path}${key}-`);
            //         } else {
            //           // console.log(`%${path}${key}%`,value);
            //           $.temp.api_parameters[`%${path}${key}%`] = value;
            //         }
            //       }
            //     }
            //   })(e.body);
            // }).catch(console.error);
          // }
          $(document.documentElement).class('app');
          $(document.body).id('body').append(
            $.elem.navtop = $('header').id('navtop').class('row top bar noselect np')
            .append(
              $.elem.menu = $('a').class('abtn icn menu').on('click', event => {
                if ($.elem.menuList && $.elem.menuList.style()) {
                  $.elem.menuList.style('');
                } else {
                  if ($.elem.menuList) $.elem.menuList.style('display:none;');
                  $(document.body).attr('tv', document.body.hasAttribute('tv') ? $(document.body).attr('tv')^1 : 0)
                }
              }),
              $('a').class('title').id('toptitle').on('click', event => $.start() ),
              $('form').class('search row aco')
              .on('submit', event => {
                const value = $.searchValue = event.target.search.value;
                var result = value
                ? [...$.props.values()]
                .filter(item => item instanceof Item)
                .unique()
                .filter(item => item.header0 && value.split(' ').every(value => [item.header0,item.name].join(' ').match(new RegExp(`\\b${value}\\b`, 'i'))))
                : [];
                $().list(result);
                return false;
              })
              .append(
                $('input').name('search').autocomplete('off').placeholder('zoeken'),
                $('button').class('abtn icn search fr').title('Zoeken'),
              ),
              $('a').class('abtn icn dark').dark(),
            ),
            $('section')//.class('row aco main section_main')
            .id('section_main').append(
              $('section').tree().id('tree').css('max-width', $().storage('tree.width') || '200px'),
              $('div').seperator(),
              $('section').id('list').list(),
              $('section').class('row aco doc').id('doc'),
              $('div').seperator('right'),
              $('section').id('view').class('col aco apv printcol').css('max-width', $().storage('view.width') || '600px'),
              $('section')//.class('col aco apv info')
              .id('preview'),
              $('section').class('prompt').id('prompt').tabindex(-1).append(
                $('button').class('abtn abs close').attr('open', '').tabindex(-1).on('click', event => $().prompt(''))
              ),
            ),
            $('footer').statusbar(),
          ).messagesPanel();
          await $().translate();
          if (aimApplication.account) {
            $.account = aimApplication.account;
            console.log($.account);
            // await client.configUserGet();
            // $().extend(client.config);
            // console.warn(client);
            if ('Notification' in window) {
              var permission = Notification.permission;
              if (Notification.permission === 'default') {
                $.elem.navtop.append(
                  $('a').class('abtn').text('Notifications').on('click', event => Notification.requestPermission())
                )
              }
            }
            $.elem.navtop.prompts(...$.const.prompt.menu.prompts).append(
              $.elem.account = $('a').class('abtn account').caption('Account').href('#?prompt=account').draggable(),
            );
            if ($().menu) {
              $().menuChildren = childObject($().menu).children;
              $().tree(...$().menuChildren);
            }
            // if ($.aud = await $(`/Company(${client.authProvider.aud})`).details()) {
            //   $().tree($.aud)
            // }
            if ($.user = await $(`/Contact(${$.account.sub})`).details()) {
              $().tree($.user);
              await $.client.api(`/`).query('request_type','visit').get().then(event => $().history = event.body);
              $.elem.account.item($.user, 'accountElem');
              $.user.emit('change');
            }
          } else {
            $().extend(JSON.parse(JSON.stringify($.config)));
            $.elem.navtop.append(
              // $('button').class('abtn login').text('Aanmelden').href(client.loginUrl().query('prompt', 'login').toString()),
              $('button').class('abtn login').text('Aanmelden').on('click', e => aimApplication.login(config.loginRequest)),
            );
          }

          (function loadpar(arr, path = '') {
            if (arr) {
              for (let [key,value] of Object.entries(arr)) {
                if (typeof value === 'object') {
                  loadpar(value, `${path}${key}-`);
                } else {
                  // console.log(`%${path}${key}%`,value);
                  $.temp.api_parameters[`%${path}${key}%`] = value;
                }
              }
            }
          })(config);

          if ($().aud) {
            $.elem.menu.showMenuTop($({tag: `Company(${$().aud})`}));
          }
          if ($().info) {
            $('toptitle').text(document.title = $().info.title).title([$().info.description,$().info.version,$().info.lastModifiedDateTime].join(' '));
          }
          $().application_path = $().application_path || '/';
          $().ref = $().ref || {};
          $().ref.home = $().ref.home || '//aliconnect.nl/sdk/wiki';
          if (!document.location.search) {
            window.history.replaceState('page', '', '?l='+url_string($().ref.home));
          }
          function response(event) {
            console.log(event.target.responseText);
          }
        },
        logout() {
          // document.location.href='/om/?prompt=logout';
        },
        newlogin() {
          // document.location.reload();
        },
        init() {
          console.log('OM INIT');
          return;
          $().extend({
            menu: {
              account: {
                My_account_profile: { href: `#/Account(${$().auth.id ? $().auth.id.sub : null})` },
                My_contact_profile: { href: `#/Contact(${$().auth.id ? $().auth.id.sub : null})` },
                Logout: { href: '#?prompt=logout' },
                Print: { onclick() {
                  $().Aliconnector.printurl('https://aliconnect.nl');
                } },
                Show: { onclick() {
                  $().Aliconnector.show();
                } },
                Hide: { onclick() {
                  $().Aliconnector.hide();
                } },
                filedownload: { onclick() {
                  $().Aliconnector.filedownload('http://alicon.nl/shared/test/test.docx');
                } },
              },
              config: {
                Upload_datafile: { href: '#?prompt=upload' },
                // $().Upload ? { label: 'Upload datafile', href: '#/Upload/show()' } : null,
                // { label: 'Test', onclick: function(event) {
                // 	new $().HttpRequest($().config.$, {path:'/test/tester()'}, function(event){console.log(event.responseText);})
                // } },
                // { label: 'Test1', onclick: function(event) {
                // 	new $().HttpRequest($().config.$, {path:'/test1/tester()'}, function(event){console.log(event.responseText);})
                // } },
                // { label: 'Test2', onclick: function(event) {
                // 	new $().HttpRequest($().config.$, {path:'/test2/tester()'}, function(event){console.log(event.responseText);})
                // } },
                Importeer_geselecteerde_mail_uit_outlook : $().aliconnectorIsConnected ? { href: '#/outlook/import/mail()' } : null,
                Importeer_contacten_uit_outlook: $().aliconnectorIsConnected ? { href: '#/outlook/import/mail()' } : null,
                Create_user: { href: '#?prompt=createAccount' },
                // { label: 'Create_domain', href: '#?prompt=createDomain' },
                Configuration: 1 || $().Account.scope.split(' ').includes('admin:write') ? { href: '#?prompt=config_edit' } : null,
                Sitemap: 1 || $().Account.scope.split(' ').includes('admin:write') ? { href: '#?prompt=sitemap' } : null,
                Get_API_Key: { href: '#?prompt=getapikey' },
                Get_Aliconnector_Key: { href: '#?prompt=Get_Aliconnector_Key' },
              }
            },
          });
          // if (!$().auth.id) document.location.href='?prompt=logout';
          // new $().NavLeft();
        },
        click(event) {
          // if ($().get.prompt && !$('colpanel').contains(event.target)) {
          //   $().request('?prompt=clean');
          // }
        }
      });
    },
    omd() {
      function childObject(object, schemaname) {
        // console.log(schemaname);
        if (object) {
          const obj = Object.fromEntries(Object.entries(object).filter(([name, obj]) => typeof obj !== 'object'));
          obj.children = Object
          .entries(object)
          .filter(([name, obj]) => typeof obj === 'object')
          .map(([name, obj]) => Item.get(Object.assign({
            schema: schemaname,
            name: name,
            title: name.replace(/^\d+[-| ]/,'')
          }, childObject(obj, schemaname))));
          return obj;
        }
      }
      $().on({
        async load() {
          ($().server = $().server || {}).url = $().server.url || ('//' + document.location.hostname.split('.')[0] + '.aliconnect.nl/api');
          if (!$().client_id) {
            console.warn($().server.url);
            await $().url($().server.url+'/').get().then(event => $().extend(event.body)).catch(console.error);
            console.warn(1, $.client.api('/').toString());
            // await $().url($().server.url+'/').get().then(event => console.log(JSON.stringify(JSON.parse(event.target.responseText),null,2).replace(/"(\w+)"(?=: )/gs,'$1'))).catch(console.error);
          }
          $(document.documentElement).class('app');
          $(document.body).class('row aim om bg').id('body').append(
            $.elem.navtop = $('header').id('navtop').class('row top bar noselect np').append(
              $.elem.menu = $('a').class('abtn icn menu').on('click', event => {
                if ($.elem.menuList && $.elem.menuList.style()) {
                  $.elem.menuList.style('');
                } else {
                  if ($.elem.menuList) $.elem.menuList.style('display:none;');
                  $(document.body).attr('tv', document.body.hasAttribute('tv') ? $(document.body).attr('tv')^1 : 0)
                }
              }),
              $('a').class('title').id('toptitle').on('click', event => $().start() ),
              $('form').class('search row aco')
              .on('submit', event => {
                const value = $.searchValue = event.target.search.value;
                var result = value
                ? [...$.props.values()]
                .filter(item => item instanceof Item)
                .unique()
                .filter(item => item.header0 && value.split(' ').every(value => [item.header0,item.name].join(' ').match(new RegExp(`\\b${value}\\b`, 'i'))))
                : [];
                $().list(result);
                return false;
              })
              .append(
                $('input').name('search').autocomplete('off').placeholder('zoeken'),
                $('button').class('abtn icn search fr').title('Zoeken'),
              ),
              $('a').class('abtn icn dark').dark(),
            ),
            $('section').tree().id('tree').css('max-width', $().storage('tree.width') || '200px'),
            // $('div').seperator(),
            $('section').id('list').list(),
            // $('div').seperator('right'),
            $('section').id('view').class('col aco apv printcol').css('max-width', $().storage('view.width') || '600px'),
            $('section').id('preview').class('col aco apv info'),
            $('section').class('row aco doc').id('doc'),
            $('section').class('prompt').id('prompt').tabindex(-1).append(
                $('button').class('abtn abs close').attr('open', '').tabindex(-1).on('click', event => $().prompt(''))
              ),
            // $('section').id('section_main').class('row aco main section_main').append(
            // ),
            $('footer').statusbar(),
          );
          $(document.body).messagesPanel();
          // console.log(document.location.hostname.split('.')[0]);
          // console.warn($().server.url, $());
          await $().translate();
          // await $().getApi(document.location.origin+'/api/');
          await $().login();
          if ($.authProvider.sub) {
            // await $.client.api('/').get().then(event => $($()).extend(event.body));
            // await $().url($().server.url+`/config/${$.authProvider.sub}/api.json`).get().then(event => $().extend(event.body));
            if ('Notification' in window) {
              var permission = Notification.permission;
              // const notificationPermission = Notification.permission.toString();
              // console.log('Notification', permission);
              if (Notification.permission === 'default') {
                $.elem.navtop.append(
                  $('a').class('abtn').text('Notifications').on('click', event => Notification.requestPermission())
                )
              }
              // if (!['denied','granted'].includes(Notification.permission)) {
              //   this.elemNavtop.append(
              //     // $('a').class('abtn').test('Notifications').on('click', event => Notification.requestPermission())
              //   )
              // }
            }
            $.elem.navtop
            .prompts(...$.const.prompt.menu.prompts)
            .append(
              $.elem.account = $('a').class('abtn account').caption('Account').href('#?prompt=account').draggable(),
            );
            if ($().menu) {
              $().menuChildren = childObject($().menu).children;
              $().tree(...$().menuChildren);
            }
            if ($.aud = await $(`/Company(${$.authProvider.aud})`).details()) {
              $().tree($.aud)
            }
            if ($.user = await $(`/Contact(${$.authProvider.sub})`).details()) {
              $().tree($.user);
              await $.client.api(`/`).query('request_type','visit').get().then(event => $().history = event.body);
              $.elem.account.item($.user, 'accountElem');
              $.user.emit('change');
              if ($.user.data.mse_access_token) {
                $()
                .schemas('msaEvent', {
                  properties: {
                    title: {
                      get() {
                        // console.log(this);
                        return this.data.start ? `${this.data.start.dateTime} ${this.data.start.endTime}` : '';
                      },
                    },
                    subject: {},
                    summary: {
                      get(){
                        // console.log(this);
                        return `${this.data.organizer.emailAddress.name} (${this.data.organizer.emailAddress.address})`;
                      },
                    },
                    // "@odata.etag": {},
                    // id: {},
                    start: {},
                    end: {},
                    organizer: {}
                  }
                })
                .schemas('msaContact', {
                  // title() {
                  //   return this.combine('displayName');
                  // },
                  // subject() {
                  //   return this.combine('givenName,firstName,middleName,lastName,companyName');
                  // },
                  header: [
                    ['DisplayName'],
                    ['GivenName','FirstName','MiddleName','LastName','CompanyName'],
                    [],
                  ],
                  // filterfieldnames: 'Surname,CompanyName',
                  properties: {
                    // "@odata.etag": {},
                    // id: {},
                    // createdDateTime: {},
                    // lastModifiedDateTime: {},
                    // changeKey: {},
                    // parentFolderId: {},
                    // fileAs: {},
                    // categories: {},
                    DisplayName: {
                      legend: 'Personalia',
                    },
                    Initials: {
                    },
                    GivenName: {
                    },
                    MiddleName: {
                    },
                    Surname: {
                    },
                    Title: {
                    },
                    nickName: {
                    },
                    // yomiGivenName: {},
                    // yomiSurname: {},
                    // yomiCompanyName: {},
                    // imAddresses: {},
                    companyName: {
                      legend: 'Business',
                    },
                    department: {
                    },
                    officeLocation: {
                    },
                    profession: {
                    },
                    jobTitle: {
                    },
                    assistantName: {
                    },
                    manager: {
                    },
                    businessHomePage: {
                    },
                    emailAddresses: {
                      legend: 'Contact',
                    },
                    mobilePhone: {
                    },
                    businessPhones: {
                    },
                    businessAddress: {
                    },
                    otherAddress: {
                    },
                    homePhones: {
                      legend: 'Personal',
                    },
                    homeAddress: {
                    },
                    birthday: {
                    },
                    spouseName: {
                    },
                    children: {
                    },
                    generation: {
                    },
                    personalNotes: {
                    },
                  }
                })
                .schemas('msaMessage', {
                  title() {
                    return this.data.from ? (this.data.from.emailAddress.name ? this.data.from.emailAddress.name : this.data.from.emailAddress.address) : '';
                  },
                  subject() {
                    return this.data.subject;
                  },
                  bodyPreview() {
                    return this.data.bodyPreview;
                  },
                  properties: {
                    // "@odata.etag": {},
                    // createdDateTime: {},
                    // lastModifiedDateTime: {},
                    // id: {},
                    // changeKey: {},
                    // hasAttachments: {},
                    // isDeliveryReceiptRequested: {},
                    // isReadReceiptRequested: {},
                    // isRead: {},
                    // isDraft: {},
                    // flag: {},
                    // bodyPreview: {},
                    // parentFolderId: {},
                    // conversationId: {},
                    // conversationIndex: {},
                    // internetMessageId: {},
                    // receivedDateTime: {},
                    // sentDateTime: {},
                    // importance: {},
                    // inferenceClassification: {},
                    // from: {},
                    // sender: {},
                    // toRecipients: {},
                    // ccRecipients: {},
                    // bccRecipients: {},
                    // replyTo: {},
                    // webLink: {},
                    // categories: {},
                    subject: {},
                    body: {},
                  }
                })
                .schemas('msaNotebook', {
                  properties: {
                    title: {
                      get: 'displayName',
                    },
                    summary: {
                      get() {
                        return `${this.data.lastModifiedDateTime} ${this.data.lastModifiedBy.user.displayName}`
                      },
                    },
                    // createdDateTime: {},
                    // createdBy: {},
                    // lastModifiedDateTime: {},
                    // lastModifiedBy: {},
                    // id: {},
                    isDefault: {},
                    isShared: {},
                    self: {},
                    displayName: {},
                    userRole: {},
                    sectionsUrl: {},
                    sectionGroupsUrl: {},
                    links: {}
                  }
                });
                $().tree(...childObject({
                  Outlook: {
                    Contacts: {
                      onclick: event => $().msa().getContacts(),
                    },
                    Events: {
                      onclick: event => $().msa().getEvents(),
                    },
                    Messages: {
                      onclick: event => $().msa().getMessages(),
                    },
                    Notes: {
                      onclick: event => $().msa().getNotes(),
                    },
                  }
                }).children);
              }
            }
            // $().url('https://aliconnect.nl/api/').query('request_type', 'build_doc').get().then(event => {
            //   console.log('DOCBUILD', event.body);
            //   $($).extend(event.body);
            //   $().tree(...childObject($.docs, 'Chapter').children);
            // });
          } else {
            $.elem.navtop
            .append(
              $('a').class('abtn login').text('Aanmelden').href($().loginUrl().query('prompt', 'login').toString()),
            );
            // $(document.documentElement).class('site');
            //
            // $('navtop').append(
            //   $.elem.menu = $('a').class('abtn icn menu').on('click', event => {
            //     if ($.elem.menuList && $.elem.menuList.style()) {
            //       $.elem.menuList.style('');
            //     } else {
            //       if ($.elem.menuList) $.elem.menuList.style('display:none;');
            //     }
            //   }),
            //   $('a').class('title').href('/').id('toptitle'),
            //   $('form').class('search row aco'),
            //   $('a').class('abtn icn dark').dark(),
            //   $.elem.account = $('a').class('abtn account').caption('Account').href('#?prompt=account').draggable(),
            // );
            //
            // $('section_main').append(
            //   $('section').id('list').list(),
            //   $('div').seperator('right'),
            //   $('section').id('view').class('col aco apv printcol').css('max-width', $().storage('view.width') || '600px'),
            //   $('section').id('preview').class('col aco apv info'),
            //   $('section').class('row aco doc').id('doc'),
            //   $('section').class('prompt').id('prompt').append(
            //     $('button').class('abtn abs close').attr('open', '').on('click', event => $().prompt(''))
            //   ),
            // );
            //
          }
          // if ($().schemas()) {
          //   const itemItem = $().schemas().get('Item');
          //   if (itemItem) {
          //     itemItem.HasChildren = true;
          //     [...$().schemas().values()].forEach(item => {
          //       if (item !== itemItem) {
          //         if (!item.Master || !item.Master.LinkID) {
          //           $(item).Master = { LinkID: itemItem.ID };
          //         }
          //         // console.log(item.name, item.SrcID, item.MasterID);
          //         if (!item.SrcID || item.SrcID !== item.MasterID) {
          //           $(item).Src = { LinkID: item.MasterID };
          //         }
          //       }
          //     });
          //     $().tree($().schemas().get('Item'));
          //   }
          //   if ($().schemas().has('Equipment')) {
          //     $.client.api(`/Equipment`).select($.config.listAttributes).top(10000).filter('keyID IS NOT NULL').get()
          //   }
          // }
          if ($().aud) {
            // console.log($().aud, $({tag: `Company(${$().aud})`}));
            $.elem.menu.showMenuTop($({tag: `Company(${$().aud})`}));
          }
          if ($().info) {
            $('toptitle').text(document.title = $().info.title).title([$().info.description,$().info.version,$().info.lastModifiedDateTime].join(' '));
          }
          // console.log(document.location.application_path);
          $().application_path = $().application_path || '/';
          // var url = new URL(document.location);
          // $().pageHome = $().pageHome || '//' + document.location.hostname.replace(/([\w\.-]+)\.github\.io/, 'github.com/$1/$1.github.io') + '/wiki/Home';
          $().ref = $().ref || {};
          $().ref.home = $().ref.home || '//aliconnect.nl/sdk/wiki/Home';
          console.log($().ref.home);

          if (!document.location.search) {

            $().execQuery('l', $().ref.home, true );
            // $().execQuery('l', document.location.origin);
          }
          // if (document.location.pathname === $().application_path && !document.location.search) {
          //   window.history.replaceState('page', 'PAGINA', '?p='+($().ref && $().ref.home ? $().ref.home : document.location.origin));
          //   // $(window).emit('popstate');
          // }
          // $(document.body).cookieWarning();
          function response(event) {
            console.log(event.target.responseText);
          }
        },
      });
    },
    loadclient() {
      // console.log('AA');
      $().on({
        load() {
          if ($().script && $().script.src) {
            const el = document.createElement('script');
            el.src = $().script.src;
            document.head.appendChild(el);
          }
          // $('list').append(
          //   $('iframe').style('border:none;width:100%;height:100%;').src('/index'),
          // )
          // $('list').load('/index');
        }
      });
    },
    getstarted() {
      $().on({
        async ready() {
          $.start();
        }
      });
    },
    map: new Map(),
    attr: {
      displayvalue(value, property) {
      if (value === undefined) {
        return null;
      }
      if (property) {
        if (property.options && property.options[value]) {
          console.log(property.name, value, property.options[value].title);
          return property.options[value].title;
        }
        if (property.type === 'datetime') {
          return value ? new Date(value).toLocaleString() : null;
        }
      }
      return value;
    },
    },
    elem: {},
    temp: {
      api_parameters: {},
      handlers: {},
      classes: {},
      httpHandlers: {},
      fav: [],
      itemsModified: {},
    },
    script: {
      import(src) {
        // console.log('SCRIPT', src);
        return $.promise('script', callback => {
          // console.log(2, 'SCRIPT', src);
          function loaded(event) {
            event.target.loading = false;
            // console.log('LOADED');
            callback();
          }
          for (let script of [...document.getElementsByTagName('SCRIPT')]) {
            if (script.getAttribute('src') === src) {
              // console.log(3, 'SCRIPT', src);
              if (script.loading) {
                // console.log(4, 'SCRIPT', src);
                return $(script).on('load', loaded);
              }
              // console.log(4, 'SCRIPT', src);
              return callback();
            }
          }
          var el = $('script').src(src).parent(document.head).on('load', loaded);
          el.elem.loading = true;
          // console.log('SCRIPT', el);
        });
      },
    },
    history: {
      mergeState(url) {
        var documentUrl = new URL(document.location);
        url = new URL(url, document.location);
        url.searchParams.forEach((value, key) => documentUrl.searchParams.set(key, value));
        // documentUrl.hash='';
        window.history.replaceState('page', '', documentUrl.href.replace(/%2F/g, '/'));
      },
      replaceUrl(selector, context){
      if (window.history){
        if (typeof selector === 'object'){
          Object.entries(selector).forEach(entry => arguments.callee(...entry));
        } else if (arguments.length>1){
          var url = new URL(document.location);
          if (context){
            url.searchParams.set(selector, context);
          } else {
            url.searchParams.delete(selector)
          }
          url.hash='';
        } else {
          var url = new URL(selector, document.location.origin);
        }
        url = url.pathname.replace(/^\/\//,'/') + url.search;
        window.history.replaceState('page', '', url);
      }
    },
    },
    const: {
      prompt: {
        menu: {
          prompts: [
            // 'qrscan',
            'lang',
            // 'chat',
            // 'msg',
            // 'task',
            // 'shop',
            'config',
            'help',
          ]
        },
        config: {
          prompts: [
            // 'upload_datafile',
            // 'import_outlook_mail',
            // 'import_outlook_contact',
            // 'account_create',
            // 'account_domain',
            'account_config',
            // 'sitemap',
            // 'get_api_key',
            'get_aliconnector_key',
            'verwerkingsregister',
          ]
        },
      },
      languages: {
        ab:{iso:'Abkhazian', native:'аҧсуа бызшәа, аҧсшәа'},
        aa:{iso:'Afar', native:'Afaraf'},
        af:{iso:'Afrikaans', native:'Afrikaans'},
        ak:{iso:'Akan', native:'Akan'},
        sq:{iso:'Albanian', native:'Shqip'},
        am:{iso:'Amharic', native:'አማርኛ'},
        ar:{iso:'Arabic', native:'العربية'},
        an:{iso:'Aragonese', native:'aragonés'},
        hy:{iso:'Armenian', native:'Հայերեն'},
        as:{iso:'Assamese', native:'অসমীয়া'},
        av:{iso:'Avaric', native:'авар мацӀ, магӀарул мацӀ'},
        ae:{iso:'Avestan', native:'avesta'},
        ay:{iso:'Aymara', native:'aymar aru'},
        az:{iso:'Azerbaijani', native:'azərbaycan dili'},
        bm:{iso:'Bambara', native:'bamanankan'},
        ba:{iso:'Bashkir', native:'башҡорт теле'},
        eu:{iso:'Basque', native:'euskara, euskera'},
        be:{iso:'Belarusian', native:'беларуская мова'},
        bn:{iso:'Bengali', native:'বাংলা'},
        bh:{iso:'Bihari languages', native:'भोजपुरी'},
        bi:{iso:'Bislama', native:'Bislama'},
        bs:{iso:'Bosnian', native:'bosanski jezik'},
        br:{iso:'Breton', native:'brezhoneg'},
        bg:{iso:'Bulgarian', native:'български език'},
        my:{iso:'Burmese', native:'ဗမာစာ'},
        ca:{iso:'Catalan, Valencian', native:'català, valencià'},
        ch:{iso:'Chamorro', native:'Chamoru'},
        ce:{iso:'Chechen', native:'нохчийн мотт'},
        ny:{iso:'Chichewa, Chewa, Nyanja', native:'chiCheŵa, chinyanja'},
        zh:{iso:'Chinese', native:'中文 (Zhōngwén), 汉语, 漢語'},
        cv:{iso:'Chuvash', native:'чӑваш чӗлхи'},
        kw:{iso:'Cornish', native:'Kernewek'},
        co:{iso:'Corsican', native:'corsu, lingua corsa'},
        cr:{iso:'Cree', native:'ᓀᐦᐃᔭᐍᐏᐣ'},
        hr:{iso:'Croatian', native:'hrvatski jezik'},
        cs:{iso:'Czech', native:'čeština, český jazyk'},
        da:{iso:'Danish', native:'dansk'},
        dv:{iso:'Divehi, Dhivehi, Maldivian', native:'ދިވެހި'},
        nl:{iso:'Dutch, Flemish', native:'Nederlands, Vlaams'},
        dz:{iso:'Dzongkha', native:'རྫོང་ཁ'},
        en:{iso:'English', native:'English'},
        eo:{iso:'Esperanto', native:'Esperanto'},
        et:{iso:'Estonian', native:'eesti, eesti keel'},
        ee:{iso:'Ewe', native:'Eʋegbe'},
        fo:{iso:'Faroese', native:'føroyskt'},
        fj:{iso:'Fijian', native:'vosa Vakaviti'},
        fi:{iso:'Finnish', native:'suomi, suomen kieli'},
        fr:{iso:'French', native:'français, langue française'},
        ff:{iso:'Fulah', native:'Fulfulde, Pulaar, Pular'},
        gl:{iso:'Galician', native:'Galego'},
        ka:{iso:'Georgian', native:'ქართული'},
        de:{iso:'German', native:'Deutsch'},
        el:{iso:'Greek, Modern (1453-)', native:'ελληνικά'},
        gn:{iso:'Guarani', native:'Avañe\'ẽ'},
        gu:{iso:'Gujarati', native:'ગુજરાતી'},
        ht:{iso:'Haitian, Haitian Creole', native:'Kreyòl ayisyen'},
        ha:{iso:'Hausa', native:'(Hausa) هَوُسَ'},
        he:{iso:'Hebrew', native:'עברית'},
        hz:{iso:'Herero', native:'Otjiherero'},
        hi:{iso:'Hindi', native:'हिन्दी, हिंदी'},
        ho:{iso:'Hiri Motu', native:'Hiri Motu'},
        hu:{iso:'Hungarian', native:'magyar'},
        ia:{iso:'Interlingua (International Auxiliary Language Association)', native:'Interlingua'},
        id:{iso:'Indonesian', native:'Bahasa Indonesia'},
        ie:{iso:'Interlingue, Occidental', native:'(originally:) Occidental, (after WWII:) Interlingue'},
        ga:{iso:'Irish', native:'Gaeilge'},
        ig:{iso:'Igbo', native:'Asụsụ Igbo'},
        ik:{iso:'Inupiaq', native:'Iñupiaq, Iñupiatun'},
        io:{iso:'Ido', native:'Ido'},
        is:{iso:'Icelandic', native:'Íslenska'},
        it:{iso:'Italian', native:'Italiano'},
        iu:{iso:'Inuktitut', native:'ᐃᓄᒃᑎᑐᑦ'},
        ja:{iso:'Japanese', native:'日本語 (にほんご)'},
        jv:{iso:'Javanese', native:'ꦧꦱꦗꦮ, Basa Jawa'},
        kl:{iso:'Kalaallisut, Greenlandic', native:'kalaallisut, kalaallit oqaasii'},
        kn:{iso:'Kannada', native:'ಕನ್ನಡ'},
        kr:{iso:'Kanuri', native:'Kanuri'},
        ks:{iso:'Kashmiri', native:'कश्मीरी, كشميري‎'},
        kk:{iso:'Kazakh', native:'қазақ тілі'},
        km:{iso:'Central Khmer', native:'ខ្មែរ, ខេមរភាសា, ភាសាខ្មែរ'},
        ki:{iso:'Kikuyu, Gikuyu', native:'Gĩkũyũ'},
        rw:{iso:'Kinyarwanda', native:'Ikinyarwanda'},
        ky:{iso:'Kirghiz, Kyrgyz', native:'Кыргызча, Кыргыз тили'},
        kv:{iso:'Komi', native:'коми кыв'},
        kg:{iso:'Kongo', native:'Kikongo'},
        ko:{iso:'Korean', native:'한국어'},
        ku:{iso:'Kurdish', native:'Kurdî, کوردی‎'},
        kj:{iso:'Kuanyama, Kwanyama', native:'Kuanyama'},
        la:{iso:'Latin', native:'latine, lingua latina'},
        lb:{iso:'Luxembourgish, Letzeburgesch', native:'Lëtzebuergesch'},
        lg:{iso:'Ganda', native:'Luganda'},
        li:{iso:'Limburgan, Limburger, Limburgish', native:'Limburgs'},
        ln:{iso:'Lingala', native:'Lingála'},
        lo:{iso:'Lao', native:'ພາສາລາວ'},
        lt:{iso:'Lithuanian', native:'lietuvių kalba'},
        lu:{iso:'Luba-Katanga', native:'Kiluba'},
        lv:{iso:'Latvian', native:'latviešu valoda'},
        gv:{iso:'Manx', native:'Gaelg, Gailck'},
        mk:{iso:'Macedonian', native:'македонски јазик'},
        mg:{iso:'Malagasy', native:'fiteny malagasy'},
        ms:{iso:'Malay', native:'Bahasa Melayu, بهاس ملايو‎'},
        ml:{iso:'Malayalam', native:'മലയാളം'},
        mt:{iso:'Maltese', native:'Malti'},
        mi:{iso:'Maori', native:'te reo Māori'},
        mr:{iso:'Marathi', native:'मराठी'},
        mh:{iso:'Marshallese', native:'Kajin M̧ajeļ'},
        mn:{iso:'Mongolian', native:'Монгол хэл'},
        na:{iso:'Nauru', native:'Dorerin Naoero'},
        nv:{iso:'Navajo, Navaho', native:'Diné bizaad'},
        nd:{iso:'North Ndebele', native:'isiNdebele'},
        ne:{iso:'Nepali', native:'नेपाली'},
        ng:{iso:'Ndonga', native:'Owambo'},
        nb:{iso:'Norwegian Bokmål', native:'Norsk Bokmål'},
        nn:{iso:'Norwegian Nynorsk', native:'Norsk Nynorsk'},
        no:{iso:'Norwegian', native:'Norsk'},
        ii:{iso:'Sichuan Yi, Nuosu', native:'ꆈꌠ꒿ Nuosuhxop'},
        nr:{iso:'South Ndebele', native:'isiNdebele'},
        oc:{iso:'Occitan', native:'occitan, lenga d\'òc'},
        oj:{iso:'Ojibwa', native:'ᐊᓂᔑᓈᐯᒧᐎᓐ'},
        cu:{iso:'Church Slavic, Old Slavonic, Church Slavonic, Old Bulgarian, Old Church Slavonic', native:'ѩзыкъ словѣньскъ'},
        om:{iso:'Oromo', native:'Afaan Oromoo'},
        or:{iso:'Oriya', native:'ଓଡ଼ିଆ'},
        os:{iso:'Ossetian, Ossetic', native:'ирон æвзаг'},
        pa:{iso:'Punjabi, Panjabi', native:'ਪੰਜਾਬੀ, پنجابی‎'},
        pi:{iso:'Pali', native:'पालि, पाळि'},
        fa:{iso:'Persian', native:'فارسی'},
        pl:{iso:'Polish', native:'język polski, polszczyzna'},
        ps:{iso:'Pashto, Pushto', native:'پښتو'},
        pt:{iso:'Portuguese', native:'Português'},
        qu:{iso:'Quechua', native:'Runa Simi, Kichwa'},
        rm:{iso:'Romansh', native:'Rumantsch Grischun'},
        rn:{iso:'Rundi', native:'Ikirundi'},
        ro:{iso:'Romanian, Moldavian, Moldovan', native:'Română'},
        ru:{iso:'Russian', native:'русский'},
        sa:{iso:'Sanskrit', native:'संस्कृतम्'},
        sc:{iso:'Sardinian', native:'sardu'},
        sd:{iso:'Sindhi', native:'सिन्धी, سنڌي، سندھی‎'},
        se:{iso:'Northern Sami', native:'Davvisámegiella'},
        sm:{iso:'Samoan', native:'gagana fa\'a Samoa'},
        sg:{iso:'Sango', native:'yângâ tî sängö'},
        sr:{iso:'Serbian', native:'српски језик'},
        gd:{iso:'Gaelic, Scottish Gaelic', native:'Gàidhlig'},
        sn:{iso:'Shona', native:'chiShona'},
        si:{iso:'Sinhala, Sinhalese', native:'සිංහල'},
        sk:{iso:'Slovak', native:'Slovenčina, Slovenský Jazyk'},
        sl:{iso:'Slovenian', native:'Slovenski Jezik, Slovenščina'},
        so:{iso:'Somali', native:'Soomaaliga, af Soomaali'},
        st:{iso:'Southern Sotho', native:'Sesotho'},
        es:{iso:'Spanish, Castilian', native:'Español'},
        su:{iso:'Sundanese', native:'Basa Sunda'},
        sw:{iso:'Swahili', native:'Kiswahili'},
        ss:{iso:'Swati', native:'SiSwati'},
        sv:{iso:'Swedish', native:'Svenska'},
        ta:{iso:'Tamil', native:'தமிழ்'},
        te:{iso:'Telugu', native:'తెలుగు'},
        tg:{iso:'Tajik', native:'тоҷикӣ, toçikī, تاجیکی‎'},
        th:{iso:'Thai', native:'ไทย'},
        ti:{iso:'Tigrinya', native:'ትግርኛ'},
        bo:{iso:'Tibetan', native:'བོད་ཡིག'},
        tk:{iso:'Turkmen', native:'Türkmen, Түркмен'},
        tl:{iso:'Tagalog', native:'Wikang Tagalog'},
        tn:{iso:'Tswana', native:'Setswana'},
        to:{iso:'Tonga (Tonga Islands)', native:'Faka Tonga'},
        tr:{iso:'Turkish', native:'Türkçe'},
        ts:{iso:'Tsonga', native:'Xitsonga'},
        tt:{iso:'Tatar', native:'татар теле, tatar tele'},
        tw:{iso:'Twi', native:'Twi'},
        ty:{iso:'Tahitian', native:'Reo Tahiti'},
        ug:{iso:'Uighur, Uyghur', native:'ئۇيغۇرچە‎, Uyghurche'},
        uk:{iso:'Ukrainian', native:'Українська'},
        ur:{iso:'Urdu', native:'اردو'},
        uz:{iso:'Uzbek', native:'Oʻzbek, Ўзбек, أۇزبېك‎'},
        ve:{iso:'Venda', native:'Tshivenḓa'},
        vi:{iso:'Vietnamese', native:'Tiếng Việt'},
        vo:{iso:'Volapük', native:'Volapük'},
        wa:{iso:'Walloon', native:'Walon'},
        cy:{iso:'Welsh', native:'Cymraeg'},
        wo:{iso:'Wolof', native:'Wollof'},
        fy:{iso:'Western Frisian', native:'Frysk'},
        xh:{iso:'Xhosa', native:'isiXhosa'},
        yi:{iso:'Yiddish', native:'ייִדיש'},
        yo:{iso:'Yoruba', native:'Yorùbá'},
        za:{iso:'Zhuang, Chuang', native:'Saɯ cueŋƅ, Saw cuengh'},
        zu:{iso:'Zulu', native:'isiZulu'},
      },
    },
    // LOGPROMISE: true,
    string: {
      html(s) {
        return s.replace(/(.*?)(&lt;\!--.*?--&gt;|$)/gs, (s,codeString,cmt) => {
          return codeString
          .replace(/&lt;(.*?)&gt;/g, (s,p1) => `&lt;${
            replaceOutsideQuotes(
              p1.replace(/(\w+)/,'<span class=hl-events>$1</span>')
              , s => {
                return s.replace(/ (\w+)(?![^<]*>|[^<>]*<\/)/g,' <span class=hl-fn>$1</span>')
              }
            )
          }&gt;`) + (cmt ? `<span class=hl-cmt>${cmt}</span>` : '')
        })
      },
      js(s) {
        // console.error(s);
        return s
        .replace(/(.*?)(\/\/.*?\n|\/\*.*?\*\/|$)/gs, (s,codeString,cmt) => {
          return replaceOutsideQuotes(
            codeString, codeString => codeString.replace(
              /\b(class|abstract|arguments|await|boolean|break|byte|case|catch|char|const|continue|debugger|default|delete|do|double|else|enum|eval|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var|void|volatile|while|with|yield|abstract|boolean|byte|char|double|final|float|goto|int|long|native|short|synchronized|throws|transient|volatile)\b(?![^<]*>|[^<>]*<\/)/gi,
              '<span class=hl-res>$1</span>'
            )
            .replace(
              /\b(Array|Date|eval|function|hasOwnProperty|Infinity|isFinite|isNaN|isPrototypeOf|length|Math|NaN|name|Number|Object|prototype|String|toString|undefined|valueOf)\b/g,
              '<span class=hl-methods>$1</span>'
            )
            .replace(
              /\b(alert|all|anchor|anchors|area|assign|blur|button|checkbox|clearInterval|clearTimeout|clientInformation|close|closed|confirm|constructor|crypto|decodeURI|decodeURIComponent|defaultStatus|document|element|elements|embed|embeds|encodeURI|encodeURIComponent|escape|event|fileUpload|focus|form|forms|frame|innerHeight|innerWidth|layer|layers|link|location|mimeTypes|navigate|navigator|frames|frameRate|hidden|history|image|images|offscreenBuffering|open|opener|option|outerHeight|outerWidth|packages|pageXOffset|pageYOffset|parent|parseFloat|parseInt|password|pkcs11|plugin|prompt|propertyIsEnum|radio|reset|screenX|screenY|scroll|secure|select|self|setInterval|setTimeout|status|submit|taint|text|textarea|top|unescape|untaint)\b/g,
              '<span class=hl-prop>$1</span>'
            )
            .replace(
              /\b(onblur|onclick|onerror|onfocus|onkeydown|onkeypress|onkeyup|onmouseover|onload|onmouseup|onmousedown|onsubmit)\b/g,
              '<span class=hl-events>$1</span>'
            )
            .replace(/(\w+)(\s*\()/g, '<span class="hl-fn">$1</span>$2')
            .replace(/\.(\w+)/g, '.<span class="hl-attr">$1</span>')
            .replace(/\b([A-Z]\w+)\./g, '<span class="hl-obj">$1</span>.')
            .replace(/\b(\w+)\./g, '<span class="hl-attr">$1</span>.')
            .replace(/\b(\d+)\b/g, '<span class="hl-nr">$1</span>')
          ) + (cmt ? `<span class=hl-cmt>${cmt}</span>` : '')
        })
      },
      css(s) {
        return s.replace(/(.*?)(\/\*.*?\*\/|$)/gs, (s,codeString,cmt) => {
          return replaceOutsideQuotes(
            codeString, codeString => codeString
            .replace(/\.(.*)\b/g, '.<span class="hl-obj">$1</span>')
          ) + (cmt ? `<span class=hl-cmt>${cmt}</span>` : '')
        })
      },
      json(s) {
        return s
        .replace(/"(.*?)":/g, '"<span class="hl-fn">$1</span>":')
        .replace(/(:\s*)"(.*?)"/g, '$1"<span class="hl-string">$2</span>"')
      },
      yaml(s) {
        return s.replace(/(.*?)(#.*?\n|$)/gs, (s,codeString,cmt) => {
          return codeString
          .replace(/^(?=\s*)(.+?):/gm, '<span class="hl-fn">$1</span>:')
          .replace(/: (.*?)$/gm, ': <span class="hl-string">$1</span>')
          + (cmt ? `<span class=hl-cmt>${cmt}</span>` : '')
        })
      },
      php(s) {
        return s.replace(/(.*?)(\/\/.*?\n|\/\*.*?\*\/|$)/gs, (s,codeString,cmt) => {
          return replaceOutsideQuotes(
            codeString, codeString => codeString.replace(
              /\b(class|abstract|arguments|await|boolean|break|byte|case|catch|char|const|continue|debugger|default|delete|do|double|else|enum|eval|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var|void|volatile|while|with|yield|abstract|boolean|byte|char|double|final|float|goto|int|long|native|short|synchronized|throws|transient|volatile)\b(?![^<]*>|[^<>]*<\/)/gi,
              '<span class=hl-res>$1</span>'
            )
          ) + (cmt ? `<span class=hl-cmt>${cmt}</span>` : '')
        })
      },
      sql(s) {
        return s.replace(/(.*?)(--.*?\n|\/\*.*?\*\/|$)/gs, (s,codeString,cmt) => {
          return replaceOutsideQuotes(
            codeString, codeString => codeString.replace(
              /\b(ADD|ADD CONSTRAINT|ALTER|ALTER COLUMN|ALTER TABLE|ALL|AND|ANY|AS|ASC|BACKUP DATABASE|BETWEEN|CASE|CHECK|COLUMN|CONSTRAINT|CREATE|CREATE DATABASE|CREATE INDEX|CREATE OR REPLACE VIEW|CREATE TABLE|CREATE PROCEDURE|CREATE UNIQUE INDEX|CREATE VIEW|DATABASE|DEFAULT|DELETE|DESC|DISTINCT|DROP|DROP COLUMN|DROP CONSTRAINT|DROP DATABASE|DROP DEFAULT|DROP INDEX|DROP TABLE|DROP VIEW|EXEC|EXISTS|FOREIGN KEY|FROM|FULL OUTER JOIN|GROUP BY|HAVING|IN|INDEX|INNER JOIN|INSERT INTO|INSERT|IS NULL|IS NOT NULL|JOIN|LEFT JOIN|LIKE|LIMIT|NOT|NOT NULL|OR|ORDER BY|OUTER JOIN|PRIMARY KEY|PROCEDURE|RIGHT JOIN|ROWNUM|SELECT|SELECT DISTINCT|SELECT INTO|SELECT TOP|SET|TABLE|TOP|TRUNCATE TABLE|UNION|UNION ALL|UNIQUE|UPDATE|VALUES|VIEW|WHERE)\b/gi,
              '<span class=hl-res>$1</span>'
            )
          ) + (cmt ? `<span class=hl-cmt>${cmt}</span>` : '')
        })
      },
      st(s) {
        return s.replace(/(.*?)(--.*?\n|\/\*.*?\*\/|$)/gs, (s,codeString,cmt) => {
          return replaceOutsideQuotes(
            codeString, codeString => codeString.replace(
              /\b(PROGRAM|END_PROGRAM|VAR|END_VAR|IF|THEN|ELSEIF|ELSIF|ELSE|END_IF|CASE|OF|END_CASE|FOR|TO|BY|DO|END_FOR|REPEAT|UNTIL|END_REPEAT|WHILE|DO|END_WHILE|EXIT|RETURN|ADD|SQRT|SIN|COS|GT|MIN|MAX|AND|OR|BYTE|WORD|DWORD|LWORD|INTEGER|SINT|INT|DINT|LINT|USINT|UINT|UDINT|ULINT|REAL|REAL|LREAL|TIME|LTIME|DATE|LDATE|TIME_OF_DAY|TOD|LTIME_OF_DAY|LTOD|DATE_AND_TIME|DT|LDATE_AND_TIME|LDT|CHAR|WCHAR|STRING|WSTRING|STRING|ANY|ANY_DERIVED|ANY_ELEMENTARY|ANY_MAGNITUDE|ANY_NUM|ANY_REAL|ANY_INT|ANY_UNSIGNED|ANY_SIGNED|ANY_DURATION|ANY_BIT|ANY_CHARS|ANY_STRING|ANY_CHAR|ANY_DATE|DATE_AND_TIME|DATE_AND_TIME|DATE|TIME_OF_DAY|LTIME_OF_DAY)\b/g,
              '<span class=hl-res>$1</span>'
            )
            .replace(
              /\b(LEN|CONCAT|LEFT|RIGHT|MID|INSERT|DELETE|REPLACE|FIND|SEL|MAX|MIN|LIMIT|MUX|TP|TON|TOF|R_TRIG|F_TRIG|TRUNC|TRUNC_INT|ROL|ROR|SHL|SHR|CTU|CTD|CTUD|ABS|SQR|LN|LOG|EXP|SIN|COS|TAN|ASIN|ACOS|ATAN|EXPT|NOT|AND|XOR|OR|MOD|BOOL_TO_INT|WORD_TO_DINT|BYTE_TO_REAL|REAL_TO_LREAL|TIME_TO_DINT)\b/g,
              '<span class=hl-methods>$1</span>'
            )
            .replace(
              /(&lt;|&gt;|&lt;&equals;|&gt;&equals;|&lt;&gt;|:&equals;|&equals;)/g,
              '<b class=hl-string>$1</b>'
            )
            .replace(
              /\b(BOOL|TRUE|FALSE)\b/gi,
              '<span class=hl-prop>$1</span>'
            )
          ) + (cmt ? `<span class=hl-cmt>${cmt}</span>` : '')
        })
      },
      mdHtml(s){
        function code(s) {
          return (s||'')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/=/g, '&equals;')
          .replace(/\t/g, '  ')
          .replace(/\^\^(.*?)\^\^/g, '<MARK>$1</MARK>')
          // .replace(/"/g, '&quot;')
          // .replace(/'/g, '&apos;')
        }
        function list(s, level = 0) {
          const ident = (s.match(/^ +/)||[''])[0].length;
          s = s.split(/\n/).map(s => s.slice(ident)).join('\n').trim();
          return s.replace(/(^(\*|-|\d+\.) .*?$)/gs, s => {
            const tagName = s.trim().match(/^\d/) ? 'OL' : 'UL';
            s = s.replace(/\n(  .*?)(?=\n(\*|-|\d+\.)|$)/gs,(s, p1, p2) => list(p1, level + 1)).replace(/^(\*|-|\d+\.) (.*?)$/gm,'<li>$2</li>')
            return `<${tagName}>${s.trim()}</${tagName}>`;
          });
        }
        function mdToHtml (s) {
          // console.log(s);
          return replaceOutsideQuotes(
            s
            .replace(/\r/gs ,'')
            // .replace(
            //   /(^|\n)(.*?)(\n\n|$)/gs,
            //   (s,p1) => {
            //     console.log('>>>',s);
            //     return s
            //     .replace(/^((\*|-|\d+\.) .*?$)/s, (s) => list(s,0))
            //   }
            // )
            .replace(/^# (.*?)$/gm, '\n<H1>$1</H1>\n')
            .replace(/^## (.*?)$/gm, '\n<H2>$1</H2>\n')
            .replace(/^### (.*?)$/gm, '\n<H3>$1</H3>\n')
            .replace(/^#### (.*?)$/gm, '\n<H4>$1</H4>\n')
            .replace(/^##### (.*?)$/gm, '\n<H5>$1</H5>\n')
            .replace(/^###### (.*?)$/gm, '\n<H6>$1</H6>\n')
            .replace(/^####### (.*?)$/gm, '\n<H7>$1</H7>\n')

            .replace(/(^|\n)(\*|-|\d+\.) .*?(?=\n\n|\n$|$)/gs, (s) => list(s,0))


            .replace(/(^|\n)> (\w+):(.*?)(?=\n\n|$)/gs, (s, p1, p2, p3) => p1 + `<BLOCKQUOTE class=${p2}>${p3.replace(/\n> /g,' ')}</BLOCKQUOTE>`)
            .replace(/(^|\n)> (.+?)(?=\n\n|$)/gs, (s, p1, p2) => p1 + `<BLOCKQUOTE>${p2.replace(/\n> /g,' ')}</BLOCKQUOTE>`)
            .replace(/\[ \](?=(?:(?:[^`]*`){2})*[^`]*$)/g, '&#9744;')
            .replace(/\[v\](?=(?:(?:[^`]*`){2})*[^`]*$)/g, '&#9745;')
            .replace(/\[x\](?=(?:(?:[^`]*`){2})*[^`]*$)/g, '&#9745;')


            .replace(/(^|\n)(.*? \| .*?)\n-+ \| -.*?\n(.*?)(?=\n\n|$)/gs, (s, p1, p2, p3) => `${p1}<TABLE><THEAD><TR><TH>${p2.trim().replace(/ \| /g, '</TH><TH>')}</TH></TR></THEAD><TBODY><TR><TD>${p3.replace(/\n/s, '</TD></TR><TR><TD>').replace(/ \| /g, '</TD><TD>')}</TD></TR></TBODY></TABLE>`)

            .split(/\n\n/).map(s => s.replace(/^(?!<)(.*?)$/s, '<p>$1</p>')).join('\n\n')
            // .replace(/(^|^\n|\n\n)(.+?)(\n\n|\n$|$)/gs, '$1<p>$2</p>$3')

            .replace(/`(.+?)`/g, (s, p1) => `<CODE>${code(p1)}</CODE>`),

            s => s
            .replace(/  \n/gm, '<BR >')
            .replace(/\!\[(.*?)\]\((.*?)\)(?=(?:(?:[^`]*`){2})*[^`]*$)/g, '<IMG src="$2" alt="$1">')
            .replace(/\[(.*?)\]\((.*?)\)(?=(?:(?:[^`]*`){2})*[^`]*$)/g, '<A href="$2">$1</A>')
            .replace(/\*\*(.+?)\*\*/g, '<B>$1</B>')
            .replace(/\*(.*?)\*/g, '<I>$1</I>')
            .replace(/__(.*?)__/g, '<B>$1</B>')
            .replace(/_(.*?)_(?![^<]*>|[^<>]*<\/)/g, '<I>$1</I>')
            .replace(/~~(.*?)~~/g, '<DEL>$1</DEL>')
            .replace(/~(.*?)~/g, '<U>$1</U>')
            .replace(/\^\^(.*?)\^\^/g, '<MARK>$1</MARK>')
            .replace(/\n</gs, '<')
            .replace(/>\n/gs, '>')
          , '', '')
        }
        s = !s ? '' : s
        .replace(/(.*?)(```(.*?)\n(.*?)\n```|$)/gs, (s,md,s2,type,codeString) => {
          s = mdToHtml(md);
          if (codeString) {
            codeString = code(codeString);
            if (type) {
              codeString = $.string[type = type.toLowerCase()] ? $.string[type](codeString) : codeString;
              s += `<div class="code-header row" ln="${type}"><span class="aco">${type.toUpperCase()}</span></div>`;
            }
            s += `<div class="code ${type ? type : ''}">${codeString}</div>`;
          }
          return s;
        });
        // console.log(s);
        return s;
      },
      isImg(src) {
        return src.match(/jpg|png|bmp|jpeg|gif|bin/i)
      },
      isImgSrc(src) {
        if (src) for (var i = 0, ext; ext = ['.jpg', '.png', '.bmp', '.jpeg', '.gif', '.bin'][i]; i++) if (src.toLowerCase().indexOf(ext) != -1) return true;
        return false;
      },
    },
    object: {
      isFile(ofile) {
        return (ofile.type || '').indexOf('image') != -1 || $.string.isImgSrc(ofile.src)
      },
    },
    extend(parent, selector, context){
      if (!selector) {
        selector = parent;
        parent = this;
      }
      // console.log(111, parent, selector);
      const objects = [];
      if (context){
        Object.entries(context).forEach(entry => Object.defineProperty(parent, ...entry))
      }
      if (selector){
        (function recurse(parent, selector, context){
          if (parent && selector && selector instanceof Object) {
            for (let [key, value] of Object.entries(selector)) {
              if (typeof parent[key] === 'function' && typeof value !== 'function') {
                // console.log(key, value, parent[key]);
                parent[key](value)
              } else if (typeof value === 'function' && !parent.hasOwnProperty(key)) {
                Object.defineProperty(parent, key, {
                  enumerable: false,
                  configurable: false,
                  writable: false,
                  value: value,
                });
              }
              if (typeof value !== 'object' || Array.isArray(value) || !(key in parent) || objects.includes(value)) {
                parent[key] = value;
              } else {
                objects.push(value);
                recurse(parent[key], selector[key]);
              }
            }
          }
        })(parent, selector, context);
      }
      return parent;
    },
    Client: Object.assign(new Array(), {
      // clients: [],
      initWithMiddleware(config){
        const client = new Client(config);
        this.push(client);
        return client;
      }
    }),
    promise(selector, context) {
      const messageElem = $.elem.statusbar ? $('span').parent($.elem.statusbar.main).text(selector) : null;
      // $().progress(1, 1);
      // const progressElem = $.elem.statusbar.progress;
      // progressElem.elem.max += 1;
      // progressElem.elem.value = (progressElem.elem.value || 0) + 1;
      if (Aim.LOGPROMISE) {
        console.debug(selector, 'start');
      }
      return new Promise( context )
      .then( result => {
        // $().progress(-1, -1);
        if (messageElem) {
          messageElem.remove();
        }
        if (Aim.LOGPROMISE) {
          console.debug(selector, 'end');
        }
        return result;
      })
      .catch(err => {
        // $().progress(-1, -1);
        if (messageElem) {
          messageElem.text(selector, err).css('color','red');
        }
        throw err;
      })
    },
    // clear(){
    //   return map.clear(...arguments)
    // },
    // entries(){
    //   return map.entries(...arguments)
    // },
    // get: $.prototype.get,
    handleData(data){
      return $.promise( 'handle data', async resolve => {
        // console.debug('handleData');
        if (data.path){
          $().url(data.path).setmethod(data.method).exec();
        }
        const body = data.body;
        if (body){
          const reindex = [];
          function handleData(data) {
            // console.debug('handleData', data);
            if (data.method === 'patch'){
              const body = data.body;
              const itemId = body.ID || data.ID;
              if ($.map.has(itemId)) {
                const item = $.map.get(itemId);
                if (body.Master) {
                  const parentID = body.Master.LinkID;
                  const index = body.Master.Data;
                  const parent = $.map.get(parentID);
                  if (item) {
                    if (item.parent) {
                      if (item.parent !== parent && item.elemTreeLi) {
                        // DEBUG: MAX FOUT
                        // item.parent.items.splice(item.parent.items.indexOf(item), 1);
                        item.elemTreeLi.elem.remove();
                        reindex.push(item.parent);
                      }
                      // if (item.elemTreeLi) {
                      // }
                    }
                    // const master = [].concat(item.data.Master).shift();
                    // master.LinkID = parentID;
                    // master.Data = index;
                    if (parent && parent.items) {
                      if (!parent.items.includes(item)) {
                        // parent.items.push(item);
                      }
                      reindex.push(parent);
                    }
                  }
                }
                Object.entries(body).forEach(entry=>item.attr(...entry));
                item.refresh();
              }
            }
          }
          if (body.requests){
            body.requests.forEach(handleData)
          } else {
            handleData(data);
          }
          reindex.unique().forEach(parent => parent ? parent.reindex() : null);
        }
        resolve();
        //
        //
        //
        // // console.debug('handleRequest', req);
        // if (req.method && req.method.toLowerCase() === 'patch'){
        //   const [tag] = req.path.match(/\w+\(\d+\)/);
        //   const item = Item.get(tag);
        //   if (item){
        //     for (let [attributeName, value] of Object.entries(req.body)){
        //       if (item.properties[attributeName].setValue){
        //         item.properties[attributeName].setValue(value);
        //       }
        //       // console.debug(item, tag, attributeName, value, item.properties[attributeName]);
        //     }
        //   }
        // } else {//if (isModule){
        //   // isModule foorwaarde is opgenomen zodat bericht niet gaat rondzingen.
        //   for (var name in req){
        //     if (typeof $[name] === 'function'){
        //       $[name].apply(this, req[name]);
        //     }
        //   }
        //   try {
        //     console.error('DO FORWARD', isModule, req);
        //
        //     if (req.body){
        //       $.handleAimItems(req.body);
        //     }
        //
        //
        //
        //
        //     $.forward = req.forward;
        //     // $().exec(req, res => {
        //     // 	res.id = req.id;
        //     // });
        //   } catch (err){
        //     console.error(err)
        //   }
        //   $.forward = null;
        //   if (req.message_id && $.WebsocketClient.requests[req.message_id]){
        //     $.WebsocketClient.requests[req.message_id](req);
        //   }
        // }
        // $().emit('message', req);
        // return;
        //
      });
    },
    // has: $.prototype.has,
    // keys(){
    //   return map.keys(...arguments)
    // },
    log() {
      if (window.document && document.getElementById('console')) {
        $('console').append($('div').text(...arguments))
      } else if ($().statusElem) {
        $().statusElem.text(...arguments);
      } else {
        console.msg(...arguments)
      }
      return arguments;
    },
    // link(params) {
    //   return $.promise( 'link', async resolve => {
    //     async function reindex(parent) {
    //       await parent.children.then(children => {
    //         if (children.length) {
    //           children.forEach((item,i) => item.getIndex(name, parent) != i ? item[name] = {target: parent, Data: i, current: parent} : null);
    //         }
    //         parent.attr('HasChildren', children.length ? 1 : 0, true);
    //       })
    //     }
    //     const item = params.item instanceof Item ? params.item : $(params.item.tag);
    //     const to = params.to ? (params.to instanceof Item ? params.to : $(params.to.tag)) : null;
    //     const name = params.name || 'link';
    //     const action = params.action || 'move';
    //     if (action === 'move') {
    //       // const current = item.elemTreeLi.elem.parentElement.item;
    //       const current = item.parent;
    //       const index = Math.max(0, params.index === undefined ? 99999 : params.index );
    //       if (name === 'Master') {
    //         console.debug('MASTER', current);
    //         if (current && current.hasChildren) {
    //           await current.children.then(children => {
    //             const index = children.indexOf(item);
    //             children.splice(index, 1);
    //             if (current !== to) {
    //               reindex(current);
    //             }
    //           });
    //         }
    //         if (to) {
    //           await to.children.then(children => {
    //             children.splice(index, 0, item);
    //             reindex(to);
    //           });
    //         } else {
    //           item[name] = {target: to, Data: params.index, current: current, max: 9999};
    //         }
    //       } else {
    //         console.debug('NO MASTER', current);
    //         item[name] = {target: to, Data: params.index, current: current, max: 9999};
    //       }
    //       setTimeout(() => resolve(item));
    //       return;
    //     }
    //   });
    // },
    clipboard: {
  		undo: function() {
  			//console.debug('UNDO', $.temp.updateList);
  			if (this.undoData = $.temp.updateList.shift()) {
  				this.undoData.Value.reverse().forEach(function(row) {
  					if (row.eventType == 'paste') row.eventType = 'cut';
  					else if (row.eventType == 'cut') row.eventType = 'paste';
  				});
  				this.undoData.from = true;
  				$.data.update(this.undoData, true);
  			}
  		},
  		update: function(data, targetItem, eventType) {
  			//if (!data || !targetItem) return false;
  			if (!data) return false;
  			if (typeof data == 'string') data = JSON.parse(data);
  			if (data.Value) {
  				//var updateAction = '';
  				if (!data.from) $.temp.updateList.unshift(data); // Add data to update history list
  				data.Value.forEach(function(row, i, rows) {
  					var item = Item.create(row.id);
  					row.eventType = row.eventType || eventType;
  					////console.debug("UPDATE", eventType, row.eventType, row, targetItem, item);
  					if (!item) return;
  					switch (eventType || row.eventType) {
  						case 'copy':
  						targetItem.appendItem(null, { schema: item.schema, Title: item.Title, userID: 0, srcID: item.id }, null, true);
  						break;
  						case 'link':
  						//console.debug('LINK', item);
  						new $.HttpRequest($.config.$, 'POST', '/' + targetItem.tag + '/link', { itemID: item.id } ).send();
  						// targetItem.appendChild(null, { schema: item.schema, Title: item.Title, detailID: item.id }, null, true);
  						break;
  						case 'cut':
  						////console.debug('CUT', row.masterID, item.masterID);
  						if (row.masterID != item.masterID) {
  							//console.debug('NO CUT', row.masterID, item.masterID);
  							return;
  						}
  						if (item.master && item.master.children && item.master.children.length) {
  							item.master.children.splice(item.master.children.indexOf(item), 1);
  							item.master.children.forEach(function(item, i) { item.index = i });
  						}
  						if (item.elemTreeLi) item.elemTreeLi.parentElement.removeChild(item.elemTreeLi);
  						if (item.elemListLi && item.elemListLi.parentElement) item.elemListLi.parentElement.removeChild(item.elemListLi);
  						if (targetItem) {
  							////console.debug('MOVE TO');
  							if (targetItem.masterID == targetItem.srcID) {
  								//target isClass en verplaatsen: ITEM wordt afgeleid van nieuwe CLASS
  								//item.masterID = item.srcID = row.srcID = row.masterID = targetItem.id;
  								//console.debug('MOVE TO CLASS', targetItem, item.srcID = row.srcID = item.masterID = row.masterID = row[item.getPropertyAttributeName('masterID')] = targetItem.id, item.master);
  								var propertyAttributeName = item.getPropertyAttributeName('srcID');
  								if (propertyAttributeName) row[propertyAttributeName] = { itemID: row.srcID };
  								var propertyAttributeName = item.getPropertyAttributeName('masterID');
  								if (propertyAttributeName) row[propertyAttributeName] = { itemID: row.masterID };
  							}
  							else {
  								//console.debug('MOVE TO', targetItem.elLI, item.masterID = row.masterID = row[item.getPropertyAttributeName('masterID')] = targetItem.id, item.master);
  							}
  							////Item isClass en target !isClass, dus verplaatsen en ITEM wordt afgeleid van nieuwe CLASS
  							//if (row.masterID == row.srcID && targetItem.masterID != targetItem.srcID && eventType=="paste") item.masterID = item.srcID = row.srcID = row.masterID = targetItem.id;
  							//item.masterID = targetItem.id;
  							if (item.master) {
  								item.master.children = item.master.children || [];
  								item.master.children.push(item);
  								if (item.master.elemTreeLi.elemTreeUl) item.appendTo(item.master.elemTreeLi.elemTreeUl);
  							}
  						}
  						$.Selection.cancel();
  						break;
  						//case 'paste':
  						//	if (row.masterID) {
  						//		item.masterID = row.masterID;
  						//		if (item.master) {
  						//			if (row.masterID == row.srcID && item.master.masterID == item.master.srcID);
  						//			if (row.masterID == row.srcID && item.master.masterID == item.master.srcID);
  						//			item.master.children.push(item);
  						//			if (item.master.elemTreeLi.elemTreeUl) item.appendTo(item.master.elemTreeLi.elemTreeUl);
  						//		}
  						//	}
  						//	break;
  						default:
  						break;
  					}
  				});
  				////console.debug('UPDATE', data);
  				//return true;
  				// @todo: mkan, versturen via ws
  				// if (!data.from) $.ws.send(Object.assign({ post: 1, to: { host: $.config.$.auth.accessToken.aud } }, data));
  				return true;
  			}
  		},
  		cancel: () => {
  			//console.debug($.temp.items.oncancel);
  			return $.temp.items.oncancel && $.temp.items.oncancel.length ? $.temp.items.oncancel.pop()() : null;
  		},
  		oncancel(fn) {
  			const oncancel = $.temp.items.oncancel = $.temp.items.oncancel || [];
  			if (oncancel.includes(fn)) {
  				oncancel.splice(oncancel.indexOf(fn), 1);
  			}
  			oncancel.push(fn);
  		},
  		reload(href) {
  			//console.error('$.reload', href);
  			setTimeout(() => {
  				if (href) document.location.href = href;
  				else document.location.reload();
  			},0);
  		},
  		// attr(items, attributeName, value) {
  		// 	//console.debug(items, attributeName, value, this[attributeName]);
  		// 	if (this[attributeName]) {
  		// 		this[attributeName].forEach(item => {
  		// 			Object.values(item).filter(value => value instanceof Elem).forEach(selector => selector.attr(attributeName, null))
  		// 		})
  		// 	}
  		// 	items.forEach(item => {
  		// 		Object.values(item).filter(value => value instanceof Elem).forEach(selector => selector.attr(attributeName, value))
  		// 	})
  		// 	this[attributeName] = items;
  		// },
  		items: [],
  		setItem(item, attributeName, value) {
  			if (!item) throw 'no item';
  			event = window.event;
  			let items = this[attributeName] || [];
        items.forEach(item => item.setAttribute ? item.setAttribute(attributeName, null) : null);
  			// this.items.forEach(item => item.setAttribute(attributeName));
  			// $.attr(this.items,'checked');
  			// $.attr(this.items,'clipboard');
  			if (item) {
  				if (Array.isArray(item)) {
  					items = item;
            this.itemFocussed = item[0];
  				} else {
  					if (!event.altKey) {
  						if (event.ctrlKey) {
  							if (event.shiftKey) {
  								// !ALT+CTRL+SHIFT
  							} else {
  								// !ALT+CTRL+!SHIFT
  								items.push(item);
  							}
  						} else if (event.shiftKey) {
  							// !ALT+!CTRL+SHIFT
  							// if (this.items.length) {
  							// 	//console.error ('find first elem', event.path);
  							//
  							// }
  							items.push(item); // lijst
  						} else {
  							// !ALT+!CTRL+!SHIFT
  							items = [item];
  						}
  					}
  				}
  				// items.forEach(item => item.setAttribute(attributeName, this.items.length));
  			} else {
  				items = [];
  			}
        // //console.debug(item);
  			value = items.length;
        $().status('checked', value);
  			items.forEach(item => {
  				Object.values(item)
  				.filter(value => value instanceof Elem)
  				.forEach(selector => selector.attr(attributeName, value))
  			});
  			this[attributeName] = items;
  			return this;
  		},
  		get length() {
  			return this.items.length;
  		},
  		push(item) {
  			if (!this.items.includes(item)) {
  				this.items.push(item);
  			}
  		},
  		copy(event) {
        const selection = window.getSelection();
        if (selection.focusNode.nodeType === 3) {
          return;
        }
        // console.log('CLIPBOARD', event.type, selection, selection.focusNode.nodeType, selection.focusNode, selection.ancherNode, selection.extendNode, selection.baseNode);
        if(document.activeElement.isContentEditable || ['INPUT'].includes(document.activeElement.tagName)) {
          return;
        }
        let type = '';
        if (this.clipboardItems) {
          this.clipboardItems.forEach(item => item.setAttribute('clipboard'));
          this.clipboardItems = [];
        }
        if (event) {
          event.preventDefault();
          if (this.data) {
            event.clipboardData.setData('application/json', JSON.stringify(this.data));
            event.clipboardData.setData('Text', JSON.stringify(this.data));
            this.data = null;
          } else {
            type = event.type;
            const items = this.clipboardItems = this.checked;
            items.forEach(item => item.setAttribute('clipboard', type));
            const data = {type: type, value: items.map(item => {return { tag: item.tag, title: item.title }})};
            event.clipboardData.setData('aim/items', JSON.stringify(data));
            event.clipboardData.setData('text', items.map(Item.toText).join('\n'));
            event.clipboardData.setData('text/html', items.map(Item.toHtml).join(''));
            $().status('clipboard', `${type}: ${this.clipboardItems.length}`);
          }
        }
  		},
  		remove(item) {
        console.debug('REMOVE');
  			if (this.items.includes(item)) {
  				this.items.splice(this.items.indexOf(item), 1);
  			}
  		},
  		cancel(event){
  			this.setItem([]);
  		},
  		clear(event){
  			//console.debug('clear');
  			$.attr(this.items,'clipboard');
  			this.items = [this.itemFocussed];
  			document.execCommand('copy');
  			// this.setItem([]);
  			return;
  		},
  		paste(event) {
  		},
  		link() {
  			for (var i = 0, o; o = $.selapi.item[i]; i++) {
  				//console.debug(o);
  			}
  		},
  		delete() {
  			for (var i = 0, o; o = $.selapi.item[i]; i++) {
  				//console.debug(o);
  			}
  		},
      copyToClipboard(obj) {
      $.clipboard.data = obj;
      // // $('input').value(JSON.stringify(obj)).focus().select();
      // const el = event => {
      //   event.preventDefault();
      //   event.stopPropagation();
      //   console.log(obj);
      // };
      // window.addEventListener('copy', el);
      document.execCommand('copy');
      // window.removeEventListener('copy', el);
      // const el = $('input')
      // .parent(document.body)
      // // .value(JSON.stringify(obj))
      // .focus()
      // .select()
      // .on('copy', event => {
      //   event.preventDefault();
      //   event.stopPropagation();
      //   console.log('COPY', obj);
      // });
      // // window.addEventListener('copy', el, true);
      // document.execCommand('copy');
      // el.remove();
      // // window.removeEventListener('copy', el, true);
    },
  	},
    // translate: new Map(),
    // set: $.prototype.set,
    // values(){
    //   return map.values(...arguments)
    // },
		maps() {
			return $.promise( 'maps', resolve => {
				if (window.google) resolve (window.google.maps);
				else $('script').parent(document.head)
				.attr('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAKNir6jia2uSgmEoLFvrbcMztx-ao_Oys&libraries=places')
				.on('load', event => resolve (window.google.maps))
			});
		},
		prompt(selector, context) {
      return $().prompt(...arguments);
		},
		// async src(selector) {
		// 	//console.warn('SRC', selector);
    //   if ($().docs) {
    //     (await $().docs()).write('doc').load(selector);
    //   }
		// 	// docs.load(elem.getAttribute('src'))
		// },
    _archive: {
      _promiseTimeout(selector, fn, msError = 5000) {
      const messageElem = $().procMessage(selector);
      // const to = setTimeout()
      if (Aim.LOGPROMISE) {
        console.debug(selector, 'start');
      }
      const msWarn = 3000;
      this.toWarn = setTimeout(() => {
        console.warn(selector, 'Timing out in ' + msWarn + 'ms.');
        messageElem.text(selector, 'warning timing out '+ msError + 'ms.').css('color','orange');
      }, msWarn);
      return Promise.race([
        new Promise((resolve, reject) => {
          this.toError = setTimeout(() => {
            console.error(selector, 'Timed out in '+ msError + 'ms.');
            messageElem.text(selector, 'Timed out in '+ msError + 'ms.').css('color','red');
            reject('Timed out in '+ msError + 'ms.')
          }, msError)
        }),
        new Promise( fn )
        .then(resolve => {
          clearTimeout(this.toWarn);
          clearTimeout(this.toError);
          messageElem.remove();
          if (Aim.LOGPROMISE) console.debug(selector, 'end');
          return resolve;
        })
        .catch(err => {
          clearTimeout(this.toWarn);
          clearTimeout(this.toError);
          console.error(selector, err);
          messageElem.text(selector, err).css('color','red');
          throw err;
          // return err;
        })
      ])
    },
      submit(event) {
			event.preventDefault();
			var formData = new FormData(event.target);
			const form = $(event.target);
			var action = form.attr('action');
			(action ? $().url(action) : $.client.api())
			.post(formData).then(event => form.emit('response', event));
			return;
			// //console.log('ONSUBMIT', par.res, par.action);
			// document.body.setAttribute('busy', Number(document.body.getAttribute('busy')) + 1 );
			// messageElement.innerText = '';
			// //console.log('SUBMIT', this, par.client, par.action);
			let method = event.target.getAttribute('method') || 'get';
			// //console.log('SUBMIT', event.submitter, event.target, method);
			method = method.toLowerCase();
			// let query = [];
			let post = {};
			var formData = new FormData(el);
			//console.log('formDataformData', formData.keys(), formData.values());
			for(var pair of formData.entries()) {
				//console.log('pair', pair[0]+ ', '+ pair[1]);
			}
			//console.log('formDataformData END');
			let submitter = event.submitter || el.submitter;
			formData.append(submitter.name, submitter.name);
			// let url = new URL(par.action);
			// url.searchParams.set('submitter', submitter.name);
			// par.action = url.toString();
			// query.push([submitter.name] + '=' + submitter.value);
			// query.push('submitter=' + submitter.name);
			// post[submitter.name] = submitter.value;
			let callback = (event) => {
				event.submitter = submitter;
				par.res.call(el, event);
			};
			var xhr = null;
			// //console.log('el.isModified', el.isModified);
			//console.log('formDataformData', formData, el);
			if (method === 'get') {
				var xhr = new $.HttpRequest(par.client, 'get', par.action, {
					onloadend: onloadend,
				}, callback ).send();
			} else if (el.isModified) {
				// var xhr = new $.HttpRequest(par.client, 'POST', par.action + '?' + query.join('&'), el, callback, {post: post}, {onloadend: onloadend} );
				// var xhr = new $.HttpRequest(par.client, 'post', par.action, formData, callback).send();
				// xhr.onloadend = onloadend;
				$.url(par.action).post(formData).then(callback);
			} else {
				//console.log('STARTLOAD GGGG', par);
				callback(el, event);
			}
			if (xhr) {
				xhr.formElement = el;
			}
			// conn.urlComponents.method = 'GET';
			// //console.log(query);
			//.res = par.res.bind(this);
			// $.client.init($.auth).api(par.action).post(event.target).res = par.res.bind(this);
			// $.client.init($.auth).api(par.action).post(event.target).res = par.res.bind(this);
			// $.client.init($.auth).api(par.action).post(event.target).res = par.res.bind(this);
			// new $.HttpRequest(par.action, {form: event.target }, par.res.bind(this) );
		},
    },



    login(options) {

    },
    logout() {

    },
    config: {
      listAttributes: 'header0,header1,header2,name,schemaPath,Master,Src,Class,Tagname,InheritedID,HasChildren,HasAttachements,State,Categories,CreatedDateTime,LastModifiedDateTime,LastVisitDateTime,StartDateTime,EndDateTime,FinishDateTime',
      trackLocalSessionTime: 5000, // timeout between tracking local cookie login session
      trackSessionTime: 30000, // timeout between tracking login session
      debug: 1,
      minMs: 60000,
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
        forceRefresh: false
      },
      clients: [],
    },
    clients: new Map,
    servers: new Map,
    authenticationProviders: new Map,
    initUserAgentApplication(options) {
      $.prototype.test = function () {
        console.log('TEST')
      }
    },
    init() {
      console.log('INIT', this.config);
      const config = this.config;
      this.storage = window[config.cache.cacheLocation];
      config.client_secret = this.storage.getItem('client_secret');
      // this.initClient({
      //   servers:[
      //     {
      //       url: 'https://aliconnect.nl/api',
      //     }
      //   ]
      // })

      if (this.storage.getItem('id_token')) {
        this.account = new Account(this.storage.getItem('id_token'));
        console.log(this.account);
      }
      if (this.storage.getItem('access_token')) {
        console.log(this.storage.getItem('access_token'));
      }
      if (config.auth) {
        for (let [name,options] of Object.entries(config.auth)) {
          this.authenticationProviders.set(name, new Aim.AuthenticationProvider(options));
        }
      }
      if (config.clients) {
        for (let [name,options] of Object.entries(config.clients)) {
          this.clients.set(name, new Aim.Client(options));
        }
      }



      console.log(clients);
    },
    getClient(src) {
      src = new URL(src, document.location).href;
      for (let [url, client] of this.servers.entries()) {
        if (src.match(url)) return client;
      }
    },
    api(src) {
      const client = this.getClient(src);
      console.log(client)
      // return client.api(src);
    },
  });

  function Account(id_token) {
    const id = this.idToken = JSON.parse(atob(id_token.split('.')[1]));
    this.sub = id.sub;
    this.name = id.name || id.email || id.sub;
    this.username = id.preferred_username || this.name;
    this.accountIdentifier = this.idToken.oid;
    // this.client = new Aim.AuthenticationProvider($.application, config.authOptions);
    // const client = new Client({
    //   servers:[
    //     {
    //       url: 'https://aliconnect.nl/api',
    //     }
    //   ]
    // });
    // this.api = client.api;

    // this.trackLocalSession();
    // this.trackSession();


    // Object.assign(this, {
    //   "accountIdentifier": "f40f8462-da7f-457c-bd8c-d9e5639d2975",
    //   "homeAccountIdentifier": "ZjQwZjg0NjItZGE3Zi00NTdjLWJkOGMtZDllNTYzOWQyOTc1.MDk3ODY2OTYtZjIyNy00MTk5LTkxYTAtNDU3ODNmNmM2NjBi",
    //   "userName": "max.van.kampen@alicon.nl",
    //   "name": "Max van Kampen",
    //   "idToken": {
    //     "aud": "4573bb93-5012-4c50-9cc5-562ac8f9a626",
    //     "iss": "https://login.microsoftonline.com/09786696-f227-4199-91a0-45783f6c660b/v2.0",
    //     "iat": 1625116688,
    //     "nbf": 1625116688,
    //     "exp": 1625120588,
    //     "aio": "ATQAy/8TAAAAE2xWr2AMjaSvQirdsTYhMjk+OQizAI+M763mE7rsDvJVcTdlx34gVaMMjeGlWK6V",
    //     "name": "Max van Kampen",
    //     "nonce": "343114a2-371c-4bd3-b69a-e35e35171e50",
    //     "oid": "f40f8462-da7f-457c-bd8c-d9e5639d2975",
    //     "preferred_username": "max.van.kampen@alicon.nl",
    //     "rh": "0.AV4AlmZ4CSfymUGRoEV4P2xmC5O7c0USUFBMnMVWKsj5piZeABI.",
    //     "sub": "w6TIVTl01uuD9UHe12Fk6YLiilqhf1arasLwPwGnxV0",
    //     "tid": "09786696-f227-4199-91a0-45783f6c660b",
    //     "uti": "QmRDVtGC-0io5TToGBfPAA",
    //     "ver": "2.0"
    //   },
    //   "idTokenClaims": {
    //     "aud": "4573bb93-5012-4c50-9cc5-562ac8f9a626",
    //     "iss": "https://login.microsoftonline.com/09786696-f227-4199-91a0-45783f6c660b/v2.0",
    //     "iat": 1625116688,
    //     "nbf": 1625116688,
    //     "exp": 1625120588,
    //     "aio": "ATQAy/8TAAAAE2xWr2AMjaSvQirdsTYhMjk+OQizAI+M763mE7rsDvJVcTdlx34gVaMMjeGlWK6V",
    //     "name": "Max van Kampen",
    //     "nonce": "343114a2-371c-4bd3-b69a-e35e35171e50",
    //     "oid": "f40f8462-da7f-457c-bd8c-d9e5639d2975",
    //     "preferred_username": "max.van.kampen@alicon.nl",
    //     "rh": "0.AV4AlmZ4CSfymUGRoEV4P2xmC5O7c0USUFBMnMVWKsj5piZeABI.",
    //     "sub": "w6TIVTl01uuD9UHe12Fk6YLiilqhf1arasLwPwGnxV0",
    //     "tid": "09786696-f227-4199-91a0-45783f6c660b",
    //     "uti": "QmRDVtGC-0io5TToGBfPAA",
    //     "ver": "2.0"
    //   },
    //   "environment": "https://login.microsoftonline.com/09786696-f227-4199-91a0-45783f6c660b/v2.0"
    // })
  };
  Aim.UserAgentApplication = function UserAgentApplication(config) {
    $.application = this;
    this.config = config = config || $.config;
    this.clientId = config.auth.client_id;
    this.clientSecret = window.localStorage.getItem('client_secret');
    this.storage = window[config.cache.cacheLocation];
    if (this.storage.getItem('id_token')) {
      this.account = new Account(this.storage.getItem('id_token'));
    }

    this.authProvider = new Aim.AuthProvider(options.auth);
    Object.assign(this, {
      auth: {
        clientSecret: window.localStorage.getItem('client_secret'),
      },
      "authResponseCallback": null,
      "tokenReceivedCallback": null,
      "errorReceivedCallback": null,
      "config": Object.assign(options, {
        "system": {
          "logger": {
            "level": 2,
            "localCallback": null,
            "correlationId": "",
            "piiLoggingEnabled": false
          },
          "loadFrameTimeout": 6000,
          "tokenRenewalOffsetSeconds": 300,
          "navigateFrameWait": 500
        },
        "framework": {
          "isAngular": false,
          "unprotectedResources": [],
          "protectedResourceMap": {}
        }
      }),
      "redirectCallbacksSet": false,
      "logger": {
        "level": 2,
        "localCallback": null,
        "correlationId": "",
        "piiLoggingEnabled": false
      },
      // clientId: "4573bb93-5012-4c50-9cc5-562ac8f9a626",
      "inCookie": false,
      "telemetryManager": null,
      "authorityInstance": {
        "IsValidationEnabled": true,
        "canonicalAuthority": "https://login.microsoftonline.com/common/",
        "canonicalAuthorityUrlComponents": {
          "Protocol": "https:",
          "HostNameAndPort": "login.microsoftonline.com",
          "AbsolutePath": "/common/",
          "PathSegments": [
            "common"
          ]
        }
      },
      // "cacheStorage": {
      //   "cacheLocation": "sessionStorage",
      //   "clientId": "4573bb93-5012-4c50-9cc5-562ac8f9a626",
      //   "rollbackEnabled": true
      // },
      "account": new Aim.Account()
    }, options);
  }
  Aim.UserAgentApplication.prototype = {




    clientAttr(options) {
      return $().url('https://aliconnect.nl/api').query({
        request_type: 'client_attr',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }).post(options).then(e => {
        console.log(e.target.responseText)
      })
    },
    // toString() {
    //
    // },
    // loginPopup(loginRequest) {
    //   this.account = {};
    // },
    getAccount() {
      return this.authProvider.access;
    },
    promptClientSecret() {
      window.localStorage.setItem('client_secret', this.clientSecret = prompt("Please enter client_secret", this.clientSecret))
    },
    // login() {
    //   return this.authProvider.login(...arguments);
    // },
    // loginPopup() {
    //   this.authProvider.login(this.config.auth);
    // },
    // // getApplicationId
    // logout() {
    //   return this.authProvider.logout(...arguments);
    // },
  // }
  // Aim.AuthProvider = function AuthProvider (options) {
  //   this.id = {};
  //   this.auth = {};
  //   this.config = options;
  //   this.config.url = this.config.url || 'https://login.aliconnect.nl/api';
  //   this.config.authUrl = this.config.url + '/oauth';
  //   this.config.tokenUrl = this.config.url + '/token';
  //
  //   console.warn('config', this.config);
  //   // this.auth = $().storage(this.key+'AuthProvider') || {};
  //   this.init();
  // }
  // Aim.AuthProvider.prototype = {
  //



    // get client_id(){
    //   return $().client_id
    // },

    getAccessToken(options){
      if (options){
        options = Object.assign({
          grant_type: 'authorization_code',
          // code: options.code, // default, overide by params
          client_id: this.config.client_id,
          // 'client_secret' => $this->client_secret,
          access_type: 'offline', // only if access to client data is needed when user is not logged in
        }, options);
        // console.debug(options);
        return $.promise('getAccessToken', resolve => $()
        .url(this.tokenUrl)
        .post(options)
        // .post()
        .then(event => {
          console.log(event.body);
          this.storage.setItem('id_token', event.body.id_token);
          this.storage.setItem('access_token', event.body.access_token);
          this.storage.setItem('refresh_token', event.body.refresh_token);
          this.account = new Account(event.body.id_token);
          // return;
          // this.init({auth: event.body});
          const url = new URL(document.location.href);
          url.searchParams.delete('code');
          url.searchParams.delete('state');
          $.history.replaceUrl( url.toString() );
          // $.clipboard.reload();
          resolve();
        }));
      }
      // console.debug(this.access_token);
      return this.access_token;
    },
    init(){
      return this;
      // return console.warn(this);
      // Object.assign(this, options);
      // const auth = this.config.auth;
      // ['id_token', 'refresh_token', 'access_token'].forEach(token => $().storage(token, auth[token] = auth[token] || $().storage(token) || ''));
      // window.sessionStorage.clear();
      // window.localStorage.clear();
      const access_token = auth.api_key || auth.access_token || auth.id_token;
      // console.log([access_token, auth.api_key, auth.access_token, auth.id_token]);
      if (access_token){
        try {
          // console.error(access_token);
          this.access = JSON.parse(atob(access_token.split('.')[1]));
          this.sub = this.access.sub;
          this.aud = this.access.aud;
          if (this.ws){
            this.send({ headers: {Authorization:'Bearer ' + $.authProvider.getAccessToken() } });
          }
        } catch (err){
        }
      }
      if (token = this.token(auth.api_key)){
        this.access_token = token.token;
      } else if (token = this.token(auth.access_token)){
        const refresh = this.token(this.access_token = auth.refresh_token);
        if (refresh){
          clearTimeout(this.refreshTokenTimeout);
          // console.error(`REFRESH EXPIRES IN ${expires_in}`, $.auth.refreshTokenTimeout);
          this.refreshTokenTimeout = setTimeout(this.refreshToken, (refresh.expires_in - 2) * 1000);
        }
      }
      // $().storage(this.key+'AuthProvider',this.auth)
      return this;
    },
    login(params){
      return $.promise('Login', async (resolve, fail) => {
        // console.log('LOGIN', params);
        // return;
        const url = new URL(document.location);
        if (url.searchParams.has('code')){
          // return console.error(url.searchParams.get('code'));
          await this.getAccessToken({code: url.searchParams.get('code')});
        }

        if (params !== undefined){
          let state = Math.ceil(Math.random() * 99999);
          console.log(this.config);
          params = Object.assign({
            // scope: 'name+email+phone_number',
            response_type: 'code',
            client_id: this.config.client_id,
            redirect_uri: this.config.redirect_uri,
            state: state,
            prompt: 'consent',
            scope: this.config.scope,
            // socket_id: $.WebsocketClient.socket_id,
          }, params);
          const url = $().url(this.authUrl).query(params).toString();
          if (document.location.protocol === 'file:'){
            params.socket_id = this.ws.socket_id;
            this.loginWindow = window.open(
              url,
              'login',
              `top=${10},left=${10},width=400,height=500,resizable=0,menubar=0,status=0,titlebar=0`
            );
          } else {
            $.clipboard.reload(url);
          }
        }
        this.init();

        window.addEventListener('focus', e => {
          if (this.access_token) {
            // console.log('JE BENT INGELOGT, DUS CONTROLEREN OF TOKEN NOG OK IS ALS HET EEN INLOG TOKEN IS');
            const access = this.access;
            // als een nonce aanwezig is dan is het een inlog token.
            // controleer of token nog actief is, c.q. gebruiker is ingelogt
            if (access.nonce) {
              $().url('https://login.aliconnect.nl/api/oauth').headers('Authorization', 'Bearer ' + this.access_token).post({
                request_type: 'access_token_verification',
                // access_token: $.authProvider.access_token,
              }).then(event => {
                if (event.target.status !== 200) {
                  $().logout();
                }
              });
            }
            // console.log($.authProvider);
          }
        });

        // console.log(this);
        if (this.access) {
          resolve(this.access);
        } else {
          fail('no login');
        }

        // let previousIdToken = $.auth.id_token;
        // let previousAccessToken = $.auth.access_token;
        // $.auth.init();
        // if ($.auth.id_token && previousIdToken !== $.auth.id_token){
        // 	$().emit('login');
        // }
      });
    },
    logout(params){
      console.log($().storage('id_token'));
      if ($().storage('id_token')) {
        $().storage('id_token', null);
        $().storage('refresh_token', null);
        $().storage('access_token', null);
        // $.clipboard.reload();
        $.clipboard.reload($().url('https://login.aliconnect.nl/api/oauth').query({
          prompt: 'logout',
          client_id: $().client_id || '',
          redirect_uri: document.location.origin + document.location.pathname,
        }).toString());
      } else {
        const searchParams = new URLSearchParams(document.location.href);
        if (searchParams.get('redirect_uri')) {
          document.location.href = searchParams.get('redirect_uri');
        }
      }
    },
    // get redirect_uri(){
    //   return this.auth.redirect_uri || this.auth.redirectUri || document.location.origin+document.location.pathname
    // },
    refreshToken(){
      return console.error('refreshToken');
      if (this.refreshTokenHandle) return;
      console.log($.Client);
      this.refreshTokenHandle = new $.Client('https://login.aliconnect.nl/api/token').post({
        grant_type: 'refresh_token',
        refresh_token: $.temp.cookie.refresh_token,
        client_id: $().client_id,
        // 'redirect_uri' => self::$redirect_uri,
        // 'client_secret' => $this->client_secret,
      }).then(event => {
        // console.debug('REFR TOKEN',event);
        this.refreshTokenHandle = null;
        // var token = event.body.access_token;
        // var access = JSON.parse(atob(token.split('.')[1]));
        // var time = new Date().getTime()/1000;
        // var expires_in = Math.round(access.exp - time);
        // console.error('RRRRRRRRRRRRefreshToken', expires_in, access);
        // $.temp.cookie = {
        // 	access_token: event.body.access_token
        // };
        // var token = $.auth.access_token = $.temp.cookie.access_token || $.temp.cookie.id_token;
        // var access = JSON.parse(atob(token.split('.')[1]));
        // var time = new Date().getTime()/1000;
        // var expires_in = Math.round(access.exp - time);
        // console.error('RRRRRRRRRRRRefreshToken', expires_in, access);
        //
        return;
        $.temp.cookie = {
          access_token: event.body.access_token
        };
        $.auth.init();
        // $.auth.refreshToken = () => {console.debug('NOOOO');};
        // updateAccessToken();
      });
    },
    token(token, clientSecret){
      if (token){
        const time = new Date().getTime() / 1000;
        const access = JSON.parse(atob(token.split('.')[1]));
        return {
          token: token,
          access: access,
          time: time,
          expires_in: Math.round(access.exp - time),
          isValid: access.exp > time || true,
        }
      }
    },
    trackLocalSession(){
      return;
      clearTimeout(arguments.callee.timeout);
      const cookie = $.temp.cookie;
      // console.debug (`trackLocalSession`);
      if (!cookie.id_token && auth.id_token > ''){
        return this.logout();
      } else if (cookie.id_token > '' && !auth.id_token){
        // return client.login();
      }
      arguments.callee.timeout = setTimeout(arguments.callee, $.config.trackLocalSessionTime);
    },
    trackSession(){
      return;
      // console.error (`trackSession`, $.auth.id.iss, arguments.callee.timeout);
      if (arguments.callee.httpRequest) return;
      clearTimeout(arguments.callee.timeout);
      window.removeEventListener('focus', arguments.callee);
      window.addEventListener('focus', arguments.callee);
      // $.auth.id.iss = 'login.aliconnect.nl/api/oauth';
      // alert(1);
      arguments.callee.timeout = setTimeout(arguments.callee, $.config.trackSessionTime);
      arguments.callee.httpRequest = $().url(authorizationUrl)
      .query('request_type', 'check_access_token')
      .headers('Authorization', 'Bearer ' + auth.id_token)
      .get()
      .then(event => {
        console.warn('trackSession', event.target);
        arguments.callee.httpRequest = null;
        // console.debug($.auth.id.nonce, event.target.status, event.target.responseText);
        if (event.target.status !== 200){
          window.removeEventListener('focus', arguments.callee);
          // return $.auth.logout();
        }
      });
    },
    // loginUrl(prompt = 'login'){
    // 	return $().url(this.authUrl).query({
    // 		response_type: 'code',
    // 		client_id: this.client_id,
    // 		redirect_uri: this.redirect_uri,
    // 		scope: 'name email',
    // 		prompt: prompt,
    // 	}).toString()
    // },
  };

  Aim.AuthenticationProvider = function AuthenticationProvider (aimApplication, config) {
    this.aimApplication = aimApplication;
    this.config = config;
  }
  Aim.AuthenticationProvider.prototype = {
    getAccessToken() {
      return this.aimApplication.storage.getItem('access_token')
    }
  }

  Aim.DataProvider = function DataProvider(options) {
    this.config = options;
  }
  Object.assign(Aim.DataProvider, {
    initWithMiddleware() {
      // const options = Object.assign()
      return new this(Object.assign({},...arguments));
    },
  })
  Aim.DataProvider.prototype = {
    api(path){
      const access_token = this.config.authProvider.getAccessToken();
      const url = this.config.servers[0].url;
      return $().url(url + path).headers('Authorization', 'Bearer ' + access_token);
    }
  }

  Aim.Client = function Client (options) {
    this.config = options;
    Array.from(options.servers).forEach(server => $.servers.set(server.url, this));
    this.url = options.servers[0].url;
    this.hostname = this.url.match(/\/\/(.*?)\//)[1];


    return this;
    // client(options){
    //   this.get(Client, options ? Object.assign(options,{authProvider: options.authProvider || this.authProvider()}) : null);
    //   return this;
    // },
    // console.error(...arguments);
    // [...arguments].forEach($(this).extend)
    this.config = {
      id: {},
      server: [
        {
          url: window.document ? document.location.origin+'/api' : 'https://aliconnect.nl/api',
        }
      ]
    };
    [...arguments].forEach(options => $(this.config).extend(options));
    this.url = this.config.servers[0].url;
    this.hostname = this.url.match(/\/\/(.*?)\//)[1];
    clients.set(this.hostname, this);
    // this.config = config;
    // console.debug(this.authProvider);
    // if (this.access_token = this.authProvider.getAccessToken()){
    // 	this.access = JSON.parse(atob(this.access_token.split('.')[1]));
    // 	this.sub = this.access.sub;
    // 	this.aud = this.access.aud;
    // }
    // $.temp.dms = $.temp.dms || [];
    // $.temp.dms.push(this);
    // $().dms[selector] = this;
    // Object.assign(this, context);
    // this.config = context;
    // console.debug('SERVERS', this.servers);

    // this.id = {};
    // this.servers = this.servers || [];
    // this.server = this.servers[0] || {};
    // this.url = this.server.url || (window.document ? document.location.origin+'/api' : 'https://aliconnect.nl/api');
    // const hostname = this.hostname = this.url.match(/\/\/(.*?)\//)[1];
    // $[hostname] = this;
    // console.debug('Client', this.hostname, this);
    // const servers = this.servers || [];
    // this.server = servers[0] || {};
    // console.debug(`Client ${selector} = ${context.info ? context.info.title : ''}`);
  }

  Aim.Client.prototype = {
    loginUrl() {
      console.error(this.config.client_id);
      return $()
      .url('https://login.aliconnect.nl/')
      .query({
        prompt: 'login',
        response_type: 'code',
        client_id: this.config.client_id,
        redirect_uri: document.location.origin + (this.config.redirect_path || ''),
        // client_id: config.auth.client_id || config.auth.clientId,
        // state: state,
        scope: this.config.scope,//('all'),
        // socket_id: data.socket_id,
      });
    },
    configGet() {
      console.log('configGet');
      return $().url(this.url+'/../config.json').get().then(e => {
        $.extend(this.config, e.body);
        // $.config = event.body;
      }).catch(console.error);
    },
    configUserGet() {
      return $().url(this.url+`/../config/${this.authProvider.sub}/config.json`).get().then(event => {
        $.extend(this.config, e.body);
        // $.extend($.config, JSON.parse(event.target.responseText));
        // $($.config).extend($.api_user = event.body);
      }).catch(err => {
        // $.api_user = {};
      });
    },
    api(path){
      // const client = this.client();
      const access_token = this.authProvider && this.authProvider.getAccessToken ? this.authProvider.getAccessToken() : null;
      if (!this.url) throw 'No api url specified';
      // const pathUrl = new URL(path, client.url);
      // console.error(''+pathUrl);
      // console.warn(client);
      const url = $().url(this.url + path.replace(/.*\/api/,''));
      // const url = this.url(pathUrl);
      // console.debug('aa', access_token, client.authProvider);
      // console.debug('aa', client.authProvider);
      return access_token ? url.headers('Authorization', 'Bearer ' + access_token) : url;
      // return this.client().api(path);
      // return $().url(this.props('url') + path).header('access_token', this.props('access_token'));
    },



    Get_Aliconnector_Key(){
      copyText = document.body.createElement('INPUT', { value: $.deviceUID });
      copyText.select();
      document.execCommand("Copy");
      document.body.removeChild(copyText);
      alert('Plak (Ctrl+V) de code in het veld "User device UID" van uw aliconnector app');
    },
    addrules(){
      if (this.web && this.web.css && this.web.css.rules){
        for (let [name, value] of Object.entries(this.web.css.rules)){
          new $.css(name, value);
        }
      }
    },
    createLoginFrame(params){
      params = Object.assign(params, {
        response_type: 'code',
        // redirect_uri: document.location.href,
        prompt: 'accept',
        scope: 'name email',
      });
      // params = new URLSearchParams({
      // 	client_id: client_id || $.config.$.client_id,
      // 	response_type: 'code',
      // 	// redirect_uri: document.location.href,
      // 	scope: 'name email',
      // 	state: '12345',
      // 	prompt: 'login',
      // });
      let url = 'https://login.aliconnect.nl?' + new URLSearchParams(params).toString();
      console.debug('LOGIN', url);
      // let login_window = window.open(url, 'login', 'top=0,left=0,width=300,height=300');
      // let loginElement = document.body.createElement('iframe', {src: url, style: 'position:fixed;margin:auto;width:100%;height:100%;top:50px;right:50px;bottom:50px;left:50px;'});
      let loginElement = document.body.createElement('DIV', { style: 'position:fixed;margin:auto;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,0.5);' }, [
        ['IFRAME', { src: url, style: 'position:fixed;margin:auto;top:0;right:0;bottom:0;left:0;width:100%;height:100%;max-width:500px;max-height:500px;border:none;' }]
      ]);
      window.addEventListener('message', event => {
        loginElement.remove();
        $.auth.getLogin();
        // if (callback) callback($.auth.id);
      }, false);
      return;
      // const params = new URLSearchParams({
      // 	client_id: client_id || $.config.$.client_id,
      // 	response_type: 'code',
      // 	redirect_uri: document.location.href,
      // 	scope: 'name email',
      // 	state: '12345',
      // 	prompt: 'login',
      // });
      // document.location.href = 'https://login.aliconnect.nl?' + params.toString();
    },
    mail(){
      return new $.HttpRequest('POST', $.origin + '/api?request_type=mail', params, res).send();
    },
    pdf(){
      return new $.HttpRequest('POST', $.origin + '/api?request_type=pdf', params, res).send();
    },
    publish(){
      console.debug("PUBLISH");
      new $.HttpRequest($.config.$, 'POST', '/', aimapi, event => {
        console.debug("API", this.responseText );
        return;
        var swaggerUrl = 'https://editor.swagger.io/?url=https://'+$.config.$.domain+'.aliconnect.nl/openapi.json';
        var onlineUrl = 'https://' + $.config.$.domain + '.aliconnect.nl';
        console.debug(swaggerUrl, onlineUrl);
        if (confirm("Show in Swagger editor")) window.open(swaggerUrl, "swagger");
        //else console.debug(swaggerUrl);
        if (confirm("Show online")) window.open(onlineUrl, "om");
        return;
        console.debug(onlineUrl, this.responseText);
        document.location.href = document.location.pathname;
      }).send();
      return;
      var def = {
        paths: {
          item: {
            get: {
              parameters: [
                {name: "id", in: "path", description: "", required: true, schema: { type: "integer", format:"int64"}},
                {name: "child", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "tree", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "master", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "src", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "user", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "refby", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "link", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "select", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "search", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "sync", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "order", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "filter", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "three", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "top", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "Accept", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "Accept", in: "header", description: "", schema: { type: "integer", format:"int64"}},
                {name: "Odata-Version", in: "header", description: "", schema: { type: "integer", format:"int64"}},
                {name: "aud", in: "header", description: "", schema: { type: "integer", format:"int64"}},
                {name: "sub", in: "header", description: "", schema: { type: "integer", format:"int64"}},
              ],
              responses: {
                405: { description: "Invalid input", content: { } }
              },
            },
          }
        }
      };
      var api = JSON.parse(aimapi);
      api.paths = api.paths || {};
      for (var SchemaName in api.components.schemas){
        var schemaName = SchemaName, schema = api.components.schemas[SchemaName];
        (api.tags = api.tags || []).push({name:SchemaName});
        schema.security = schema.security || {
          get: [{ default_auth: ['read:web'] }],
          post: [{ default_auth: ['read:web'] }],
          patch: [{ default_auth: ['read:web'] }],
          delete: [{ default_auth: ['read:web'] }],
        };
        api.paths['/' + schemaName] = api.paths['/' + schemaName] || {
          get: {
            //"tableName": schema.tableName, "idname": schema.idname, "searchNames": schema.searchNames,
            tags: [schemaName],
            Summary: "Get list of " + SchemaName,
            operationId: "item('" + SchemaName + "').find",
            parameters: def.paths.item.get.parameters, //{ "$ref": "#/paths/item/get/parameters" },
            responses: def.paths.item.get.responses, //{ "$ref": "#/paths/item/get/responses" },
            security: schema.security.get,
          },
          post: {
            tableName: schema.tableName, "idname": schema.idname,
            tags: [schemaName],
            Summary: "Add a new " + SchemaName,
            operationId: "item('" + SchemaName + "').add",
            parameters: def.paths.item.get.parameters, //{ "$ref": "#/paths/item/get/parameters" },
            responses: def.paths.item.get.responses, //{ "$ref": "#/paths/item/get/responses" },
            requestBody: {
              description: SchemaName + " object that needs to be added to the store",
              content: { "application/json": { schema: { "$ref": "#/components/schemas/" + SchemaName } } }
            },
            security: schema.security.post,
          },
        };
        api.paths['/' + schemaName + "(id)"] = api.paths['/' + schemaName + "(id)"] || {
          get: {
            // tableName: schema.tableName,
            // idname: schema.idname,
            tags: [schemaName],
            Summary: "Find " + SchemaName + " by ID",
            description: "Returns a single " + SchemaName,
            operationId: "item('" + SchemaName + "').get",
            parameters: def.paths.item.get.parameters, //{ "$ref": "#/paths/item/get/parameters" },
            responses: {
              200: { description: "successful operation", content: { "application/json": { schema: { "$ref": "#/components/schemas/" + SchemaName } } } },
              400: { description: "Invalid ID supplied", content: {} },
              404: { description: SchemaName + " not found", content: {} }
            },
            security: schema.security.get,
          },
          post: {
            // tableName: schema.tableName, "idname": schema.idname,
            tags: [schemaName],
            Summary: "Updates a " + SchemaName + " with form data",
            operationId: "item('" + SchemaName + "').post",
            parameters: def.paths.item.get.parameters, //{ "$ref": "#/paths/item/get/parameters" },
            responses: def.paths.item.get.responses, //{ "$ref": "#/paths/item/get/responses" },
            requestBody: {
              content: {
                "application/x-IsPublic-form-urlencoded": {
                  schema: {
                    properties: {
                      name: { type: "string", description: "Updated name of the " + SchemaName },
                      status: { type: "string", description: "Updated status of the " + SchemaName }
                    }
                  }
                }
              }
            },
            security: schema.security.post,
          },
          patch: {
            // tableName: schema.tableName,
            // idname: schema.idname,
            tags: [schemaName],
            Summary: "Updates a " + SchemaName,
            operationId: "item('" + SchemaName + "').patch",
            parameters: def.paths.item.get.parameters, //{ "$ref": "#/paths/item/get/parameters" },
            responses: def.paths.item.get.responses, //{ "$ref": "#/paths/item/get/responses" },
            security: schema.security.patch,
          },
          delete: {
            // "tableName": schema.tableName, "idname": schema.idname,
            tags: [schemaName],
            Summary: "Deletes a " + SchemaName,
            operationId: "item('" + SchemaName + "').delete",
            parameters: def.paths.item.get.parameters, //{ "$ref": "#/paths/item/get/parameters" },
            responses: def.paths.item.get.responses, //{ "$ref": "#/paths/item/get/responses" },
            security: schema.security.delete,
          }
        }
        //"security, usertasks".split(", ").forEach(function(key){delete(schema[key]);});
        // var properties = {};
        // for (var propertyName in schema.properties){
        // 	var property = properties[propertyName] = {};
        // 	for (var key in ref.properties){
        // 		if (schema.properties[propertyName][key]) property[key] = schema.properties[propertyName][key];
        // 	}
        // }
        //api.components.schemas[SchemaName] = {properties: properties};
      }
      console.debug(api.paths);
      aimapi = JSON.stringify(api, null, 2);
      var js = $.operations ? JSON.stringify($.operations, function(key, value){ return typeof value == "function" ? value.toString() : value }, 4).replace(/\\r\\n/g, '\r\n').replace(/\\t/g, '    ').replace(/"function /g, 'function ').replace(/}"/g, '}') : "";
      //return;
      //console.debug("FN", "$.extend({operations: {\n" + fn.join(", \n") + "\n}});" );
      new $.HttpRequest($.config.$, 'POST', '/', aimapi, event => {
        console.debug("API", this.responseText );
        new $.HttpRequest($.config.$, 'POST', '/?js', `$.operations = ${js};`, event => {
          console.debug("JS", this.responseText );
          var swaggerUrl = 'https://editor.swagger.io/?url=https://'+$.config.$.domain+'.aliconnect.nl/openapi.json';
          var onlineUrl = 'https://'+$.config.$.domain+'.aliconnect.nl';
          console.debug(swaggerUrl, onlineUrl);
          if (confirm("Show in Swagger editor")) window.open(swaggerUrl, "swagger");
          //else console.debug(swaggerUrl);
          window.open(onlineUrl, "om");
          return;
          console.debug(onlineUrl, this.responseText);
          document.location.href = document.location.pathname;
        });
      }).send();
    },
    qrcode(selector){
      if (typeof QRCode === 'undefined'){
        return Object.assign(document.head.createElement('script'), {
          src: 'https://aliconnect.nl/api/js/lib/qrcode.js',
          onload: arguments.callee.bind(this, ...arguments),
        });
      }
      new QRCode(selector, {
        // text: $.config.$.websocket.socket_id,
        text: $.config.$.websocket.socket_id ? 'https://login.aliconnect.nl?s=' + $.config.$.websocket.socket_id : '',
        width: 160,
        height: 160
      });
    },
    randompassword(){
      a = [];
      for (var i = 0; i < 20; i++){
        // a.push(String.fromCharCode(48 + Math.round(74 * Math.random())));
        a.push(String.fromCharCode(33 + Math.round((126-33) * Math.random())));
      }
      return a.join('');
    },
    setUserstate(userstate){
      clearTimeout(this.stateTimeout);
      const config = this.config;
      if (this.access && this.access.sub){
        if (userstate === 'available'){
          this.stateTimeout = setTimeout(() => $.setUserstate('inactive'), 5 * $.config.minMs);
        } else if (userstate === 'inactive'){
          this.stateTimeout = setTimeout(() => $.setUserstate('appear_away'), 5 * $.config.minMs);
        }
        if (this.userstate !== userstate){
          $.send({
            // to: { aud: $.auth.access.aud, sub: $.auth.access.sub },
            sub: this.access.sub,
            userstate: this.userstate = userstate,
          });
        }
      }
    },
    setState(activestate){
      //// console.debug('setactivestate', activestate);
      //var data = { activestate: activestate, accountID: $.client.account.id, userID: $.Account.sub, to: [$.key] };
      //fieldset($.Account.sub, 'state', activestate, true);
      //fieldset($.client.account.id, 'state', activestate, true);
      // Check if current logged in user is still logged in
      if (activestate == 'focus'){
        //if ('auth' in $) $.auth.check_state();
        // src='https://login.aliconnect.nl/api/v1/oauth/token/index.php';
        // src='https://login.aliconnect.nl/$-connect/$-api/v1/oauth/token/index.php';
        // new $.Client({
        // 	src: src, onload: function(event){
        // 		// console.debug('SETACTIVESTATE', this.status, this.responseText, this.data);
        // 		if (this.status != 200) $.auth.login();
        // 		//// console.debug('api', this.data);
        // 	}
        // });
        // src=$.authurl + 'token/';
        // new $.Client({
        // 	src: src, onload: function(event){
        // 		// console.debug('SETACTIVESTATE', this.status, this.responseText, this.data);
        // 		if (this.status != 200) $.auth.login();
        // 		//// console.debug('api', this.data);
        // 	}
        // });
        return;
        ws.send({
          //broadcast: true,
          //to: { host: $.Account.aud },
          value: [{ id: $.Account.sub, values: { state: activestate } }, { id: $.client.account.id, values: { state: activestate } }]
        });
      }
      //return;
      //ws.send(data);
      //ws.send({ a: 'set', id: $.client.account.id, name: 'online', value: false });
      //ws.send({ a: 'blur' });
      //clearTimeout(msg.to);
      //new $.Client({
      //    api: 'window/blur/' + aliconnect.deviceUID,
      //    //post: { exec: 'onblur', deviceUID: aliconnect.deviceUID, },
      //    onload: function(){
      //        //// console.debug('onblur done', this.post);
      //    }
      //});
    },
    sms(){
      return new $.HttpRequest('POST', $.origin + '/api?request_type=sms', params, res).send();
    },
    then(callback){
      this.callback = callback;
    },
    ws_send_code(socket_id, code){
      $.WebsocketClient.request({
        to: {
          sid: socket_id,
        },
        body: {
          // id_token: $.auth.id_token,
          code: code,
        },
      });
      window.close();
    },
  };

  Object.assign(Item = function () {}, {
    get(selector, schemaName){
      // console.log(selector.schemaName);
      // iii++;
      // if (iii>1000) throw 'STOP';
      if (!selector) throw 'No Item selector';
      if (selector instanceof Item) return selector;
      if (typeof selector !== 'object'){
        if ($.map.has(selector)){
          return $.map.get(selector);
        } else if (isNaN(selector)){
          selector = { '@id' : selector };
        } else {
          return null;
        }
      }
      if (selector.AttributeID){
        selector = {
          '@id': selector['@id'],
          header0: selector.Value,
        };
      }
      let match = (selector['@id'] || selector['@odata.id'] || selector.tag || '').match(/(\w+)\((\d+)\)/);
      // console.log(selector.schema);
      if (match && !selector.schema && !selector.schemaName) {
        selector.schema = match[1];
        selector.ID = match[2];
      }
      const ID = selector.ID = selector.ID ? selector.ID.Value || selector.ID : String('item'+(selector.nr = Item.nr = Item.nr ? ++Item.nr : 1));
      // console.log(selector.ID);
      // if (selector.schemaPath) console.debug(selector.schemaPath)
      // if (!selector.schema) console.error(selector.schemaPath, selector)
      // console.log(selector.schema);
      schemaName = validSchemaName(selector.schema = selector.schema || selector.schemaName || schemaName || 'Item');
      const tag = `${schemaName}(${ID})`;
      if (tag.includes('[')) console.warn(tag, selector);
      const id = selector.id || tag;
      var item = $.map.get(id);
      // console.warn(111,schemaName,id);
      if (item) {
        // console.log(item.data);
        item.data = Object.assign(item.data, selector);
      } else {
        // console.debug(schemaName, window[schemaName]);
        // if (!window[schemaName]) return console.warn(schemaName, 'not exists');
        // console.log(schemaName, window[schemaName]);
        var item = window[schemaName] ? new window[schemaName]() : new Item();
        // console.debug(selector, item.schema, window[schemaName].prototype);
        // console.log(selector.properties);
        item.properties = Object.fromEntries(
          Object.entries(selector.properties || item.schema.properties)
          .map(([propertyName, property]) => [
            propertyName,
            Object.assign({
              item: item,
              get value(){
                return item[propertyName];
              },
              set value(value) {
                item[propertyName] = value;
              },
            }, property)
          ])
        );
        item.tag = tag;
        if (item.href = selector['@id'] || selector['@odata.id']) {
          item.Id = btoa(item.href);
        }
        item.data = selector;
        item.schemaName = schemaName;
        if (window[schemaName] && window[schemaName].set){
          window[schemaName].set(tag, item);
        }
        $.map.set(ID,item);
        // console.debug(ID, $.map.get(ID));
        $.map.set(tag,item);
        $.map.set(id,item);
        // item.on('change', event => {
        //   // console.debug($().list())
        //   // Object.values(this).filter(obj => typeof obj === 'object' && obj.emit).forEach(obj => obj.emit('change'));
        // });
      }
      return item;
      Object.entries(item.data).forEach(([propertyName,property]) => {
        // console.log(propertyName,property, item.hasOwnProperty(propertyName));
        if (!item.hasOwnProperty(propertyName)) {
          Object.defineProperty(item, propertyName, {
            get(){
              return this.getValue(propertyName);
            },
            set(value){
              this.attr(propertyName, value, true);
            }
          });
        }
      });
      return item;
    },
    mergeinto(newID, oldID){
      //om drop action move into
      // console.debug('SAMENVOEGEN');
      new $.HttpRequest($.config.$, 'GET', `/item(${newID})`, {
        oldID: oldID,
      }, this.onload || function (){
        // console.debug(this.data);
      }).send();
    },
    new(item){
      return $.promise( 'New item', resolve => {
        //Geeft inzicht in bal bla
        //// console.debug('ADD', this.caller);
        //return;
        //var a = String(this.id || get.lid).split(';');
        //var schemaname;// = api.find(post.classID);
        //var schema = $.config.components.schemas[this.caller.schema];// || $.config.components.schemas[schemaname = api.find(post.classID)];
        //var post = { id: a.shift(), };
        //if (schema.onadd) schema.onadd.call(post);
        // var put = { schema: item.schema || item.get.folder };
        //// console.debug('ADD', this, put, this.caller);
        if (item.source){
          const [s,schemaName,id] = item.source.match(/(\w+)\((\d+)\)/);
          var url = `/${schemaName}`;
          item
        }
        $.client.api(url).patch(item).then(event => {
          console.debug(event.target.responseText);
          resolve(event.body);
        });
        return;
        new $.HttpRequest($.config.$, 'PATCH', '/' + this.schema, {
          value: [put],
        }, this.onload || function(event){
          // console.debug('ADDED', this.data);
          //return;
          //// console.debug(this.src, this.responseText, this.data.id, this.data, $.getItem(this.data.id]);
          //var itemID = this.data[];//.set[0][0].id;
          var item = ItemAdded = $.getItem(event.body.Value.shift().id);
          item.onloadEdit = true;
          for (var name in item.properties){
            if (item.properties[name].initvalue){
              item.setAttribute(name, item.properties[name].initvalue);
            }
          }
          $.url.set({ schema: item.schema, id: item.id });
          //// console.debug('LV', $.listview);
          //$.listview.elItems.insertBefore($.listview.items.appendListitem(item), $.listview.elItems.firstChild);
          //$.show({ id: item.id });
        }).send();
        resolve('ja');
      })
    },
    toData(item){
      console.debug('TODATA', item);
      return {
        ID: item.ID,
        tag: item.tag,
        index: item.index,
        title: item.headerTitle,
        // hostID: item.hostID,
        // srcID: item.srcID,
        // classID: item.classID,
        Master: item.elemTreeLi && item.elemTreeLi.elem.parentElement.item ? { tag: item.elemTreeLi.elem.parentElement.item.tag } : null,
        Class: item.data.Class,
        // type: type,
      }
    },
    toHtml(item){
      return `<table>${Object.entries(item).filter(entry => !['object', 'function'].includes(typeof entry[1])).map(entry => `<tr><td>${entry[0]}</td><td>${entry[1]}</td></tr>`).join('')}</table>`;
    },
    toText(item){
      return `${Object.entries(item).filter(entry => !['object', 'function'].includes(typeof entry[1])).map(entry => `${entry[0]}\t${entry[1]}\n`).join('')}`;
    },
  });
  Item.prototype = {
    api(selector = '') {
      return $.client.api(`/${this.tag}` + selector);
    },
    attr(attributeName, value, postdata){
      return $.promise( 'Attribute', async resolve => {
        try {
          // console.warn(1, 'attr', attributeName, value, postdata);
          const item = this;
          const property = this.schema.properties[attributeName] || {};
          if (property.readOnly) return resolve(item);
          if (value === undefined){
            return resolve(item);// console.error('value is undefined', arguments.length, attributeName, this);
          }
          if (value instanceof String){
            value = String(value);
          }
          const values = item.data = item.data || {};
          if (Array.isArray(value)){
            values[attributeName] = value;
            // console.debug('attr1', attributeName, value);
            return resolve(item);
          }
          let data = values[attributeName] = values[attributeName] || {};
          data = [].concat(data);
          data = data.filter(data => !data.SrcID || data.SrcID == item.ID);
          if (typeof value !== 'object' || value === null) {
            value = { Value: value };//values[attributeName] = values[attributeName] || value;
          }
          function getItem(selector) {
            if (selector instanceof Item) return selector;
            selector = typeof selector === 'object' ? selector.tag : selector;
            if ($.map.has(selector)) return $.map.get(selector);
          }
          if (value.target) {
            console.log(value.target);
            value.LinkID = getItem(value.target).ID;
          }
          if (value.current) {
            const current = getItem(value.current);
            data = data.find(attr => attr.AttributeName === attributeName && attr.LinkID === current.ID) || null;
          } else if (value.AttributeID) {
            data = data.find(data => data.AttributeID === value.AttributeID)
          } else if (value.type !== 'append') {
            data = data.shift();
          }
          // if (value === data){
          //   console.debug('attr2', attributeName, value);
          //   return resolve(item);
          // }
          if (typeof data !== 'object' || data === null){
            data = values[attributeName] = { Value: data };
          }
          value = Object.assign({},{
            AttributeID: data.AttributeID,
            Value: data.Value,
            HostID: data.HostID,
            Data: data.Data,
            LinkID: data.LinkID
          },value);
          if (value.LinkID1) {
            async function reindex(parent) {
              await parent.children.then(children => {
                if (children.length) {
                  // children.forEach((item,i) => item.getIndex(attributeName, parent) != i ? item.setLink(attributeName, parent, i, parent) : null);
                }
                // parent.attr('HasChildren', children.length ? 1 : 0, true);
              })
            }
            const to = $.map.get(value.LinkID);
            // const name = attributeName || 'link';
            const action = value.action || 'move';
            if (attributeName === 'Master') {
              if (action === 'move') {
                const current = item.elemTreeLi.elem.parentElement.item;
                value.Data = Math.max(0, value.Data === undefined ? 99999 : value.Data );
                await current.children.then(children => {
                  children.splice(children.indexOf(item), 1);
                  if (current !== to) {
                    // reindex(current);
                  }
                });
                if (to) {
                  await to.children.then(children => {
                    children.splice(value.Data, 0, item);
                    reindex(to);
                  });
                  // } else {
                  //   item.setLink(attributeName, to, value.Data, current);
                }
                // } else {
                //   item.setLink(attributeName, to, params.index, current);
              }
              // setTimeout(() => resolve(item));
              // return;
            }
          }
          const currentJson = [data.AttributeID,data.Value,data.HostID,data.Data,data.LinkID].join();
          const newJson = [value.AttributeID,value.Value,value.HostID,value.Data,value.LinkID].join();
          if (value.max) {
            delete value.AttributeID;
          } else if (currentJson === newJson){
            return resolve(item);
          } else {
            // console.log(attributeName,currentJson,newJson,value,data);
          }
          // console.debug(attributeName, value);
          if ($.threeObjects && $.threeObjects[item.tag] && $.threeObjects[item.tag].obj.onchange){
            $.threeObjects[item.tag].obj.onchange(attributeName, value.Value);
          }
          item['@id'] = item['@id'] || item.tag;
          // console.debug(attributeName, value);
          Object.assign(data, value);
          if (item.elems) {
            item.elems.forEach(elem => {
              var displayvalue = newvalue = typeof value === 'object' ? value.Value : value;
              // console.debug(attributeName, value, item.elems);
              // var displayvalue = property.displayvalue || displayvalue;
              const el = elem.elem;
              if (el.hasAttribute('displayvalue')) {
                elem.displayvalue(this.displayvalue(attributeName));
              }
              // if (property.type === 'datetime'){
              // 	newvalue = new Date(newvalue).toISOString().substr(0,19);
              // }
              // Do not update if type in files
              // if (!['files','radio','select'].includes(property.format)){
              // displayvalue = String(displayvalue).split('-').length == 3 && String(displayvalue).split(':').length == 3 && new Date(displayvalue) !== "Invalid Date" && !isNaN(new Date(displayvalue)) ? new Date(displayvalue).toISOString().substr(0, 19).replace(/T/, ' ') : displayvalue;
              // if (displayvalue && !isNaN(displayvalue)){
              // 	displayvalue = Math.round(displayvalue * 100) / 100;
              // }
              if (el.hasAttribute(attributeName) && el.getAttribute(attributeName) != newvalue){
                el.setAttribute(attributeName, newvalue);
                el.setAttribute('modified', new Date().toLocaleString());
              }
              // [...el.getElementsByClassName(attributeName)].forEach((attributeElement, i) => {
              //   // if (attributeElement.noupdate) return;
              //   // if (attributeElement === document.activeElement) return;
              //
              //   if (['files','radio','select'].includes(attributeElement.format)) return;
              //   if (attributeElement.hasAttribute('checked')){
              //     if (newvalue){
              //       attributeElement.setAttribute('checked', '');
              //     } else {
              //       attributeElement.removeAttribute('checked');
              //     }
              //     attributeElement.setAttribute('modified', new Date().toLocaleString());
              //   } else if ('value' in attributeElement && attributeElement.type === 'radio'){
              //     attributeElement.checked = attributeElement.value === newvalue;
              //   } else if ('value' in attributeElement){
              //     // return console.error(attributeElement, document.activeElement, attributeElement === document.activeElement);
              //     // return console.error(1);
              //     // console.error(attributeElement.value, newvalue)
              //     if (attributeElement.value != newvalue){
              //       attributeElement.value = newvalue;
              //       attributeElement.setAttribute('modified', new Date().toLocaleString());
              //     }
              //   } else if (attributeElement.hasAttribute('value')){
              //     if (attributeElement.getAttribute('value') != newvalue){
              //       attributeElement.setAttribute('value', newvalue);
              //       attributeElement.setAttribute('modified', new Date().toLocaleString());
              //     }
              //   } else if (['SPAN', 'DIV', 'TD'].includes(attributeElement.tagName)){
              //     // console.debug(attributeElement.tagName, attributeElement, attributeElement.children);
              //     if (property && property.options && property.options[newvalue] && property.options[newvalue].color){
              //       if (attributeElement.style.backgroundColor){
              //         attributeElement.style.backgroundColor = property.options[newvalue].color;
              //       }
              //     } else if (!attributeElement.children.length){
              //       attributeElement.innerHTML = displayvalue != undefined ? displayvalue : '';
              //     }
              //     // attributeElement.setAttribute('modified3', new Date().toLocaleString());
              //   }
              // });
              setTimeout(e => elem.emit('change'));
              // if (el.onupdate){
              //   setTimeout(el.onupdate);
              // }
            })
          }
          if (!$.temp.noPost && postdata){
            // console.error(arguments);
            // for (var callee = arguments.callee, caller = callee.caller;caller;caller = caller.caller){
            // 	console.debug(caller);
            // }
            // return;
            const itemModified = $.temp.itemsModified[item['@id']] = $.temp.itemsModified[item['@id']] || {
              ID: item.data.ID ? item.data.ID.Value || item.data.ID : null,
              method: 'patch',
              path: '/' + item.tag,
              body: {
                // ID: item.data.ID,
              },
              // res: (event) => {
              // 	// console.debug('DONE', item.tag, event.request );
              // }
            };
            // console.log(itemModified);
            const updateProperty = itemModified.body[attributeName] = itemModified.body[attributeName] || {};
            Object.assign(updateProperty, (({ AttributeID, Value, HostID, UserID, LinkID, Data }) => ({ AttributeID, Value, HostID, UserID, LinkID, Data }))(data));
            if ('max' in property && !('max' in value)) {
              value.max = property.max;
            }
            if ('max' in value) {
              updateProperty.max = value.max;
              if (value.LinkID !== null || value.Value !== null) {
                delete updateProperty.AttributeID;
              }
            }
            // if (value.LinkID === null) return console.warn(value,updateProperty);
            let values = Object.values($.temp.itemsModified);
            if (values.length){
              clearTimeout($.temp.itemsModifiedTimeout);
              $.temp.itemsModifiedResolve = $.temp.itemsModifiedResolve || [];
              $.temp.itemsModifiedResolve.push([resolve, item]);
              $.temp.itemsModifiedTimeout = setTimeout(() => {
                $.temp.itemsModified = {};
                const param = { requests: values };
                // console.debug('saveRequests', param.requests);
                if ($.config && $.config.dbs) {
                  $.saveRequests(param.requests);
                } else if (this.schema.table) {
                } else {
                  $().send({
                    to: { aud: $.aud, sub: $.aud },
                    body: param,
                    itemsModified: true,
                  });
                  // DEBUG: MKAN STAAT UIT IVM SCHIPHOL
                  $().send({body: param});
                }
                $.handleData({body: { requests: values }});
                $.temp.itemsModifiedResolve.forEach(([resolve, item]) => resolve(item));
                $.temp.itemsModifiedResolve = [];
              });
            }
          } else {
            resolve(item);
          }
          // if (properties[attributeName]){
          // var property = item.properties[attributeName];
          // if (property.type === 'datetime'){
          // 	if (value.Value){
          // 		value.Value = (value.Value + ':00').substr(0,19);
          // 	}
          // }
          // return;
          if (property.type === 'datetime'){
            if (value.Value && value.Value.match(/T\d+:\d+$/)){
              value.Value = (value.Value + ':00').substr(0,19);
            }
          }
          // let {UserID,Value} = value;
          // console.debug(Object.entries(value), JSON.stringify(data), JSON.stringify(value));
          // Object.assign(data, value);
          //
          // for (let [key, keyValue] of Object.entries(value)){
          // 	if (values[key] != keyValue){
          // 		let object = Object.assign(data, value);
          // 		['UserID', 'Value', 'LinkID', 'Data'].forEach(key => {
          // 			if (key in data){
          // 				var bodyAttribute = itemModified.body[attributeName] = itemModified.body[attributeName] || {};
          // 				bodyAttribute[key] = value[key];
          // 			}
          // 		});
          // 		break;
          // 	}
          // }
          // execute autonoom_proces for item and parent
          for (let parent = item; parent; parent = parent.parent){
            if (parent.operations){
              for (let [operationName, operation] of Object.entries(parent.operations)){
                if (parent[operationName] && operation.stereotype === 'autonoom_proces' && typeof parent[operationName] === 'function'){
                  // console.debug('setAttribute autonoom_proces', operationName);
                  try {
                    // item[operationName]();
                  } catch (err){
                    console.debug('ERROR', err);
                  }
                }
              }
            }
          }
          // }
          /* bij data van database, item.loading dan stoppen met uitvoeren, niet wegschrijven naar database, is ook actief bij data van WS  */
          /* If attribute exists (been loaded) then this is an update and the change should be writen to the database			*/
          (recursive = function (item){
            if (!item) return;
            if (typeof item.onchange === 'function') item.onchange();
            recursive(item.master);
          })(item);
          // $().emit("attributeChange", { item: this, [attributeName]: modvalues });
          // return ref.itemsModified;
        } catch (err) {
          console.error(err);
        }
      });
    },
    append(item, index){
      return $.promise( 'Append', async resolve => {
        if (item.parent) {
          await item.parent.children.then(children => {
            const index = children.indexOf(item);
            children.splice(index, 1);
            if (item.parent !== this) {
              children.forEach((item,i) => item.index !== i ? item.Masterindex = i : i);
            }
          });
        }
        this.children.then(children => {
          children.splice(index = Math.max(index,0), 0, item);
          item.attr('Master', { LinkID: this.data.ID }, true);
          console.debug('MASTER',this.data.ID,item.data.Master.LinkID)
          children.forEach((item,i) => item.index !== i ? item.index = i : i);
          setTimeout(() => resolve(item));
        });
      });
    },
    get bccRecipients(){
      console.log(this);
      return this.data.bccRecipients || 0;
    },
    get ccRecipients(){
      return this.data.ccRecipients || 0;
    },
    get children() {
      return $.promise( 'Children', resolve => {
        if (this.items) return resolve(this.items);
        const api = this.api(`/children`)
        .filter('FinishDateTime eq NULL')
        .select($.config.listAttributes)
        .get()
        .then(event => {
          // const children = Array.isArray(this.data.Children) ? this.data.Children : this.data.children;
          // console.log('children_then', this.header0, this.data.Children, this.data.children, this.data, JSON.parse(event.target.responseText));
          const children = this.data.Children || this.data.children;
          this.items = [].concat(children).filter(Boolean).map($).unique();
          this.items.url = event.target.responseURL;
          this.HasChildren = this.items.length>0;
          resolve (this.items);
        })
      });
    },
    get class() {
      console.debug(this,this.schemaName,this.schema,this.classID);
      return $.map.get(this.classID);
    },
    get classItemName(){
      return (this.source && this.source.name ? this.source.name : '') + (this.name || '');
    },
    get classTag(){
      return (this.source && this.source.tag ? this.source.tag : '') + (this.tag || '');
    },
    get className() {
      // console.debug(this.schema.Name, this.schema.allOf);
      return [
        // this.schema.Name || 'Item',
        ...(this.schema.allOf || []),
        this.name,
        this.schemaName,
        this.isSchema ? 'constructor' : '',
        // this.schema.Name === 'Item' ? 'isclass' : 'noclass',
        // this.ID,
      ].join(' ')
    },
    get created(){
      return dateText(this.data.CreatedDateTime);
    },
    get createdDateTime(){
      return this.data.createdDateTime;
    },
    combine(config){
      return config.split(',')
      .map(name => this.data[name] ? this.data[name].Value || this.data[name] || '' : '')
      .filter(Boolean)
      .join(' ');
    },
    clone() {
      if (this.data.Src) {
        return $.promise( 'Clone', resolve => {
          console.debug('CLONE', this.data);
          const sourceId = [].concat(this.data.Src).shift().LinkID;
          $.client.api(`/${this.tag}`).query('request_type','build_clone_data').get().then(async event => {
            // console.warn('clone1',event.body);
            const items = event.body;
            (async function clone(targetId,sourceId){
              // console.warn('clone',targetId,sourceId);
              if (targetId && sourceId) {
                const children = items.filter(row => row.masterId && sourceId && row.masterId == sourceId);
                await children.forEach(async (child,i) => {
                  let allOf = JSON.parse(child.allOf);
                  const schemaName = allOf.find(schemaName => $().schemas().has(schemaName));
                  if (child.cloneId === null){
                    const data = {
                      header0: child.header0,
                      header1: child.header1,
                      header2: child.header2,
                      Master: {
                        LinkID: targetId,
                        Data: i,
                      },
                      Src: {
                        LinkID: child.itemId,
                      },
                      Inherited: {
                        LinkID: child.itemId,
                      },
                    };
                    console.debug('create',data);
                    // console.debug(targetId, sourceId, i, child.id, child.title, child.schemaName);
                    await $.client.api(`/${schemaName}`).input(data).post().then(event => clone(event.body.data.ID, child.itemId));
                  } else {
                    clone(child.cloneId, child.itemId)
                  }
                });
                const target = $(targetId);
                if(target && target.elemTreeLi) {
                  target.elemTreeLi.emit('toggle')
                }
              }
            })(this.data.ID,sourceId);
            resolve(this);
          });
        });
      }
    },
    get detail(){
      return this.detailID ? Item.create({ id: this.detailID }) : {};
    },
    details(reload){
      return $.promise( 'Details', resolve => {
        if (reload || !this.hasDetails){
          this.data = {};
          this.get().then(event => resolve(event.body, this.hasDetails = true)).catch(console.error);
        } else {
          resolve(this)
        }
      })
    },
    delete(){
      this.remove();
      return $.client.api(`/${this.tag}`).delete();
    },
    displayvalue(attributeName) {
      return $.attr.displayvalue(this.getValue(attributeName), ((this.schema||{}).properties||{})[attributeName]);
    },
    get elements(){
      return Object.values(this).filter(value => value instanceof Element);
    },
    eval(name){
      const config = this.schema[name] || '';
      // console.debug(name);
      if (typeof config === 'function'){
        return config.call(this);
      }
      return this.combine(config);
    },
    get fav(){
      let isFavorite = 'Fav' in this ? Number(this.Fav) : $.temp.fav.includes(this.tag);
      // console.debug('isFavorite', isFavorite);
      return isFavorite;
    },
    set fav(value){
      console.debug(value);
      let id = this.tag;
      $.temp.fav.splice($.temp.fav.indexOf(id), 1);
      if (value){
        $.temp.fav.unshift(this.tag);
      }
      // console.debug('SET FAV', private.fav, this.tag, this.id, value, $.auth.access.sub);
      this.Fav = { UserID: $.auth.access.sub, Value: value };
      this.rewriteElements();
    },
    get filternames() {
      return Object.entries(this.schema.properties||{}).filter(([name,prop]) => prop.filter).map(([name,prop]) => name);
    },
    get flag(){
      return this.data.flag || false;
    },
    flagState(){
      const today = new Date();
      if (String(this.FinishDateTime)){
        return 'done';
      } else if (String(this.EndDateTime)){
        let daysLeft = Math.round((new Date(this.EndDateTime) - today) / 1000 / 60 / 60 / 24);
        if (daysLeft > 28) return '4weeks';
        if (daysLeft > 21) return '3weeks';
        if (daysLeft > 14) return '2weeks';
        if (daysLeft > 7) return 'nextweek';
        if (daysLeft > 1) return 'thisweek';
        if (daysLeft > 0) return 'tomorrow';
        if (daysLeft == 0) return 'today';
        return 'overdate';
      }
      return '';
    },
    flagMenu: {
      vandaag: { title: 'Vandaag', className: 'flag', flag: 'today', onclick: event => {
        // console.debug(this, new Date().toISOString().substr(0, 10));
        this.FinishDateTime = '';
        this.EndDateTime = new Date().toISOString().substr(0, 10) + 'T17:00:00';
        // this.item.set({ FinishDateTime: '', EndDateTime: aDate().toISOString().substr(0, 10) });
      }},
      morgen: { title: 'Morgen', className: 'flag', flag: 'tomorrow', onclick: event => {
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + (0 < today.getDay() < 5 ? 1 : 3));
        this.FinishDateTime = '';
        this.EndDateTime = endDate.toISOString().substr(0, 10) + 'T17:00:00';
      }},
      dezeweek: { title: 'Deze week', className: 'flag', flag: 'thisweek', onclick: event => {
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + (5 - today.getDay()));
        this.FinishDateTime = '';
        this.EndDateTime = endDate.toISOString().substr(0, 10) + 'T17:00:00';
      }},
      volgendeWeek: { title: 'Volgende week', className: 'flag', flag: 'nextweek', onclick: event => {
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 7 + (5 - today.getDay()));
        this.FinishDateTime = '';
        this.EndDateTime = endDate.toISOString().substr(0, 10) + 'T17:00:00';
      }},
      over2weken: { title: 'Over 2 weken', className: 'flag', flag: '2weeks', onclick: event => {
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 14 + (5 - today.getDay()));
        this.FinishDateTime = '';
        this.EndDateTime = endDate.toISOString().substr(0, 10) + 'T17:00:00';
      } },
      over3weken: { title: 'Over 3 weken', className: 'flag', flag: '3weeks', onclick: event => {
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 21 + (5 - today.getDay()));
        this.FinishDateTime = '';
        this.EndDateTime = endDate.toISOString().substr(0, 10) + 'T17:00:00';
      } },
      over4weken: { title: 'Over 4 weken', className: 'flag', flag: '4weeks', onclick: event => {
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 28 + (5 - today.getDay()));
        this.FinishDateTime = '';
        this.EndDateTime = endDate.toISOString().substr(0, 10) + 'T17:00:00';
      } },
      none: { title: 'Geen', className: 'flag', flag: '', onclick: event => {
        this.EndDateTime = '';
      } },
      // datum: { title: 'Datum', className: 'calendar', onclick: event => {
      // 	// console.debug(this.item);
      // } },
      gereed: { title: 'Gereed', className: 'flag', flag: 'done', onclick: event => {
        const today = new Date();
        this.FinishDateTime = today.toISOString().substr(0, 19);
      } },
    },
    get fullName(){
      var text = [this.classItemName], item = this.master;
      while (item){
        if (item.tag) text.unshift(item.classItemName);
        item = item.master;
      }
      return text.join('_');
    },
    get fullTag(){
      var text = [this.classTag], item = this.master;
      while (item){
        if (item.tag) text.unshift(item.classTag);
        item = item.master;
      }
      return text.join('.');
    },
    get from(){
      return this.data.from || 0;
    },
    get() {
      return this.api().select('*').get();
    },
    getrel(name, root){
      if (!this[name]) return;
    },
    getPropertyAttributeName(propertyName){
      for (var attributeName in this.properties){
        if (this.properties[attributeName].idname == propertyName){
          return attributeName;
        }
      }
    },
    getValue(name) {
      if (this.data && this.data[name]) {
        const data = [].concat(this.data[name]);
        const value =
        data.find(value => typeof value === 'object' && value.SrcID == this.data.ID && 'Value' in value) ||
        data.find(value => typeof value === 'object' && 'Value' in value) ||
        data.shift();
        // // console.debug(name, this.data[name]);
        // value = value
        // .filter(value => value.Value)
        // .map(value => value.Value)
        // .shift() ||
        // value
        // .filter(value => value.SrcValue)
        // .map(value => value.SrcValue)
        // .shift();
        return typeof value === 'object' ? value.Value : value;
      }
      return null;
    },
    getDisplayValue(attributeName) {
      return $.attr.displayvalue(this.getValue(attributeName), ((this.schema||{}).properties||{})[attributeName]);
    },
    get hasAttach(){
      return Object.values((this.schema || {}).properties || {}).find(property => property.format === 'files' && this.data[property.name]) ? true : false;
    },
    get hasAttachments(){
      return this.data.hasAttachments || false;
    },
    get hasChildren(){
      if (this.data && this.data.children) return true;
      // console.debug(this.data);
      return this.getValue('HasChildren');
      const children = this.data.Children || this.data.children;
      return children ? children.length > 0 : this.getValue('HasChildren');
    },
    set hasChildren(value){
      new $(this).elements.forEach(element => {
        if (element.hasAttribute('open')){
          if (value){
            if (element.getAttribute('open') === ''){
              element.setAttribute('open', 0);
              element.onopen = event => this.open();
              element.onclose = event => this.close();
            }
          } else {
            element.setAttribute('open', '');
            element.onopen = null;
            element.onclose = null;
            console.debug('REMOVE OPEN', element.getAttribute('open'), element);
          }
        }
      });
    },
    get hasImage(){
      return this.hasAttach && $.object.isFile(this.files[0]);
    },
    headerId(id) {
      return this.schema.header && this.schema.header[id] ? this.schema.header[id] : Object.entries(this.schema.properties).filter(([name,prop]) => prop.header === id).map(([name,prop]) => name);
    },
    headerValue(id,name) {
      if (this.hasDetails) {
        const headerValue = this.headerId(id).map(name => String(this.getValue(name)||'').stripTags()).filter(Boolean).join(' ').substr(0,500) || null;
        const value = this.getValue(name) || null;
        // console.debug(headerValue, value)
        if (headerValue != value) {
          // console.warn([headerValue, value]);
          this.attr(name, headerValue, true);
        }
      }
      return this.getValue(name)||'';
    },
    get header0(){
      var value = this.headerValue(0,'header0') || this.getValue('header0') || this.getValue('Title') || this.getValue('Name') || this.title || this.name || this.tag || '';
      return (typeof value === 'object' ? value.Value : value);
    },
    set header0(value) {
      this[this.headerId(0)[0]] = value;
    },
    get header1() {
      // console.debug('header1', this.headerValue(1,'header1'));
      return this.headerValue(1,'header1');
    },
    get header2() {
      return this.headerValue(2,'header2');
    },
    get iconsrc(){
      if (!this.files || !this.files.length) return '';
      for (var i = 0, f; f = this.files[i]; i++){
        if ($.object.isFile(f)){
          break;
        }
      }
      if (f && f.src && f.src[0] == '/'){
        f.src = 'https://aliconnect.nl' + f.src;//// console.debug(f.src);
      }
      return f ? f.src : '';
    },
    get index(){
      return Number(this.getIndex('Master', this.parent));
    },
    set index(value){
      if (this.parent) this.Master = { LinkID: this.parent.data.ID, Data: value };
    },
    get ID(){
      return this.data.ID;
    },
    getIndex(name, to) {
      if (this.data[name] && to) {
        to = to instanceof Item ? to : $(to.tag);
        const attribute = [].concat(this.data[name]).find(attr => attr.AttributeName === name && attr.LinkID === to.ID) || {};
        return attribute.Data;
      }
    },
    get id(){
      return this.data.ID;
    },
    get importance(){
      return this.data.importance || 0;
    },
    get isClass(){
      return this.data && this.data.Class && [].concat(this.data.Class).shift().LinkID == 0 ? true : false;
    },
    get isInherited(){
      // console.debug(this.tag,this.header0,this.data.InheritedID);
      return this.getValue('InheritedID') ? 1 : 0;//this.data && this.data.InheritedID;
    },
    get isDraft(){
      return this.data.isDraft || false;
    },
    get lastModified(){
      return dateText(this.data.LastModifiedDateTime);
    },
    get lastModifiedDateTime(){
      return this.data.lastModifiedDateTime;
    },
    get lastModifiedBy(){
      var value = (this.data || {}).lastModifiedBy || '';
      value = value.user || value;
      value = value.displayName || value.Value || value.value || value || '';
      return value;
    },
    get modified(){
      return !this.LastModifiedDateTime ? '' : (!this.LastVisitDateTime ? 'new' : (new Date(this.LastModifiedDateTime).valueOf() > new Date(this.LastVisitDateTime).valueOf() ? 'modified' : ''));
    },
    async movetoidx(parent, index, noput){
      return parent.append(this, index === undefined ? 99999 : index, true);
      // return;
      // DEBUG: CLASS LOGICA
      if (this.isClass && master.isClass){
        this.srcID = master.id;
      } else if (this.isClass && !master.isClass){
        if (confirm("Class '" + this.Title + "' moved into object '" + master.Title + "', do you want to instantiate?")) return this.copytoidx(master, index);
        if (confirm("Make '" + this.Title + "' a derived class from '" + master.Title + "'?")) set.srcID = master.id;
        else if (!confirm("Continue move?")) return;
      } else if (!this.isClass && master.isClass){
        if (confirm("Object '" + this.Title + "' moved into class '" + master.Title + "', make this an inherited?")) set.srcID = master.id;
        //else if (!confirm("Continue move?")) return;
      }
    },
    moveup() {
      return $.link({
        item: this,
        to: this.parent,
        name: 'Master',
        index: this.index - 1,
        action: 'move',
      });
      // return this.parent.append(this, this.index - 1);
      // if (this.index > 0){
      //   this.movetoidx(this.parent, this.index - 1);
      // }
    },
    movedown(event){
      return $.link({
        item: this,
        to: this.parent,
        name: 'Master',
        index: this.index - 1,
        action: 'move',
      });
      // return this.parent.append(this, this.index + 1);
      // if (this.index < this.parent.items.length - 1){
      //   this.movetoidx(this.parent, this.index + 1);
      // }
    },
    get name() {
      return this.getValue('name') || this.getValue('Name') ;
    },
    options(attr){
      const properties = (this.schema || {}).properties || {};
      const property = properties[attr] || {};
      const options = property.options || {};
      const value = this[attr] || '';
      const option = value.split(',').map(v => options[v] || { color: '' });
      return [option, options];
    },
    get parent() {
      if (this.elemTreeLi && this.elemTreeLi.elem.parentElement) {
        return this.elemTreeLi.elem.parentElement.item;
      }
      return this.data.Master ? $([].concat(this.data.Master).shift()) : null
      // return this.elemTreeLi && this.elemTreeLi.elem.parentElement ? this.elemTreeLi.elem.parentElement.item : null;
    },
    get receivedDateTime(){
      return this.data.receivedDateTime || 0;
    },
    reindex(event){
      return $.promise( 'Reindex', async resolve => {
        // return;
        if (this.hasChildren){
          console.warn('reindexOOOO1');
          const children = await this.children;
          console.warn('reindexOOOO', children);
          if (this.elemTreeLi) this.elemTreeLi.emit('toggle');
          children.forEach((child, i) => {
            if (child.elemListLi && child.elemListLi.elem && child.elemListLi.elem.parentElement){
              child.elemListLi.elem.parentElement.appendChild(child.elemListLi.elem);
            }
          });
        }
        resolve(this);
      });
    },
    refresh(row){
      const deadline = {
        'done': 'Gereed',
        'overdate': 'Te laat',
        'today': 'Vandaag',
        'tomorrow': 'Morgen',
        'thisweek': 'Deze week',
        'nextweek': 'Volgende week',
        'afternextweek': 'Later',
        '': 'Geen'
      };
      this.filterfields = this.filterfields || {
      };
      this.filterfields.Deadline = deadline[this.flagState()];
      this.filterfields.Bijlagen = this.hasAttach ? 'Ja' : 'Nee';
      this.filterfields.Status = this.state;
      this.filterfields.Schema = this.schema;
      if (this.elLvLi) this.elLvLi.rewrite();
      if (this.createTreenode) this.createTreenode();
    },
    refreshAttribute(attributeName){
    },
    refreshAttributes(){
      var s = new Date();
      var attributes = {
        Title: { displayvalue: this.Title }, Subject: { displayvalue: this.Subject }, Summary: { displayvalue: this.Summary }, ModifiedDT: { displayvalue: this.modifiedDT = new Date().toISOString() }
      };
      if (this.data)
      for (var attributeName in this.data)
      if (!attributes[attributeName]) attributes[attributeName] = {
        value: this.data[attributeName].value, displayvalue: this.properties[attributeName].displayvalue
      };
      //this.ModifiedDT = (this.data.ModifiedDT = this.data.ModifiedDT || {}).value =
      //this.modifiedDT = attributes.ModifiedDT = new Date().toISOString();
      for (var i = 0, event, c = document.getElementsByClassName(this.id) ; event = c[i]; i++){
        //$.Alert.appendAlert({ id: 1, condition: 1, Title: 'TEMP HOOG', created: new Date().toISOString(), categorie: 'Alert', ack: 0 });
        //if (row.attr) for (var name in row.attr) if (row.attr[name]) event.setAttribute(name, row.attr[name]); else event.removeAttribute(name);
        for (var attributeName in attributes){
          //if (attributeName == 'ModifiedDT') // console.debug(attributeName, attributes[attributeName]);
          var displayvalue = attributes[attributeName].displayvalue, value = attributes[attributeName].value;//typeof attributes[attributeName] == 'object' ? attributes[attributeName].value : attributes[attributeName];
          //if (attributeName=='Value') // console.debug('hhhhhh', attributeName, displayvalue);
          displayvalue = String(displayvalue).split('-').length == 3 && String(displayvalue).split(':').length == 3 && new Date(displayvalue) !== "Invalid Date" && !isNaN(new Date(displayvalue)) ? new Date(displayvalue).toISOString().substr(0, 19).replace(/T/, ' ') : displayvalue;
          displayvalue = (isNaN(displayvalue) ? displayvalue : Math.round(displayvalue * 100) / 100);
          //if (attributeName == "CriticalFailure") // console.debug('REFESH', this.id, this.Title, attributeName, event.getAttribute(attributeName), val);
          if (event.hasAttribute(attributeName) && event.getAttribute(attributeName) != value){
            event.setAttribute(attributeName, value);
            event.setAttribute('modified', new Date().toLocaleString());
          }
          for (var i1 = 0, e1, c1 = event.getElementsByClassName(attributeName) ; e1 = c1[i1]; i1++){
            if (e1.hasAttribute('checked')){
              if (value) e1.setAttribute('checked', ''); else e1.removeAttribute('checked');
              e1.setAttribute('modified', new Date().toLocaleString());
            }
            else if ("value" in e1){
              if (e1.value != value){
                e1.value = value;
                e1.setAttribute('modified', new Date().toLocaleString());
              }
            }
            else if (e1.hasAttribute('value')){
              if (e1.getAttribute('value') != value){
                e1.setAttribute('value', value);
                e1.setAttribute('modified', new Date().toLocaleString());
              }
            }
            else if (['SPAN', 'DIV', 'TD'].indexOf(e1.tagName) != -1){
              //if (attributeName == "CriticalFailure") // console.debug('REFESH', this.id, this.Title, attributeName, event.getAttribute(attributeName), val);
              //MKAN DIsplay value of value, probleem DMS
              e1.innerHTML = displayvalue != undefined ? displayvalue : "";
              e1.setAttribute('modified', new Date().toLocaleString());
            }
          }
        }
      }
    },
    remove(){
      console.warn('remove', this);
      if (this.parent){
        if (this.parent.items){
          this.parent.items.splice(this.parent.items.indexOf(this), 1);
          this.elemTreeLi.elem.remove();
          if (this.parent) {
            this.parent.reindex();
          }
          // $.delay(this.parent.reindex);
        }
      }
      Object.entries(this).filter(elem => elem instanceof Element).forEach(elem => elem.remove());
    },
    rewriteElements(){
      [...document.getElementsByClassName(this.tag)].forEach(element => element.rewrite ? element.rewrite() : null);
    },
    get replyTo(){
      return this.data.replyTo || 0;
    },
    get schemaColor() {
      return (this.data||{}).color || (this.schema||{}).color || '';
    },
    set(values, onload){
      api.request({
        put: { value: [{ schema: this.schema, id: this.detailID || this.id, values: values }] },
        item: this
      }, onload || function (){
        // console.debug('SET DONE', this.src, this.put, this.data);
        //if (this.item.id == get.id) this.item.reload();
      });
      this.refresh();
      this.show();
    },
    setAttribute(selector, context){
      if (window.document && this.elems) {
        this.elems.forEach( elem => elem.attr(selector, context))
        // Object.entries(this).filter(entry => entry[1] instanceof Element).forEach(entry => context === undefined ? entry[1].removeAttribute(selector) : entry[1].setAttribute(selector, context))
      }
    },
    get sender(){
      return this.data.sender || 0;
    },
    get sentDateTime(){
      return this.data.sentDateTime || 0;
    },
    get state(){
      const data = this.data.State || '';
      return data.Value || data;
    },
    get _stateColor(){
      return (((((this.schema || {}).properties || {}).State || {}).options || {})[((this.data || {}).State || {}).Value] || {}).color;
    },
    get stateColor(){
      return this.properties && this.properties.State && this.properties.State.options && this.properties.State.options[this.State] ? this.properties.State.options[this.State].color : 'inherited';
    },
    get scope(){
      // let isFavorite = 'Fav' in this ? Number(this.Fav) : private.fav.includes(this.tag);
      // console.debug('isFavorite', isFavorite);
      let userId = Number(this.UserID);
      if (!userId) return 'public';
      if (userId && userId == $.auth.access.sub) return 'private';
      return 'read';
    },
    set scope(value){
      /// console.debug(value);
      const values = {
        private: () => this.UserID = $.auth.access.sub,
        public: () => this.UserID = 0,
      }[value]();
      this.rewriteElements();
      // values[value]();
      // let id = this.tag;
      // private.fav.splice(private.fav.indexOf(id), 1);
      // if (value){
      // 	private.fav.unshift(this.tag);
      // }
      // console.debug('SET FAV', private.fav, this.tag, this.id, value, $.auth.access.sub);
      // this.Fav = { UserID: $.auth.access.sub, Value: value };
      // this.rewriteElements();
    },
    get source(){
      return this.data && this.data.Src ? $([].concat(this.data.Src).shift()) : null;
    },
    get sourceName() {
      // console.debug(this.data.Source);
      return this.data && this.data.Src
      ? [].concat(this.data.Src)
      .filter(v=>v['@id'])
      .map(v=>v['@id'].match(/(\w+)\(\d+\)/)[1])
      .shift()
      : null;
      // return this.data.schemaPath ? this.data.schemaPath.split('/')[1] : '';
    },
    schema: {
      properties: {}
    },
    get toRecipients(){
      return this.data.toRecipients || 0;
    },
    get tooltipText(){
      return;
      var s = '';
      var fnames = 'keyname, name, fullName, tag, fullTag'.split(', ');
      for (var i = 0, name; name = fnames[i]; i++) if (this[name]) s += name + ':' + this.getAttribute(name) + "\r\n";
      return s;
    },
    get typicalIdx(){
      if (!this.master) return null;
      var index = 0;
      for (var i = 0, item; item = this.master.Children[i]; i++){
        if ('selected' in item && item.selected == 0) continue;
        if (item.srcID == this.srcID) index++;
        if (item == this) return index;
      }
    },
    get type(){
      if (this.data){
        const parent = this.parent;
        const sourceID = this.data.Src ? Number([].concat(this.data.Src).shift().LinkID) : null;
        if (sourceID) {
          const masterID = this.parent ? this.parent.ID : null;
          if (this.getValue('InheritedID')) {
            return 'inherit';
          } else if (![...$().schemas().values()].some(schema => schema.ID == sourceID)) {
            // console.debug(sourceID, [...$().schemas().values()].some(schema => schema.ID == sourceID));
            return 'copy';
          }
        }
      }
      return 'nodata';
    },
    get viewstate(){
      return $().history[this.data.ID] ? 'read' : 'new';
    },
    emit: $.prototype.emit,
    forEach: $.prototype.forEach,
    on: $.prototype.on,
		async appendItem (previousItem, item, sourceItem, noedit) {
			// const itemIndex = previousItem ? this.children.indexOf(previousItem) + 1 : (this.children ? this.children.length : 0);
			 // ? this.children.indexOf(previousItem) + 1 : (this.children ? this.children.length : 0);
			// Update all indexes of childs after inserted item
			item.Master = { LinkID: this.ID };
			if (sourceItem) {
				item.schema = sourceItem.schema;
				item.userID = 0;
				item.srcID = sourceItem.ID;
			};
			let event = await $.api(`/${item.schemaName}`).input(item).post();
			// TODO: 1 aanroep naar api
			event = await $.api(`/${event.body.tag}`).select('*').get();
			const newItem = event.body;
			newItem.selectall = true;
			const index = previousItem ? previousItem.index + 1 : this.children.length;
			// TODO: index meenemen in aanroep => een api call, => na aanroep wel sorteren.
			//console.log(index, previousItem);
			await newItem.movetoidx(this, index);
			return newItem;
			// await this.open();
		},
    _catElement() {
			if (this.Categories && this.Categories.options) {
				let categories = String(this.Categories);
				categories = 'draft,concept';
				let catElement = $.createElement('DIV', 'cat');
				var cats = categories.split(',');
				cats.forEach((cat)=>{
					// //console.log(cat, this.Categories.options[cat].color);
					catElement.createElement('SPAN').style.backgroundColor = this.Categories.options[cat].color;
				});
				return catElement;
			}
		},
    copytoidx(master, index) {
			//console.debug('COPY TO', master, index);
			master.appendChild(null, { srcID: this.detailID || this.id });
			this.master.reindex();
		},
    _createPriceElement(parentElement) {
			// this.CatalogPrice = 0;
			// this.SalesDiscount = 3;
			// this.AccountDiscount = 4;
			let catalogPrice = this.catalogPrice = Number(this.CatalogPrice || 0);
			if (!catalogPrice) {
				return;
			}
			let salesDiscount = Number(this.SalesDiscount);
			let accountDiscount = Number(this.AccountDiscount);
			let discount = accountDiscount || salesDiscount;
			let price = this.price = discount ? catalogPrice * (100 - discount) / 100 : catalogPrice;
			let customer = $.shop.customer, item = this;
			let product = customer && customer.Product && customer.Product.find
			? customer.Product.find(function(row){
				return row == item;
			})
			: null;
			// writeprice: function(el, index) {
			// //console.log('CatalogPrice', this.CatalogPrice);
			// //console.log('SalesDiscount', this.SalesDiscount);
			// //console.log('AccountDiscount', this.AccountDiscount);
			if (accountDiscount) {
				parentElement.createElement('DIV', 'tagAccountDiscount', __('Account discount'));
			}
			if (discount) {
				parentElement.createElement('DIV', 'tagSalesDiscount', -discount.toFixed(1));
			}
			return parentElement.createElement('DIV', 'pricerow col', [
				['DIV', 'aco', [
					discount ? ['SPAN', 'currency strikeThrough', catalogPrice.toFixed(2)] : null,
					['SPAN', 'currency price', price.toFixed(2)],
				]],
				['DIV', 'shopbag', [
					['INPUT', 'addbag', {type:'number', value:this.amount = product ? product.Data : '', onchange: (event)=>{
						return // //console.log(this.tag, event.target.value);
						$.shop.add(this.row, event.target.value);
					}}],
					['BUTTON', 'abtn icn bagAdd', {type:'button', tabindex: -1, onclick: (event)=>{
						event.stopPropagation();
						event.preventDefault();
						return // //console.log(this.tag);
						$.shop.add(
							this.id,
							$.shop.data && $.shop.data[this.id]
							? Number($.shop.data[this.id].quant) + 1
							: 1
						);
					}}],
				]],
				['DIV', this.Stock ? 'delivery onstock' : 'delivery notonstock', __('notonstock', this.Stock) ],
			]);
		},
    fieldDefault() {
			for (var attributeName in this.properties) { if (this.properties[attributeName].default) break; }
			if (!attributeName) for (var attributeName in this.properties) { if (this.properties[attributeName].kop === 0) break; }
			return this.properties[attributeName];
		},
    init() {},
    model2d(event) {
			//console.debug('MODEL 2d', this.id, this.ID, this.tag, this, this.item);
			//get:{masterID: this.id} ?
			new $.HttpRequest($.config.$, 'GET', `/item(${this.id})/model2d`, event => {
				self.innerText = '';
				self.createElement('DIV', 'row top btnbar np', { operations: {
					filter: { Title: 'Lijst filteren', onclick: function(event) { $.show({ flt: get.flt ^= 1 }); } },
				} });
				function ondrop (event) {
					//console.debug(event, this, event.clientX, event.clientY);
					event.stopPropagation();
					var childItem = $.dragdata.item;
					with (this.newTag = this.createElement('DIV', { Title: childItem.Title, className: 'symbol icn ' + childItem.schema + " " + childItem.typical + " " + (childItem.name || childItem.Title) + " " + childItem.id, item: childItem, id: childItem.id, value: 1 })) {
						style.top = (event.offsetY - 25) + 'px';
						style.left = (event.offsetX - 25) + 'px';
					}
					var children = [];
					new $.HttpRequest($.config.$, 'POST', `/item(${this.id})/model2d`, {
						masterID: this.id,
						childID: childItem.id,
						offsetTop: this.newTag.offsetTop,
						offsetLeft: this.newTag.offsetLeft,
					});
					return false;
				};
				this.elContent = self.createElement('DIV', 'row aco model2d', { id: this.get.masterID, ondrop: ondrop });
				this.data.forEach(row => {
					var childItem = $.getItem(row.id);
					let el = this.elContent.createElement('DIV', { Title: row.Title, className: 'symbol icn ' + row.schema + " " + row.typical + " " + (childItem.name || childItem.Title) + " " + row.id, id: row.id, value: childItem.Value, onclick: Element.onclick, set: { schema: row.schema, id: row.id } });
					el.style.top = (row.offsetTop) + 'px';
					el.style.left = (row.offsetLeft) + 'px';
				});
			}).send();
		},
    networkdiagram(event) {
			new $.HttpRequest($.config.$, 'GET', `/item(${this.item.id})/network`, event => {
				//console.debug(this.src, this.data);
				new $.graph(Listview.createElement('DIV', { className: 'slidepanel col bgd oa pu', }), this.data);
				//if (!$.graph.init()) return;
				//$.graph(Listview.createElement('DIV', { className: 'slidepanel col bgd oa pu', }), this.data);
			}).send();
		},
    post(postfields) {
			setItems([{ id: this.id, schema: this.schema, values: postfields }], true);
		},
    popout(left = 0,top = 0,width = 600,height = 600) {
      const item = this;
      var url = document.location.origin;
      var url = 'about:blank';
      if (item.popoutWindow) {
        return item.popoutWindow.focus();
      }
      const win = item.popoutWindow = window.open(url, item.tag, `top=${top},left=${left},width=${width},height=${height}`);
      // //console.log(window.innerHeight,window.outerHeight,window.outerHeight-window.innerHeight,window.screen,this.elem.getBoundingClientRect());
      window.addEventListener('beforeunload', event => win.close());
      const doc = win.document;
      //console.log(pageHtml);
      doc.open();
      doc.write(pageHtml);
      doc.close();
      win.onload = function (event) {
        const $ = this.$;
        $(this.document.documentElement).class('app');
        $(this.document.body).class('col $ om bg').id('body').append(
          $('section').class('row aco main').append(
            $('section').class('col aco apv printcol').id('view'),
          ),
        );
        console.log(item);
        $('view').show(item);
        win.addEventListener('beforeunload', event => item.popoutWindow = null);
      }
      // win.$.on('load', event => {
      //   win.elem = win.$(doc.body)
      //   win.elem.append(
      //     $('div').text('JAsfdssdfgs')
      //   )
      // })
      //popout: { schema: this.schema, id: this.id, uid: this.uid, onclick: $.windows.open },
      //
      // dragItems.forEach(item => window.open(
      //   document.location.href.split('/id').shift()+'/id/'+ btoa(item['@id']),
      //   '_blank',
      //   'width=640, height=480, left=' + (event.screenX || 0) + ', top=' + (event.screenY || 0)
      // ));
    },
    selectitem(event) {
			if (event) {
				////console.debug('selectitem stopPropagation');
				event.stopPropagation();
				return this.item.selectitem();
			}
			this.selectitemset(this.elemTreeLi.getAttribute('sel') ^ 1);
		},
    selectitemcheckchildren(value) {
			if (isnull(this.selected, false) !== false) {
				this.selectcnt = 0;
				for (var i = 0, event; event = this.items[i]; i++) if (event.selected) this.selectcnt += 1;
				if (this.selectcnt) this.selectitemset(1);
				else this.selectitemset(0);
				if (this.parent && this.parent.selectitemcheckchildren) this.parent.selectitemcheckchildren();
			}
		},
    selectitemset(value) {
			if (this.groupname) {
				var c = this.elemTreeLi.parentElement.children;
				for (var i = 0, event; event = c[i]; i++) if (event.item.groupname == this.groupname && event.item.selected) {
					event.setAttribute('sel', 0);
					event.item.selected = 0;
					event.item.set({ selected: event.item.selected });
					event.item.close();
				}
			}
			var a = [];
			var ia = [];
			event = this.elemTreeLi;
			if (value) {
				while (event.item) {
					a.push(event);
					event = event.parentElement.parentElement;
				}
			}
			else
			a.push(event);
			var c = this.elemTreeLi.getElementsByTagName('LI');
			for (var i = 0, event; event = c[i]; i++) a.push(event);
			for (var i = 0, event; event = a[i]; i++) {
				event.item.selected = value;
				event.setAttribute('sel', value);
			}
			this.set({ selected: value });
		},
    setClass(className, unique) {
			this.elements.forEach(elem => elem.className = elem.className.split(' ').concat(className).filter((value, index, self) => self.indexOf(value) === index).join(' '));
		},
    setChecked(checked) {
			this.checked = checked;
			// 	if (!item.elemTreeLi.getAttribute('checked')) {
			// 		item.elemTreeLi.removeAttribute('checked');
			// 	}
			let elements = [this.elemListLi,this.elemTreeLi];
			if (this.checked) {
				$.clipboard.push(this);
				elements.forEach((elem)=>{
					if (elem) {
						elem.setAttribute('checked', '');
					}
				});
			} else {
				$.clipboard.remove(this);
				elements.forEach((elem)=>{
					if (elem) {
						elem.removeAttribute('checked');
					}
				});
			}
		},
    setFocus() {
			// if ($.focusItem) {
			//
			// }
			// $.focusItem = this;
			// this.checked = checked;
			// // 	if (!item.elemTreeLi.getAttribute('checked')) {
			// // 		item.elemTreeLi.removeAttribute('checked');
			// // 	}
			// let elements = [this.elemListLi,this.elemTreeLi];
			// if (this.checked) {
			// 	$.clipboard.push(this);
			// 	elements.forEach((elem)=>{
			// 		if (elem) {
			// 			elem.setAttribute('checked', '');
			// 		}
			// 	});
			// } else {
			// 	$.clipboard.remove(this);
			// 	elements.forEach((elem)=>{
			// 		if (elem) {
			// 			elem.removeAttribute('checked');
			// 		}
			// 	});
			// }
		},
    submit(event) {
			if (event) event.preventDefault();
			this.remove();
			return;
			//// //console.debug('SUBMIT', this, this.elUsers.innerText, this.oldusers);
			var item = { id: this.id };
			//// //console.debug(this.oldusers, this.elUsers.innerText);
			if (this.elUsers && this.oldusers != this.elUsers.innerText) {
				var users = (this.link = this.link || {}).users = [];
				item.userlist = {};
				for (var i = 0, event, c = this.elUsers.getElementsByTagName('A') ; event = c[i]; i++) if (event.id) users.push(item.userlist[event.innerText] = event.id);// || event.getAttribute('itemID') || '';
			}
			// //console.debug('SUBMIT ITEM', item);
			$.ws.request({
				to: [ { sub: $.auth.sub } ],
				showNotification: [this.Title, {
					// title: 'Come',
					tag: this.ID,
					body: 'Modified', //this.Subject,
					click_action: document.location.href,
					data: { click_action: document.location.href },
					actions: [ {action: "open_url", title: "Read Now"} ],
				}]
			});
			// (new $.showNotification(this.Title, {
			// 	// title: 'Come',
			// 	tag: this.ID,
			// 	body: 'Modified', //this.Subject,
			// 	click_action: document.location.href,
			// 	data: { click_action: document.location.href },
			// 	actions: [ {action: "open_url", title: "Read Now"} ],
			// })).send();
			//// //console.debug('item.submit', document.activeElement);
			this.editclose();
			setTimeout(function(item) {
				//// //console.debug(item);
				//return;
				new $.HttpRequest($.config.$, 'PATCH', `/item(${item.id})`, item, {
					query: { reindex: 1 },
				}).send();
			}, 10, item);
			// //console.log(this);
			// this.remove();
		},
    stateElementArray () {
			if (this.properties && this.properties.state && this.properties.state.options) {
				return ['DIV', 'stateicon', {
					// item: this,
					contextmenu: this.properties.state.options,
					onselect: event => {
						//console.log(event);
						let el = [...event.path].find(el => el.value);
						this.state = el.value;
					},
				}, [
					['SPAN', 'state', {
						style: 'background-color:' + (this.state ? this.state.color : ''),
					}]
				]]
			} else {
				return [];
			}
		},
    show(event) {
			if (event) return this.item.show();
			//if ()
			// get.id = this.id;
			if (colpage.item && colpage.item.editing) colpage.item.editclose();
			this.PageElement();
			if ($.temp.err) {
				var c = $.temp.err.children;
				for (var i = 0, elErrRow; elErrRow = c[i]; i++) if (elErrRow.meshitem.src.itemID == this.id) break;
				if (elErrRow) {
					elErrRow.accept = new Date();
					elErrRow.elAccept.innerText = elErrRow.accept.toISOString().substr(11, 8);
					elErrRow.refresh();
				}
			}
		},
    showinfo() {
			//this.load(function() {
			colinfo = document.getElementById('colinfo') || document.body.createElement('SECTION', 'col ainf', {id: 'colinfo'});
			colinfo.innerText = '';
			setTimeout(() => {
				colinfo.createElement([
					this.createHeaderElement(),
					['DIV', 'row top btnbar', [
						['A', 'abtn icn form r', ]
					]]
				]);
			})
			// with (colinfo.createElement('DIV', { className: 'row top btnbar' })) {
			// 	createElement('A', {
			// 		className: 'abtn icn form r', onclick: Element.onclick, par: { id: this.itemID, lid: this.itemID }, onclick: function(event) {
			// 			//console.debug('show ifo');
			// 			event.stopPropagation();
			// 			private.info.innerText = '';
			// 		}
			// 	});
			// }
			// var elDetails = createElement('DIV', { className: 'details' });
			// elDetails.createElement('DIV', { className: 'name', innerText: this.Title });
			// this.writedetails(elDetails);
			//});
		},
  };
  // $.client = $();

  if (!window.document) {
    require("./node.js");
    setTimeout(async event => await $().emit('load') && await $().emit('ready'));
    return module.exports = $;
  }

  $(window)
  .on('afterprint', event => {
    //var event = Listview.elOa;
    ////console.debug('BEFORE PRINT'); //items.printiframe(Listview.elOa);
    //if ($.elPrintDiv) $.elPrintDiv.innerText = '';
  })
  .on('beforeunload', event => {
    if ($.temp.handles) for (var name in $.temp.handles) { $.temp.handles[name].close(); }
  })
  .on('beforeprint', event => {
    //var event = Listview.elOa;
    //console.debug('BEFORE PRINT'); //items.printiframe(Listview.elOa);
    if (!$.printElement) {
      $.printElement = document.body.createElement('DIV', 'doc-content printablediv' ); //document.body.createElement('table', { className: 'printablediv', style: 'width:100%;' });
    }
    //$.elPrintDiv.innerHTML = $.printdiv.innerHTML;
    with ($.printElement) {
      //console.debug($.printSource, $.printHeader);
      innerText = '';
      if (!$.printHeader) return innerHTML = $.printSource.innerHTML;
      with (createElement('TABLE', 'border', {  style: 'width:100%;' })) {
        //with (createElement('thead').createElement('TR').createElement('th').createElement('DIV', { style: 'display:table;table-layout:fixed;width:100%;' }).createElement('DIV', { style: 'display:table-row;' })) {
        //    createElement('DIV', { style: 'display:table-cell;width:35mm;padding:10px;border-bottom:solid 1px #ccc;vertical-align:middle;' }).createElement('img', { src: Files && Files[1] ? Files[1].src : '' });
        //    with (createElement('DIV', { style: 'display:table-cell;padding:10px;border-bottom:solid 1px #ccc;vertical-align:top;' })) {
        //        if ($.printheader) {
        //            createElement('DIV', { className: 'kop0', innerText: $.printheader.kop0 || '' });
        //            createElement('DIV', { className: 'kop1', innerText: $.printheader.kop1 || '' });
        //            createElement('DIV', { className: 'kop2', innerText: $.printdiv ? $.printdiv.Title : $.printheader.kop2 || '' });
        //        }
        //    }
        //}
        createElement('thead').createElement('TR').createElement('TH', '', $.printHeader.innerHTML );
        createElement('tbody').createElement('TR').createElement('TD', 'doc', $.printSource.innerHTML );
        with (createElement('tfoot').createElement('TR').createElement('TH').createElement('DIV')) {
          createElement('SPAN', '', 'Printed: ' + new Date().toLocaleString() + ' by ' + $.accountName, { style: 'float:right;'});
        }
      }
    }
  })
  .on('blur', event => {
    $.focussed = false;
    document.body.setAttribute('blur', '');
    clearTimeout($.temp.stateTimeout);
    $.temp.stateTimeout = setTimeout(() => $().state('inactive'), 500);
  })
  .on('click', event => {
    checkPath(event);
    $.temp.clickEvent = event;
    const sectionElement = event.path.find(elem => elem.tagName === 'SECTION' && elem.id);
    if (sectionElement) {
      document.body.setAttribute('section', sectionElement.id);
    }
  }, true)
  .on('click', event => {
    $.clickEvent = event;
    // return;
    $.temp.clickElement = event.target;
    $.temp.clickPath = event.path = event.path || function(el) {
      var path = [];
      while (el) {
        path.push(el);
        el = el.parentElement;
      };
      return path;
    } (event.target);
    // //console.log($('colpanel'));
    if (document.getElementById('colpanel') && !$.temp.clickPath.includes($('colpanel'))) {
      // $.request('?prompt=');
    }
    // const itemElement = event.path.find(itemElement => itemElement.item);
    // if (itemElement) {
    // 	$.clipboard.setItem(itemElement.item);
    // }
    let elem = event.target;
    // //console.debug('CLICK', el, el.$infoID);
    //if (this.printable) $.printdiv = this;
    // //console.log(this);
    //// //console.debug('CLICK', this.get);
    // if (el.hasAttribute('accept') && el.tagName !== 'INPUT') {
    // 	//console.log('ACCEPT', itemElement.item);
    // 	if (itemElement.files) {
    // 		itemElement.files.openDialog();
    // 		return;
    // 	}
    // }
    // DEBUG: MAX
    // if (elem.hasAttribute('open')) {
    //   $(elem).select();
    // }
    // if (elem = event.path.find(elem => elem instanceof Element && elem.hasAttribute('open'))) {
    // 	$.el.select.call(elem);
    // }
    if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
      for (let elem of event.path.filter(elem => elem instanceof Element)) {
      if (elem.is && elem.is.has('ofile') && elem.is.get('ofile').src.match(/\.(jpg|png|bmp|jpeg|gif|bin|mp4|webm|mov|3ds)/i)) {
        return $(document.body).slider(elem)
      }
      // if (elem.hasAttribute('src')) {
      //   return document.location.href = '#?src='+elem.getAttribute('src');
      // }
      if (elem.hasAttribute('href')) {
        if (elem.getAttribute('href').match(/^\/\//)) {
          console.log('CLICK MAIN href REL');

          event.preventDefault();
          $().execQuery('l', elem.getAttribute('href'));
          // $('list').load(elem.getAttribute('href'))
          return;
        }
        if (window.colpage) {
          if (elem.getAttribute('href')[0] === '#' && elem.getAttribute('href')[1] === '/') {
            return $().exec(elem.getAttribute('href').substr(1));
          } else if (elem.getAttribute('href').includes('.pdf') && !elem.download) {
            event.preventDefault();
            return new $.Frame(elem.href);
          }
        // } else if (elem.getAttribute('href')[0] !== '#' && elem.href.includes(document.location.origin)) {
        //   event.preventDefault();
        //   window.history.pushState('page', 'test1', elem.href);
        //   $(window).emit('popstate');
        //   // $('list').load(elem.getAttribute('href')+'.md');
        //
        //   // console.log();
        //   return;// event.preventDefault();
        }
      }
    }
    }
    if ($.mainPopup) {
      $.mainPopup.close();
      $.subPopup.close();
    }
    //if (window.colpanel && ref.clickPath.indexOf(colpanel) == -1) $.prompt.open();
    //alert(ref.clickPath);
    // //console.log(1, event.target);
    for (var i = 0, el; el = $.temp.clickPath[i]; i++) {
      if (el.itemID) {
        console.debug('itemID');
        var item = $.getItem(el.itemID);
        if (item) document.location.href = '#' + item.schema + '/' + item.id + '?select=*';
        return false
        //$.show({ id: this.itemID });
      }
      else if (el.set) {
        $.url.set(el.set);
        return false
        //$.show({ id: this.itemID });
      }
      else if (el.$infoID) {
        //console.debug('infoID');
        event.stopPropagation();
        $.getItem(el.$infoID, item => {
          item.showinfo();
          el.remove();
        });
        return;
      }
      //if (this.pnl)
      //if (this.par) {
      //	$.show(this.par);
      //	event.stopPropagation();
      //	event.preventDefault();
      //	return false;
      //}
      //else if (this.colName) $.setfocus(this);
      else if (el.colName) {
        document.body.setAttribute('ca', el.colName);
        $.colActive = el;
        $.elColActive = el;
        $.printSource = el;
      }
      else if (el.elClose) el.elClose.parentElement.removeChild(el.elClose);
      // else if (el.get) $().exec(el.get);//$.url.set(typeof this.get == 'function' ? this.get() : this.get);
      if ($.targetItem = el.item) {
        break;
      }
    }
    // //console.log('ONCLICK MAIN', event.target);
    // //if ($.targetItem && $.targetItem.focus) $.targetItem.focus(event);
    //
    // // if ($.prompt.panelName) {
    // // 	$.prompt('');
    // // }
    //
    //
    //
    //  // MKA is denk ik vervallen omdat er een algemeen window on click event is die het path bepaald
    // return;
    //
    // ////console.debug('OM CLICK', event);
    //
    // //if ($.mainPopup) {
    // //	$.mainPopup.close();
    // //	$.subPopup.close();
    // //}
    // //$.clickElement = event.target;
    // //$.clickPath = event.path;
    // //for (var i = 0, el; el = $.clickPath[i]; i++) if ($.targetItem = el.item) break;
    // //if ($.targetItem && $.targetItem.focus) $.targetItem.focus(event);
    // return;
    //
    //
    // var el = $.clickElement = event.target;
    // while (el && !el.item) el = el.parentElement;
    // if (!el) return;
    // $.targetItem = el.item;
    // //console.debug('itemClicked', $.clickElement, $.targetItem.id, $.targetItem.Title, $.targetItem, event);
    //
    // if (msg.newItem) msg.write();
    //
    // //$.play('/wav/Windows Notify Email.wav').then(function() { //console.debug('PLAYING'); }, function() { //console.debug('NOT PLAYING'); });
    //
    //
    //
    //
    //
    // $.activeElement = event.path ? event.path.shift() : event.target;
    // if ($.activeElement.item && $.activeElement.item.focus) $.activeElement.item.focus(event);//app.selection.cancel();
    // //Element.Pulldown.el.innerText = '';
  })
  .on('copy', event => $.clipboard.copy(event))
  .on('cut', event => $.clipboard.copy(event))
  .on('dragend', event => {
    $().status('source');
    $().status('target');
    const dragItems = $.clipboard.dragItems;
    //console.log('dragend', event.dataTransfer.dropEffect, dragItems, event, event.view === window);
    switch (event.dataTransfer.dropEffect) {
      // case 'move': {
      // 	if (dragItems) {
      // 		if (event.view === window) return;
      // 		//console.log('dragend', event);
      // 		dragItems.forEach(item => item.remove());
      // 	}
      // 	return;
      // }
      // // if drop outside window then open window
      case 'none': {
        var outside = event.screenX > window.screenX + window.outerWidth || event.screenX < window.screenX || event.screenY > window.screenY + window.outerHeight || event.screenY < window.screenY;
        if (outside) {
          return dragItems.forEach(item => item.popout(event.screenX,event.screenY));
        }
      }
      // case 'move' : {
      // 	dragItems.forEach(item => item.parent.removeChild(item));
      // }
    }
  })
  .on('dragenter', event => {
    if (
      event.dataTransfer.types.includes('aim/items') ||
      event.dataTransfer.types.includes('Files')
    ){
      const targetItemElement = event.path.filter(elem => elem.item).shift();
      if (targetItemElement instanceof Element) {
        event.stopPropagation();
        setTimeout(() => ($.temp.targetItemElement = targetItemElement).setAttribute('target', ''));
      }
    }
  })
  .on('dragleave', event => {
    if ($.temp.targetItemElement) {
      $.temp.targetItemElement.removeAttribute('target');
    }
  })
  .on('dragover', event => {
    if ($.temp.targetItemElement) {
      $().status('target', $.temp.targetType = eventKeyState(event));
      event.dataTransfer.dropEffect = event.ctrlKey ? (event.shiftKey ? 'link' : 'copy') : 'move';
      // event.dataTransfer.dropEffect = event.ctrlKey ? (event.shiftKey ? 'link' : 'copy') : 'move';
      event.preventDefault();
    }
  })
  .on('dragstart', event => {
    // letop ook files selecteren in AIm.Selection gebaseerd op ofile in path
    // console.log(event.type);
    $().status('source', $.temp.sourceType = eventKeyState($.temp.keyEvent));
    var elem = event.path.find(elem => elem.ofile);
    if (elem) {
      var dragItems = $.clipboard.items.includes(elem.ofile) ? $.clipboard.items : [elem];
      event.dataTransfer.setData('aim/items', JSON.stringify({files: dragItems.map(elem => elem.ofile)}));
    } else {
      var item = event.path.filter(elem => elem.item).map(elem => elem.item).shift();
      var dragItems = $.clipboard.items.includes(item) ? $.clipboard.items : [item];
      event.dataTransfer.setData('aim/items', JSON.stringify({
        value: dragItems.map(Item.toData),
        sid: $().ws().socket_id,
      }));
      event.dataTransfer.setData('text', dragItems.map(Item.toText).join('\n'));
      event.dataTransfer.setData('text/html', dragItems.map(Item.toHtml).join(''));
    }
    $.clipboard.dragItems = dragItems;
    //console.log(dragItems);
  })
  .on('drop', event => $.temp.targetItemElement ? handleData($.temp.targetItemElement.item, event) : null)
  .on('focus', event => {
    // console.log('FOCUS');
    if (!$.focussed) {
      $.focussed = true;
      document.body.removeAttribute('blur');
      $().state('available');
      // $.send();
      // setTimeout(function() { $.auth.setstate('focus'); }, 100);
      // if ($.user.sub) $.auth.check_state();
      ////if (!$.app.user) return;
      //var data = { activestate: 'focus', accountID: $.client.account.id, userID: $.auth.sub, to: [$.key] };
      //ItemSetAttribute(data.userID, 'activestate', data.activestate);
      //ItemSetAttribute(data.accountID, 'activestate', data.activestate);
      //ws.send(data);
      ////// //console.debug('onfocus start');
      ////msg.check(true); HOEFT NIET GEBEURD VIA EVENT RT SERVER
      //new $.HttpRequest({
      //    api: 'window/focus/' + aliconnect.deviceUID,
      //    //post: { exec: 'onfocus', deviceUID: $.app.user ? aliconnect.deviceUID : '', },
      //    onload: function() {
      //        //// //console.debug('onfocus done', this.post, this.responseText);
      //        //if ($.app.user && $.auth.sub && this.data.UserID != $.auth.sub) $.show({ wv: 1, apnl: 'login' });//document.location.href = '?wv=1&apnl=login';
      //    }
      //});
    }
  })
  .on('keyup', onkey, true)
  .on('keyup', checkkey)
  .on('keydown', onkey, true)
  .on('keydown', checkkey)
  .on('keydown', event => {
    switch (event.keyPressed) {
      case 'F1': {
        $().prompt('help');
        event.preventDefault();
        return;
      }
      case 'Escape': {
        if (window.activeElement) return;
        if ($.clipboard.copyItems && $.clipboard.copyItems.length) {
          return $.clipboard.copy();
        }
        // if ($('view').show() && $('view').show().elem && $('view').show().elem.innerText) {
        //   return $('view').show().elem.innerText = '';
        // }
        if (document.activeElement && document.activeElement.cancel && document.activeElement.cancel()) {
          return;
        }
        if ($.temp.iframeElement) {
          $.temp.iframeElement.remove();
        }
        if ($.imageSlider && $.imageSlider.elem) {
          $.imageSlider.close();
        }
        if (new URLSearchParams(document.location.search).has('prompt')) {
          $().prompt('');
        }
        if (document.activeElement === $.elMsgTextarea) {
          contentEditableEnd($.elMsgTextarea.blur());
        }
        if ($().tree().editing) {
          $().tree().editcancel(Treeview.elINP.Value = Treeview.elINP.initValue)
        }
        if ($('colpage').elFrame) {
          $('colpage').elFrame.close(event);
        }
        // $().tree().cancel();
        // $.tree().edit.cancel() ||
        // $.popup().cancel() ||
        // $.edit().cancel() ||
      }
      // EscapeEdit: keyEscape,
      // F2(event) {
      // 	if ($.path.includes($('self'))) {
      // 		if (self.focusElement) {
      // 			return self.focusElement.edit();
      // 		}
      // 	}
      // 	if ($.pageItem) {
      // 		return $.pageItem.PageEditElement();
      // 	}
      // },
      // pv: {
      // 	EscEdit: function(event) {
      // 		if ($.pageItem && $.pageItem.editing) {
      // 			event.preventDefault();
      // 			$.pageItem.editclose();
      // 		}
      // 	},
      // 	UpShiftAlt: function(event) {
      // 		var field = document.activeElement.field;
      // 		if (field.aid) {
      // 			var el = field.el;
      // 			if (el.previousElementSibling) {
      // 				el.parentElement.insertBefore(el, el.previousElementSibling);
      // 				field.elINP.focus();
      // 			}
      // 		}
      // 		event.preventDefault();
      // 	},
      // 	Up: function(event) {
      // 		if (document.activeElement.tagName != 'DIV' && document.activeElement.field && document.activeElement.field.el.previousElementSibling) {
      // 			document.activeElement.field.el.previousElementSibling.field.elINP.focus();
      // 			event.preventDefault();
      // 		}
      // 		event.preventDefault();
      // 	},
      // 	Down: function(event) {
      // 		if (document.activeElement.tagName != 'DIV' && document.activeElement.field && document.activeElement.field.el.nextElementSibling) {
      // 			document.activeElement.field.el.nextElementSibling.field.elINP.focus();
      // 			event.preventDefault();
      // 		}
      // 	},
      // 	DownShiftAlt: function(event) {
      // 		var field = document.activeElement.field;
      // 		if (field.aid) {
      // 			var el = field.el;
      // 			if (el.nextElementSibling) {
      // 				el.parentElement.insertBefore(el, el.nextElementSibling.nextElementSibling);
      // 				field.elINP.focus();
      // 			}
      // 		}
      // 	},
      // },
      // //tv: {		},
      // //lv: {		},
      // //CtrlKeyP: function() {
      // //	//if (!) document.body.createElement('DIV', { className: 'divprint' , innerHTML:colpage.innerHTML});
      // //	//event.preventDefault();
      //
      // //},
      //
      //
      // // ShiftShift wordt gegenereerd door scanner voor barcode. Bij scannen code tree select resetten
      // ShiftShift: function() {
      // 	Treeview.selstart = null;
      // },
      // CtrlKeySEdit: function(event) {
      // 	if ($.pageItem && $.pageItem.editing) {
      // 		event.preventDefault();
      // 		//if (document.activeElement && document.activeElement.onblur) document.activeElement.onblur();
      // 		//if (document.activeElement && document.activeElement.onchange) document.activeElement.onchange();
      // 		//$.pageItem.btnSave.focus();
      // 		$.pageItem.btnSave.click();
      // 	}
      // },
      // CtrlKeyZ: function(event) {
      // 	$.undo();
      // },
      // //KeyCCtrl: function(event) {
      // //    return $.clipboard.copy();
      // //},
    }
  })
  .on('keydown', event => {
    // //console.log(event, window.event);
    $().state('available');
    // 	if (key == 'Enter') {
    // 		if ($.setting.keybuf.length == 10 && !isNaN($.setting.keybuf)) return auth.keyloggin($.setting.keybuf);
    // 		$.setting.keybuf = $.setting.keybuf.split('CapsLockCapsLock');
    // 		if ($.setting.keybuf[1]) {
    // 			bc = $.setting.keybuf.pop();
    // 			//console.debug(bc);
    // 			private.search.Value = bc;
    // 			$.formfind.onsubmit();
    // 		};
    // 		$.setting.keybuf = '';
    // 	} else {
    // 		$.setting.keybuf += event.key;
    // 	}
    // onkey(event);
    $.temp.keyEvent = event;
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyC') {
      event.preventDefault();
      document.execCommand('copy');
    }
    // //console.log('keydown', event, event.keyPressed);
    event.previousKey = $.temp.previousKey;
    $.temp.previousKey = event.keyPressed;
  }, true)
  .on('message', event => {
    // if (event && event.body && event.body.code) {
    // 	$.auth.get_access_token(event.body);
    // 	// return $.auth.login({
    // 	// 	code: event.body.code,
    // 	// 	client_id: $.config.$.client_id,
    // 	// });
    //
    // 	// $.temp.cookie = {
    // 	// 	id_token: event.body.id_token,
    // 	// }
    // 	// //console.error('document.cookie', document.cookie);
    // 	//
    // 	//
    // 	// //console.debug('id_token', event.body.id_token);
    // 	// $.extendLocal({auth:{id_token: event.body.id_token}});
    // 	// document.cookie = 'id_token=' + event.body.id_token;
    // 	// $.auth.id_token = event.body.id_token;
    // 	// new $.WebsocketRequest({
    // 	// 	to: {
    // 	// 		sid: event.from_id,
    // 	// 	},
    // 	// 	message_id: event.id,
    // 	// 	body: {
    // 	// 		state: 'ack',
    // 	// 	},
    // 	// }, event => {
    // 	// 	//console.log('RESPONSE ACK ACK', event.body);
    // 	// });
    // 	//
    // }
    // var data = event.body;
    // if (!data) return;
    // //console.debug('ON MESSAGE WEB DATA', event);
    const data = event;
    if (event.body && event.body.Master && event.body.Master.LinkID) {
      const parent = $.ref[Number(event.body.Master.LinkID)];
      const item = $.ref[Number(data.ID)];
      if (parent && item) {
        $.noPost(() => {
          item.movetoidx(parent, Number(event.body.Master.Data));
        })
      }
    }
    // if (data.changeData) {
    // 	return changeData(data.changeData);
    // }
    if (data.state && data.description && document.getElementById('aimStatusMsg'))
    document.getElementById('aimStatusMsg').innerText = data.description;
    switch (data.state) {
      case 'datatransfered':
      for (var name in data.values) {
        for (var c = document.getElementsByName(name), el, i = 0; el = c[i]; i++) el.Value = data.values[name];
      }
      break;
    }
    if (data.systemalert) {
      // //console.debug('ONMESSAGE ALERT', data);
      if (!document.getElementById('alertpanel')) return;
      if (!$.elAlertrow) {
        with (document.getElementById('alertpanel')) {
          $.elAlertsum = document.getElementById('alertsum') || createElement('DIV', { className: 'col', id: 'alertsum' });
          $.elAlertrow = document.getElementById('alertrow') || createElement('DIV', { className: 'col aco', id: 'alertrow' });
        }
      }
      if (!$.alerts[data.systemalert.id]) $.alerts[data.systemalert.id] = $.elAlertrow.createElement('DIV', {
        className: data.systemalert.categorie, innerText: [data.systemalert.Title, data.systemalert.created].join(' '),
        onchange: function(event) {
          // //console.debug('CHANGE', this);
          if ('condition' in this) this.setAttribute('condition', this.condition);
          if ('ack' in this) this.setAttribute('ack', this.ack);
          if (this.ack && !this.condition) { $.alerts[this.id] = null; $.elAlertrow.removeChild(this); }
        },
        onclick: function() {
          ws.send({ systemalert: { id: this.id, ack: this.ack = 1 } });
          this.onchange();
        }
      });
      Object.assign($.alerts[data.systemalert.id], data.systemalert).onchange();
    }
    return;
    if (data.itemID && data.attributeName && ('value' in data)) {
      c = document.getElementsByName([data.itemID, data.attributeName].join('.'));
      for (var i = 0, event; event = c[i]; i++) event.setAttribute('value', data.Value);
      var c = document.getElementsByClassName(data.itemID);
      for (var i = 0, event; event = c[i]; i++) event.setAttribute(data.attributeName, data.Value);
      if (window.meshitems && window.meshapi.item[data.itemID] && data.attributeName == 'MeshColor') {
        window.meshapi.item[data.itemID].src.basiccolor = data.Value;
        window.meshapi.item[data.itemID].colorSet(data.Value);
      }
      if (window.meshitems && window.meshapi.item[data.itemID] && data.attributeName == 'err') {
        for (var i = 0, c = $.temp.err.children, elErrRow; elErrRow = c[i]; i++) if (elErrRow.meshitem.src.itemID == data.itemID) break;
        if (elErrRow) {
          elErrRow.elEnd.innerText = (elErrRow.end = new Date()).toISOString().substr(11, 8);
          elErrRow.refresh();
        }
        else with ($.temp.err.insertBefore(elErrRow = $.temp.err.createElement('DIV', { className: 'row err start', itemID: data.itemID, meshitem: window.meshapi.item[data.itemID], start: new Date() }), $.temp.err.firstChild)) {
          createElement('SPAN', { className: 'icon' });
          createElement('SPAN', { className: '', innerText: window.meshapi.item[data.itemID].src.name });
          createElement('SPAN', { className: '', innerText: data.Value });
          createElement('SPAN', { className: '', innerText: elErrRow.start.toISOString().substr(11, 8) });
          elErrRow.elAccept = createElement('SPAN', { className: '', innerText: '' });
          elErrRow.elEnd = createElement('SPAN', { className: '', innerText: '' });
          elErrRow.refresh = function() {
            if (this.end && this.accept) {
              this.meshitem.colorSet();
              $.temp.err.removeChild(this);
            }
            $.temp.errCont.style = $.temp.err.children.length ? '' : 'display:none;';
            window.onWindowResize();
          };
          elErrRow.refresh();
        }
      }
    }
    return;
    //console.debug('message', event.body);
    if (event.body) $.data.update(event.body);
    // var data = event.body;
    if (data.Value)
    ////console.debug('ONMESSAGE OM', this, event);
    ////console.debug('onreceive', this.data);
    //if (data.Notification) $.Notification.create(data.Notification);
    if (data.state && data.fraim.app === 'aliconnector' && data.fraim.ip == $.client.ip) {
      ////console.debug('CONNECT');
      document.body.setAttribute('aliconnector', $.aliconnector.state = data.state);
      // if (data.state=='disconnected') {
      // 	$.hasConnector=false;
      // 	//document.body.style.color='red';
      // }
      if (data.state == 'connected') {
        //$.hasConnector=true;
        //document.body.style.color='green';
        if (!data.ack) ws.send({ to: { client: data.fraim.client }, state: 'connected', ack: 1 });
        if (data.fraim.device != $.client.device.id) {
          //alert('SYNC ALICONNECT DEVICE_ID');
          ws.send({ to: { client: data.fraim.client }, device: $.client.device });
          ////console.debug('CONNECT ALICONNECTOR', senddata);
        }
      }
    }
    //{
    //	//console.debug('Notification', data.Notification);
    //	$.Notification.Notify(data.Notification.Title, data.Notification.options);
    //	//{
    //	//	body: "Bericht geplaatst door " + data.get.from,
    //	//	url: "https://aliconnect.nl/tms/app/om/#id=" + data.get.id,
    //	//	//url: "https://aliconnect.nl/moba/app?lid=;2101;;FinishDateTime+IS+NULL&q=*&n=EWR&id=2776611&pv=1",
    //	//	//icon: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
    //	//	//image: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
    //	//	data: data,
    //	//});
    //}
    //if (data.Value) data.Value.forEach(function(item) {
    //});
    ////console.debug('OnReceive', data);
    ////console.debug(data);
    //if (data.supportmessage) $.Notification.create(data.supportmessage);
    if (data.reload) document.location.href = document.location.href;
    if (data.app === 'aliconnector') {
      if (!msg) return;
      $.aliconnector = msg;
      //console.debug('aliconnector', msg);
      if (msg.state == 'connected') {
        ws.send({ to: { deviceUID: $.deviceUID }, msg: { userName: $.accountName || $.client.user.name, userUID: $.userUID } });
        //Notify("EWR 4292 Updated", {
        //    body: "TL20 on packing lanes before CP12",
        //    url: "https://aliconnect.nl/moba/app?lid=;2101;;FinishDateTime+IS+NULL&q=*&n=EWR&id=2776611&pv=1",
        //    icon: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
        //    //image: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
        //});
        //Notify('fdsgsdfgsdfgs');
      }
      if (msg.state) {
        //ws.send({ broadcast: true, msg: { id: $.Account.sub, uid: $.userUID, state: msg.state } });
        //document.body.setAttribute('aliconnector', msg.state);
      }
      //{
      //    document.body.setAttribute('aliconnector', 'online');
      //}
      //return;
      //if ($.aliconnector.state == 'init') ws.send({ to: { deviceUID: $.deviceUID }, msg: { userName: $.accountName } });
      //clearTimeout($.toaliconnector);
      //$.toaliconnector = setTimeout(function() { document.body.setAttribute('aliconnector', $.aliconnector.state = 'offline'); }, 40000);
      ////console.debug('ONLINE SERVICE', data);
      //document.body.setAttribute('aliconnector', 'online');
    }
    //if (msg.post && msg.post.item && $.ref[msg.post.item.id]) {
    //    var item = $.ref[msg.post.item.id];
    //    //console.debug(document.location.href);
    //    //Notify(item.Title, {
    //    //    body: "Modified by user",
    //    //    icon: item.files && item.files[0] ? "https://aliconnect.nl" + item.files[0].src : null, //"https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
    //    //    //image: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
    //    //    data: { id: item.id, url: document.location.href },
    //    //});
    //}
    if (data.editfiledone) {
      var c = document.getElementsByName(data.editfiledone);
      for (var i = 0, event; event = c[i]; i++) event.setAttribute('state', '');
    }
    if (data.editfile) {
      data.editfile = data.editfile.split('/').pop();
      var c = document.getElementsByName(data.editfile);
      for (var i = 0, event; event = c[i]; i++) event.setAttribute('state', 'editing');
    }
    //if ($.ref[data.id]) ItemSetAttribute(data.id, data.name, data.Value);
    //if (msg.items) itemset(msg.items);//for (var id in msg.items) if ($.ref[id]) { msg.items[id].id = id; itemset(msg.items[id]); }
    //if (data.activestate) {
    //    ItemSetAttribute(data.userID, 'activestate', data.activestate);
    //    ItemSetAttribute(data.accountID, 'activestate', data.activestate);
    //    //if ($.ref[data.userID]) {
    //    //    $.ref[data.userID].guistate = data.guistate;
    //    //    var c = document.getElementsByName('state' + data.accountID);
    //    //}
    //    //if ($.ref[data.accountID]) $.ref[data.accountID].guistate = data.guistate;
    //    //for (var i = 0, event; event = c[i]; i++) event.setAttribute('state', 'online');
    //    //if ($.ref[data.accountID]) $.ref[data.accountID].onlinestate = 'online';
    //}
    //if (data.a == 'blur') {
    //    var c = document.getElementsByName('state' + data.accountID);
    //    for (var i = 0, event; event = c[i]; i++) event.setAttribute('state', 'offline');
    //    if ($.ref[data.accountID]) $.ref[data.accountID].onlinestate = 'offline';
    //}
    if (data.alert) alert(data.alert);
    //if (data.deviceUID == $.deviceUID) {
    return;
    //}
    if (data.a == 'submit' && $.getItem(data.id) && $.getItem(data.id).modifiedDT != data.modifiedDT) {
      ////console.debug('SUBMIT', data.id);
      //if (data.hostID == $.config.$.auth.accessToken.aud) {
      ////console.debug('SUBMIT', data, $.config.$.auth.accessToken.aud, get.id, data.id);
      if (get.id == data.id) {
        $.getItem(data.id).reload();
      } else if ($.getItem(data.id)) {
        $.getItem(data.id).loaded = false;
      }
      msg.check();
      //}
    }
  })
  .on('mousemove', event => {
    $.temp.clickPath = event.path;
    $().state('available');
    // if (event.target.item) // //console.log(event.target.tagName, event.target.item);
    // if (!$.temp.clickPath.includes($)) $.temp.clickPath.push($);
  })
  .on('paste', event => handleData($.clipboard.itemFocussed, event))
  .on('popstate', event => {
    event.preventDefault();
    console.log('POPSTATE', document.location.href);
    $().execUrl(document.location.href, true);
  })
  .on('resize', event => {
    if ($.mainPopup) {
      $.mainPopup.close();
      $.subPopup.close();
    }
    // if (document.body.clientWidth < 400 && document.body.clientWidth < document.body.clientHeight) document.body.setAttribute('device', device = 'phone');
    // else if (document.body.clientHeight < 400 && document.body.clientWidth > document.body.clientHeight) document.body.setAttribute('device', device = 'phonewide');
    // else if (document.body.clientWidth < 800 && document.body.clientWidth < document.body.clientHeight) document.body.setAttribute('device', device = 'tablet');
    // else if (document.body.clientHeight < 800 && document.body.clientWidth > document.body.clientHeight) document.body.setAttribute('device', device = 'tabletwide');
    // else document.body.setAttribute('device', device = 'pc');
  })
  .on('scroll', event => {

    const lastdoc = $('doc').elem.lastChild;
    if (lastdoc && lastdoc.doc) {
      const docelem = lastdoc.doc.docElem;
      // console.log(docelem, docelem.findAll);
      if (!$.toScroll) {
        // const div = Math.abs(lastScrollTop - docelem.elem.scrollTop);
        // clearTimeout(to);
        $.toScroll = setTimeout(() => {
          // console.log('re');
          $.toScroll = null;
          // if (div > 50) {
          lastScrollTop = document.body.scrollTop;
          let elem = docelem.findAll.find(elem => elem.getBoundingClientRect().top < docelem.elemTop) || docelem.topItem;
          // console.log(docelem.findAll);
          // let elem = all.find(elem => elem.offsetParent );
          // console.log(elem.innerText, elemTop, elem.getBoundingClientRect().top, elem.getBoundingClientRect().height, all.indexOf(elem));
          // return;
          // elem = all[all.indexOf(elem)-1];
          docelem.allmenu.forEach(a => a.attr('open', '0').attr('select', null));
          const path = [];
          for (var p = elem.a.elem; p.tagName === 'A' && p.parentElement && p.parentElement.parentElement; p=p.parentElement.parentElement.parentElement.firstChild) {
            p.setAttribute('select', '');
            p.setAttribute('open', '1');
            path.push(p);
          }
          $(elem.a.elem).scrollIntoView();
          if ($('navDoc')) {
            $('navDoc').text('').append(...path.reverse().map(elem => ['/', $('a').text(elem.innerText)]))
          }
          // elem.li.select();
          // $()
          // let elem = all.forEach(elem => //console.log(elem.getBoundingClientRect().top));
          // //console.log(elem, elem.li);
          // }
        }, 500);
      }

    }
    // console.error(docelem, docelem.doc);



    if ($.mainPopup) {
      $.mainPopup.close();
      $.subPopup.close();
    }
    var st = window.pageYOffset || document.documentElement.scrollTop;
    var scrolldir = st > 50 && st > $.lastScrollTop ? 'down' : 'up';
    if ($.temp.body) $.temp.body.setAttribute('scroll', scrolldir);
    $.lastScrollTop = st;
    if (Element && Element.iv) {
      if (window.toscroll) clearTimeout(window.toscroll);
      toscroll = setTimeout(function() {
        var event = Element.iv, ot = 0;
        while (event = event.parentElement) ot += event.offsetTop;
        ////console.debug(ot);
        for (var i = 0, elHFocus, elNext; elNext = hapi.item[i]; i++) {
          if (elNext.offsetTop > st - ot) break;
          elHFocus = elNext;
        }
        elHFocus = elHFocus || elNext;
        var c = Element.iv.getElementsByTagName('LI');
        ////console.debug(c);
        //var elFocus = null, elPrev = null;
        for (var i = 0, event; event = c[i]; i++) {
          //if (event.h.offsetTop - 25 >= st) elFocus = elFocus || elPrev || event;
          //elPrev = event;
          if (event.hasAttribute('open')) event.setAttribute('open', 0);
          event.removeAttribute('focus');
        }
        ////console.debug(elHFocus.innerText, elHFocus.elemTreeLi);
        Element.iv.style.paddingTop = Math.max(0, st - ot + 50) + 'px';
        if (elHFocus) {
          elPar = elFocus = elHFocus.elemTreeLi;
          ////console.debug('FOCUS', elHFocus.innerText, elHFocus.elemTreeLi, elPar.innerText);
          //var otf = elFocus.offsetTop;
          //elFocus = elFocus || elPrev || event;
          elFocus.setAttribute('focus', 1);
          while (elPar.h) {
            ////console.debug('FOCUS', elPar.innerText, elPar.offsetTop, elPar.tagName);
            //otf += elPar.offsetTop + 30;
            if (elPar.hasAttribute('open')) elPar.setAttribute('open', 1);
            elPar = elPar.parentElement.previousElementSibling;
          }
          ////console.debug('go');
          //while ((elFocus = elFocus.parentElement) && elFocus != Element.iv.firstChild) {
          //    //console.debug(elFocus.offsetTop);
          //    otf += elFocus.offsetTop;
          //}
          //console.debug('TOTAL', Element.iv.firstChild.getBoundingClientRect().top, elFocus.getBoundingClientRect().top);
          ////console.debug(elPar.innerText, elPar.offsetTop);
          //otf += elPar.offsetTop;
          //elFocus.scrollIntoView({ block: "nearest", inline: "nearest" });
          //var br = Element.iv.getBoundingClientRect();
          //var bre = elFocus.getBoundingClientRect();
          if (scrolldir == 'down') Element.iv.style.paddingTop = (st - ot - elFocus.getBoundingClientRect().top + Element.iv.firstChild.getBoundingClientRect().top + 50) + 'px';
          //else Element.iv.style.paddingTop = (st - ot + 50) + 'px';
          ////console.debug(st, bre.top, elHFocus.offsetTop);
        }
      }, 300);
    }
    // $.player.onscroll();
    ////console.debug(document.documentElement.clientHeight, Element.iv.clientHeight, Element.iv.firstChild.clientHeight, document.documentElement.clientHeight);
    //Element.iv.style.paddingTop = Math.min(Element.iv.clientHeight - Element.iv.firstChild.clientHeight - 300, Math.max(0, document.documentElement.scrollTop - 300)) + 'px';
  })
  .on('unload', event => {
    // $.api.setactivestate('offline');
  });

  require = function () {};
  let localAttr = window.localStorage.getItem('attr');
  $.localAttr = localAttr = localAttr ? JSON.parse(localAttr) : {};
  $().on({
    connect: handleEvent,
    message(event){
      if (event.body && event.body.code){
        $.history.replaceUrl( '#');
        $.auth.loginWindow.close();
        $.auth.get_access_token(event.body);
      }
    },
    // logout(event){
    //   $.clipboard.reload('https://login.aliconnect.nl/api/oauth?' + new URLSearchParams({
    //     prompt: 'logout',
    //     client_id: config.auth.client_id || config.auth.clientId,
    //     redirect_uri: document.location.origin,
    //   }).toString());
    // },
  });

  function Doc(){}
  Doc.prototype = {
    extend(index){
      $.extend.call(this.index, index);
    },
    index: {},
    json(){
      function comp (a,b){
        return a[0].charCodeAt(0) > b[0].charCodeAt(0) ? 1 : (
          a[0].charCodeAt(0) < b[0].charCodeAt(0) ? -1 : a[0].localeCompare(b[0])
        );
      }
      const mydocs = {
        prototype: $.prototype
      };
      const doc = (function recursive (obj){
        const entries = [];
        Object.keys(obj).forEach(key => {
          // const val = {};
          let descriptor = Object.getOwnPropertyDescriptor(obj, key) || {};
          // descriptor.name = key;
          entries.push([key, descriptor]);
          if (descriptor.set){
            descriptor.set = String(descriptor.set);
          }
          if (descriptor.get){
            descriptor.get = String(descriptor.get);
          }
          if (String(descriptor.value) === '[object Object]'){
            // delete descriptor.value;
          }
          delete descriptor.value;
          if (['access_token','nonce','refresh_token','client_secret','api_key','api-key','x-api-key'].includes(key)){
            delete descriptor.value;
          }
          if (key.includes('token') || key.includes('secret') || key.includes('key')){
            delete descriptor.value;
          }
          delete descriptor.writable;
          delete descriptor.enumerable;
          delete descriptor.configurable;
          // descriptor = Object.assign(descriptor, {
          // 	name: key,
          // }, descriptor);
          // return;
          // let item = {
          // 	__descriptor: descriptor,
          // };
          // doc[key] = item;
          if (!descriptor.get){
            let type = descriptor.type = Array.isArray(obj[key]) ? 'array' : typeof obj[key];
            if (type === 'function'){
              descriptor.type = 'method';
              var code = String(obj[key]).replace(/\t/gs,'  ').replace(/\r/gs,'');
              var content = String(code).split(/\n/);
              content.shift();
              content.pop();
              var ident = content.filter(line => line.trim());
              if (ident.length){
                // console.debug(content, code);
                var ident = ident[0].search(/\S/);
                content = content.map(line => line.substr(ident));
                content = content.map(line => line.replace(/\/\/.*/,''));
                content = content.filter(line => line.trim());
                descriptor.code = content.join('\n');
              }
              // console.debug(code, content);
              if (obj[key].prototype){
                descriptor.type = 'constructor';
              }
              var value = arguments.callee(obj[key]);
              if (value){
                descriptor.value = value;
              }
              if (obj[key].prototype){
                descriptor.constructor = true;
                var value = arguments.callee(obj[key].prototype);
                if (value){
                  descriptor.prototype = value;
                }
              }
              // if (obj[key].prototype instanceof Object){
              // }
              // doc[key] = Object.keys(item).sort().reduce((r, k) => (r[k] = item[k], r), {});
            } else {
              if (obj[key] instanceof Object){
                var value = arguments.callee(obj[key]);
                if (value){
                  descriptor.value = value;
                }
              }
              // doc[key] = Object.keys(item).sort().reduce((r, k) => (r[k] = item[k], r), {});
            }
          }
        });
        // for (let key in obj){
        // 	let val;
        // 	if (typeof obj[key] === 'function'){
        // 		val = {
        // 			type: key[0] === key[0].toUpperCase() ? 'constructor' : 'method',
        // 		}
        // 		if (obj[key].prototype){
        // 			val.prototype = recursive(obj[key].prototype);
        // 		}
        // 		val.sub = recursive(obj[key]);
        // 	} else {
        // 		val = Object.getOwnPropertyDescriptor(obj, key);
        // 		if (val){
        // 			// val.type = String(val.value);
        // 			if (Array.isArray(val.value)){
        // 				val.type = 'array';
        // 			} else {
        // 				val.type = typeof val.value;
        // 				console.debug(val.value);
        // 				if (val.value){
        // 					val.value = recursive(val.value);
        // 				}
        // 				// if (String(val.value) === '[object Object]'){
        // 				// }
        // 			}
        // 		} else {
        // 			val = {
        // 				value: String(val),
        // 			}
        // 		}
        // 	}
        // 	entries.push([key,val]);
        // 	continue;
        // 	// let val = obj[key];
        // 	// if (typeof val === 'function'){
        // 	// 	val = {
        // 	// 		type: key[0] === key[0].toUpperCase() ? 'constructor' : 'method',
        // 	// 	}
        // 	// 	if (obj[key].prototype){
        // 	// 		// Object.assign(obj, sortObject(val.prototype));
        // 	// 		val.prototype = recursive(obj[key].prototype);
        // 	// 	}
        // 	// } else if (Array.isArray(val)){
        // 	// } else if (val !== null && typeof val === 'object'){
        // 	// 	if (!seen.includes(val)){
        // 	// 		seen.push(val);
        // 	// 		if (val.get){
        // 	// 			val = {
        // 	// 				type: 'getter',
        // 	// 				subitems: val,
        // 	// 			}
        // 	// 		}
        // 	// 	} else {
        // 	// 		val = {
        // 	//
        // 	// 		}
        // 	// 	}
        // 	// 	// val = {
        // 	// 	//
        // 	// 	// };
        // 	// 	recursive(val);
        // 	// } else {
        // 	// 	val = {
        // 	// 		type: typeof val,
        // 	// 		// value: val,
        // 	// 	}
        // 	// }
        // 	// entries.push([key,val]);
        // }
        return entries.length ? Object.fromEntries(entries.sort(comp)) : null;
      })(mydocs);
      return JSON.stringify(doc);
      function sortObject(obj){
        arr = [];
        for (const name in obj){
          arr.push([name,obj[name]]);
        }
        return Object.fromEntries(Object.entries(obj).sort(comp));
      }
      return JSON.stringify(sortObject(docs), (key,val) => {
        if (typeof val === 'function'){
          var obj = {
            type: key[0] === key[0].toUpperCase() ? 'constructor' : 'method',
            // code: String(val),
          };
          if (val.prototype && Object.values(val.prototype).length){
            // Object.assign(obj, sortObject(val.prototype));
            obj.prototype = sortObject(val.prototype);
          }
          // if (val.prototype){
          // 	obj.methods = {};
          // 	for (var name in val.prototype){
          // 		obj.methods[name] = {};
          // 	}
          // }
          return obj;
        } else if (val instanceof Object){
          return sortObject(val);
          // } else {
          // 	return {
          // 		value: val;
          // 	}
        }
        return val;
      });
      // console.debug(docs, JSON.stringify(docs, val => typeof val === 'function' ? String(val) : val));
      // return JSON.stringify(docs, val => typeof val === 'function' ? String(val) : val);
    }
  };
	const TreeListview = {
		construct(selector) {
			this.selector = selector;
			const elem = this.elem = this.selector.elem;
			const self = this;
      this.menu = {
        items: {
          previous: {
            class: 'previous',
            text: 'previous',
            hotkey: 'Up',
            key: 'ArrowUp',
            on: {
              click: event => this.setFocusElement(this.getPreviousElement(event), event),
            },
          },
          next: {
            class: 'next',
            text: 'next',
            hotkey: 'Down',
            key: 'ArrowDown',
            on: {
              click: event => this.setFocusElement(this.getNextElement(event), event),
            },
          },
          selectUp: {
            class: 'previous',
            text: 'Select previous',
            hotkey: 'Shift+Up',
            key: 'shift_ArrowUp',
            on: {
              click: event => this.setFocusElement(this.getPreviousElement(event), event),
            },
          },
          selectDown: {
            class: 'next',
            text: 'Select next',
            hotkey: 'Shift+Down',
            key: 'shift_ArrowDown',
            on: {
              click: event => this.setFocusElement(this.getNextElement(event), event),
            },
          },
          moveUp: {
            class: 'moveup',
            text: 'Move up',
            hotkey: 'Ctrl+Up',
            key: 'ctrl_ArrowUp',
            on: {
              click: event => this.moveUp(event),
            },
          },
          moveDown: {
            class: 'movedown',
            text: 'Move down',
            hotkey: 'Ctrl+Down',
            key: 'ctrl_ArrowDown',
            on: {
              click: event => this.moveDown(event),
            },
          },
        }
      };
			elem.addEventListener('click', function() {
				if (event.itemElement) {
					self.setFocusElement(event.itemElement, event);
				}
			}, true);
			$(elem).extend({
				cancel(event) {},
				onkeydown(event) {
					clearTimeout(self.arrowTimeout);
					if (document.activeElement === document.body) {
						const str = event.keybuffer.join('').trim();
						if (str) {
							const listItems = [...elem.getElementsByClassName('item')];
							const elementFind = listItems.find(elem => elem.is.item() && String(elem.is.item().header0) && String(elem.is.item().header0).toLowerCase().includes(str));
							if (elementFind) {
								self.setFocusElement(elementFind, event);
							}
						}
					}
				},
			});
		},
    move(event, offset) {
      // console.log(event.target.parentElement);
      console.log(event.target.parentElement);
      const itemElem = event.path.find(el => el.item);
      this.setFocusElement(itemElem);
      if (this.focusElement) {
        event.preventDefault();
        event.stopPropagation();
        const parent = this.focusElement.parentElement.item;
        const index = [...this.focusElement.parentElement.children].indexOf(this.focusElement) - 1;
        // this.focusElement.item.attr('Master', {
        //   action: 'move',
        //   LinkID: parent.ID,
        //   Data: index + offset,
        // }).then(item => item.elemTreeLi.elemTreeDiv.scrollIntoView());
        $.link({
          name: 'Master',
          item: this.focusElement.item,
          to: parent,
          // current: parent,
          index: index + offset,
          action: 'move',
        })
        .then(item => {
          console.log('move done', item, item.elemTreeLi.elem);
          this.setFocusElement(item.elemTreeLi.elem);
        });
      // }).then(item => this.setFocusElement(event.target.parentElement)item.elemTreeLi.elemTreeDiv.scrollIntoView());
			}
    },
		moveUp (event) {
      this.move(event, -1);
		},
		moveDown (event) {
      this.move(event, 1);
		},
		getOffsetElement(offset, event) {
      // console.log('getOffsetElement', event);
      const focusElement = event && event.target && event.target.is && event.target.is.srcEvent ? event.target.is.srcEvent.path.find(el => el.item) : this.focusElement;
      // if (event) this.focusElement = event.path.find(el => el.item);
			const listElements = [...this.elem.getElementsByClassName('item')].filter(el => el.tagName !== 'I');
			for (var index = listElements.indexOf(focusElement) + offset, elem; elem = listElements[index]; index+=offset) {
				if (elem.offsetParent !== null) {
					break;
				}
			};
			return elem;
		},
		getPreviousElement(event) {
			return this.getOffsetElement(-1, event);
		},
		getNextElement(event) {
			return this.getOffsetElement(1, event);
		},
		setFocusElement (newFocusElement, event) {
      // console.log('setFocusElement', newFocusElement, event);
			const elem = this.elem;
			const list = [...elem.getElementsByClassName('item')].filter(elem => elem.item);
			if (event) {
				event.preventDefault();
			}
      // console.log('FOCUS', newFocusElement, this.focusElement);
			if (newFocusElement && newFocusElement !== this.focusElement) {
				if (event && event.shiftKey) {
					event.stopPropagation();
					elem.multiSelectStartElement = elem.multiSelectStartElement || newFocusElement;
					const startIndex = list.indexOf(elem.multiSelectStartElement);
					const thisIndex = list.indexOf(newFocusElement);
					const [firstIndex,lastIndex] = thisIndex > startIndex ? [startIndex,thisIndex] : [thisIndex,startIndex];
					const all = list.slice(firstIndex,lastIndex+1);
					$.clipboard.setItem(all.map(elem => $(elem).item()), 'checked', '');
				} else {
					if (event && event.ctrlKey) {
						event.stopPropagation();
					} else {
						elem.multiSelectStartElement = newFocusElement;
            // //console.log(newFocusElement);
						if (newFocusElement) {
							$(newFocusElement).emit('focusselect');
							if (newFocusElement.item) {
								$.clipboard.setItem([newFocusElement.item], 'checked', '');
							}
						}
						// const event = window.event;
						// elem.arrowTimeout = setTimeout(() => setSelectElement(this.focusElement), event.type === 'keydown' ? 200 : 0);
					}
				}
				if (this.focusElement && this.focusElement.removeAttribute) {
					this.focusElement.removeAttribute('focus');
				}
        if (newFocusElement instanceof Elem) {
          console.log('Elem', newFocusElement);
        }
        this.focusElement = newFocusElement;
      }
      if (this.focusElement instanceof Element) {
        $(this.focusElement).attr('focus', '');
        if (this.focusElement && this.focusElement.firstChild && this.focusElement.firstChild.focus) {
          $(this.focusElement.firstChild).scrollIntoView();
          setTimeout(() => this.focusElement.firstChild.focus(), 100);
        }
      }
			return this.focusElement;
		},
		setSelectElement (elem) {
			// return;
			if (elem && elem.is.item()) {
				const item = elem.is.item();
				$('view').show(item);
				//console.log(item, item.tag, item.header0);
				return;
				if (elem && elem.is.item() && elem !== this.selectElement) {
					// //console.log('SELECT PAGE', elem.is.item());
					this.selectElement = elem;
					$('view').show(elem.is.item());
					// elem.is.item().PageElement();
				}
				return elem;
			}
			// //console.log(arguments.callee.name, ...arguments);
		},
		selectFocusElement(newFocusElement) {
			if (newFocusElement) {
				//console.log('selectFocusElement', newFocusElement);
				const event = window.event;
				this.setFocusElement(newFocusElement, event);
				clearTimeout(this.arrowTimeout);
				this.arrowTimeout = setTimeout(() => this.setSelectElement(this.focusElement), event.type === 'keydown' ? 200 : 0);
				// $.view()
				return;
				//console.log(arguments.callee.name, newFocusElement);
			}
		},
	};
	function Listview(selector) {
    selector.class('row aco listview');
		this.construct(...arguments);
		const elem = this.elem;
		const self = this;
		this.viewType = document.body.getAttribute('view');
		$(elem).extend({
			keyup: {
				ArrowUp: event => this.selectFocusElement(),
				ArrowDown: event => this.selectFocusElement(),
			},
			keydown: {
				// shift_ArrowUp: event => this.setFocusElement(this.getPreviousElement(), event),
        // ArrowUp: event => this.setFocusElement(this.getPreviousElement(), event),
				// ArrowDown: event => this.setFocusElement(this.getNextElement(), event),
				// shift_ArrowDown: event => this.setFocusElement(this.getNextElement(), event),
				shift_alt_ArrowDown: event => this.moveDown(event),
				shift_alt_ArrowUp: event => this.moveUp(event),
				ctrl_ArrowDown: event => this.moveDown(event),
				ctrl_ArrowUp: event => this.moveUp(event),
				ArrowRight: event => {
					// $.url.set({ folder: this.focusElement.item.id });
				},
				ArrowLeft: event => {
					// var master = this.focusElement.item.master;
					// if (master) {
					// 	if (master.master) $.url.set({ folder: master.master.id });
					// 	$.url.setitem(master);
					// }
				},
			},
		});
		// //console.log('ssss',this.elem, this.elem.keyup)
	}
	Listview.prototype = Object.assign({
    activeFilterAttributes: {},
    calendar() {
			$('div').class('aco').parent(this.div.text(''))
			.calendar(this.itemsVisible)
    },
    chart() {
      $('div').class('aco').parent(this.div.text('')).chart(this.itemsVisible)
      // var data = [];
      // for (var i=0, item; item = this.items[i]; i++) {
      //   for (var category in item.Datachart) data.push({category:category, label:item.Title, value:item.Datachart[category]});
      //   if(i>10) break;
      //   // //console.log(item.Datachart);
      // }
      // // //console.log(data);
      // // return;
      // return $.Charts.show(data, listItemElement);
    },
    clickfilter(event) {
			const target = event.target;
			const activeFilterAttributes = this.activeFilterAttributes;
			activeFilterAttributes[target.name] = activeFilterAttributes[target.name] || [];
			if (activeFilterAttributes[target.name].includes(target.value)) {
				activeFilterAttributes[target.name].splice(activeFilterAttributes[target.name].indexOf(target.value), 1);
			} else {
				activeFilterAttributes[target.name].push(target.value);
			}
      if (!activeFilterAttributes[target.name].length) {
        delete activeFilterAttributes[target.name];
      }
      var searchParams = new URLSearchParams(document.location.search);
      searchParams.set('f',btoa(JSON.stringify(activeFilterAttributes)));//$.Object.stringify(this.activeFilterAttributes);
      window.history.pushState('page', 'PAGINA', '?' + searchParams.toString() );
      this.refilter();
    },
		set data(data) {
			if (Array.isArray(data)) {
			}
			if (typeof data === 'string')
			this.show(data);
		},
		get data() {
			return this.items;
		},
    elementSelect(el) {
      //// //console.log("select");
      if (this.elSelect) this.elSelect.removeAttribute('selected');
      if (!el) return;
      this.setFocusElement(el);
      (this.elSelect = el).setAttribute('selected', '');
    },
    filtersOpen: {},
    filterAttributes: {},
    fill() {
      this.itemsVisible.forEach(row => {
        if (row.elemListLi && row.elemListLi.elem) {
          const h = document.documentElement.clientHeight;
          const rect = row.elemListLi.elem.getBoundingClientRect();
          const visible = rect.bottom > -h && rect.top < h + h;
          if (!visible) {
            row.elemListLi.text('');
          } else if (!row.elemListLi.elem.innerText) {
					this.listnode(row)
				}
        }
      });
    },
    ganth() {
			$('div').class('aco').parent(this.div.text('')).ganth(this.itemsVisible)
    },
    go() {
      return $.Go.create({ el: listItemElement, data: this.items });
    },
    get: {},
    itemsVisible: [],
    items: [],
    _init1(get) {
      Object.assign(this, get);
      refilter();
    },
    async maps() {
      // this.setAttribute('view', 'maps');
      // //console.debug('MAPSSSSSS');
      //this.rewrite();
			this.div.text('').append(
				this.mapElem = $('div').class('googlemap').css('width:100%;height:100%;'),
			);
			const maps = await $.maps();
			const mapOptions = {
				zoom: 10,
				center: { lat: 51, lng: 6 },//new maps.LatLng(51,6),
				mapTypeId: maps.MapTypeId.ROADMAP,
        // mapId: 'cb830478947dbf25',
        // styles: [
        //   {
        //     "featureType": "all",
        //     "stylers": [
        //       { "color": "#C0C0C0" }
        //     ]
        //   },{
        //     "featureType": "road.arterial",
        //     "elementType": "geometry",
        //     "stylers": [
        //       { "color": "#CCFFFF" }
        //     ]
        //   },{
        //     "featureType": "landscape",
        //     "elementType": "labels",
        //     "stylers": [
        //       { "visibility": "off" }
        //     ]
        //   }
        // ],
        // https://mapstyle.withgoogle.com/
        styles: $().maps.styles,
			};
			const map = new maps.Map(this.mapElem.elem, mapOptions);
      // return;
      // new maps.Marker({
      //   position: {
      //     // lat: Number(loc[0]),
      //     // lng: Number(loc[1]),
      //     lat: 51.93281270000000,
      //     lng: 6.07558600000000,
      //   },
      //   map: map,
      //   title: 'Hello world',
      // });
			var bounds = new maps.LatLngBounds();
			// var focusmarker;
      const dataItems = this.itemsVisible.filter(item => item.data.Location && item.data.data);
      if (dataItems.length) {
        dataItems.forEach(item => item.value = Object.values(item.data.data).reduce((a,b) => a+b));
        const maxValue = dataItems.map(item => item.value).reduce((a,b) => Math.max(a,b));
        console.log(maxValue);
        dataItems.forEach(item => item.scale = 1 + 2 / maxValue * item.value);
      }
      this.itemsVisible.filter(item => item.data.colorid && item.schema.colorid).forEach(item => item.color = item.schema.colorid[item.data.colorid] || item.schema.colorid.default);
      this.itemsVisible.filter(item => item.data.Location).forEach(item => {
        const loc = item.data.Location.split(',');
        const marker = new maps.Marker({
          position: {
            lat: Number(loc[0]),
            lng: Number(loc[1]),
          },
          map: map,
          item: item,
          zIndex: Number(1),
          title: [item.header0,item.header1,item.header2].join('\n'),
          // icon: getCircle((row.state && row.state.value && row.fields.state.options && row.fields.state.options[row.fields.state.value]) ? row.fields.state.options[row.fields.state.value].color : 'red')
          icon: {
            //url: document.location.protocol+'//developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            //// This marker is 20 pixels wide by 32 pixels high.
            //size: new google.maps.Size(20, 32),
            //// The origin for this image is (0, 0).
            //origin: new google.maps.Point(0, 0),
            //// The anchor for this image is the base of the flagpole at (0, 32).
            //anchor: new google.maps.Point(0, 32)
            path: maps.SymbolPath.CIRCLE,
            fillColor: 'red',
            fillOpacity: .6,
            scale: 10, //Math.pow(2, magnitude) / 2,
            strokeColor: 'white',
            strokeWeight: .5
          },
          icon: {
            // path: "M24-28.3c-.2-13.3-7.9-18.5-8.3-18.7l-1.2-.8-1.2.8c-2 1.4-4.1 2-6.1 2-3.4 0-5.8-1.9-5.9-1.9l-1.3-1.1-1.3 1.1c-.1.1-2.5 1.9-5.9 1.9-2.1 0-4.1-.7-6.1-2l-1.2-.8-1.2.8c-.8.6-8 5.9-8.2 18.7-.2 1.1 2.9 22.2 23.9 28.3 22.9-6.7 24.1-26.9 24-28.3z",
            // path: "M146.667,0C94.903,0,52.946,41.957,52.946,93.721c0,22.322,7.849,42.789,20.891,58.878 c4.204,5.178,11.237,13.331,14.903,18.906c21.109,32.069,48.19,78.643,56.082,116.864c1.354,6.527,2.986,6.641,4.743,0.212 c5.629-20.609,20.228-65.639,50.377-112.757c3.595-5.619,10.884-13.483,15.409-18.379c6.554-7.098,12.009-15.224,16.154-24.084 c5.651-12.086,8.882-25.466,8.882-39.629C240.387,41.962,198.43,0,146.667,0z M146.667,144.358 c-28.892,0-52.313-23.421-52.313-52.313c0-28.887,23.421-52.307,52.313-52.307s52.313,23.421,52.313,52.307 C198.98,120.938,175.559,144.358,146.667,144.358z",
            // path: "M24-8c0 4.4-3.6 8-8 8h-32c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h32c4.4 0 8 3.6 8 8v32z",
            // path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
            path: "M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z",
            scale: (item.scale || 1)/2,
            fillColor: item.color || "blue",
            fillOpacity: 0.6,
            strokeWeight: 0,
            strokeColor: 'white',
            rotation: 0,
            anchor: new maps.Point(15, 30),
          },
          //icon: (row.state) ? 'icon/' + row.state.value + '.png' : null,
        });
        // console.log(marker);
        marker.addListener('click', event => $('view').show(item));
        bounds.extend(marker.getPosition());
      });
      // if (bounds) {
      map.fitBounds(bounds);
      // //console.log(google.maps);
      if (maps.event) {
        maps.event.addListenerOnce(map, 'bounds_changed', function() { this.setZoom(Math.min(15, this.getZoom())); });
      }
      // }
    },
    refilter() {
			for (let [attributeName, attribute] of Object.entries(this.filterAttributes)) {
        attribute.cnt = 0;
        attribute.checked = false;
        for (var fieldvalue in attribute.values) {
          var field = attribute.values[fieldvalue];
          field.cnt = 0;
          field.checked = this.activeFilterAttributes && this.activeFilterAttributes[attributeName] && this.activeFilterAttributes[attributeName].indexOf(fieldvalue) > -1;
          attribute.checked = attribute.checked || field.checked;
        }
      }
			this.items.forEach(row => {
        row.hidden = false;
        for (let [attributeName, attribute] of Object.entries(this.activeFilterAttributes)) {
          if (!(attributeName in row.filterfieldslower) || attribute.indexOf(row.filterfieldslower[attributeName]) === -1) {
            row.hidden = true;
            break;
          }
        }
      });
			// add: this.childClasses && this.childClasses.length > 1
			// ? {
			// 	Title: __('newitem'),
			// 	popupmenu: (function(childClasses) {
			// 		for (var i = 0, childclass; childclass = childClasses[i]; i++) {
			// 			//var schema = $.config.components.schemas[className];
			// 			//// //console.debug(childclass);
			// 			//if (!schema) return;
			// 			//var menuitem = menuitems[className] = { Title: schema.Title || className };
			// 			////var childclass = childClasses[name];
			// 			////schema.Title = schema.Title || className;
			// 			////if (item) menuitem.masterID = item.id;
			// 			////menuitem.onclick = $.config.components.schemas.item.add.bind({ schema: className, srcID: childclass.scrID, masterID: childclass.masterID, });
			// 			childclass.onclick = $.config.components.schemas.item.add.bind({ schema: childclass.schema || childclass.Title, masterID: item ? item.id : null });
			// 			//if (item && item.schema == name) childClasses["Typical"] = { schema: "System", srcID: item.scrID }
			// 		}
			// 		//// //console.debug('childClasses', childClasses);
			// 		return childClasses;
			// 	})(this.childClasses)
			// }
			// : {
			// 	Title: __('newitem'),
			// 	onclick: event => {
			// 		let schemaname = this.path.split('/')[1];
			// 		//console.log(1,schemaname);
			// 		$(schemaname).post();
			// 	}
			// },
      this.itemsVisible = this.items.filter(item => !item.hidden);
			this.selector.text('')
      .attr('hidefilter', $().storage('hidefilter'))
      .append(
				$('div', 'row top abs btnbar np').append(
					$('button').class('abtn select').on('click', event => this.selector.attr('hidefilter', $().storage('hidefilter', this.selector.attr('hidefilter')^1).storage('hidefilter'))),
					$('span').class('aco').text(this.title + ' (' + this.items.length + ')'),
					$('button').class('abtn add').append(
            $('ul').append(
              [...$().schemas().entries()].map(
                ([name,schema]) => $('li')
                .class('abtn')
                .draggable()
                .text(name)
                .item($(schema), 'elemAdd')
                .on('click', event => {
                  event.stopPropagation();
                  const targetItem = this.tag ? $(this.tag) : null;
                  const sourceItem = Item.toData($(schema));
                  // return console.log(this.tag, sourecItem, targetItem);
                  $().copyFrom(sourceItem, targetItem).then(item => {
                    $('view').show(item, true);
                  });
                })
              ),
            ),
          ),
					$('button').class('abtn refresh').on('click', event => $.client.api(document.location.pathname.replace(/\/id\/.*/,'')).query(document.location.search).get().then(event => $().list(event.body))),
					$('button').class('abtn download').append(
						$('ul').append(
							$('li').class('abtn toexcel').text('Excel').on('click', event => {
                const properties = this.getProperties();
                const data = this.itemsVisible.map(item => Object.fromEntries(properties.map(key => [key, item[key]] )));
								let ws = XLSX.utils.json_to_sheet(data);
								let wb = XLSX.utils.book_new();
								// let title = this.title.replace(/\/|\(|\)|\_/g,'');
                let title = 'export';
								XLSX.utils.book_append_sheet(wb, ws, title);
								XLSX.writeFile(wb, title + '.xlsx');
							}),
						)
					),
					$('button').class('abtn print').on('click', null),
					$('button').class('abtn filter').attr('title', 'Lijst filteren').on('click', event => $.show({ flt: get.flt ^= 1 }) ),
					$('button').class('abtn sort').attr('title', 'Menu Opties sorteren openen').append(
						$('ul').append(
							$('li').class('abtn').text('Title').on('click', event => this.sortby('Title')),
							$('li').class('abtn').text('Subject').on('click', event => this.sortby('Subject')),
							$('li').class('abtn').text('Summary').on('click', event => this.sortby('Summary')),
							$('li').class('abtn').text('Deadline').on('click', event => this.sortby('EndDateTime')),
						),
					),
					$('button').class('abtn view', this.viewType).append(
						$('ul').append(
							$('li').class('abtn rows').text('Lijst').on('click', event => this.rewrite('rows')),
							$('li').class('abtn cols').text('Tegels').on('click', event => this.rewrite('cols')),
              $('li').class('abtn table').text('Tabel').on('click', event => this.rewrite('table')),
							!this.hasMapsData ? null : $('li').class('abtn maps').text('Maps').on('click', event => this.rewrite('maps')),
							!this.hasChartData ? null : $('li').class('abtn chart').text('Graph').on('click', event => this.rewrite('chart')),
							!this.hasDateData ? null : $('li').class('abtn ganth').text('Ganth').on('click', event => this.rewrite('ganth')),
							!this.hasDateData ? null : $('li').class('abtn calendar').text('Calendar').on('click', event => this.rewrite('calendar')),
							$('li').class('abtn flow').text('Flow').on('click', event => this.rewrite('flow')),
							!this.hasModelData ? null : $('li').class('abtn model').text('Model').on('click', event => this.rewrite('go')),
							$('li').class('abtn model2d').text('2D').on('click', event => {
								//get hidden() {
								//	var item = colpage.item;
								//	return !item || !item.attributes || !item.attributes.x || !item.attributes.y || !item.attributes.z || !(item.attributes.x.value || item.attributes.y.value || item.attributes.z.value);
								//},
								colpage.item.model2d();
							}),
							$('li').class('abtn model3d').text('3D').on('click', event => {
								//get hidden() {
								//	var item = colpage.item;
								//	return !item || !item.attributes || !item.attributes.x || !item.attributes.y || !item.attributes.z || !(item.attributes.x.value || item.attributes.y.value || item.attributes.z.value);
								//},
								colpage.item.model3d();
							}),
						),
					),
				),
				this.filter = $('ul', 'col afilter liopen np noselect').id('afilter')
				.css('max-width', $().storage('afilter.width') || '150px').on('click', event => document.body.setAttribute('ca', 'lvfilter')),
        $('div').seperator(),
				this.div = $('div', 'col aco oa').on('scroll', event => {
					clearTimeout($.toBodyScroll);
					$.toBodyScroll = setTimeout(() => this.fill(), 100);
				}),
			);
			this.rewrite();
			this.filterFields.forEach(filterfield => filterfield.avalues.sort((a,b)=>{
				if (a.cnt > 0 && b.cnt === 0) return -1;
				if (a.cnt === 0 && b.cnt > 0) return 1;
				return a.value.localeCompare(b.value, {}, 'numeric');
			}));
      this.filter.append(...this.filterFields.filter(
        filterfield => filterfield.avalues.length > 1 || filterfield.avalues[0].items.length != this.items.length
      ).map(
        filterfield => $('li', 'col')
        .open(filterfield.open = this.filtersOpen[filterfield.name] || filterfield.checked)
        .attr('cnt', filterfield.cnt || 0)
        .checked(filterfield.checked)
        .append(
          $('a').class('row')
          // .on('click', event => this.filtersOpen[filterfield.name] = filterfield.listItemElement.getAttribute('open') = filterfield.open)
          .on('click', event => this.filtersOpen[filterfield.name] = filterfield.listItemElement.getAttribute('open') = filterfield.open)
          .append(
            $('span').class('aco attrlabel').ttext(filterfield.Title),
          ),
          $('ul')
          .checked(filterfield.checked)
          .attr('meer', filterfield.meer || 0)
          .open(filterfield.avalues.some(field => field.checked))
          .append(
            filterfield.avalues
            .filter(field => field.Title && (filterfield.checked || field.checked || field.cnt))
            .map(
              (field,i) => $('li').class('row')
              .setProperty('btbg', 'red')
              .append(
                $('input')
                .type('checkbox')
                .on('change', event => this.clickfilter(event))
                .checkbox(filterfield, field),
              )),
              $('div')
              .class('meer')
              .on('click', event => $(event.target.parentElement)
              .attr('meer', $(event.target.parentElement).attr('meer')^1)),
              // $('div').class('minder').on('click', event => $(event.target.parentElement).attr('meer', '0')),
            )
          )
        )
      );
      return this;
      if (filterElement) {
        filterElement.innerText = '';
        this.filterFields.forEach(filterfield => {
          filterfield.avalues.sort((a,b)=>{
            if (a.cnt > 0 && b.cnt === 0) return -1;
            if (a.cnt === 0 && b.cnt > 0) return 1;
            return a.value.localeCompare(b.value, {}, 'numeric');
          });
          filterfield.listItemElement = filterElement.createElement('LI', 'col', {
            cnt: filterfield.cnt || 0,
            checked: filterfield.checked || 0,
            open: filterfield.open = this.filtersOpen[filterfield.name] || filterfield.checked || 1
          }, [
            ['A', 'row', {
              onclick: (event)=> {
                this.filtersOpen[filterfield.name] = filterfield.listItemElement.getAttribute('open') = filterfield.open;
              }
            }, [
              ['SPAN', 'aco', __(filterfield.Title)]
            ]],
          ]);
          filterfield.listItemElement = filterfield.listItemElement.createElement('UL', {
            checked: filterfield.checked || 0,
            meer: filterfield.meer || 0
          });
          var ic = 0;
          for (var i = 0, field; field = filterfield.avalues[i]; i++) {
            if (!field.Title) continue;
            if (filterfield.checked || field.checked || field.cnt) {
              if (field.checked) {
                filterfield.listItemElement.setAttribute('open', filterfield.open = 1);
              }
              filterfield.listItemElement.createElement('LI', 'row', {
                ondragover(event) {
                  event.dataTransfer.dropEffect = 'move';
                  event.stopPropagation();
                  event.preventDefault();
                },
                ondrop(event) {
                  // //console.debug(this.filterfield, this.field, $.dragdata.item, event);
                  var par = {};
                  par[this.filterfield.name] = field.Title;
                  if ($.dragdata.item) $.dragdata.item.set(par);
                }
              }, [
                ['INPUT', '', {
                  type: 'checkbox',
                  value: field.value,
                  name: filterfield.name,
                  id: filterfield.name + field.value + i,
                  checked: field.checked,
                  onchange: event => this.clickfilter(event),
                }],
								['LABEL', 'aco', __(field.Title), { for: filterfield.name + field.value + i }],
								['SPAN', '', field.cnt],//{ for: filterfield.name + field.value + i, cnt: field.cnt, caption: __(field.Title) }],
              ]);
              ic++;
            }
          }
          if (ic > 5) {
            filterfield.listItemElement.createElement('LI', 'meer', {
              onclick() {
                filterfield.listItemElement.setAttribute('meer', filterfield.meer ^= 1)
              }
            });
          }
        });
      }
    },
    getProperties() {
      const schemaNames = this.itemsVisible.map(item => item.schemaName).unique();
      const schemas = [...Object($().schemas()).entries()].filter(([schemaName, schema]) => schemaNames.includes(schemaName));
      const schemaKeys = schemas.map(([schemaName, schema]) => schemaName);
      let properties = [].concat(
        'Tagname',
        'LinkTagname',
        'header0',
        'header1',
        'header2',
        // 'schemaPath',
        // 'schemaName',
        ...schemas.map(([schemaName, schema]) => schemaName), ...schemas.filter(([key, schema]) => !['hidden'].includes(schema.format)).map(([key, schema]) => Object.keys(schema.properties)),
        'ID',
        'level',
      ).unique();
      properties = properties.filter(name => this.itemsVisible.some(item => item.data[name]));
      return properties;
    },
    rewrite(viewType) {
      window.localStorage.setItem('viewType', viewType = this.viewType = viewType || window.localStorage.getItem('viewType'));
			const itemsVisible = this.itemsVisible;
			itemsVisible.forEach(row => {
				for (var attributeName in this.filterAttributes) {
					if (row.filterfieldslower && row.filterfieldslower[attributeName] && this.filterAttributes[attributeName].values) {
						var value = row.filterfieldslower[attributeName];
						if (this.filterAttributes[attributeName].values[value]) {
							this.filterAttributes[attributeName].values[value].cnt++;
							this.filterAttributes[attributeName].cnt++;
						}
					}
				}
			});
			this.div.text('');
      if (this[this.viewType]) {
        return this[this.viewType]();
      }
			$('summary')
			.class('col list')
			.parent(this.div)
      .contextmenu(this.menu)
			.append(...itemsVisible.map(
				item => item.elemListLi = $('li')
				.class('item')
        .draggable()
        .item(item, 'listview')
        .on('click', event => this.select(item))
				.on('focusselect', event => {
          clearTimeout($.arrowTimeout);
					$.arrowTimeout = setTimeout(() => this.select(item), window.event.type === 'keydown' ? 300 : 0);
				})
        .on('change', event => this.listnode(item))
        .emit('change')
				// .attr('userID', item.userID || '0')
				// .attr('level', item.level || '0')
				// .on('rewrite', () => this.listnode(item))
				// .on('select', function() {
				// 	if (!this.innerText) this.createListRowElement(this, this.item);
				// 	Web.Element.scrollIntoView(this);//.scrollIntoViewIfNeeded(false);
				// 	if (this.item.listItemElement) this.item.listItemElement.click();
				// })
				// .assign({
				// 	// item: item,
				// 	//oncontextmenu: $.mainPopup.show,
				// 	//attr: function(row) {
				// 	//	var res = {};
				// 	//	if ($.fav && $.fav[row.id]) res.Fav = 1;
				// 	//	if (row.fields && row.fields.state) res.state = row.fields.state.value;
				// 	//	//if (row.srcID) res.derived = '';
				// 	//	return res;
				// 	//}(row),
				// 	// userID: item.userID || '0',
				// 	// level: item.level || '0',
				// 	select: function() {
				// 		return;
				// 		if (!this.innerText) this.createListRowElement(this, this.item);
				// 		Web.Element.scrollIntoView(this);//.scrollIntoViewIfNeeded(false);
				// 		if (this.item.listItemElement) this.item.listItemElement.click();
				// 	},
				// 	rewrite: () => this.listnode(item),
				// })
				// .contextmenu($(item).popupmenuitems())
				// .on('click', event => this.selectFocusElement(item.elemListLi.elem, event))
				// .on('click', event => //console.log(item.tag, item.header0))
			));
      this.fill();
    },
		select(item, event) {
			// //console.log(2);
			// $.clipboard.setItem([item], 'checked', '');
			// this.focus(item);
			this.setFocusElement(item.elemListLi.elem, event);
      $().execQuery({
        v:item.data['@id'],
      });
      //
			// $('view').show(item);
		},
    set(set) {
      //// //console.debug('LIST SET', this.get.filter, set);
      //// //console.debug('LIST SET', set);
      //if (!set.q) this.get = {};
      //'folder, function, q, filter, search, Title, id, child, select, src, master, users, link, refby, origin, source'.split(', ').forEach(function(name) { if (name in set) this.get[name] = set[name]; }, this);
      //$.url.sethis(this.get);
      //Object.assign(set, { id: '', schema: '', tv: '', lv: '', reload: '' , Title: '' });
      //Object.assign(set, { id: '', schema: '', reload: '' });
      //// //console.debug('LIST SET', set.Title, set.filter);
      for (var name in set) if (this.get[name] != set[name]) break; else name = null;
      if (!name) return;
      //// //console.debug('LIST SET', set);
      //// //console.debug(set);
      //// //console.debug('LIST SET', this.get.filter, set);
      Object.assign(this.get, set);
      //indien er een filter aanstaat en er een zoekopdracht wordt gegeven, schakelen we het filter uit. Zoeken vindt plaats op alle items van een masterclass
      //Voorbeeld is EWR moba. Filter is actief, alleen actieve items. Bij zoeken alle items.
      //if (this.get.q && this.get.q != '*' && this.get.filter) this.get.filter = '';
      this.schema = this.get.schema || ($.getItem(this.get.folder) ? $.getItem(this.get.folder).schema : null) || this.get.folder;
      this.childClasses = $.config.components.schemas[this.schema] && $.config.components.schemas[this.schema].childClasses ? $.config.components.schemas[this.schema].childClasses : [this.schema];
      //// //console.debug('SCHEMA', this.schema, this.childClasses);
      //// //console.debug('LIST SET', this.get.filter, set);
      for (var name in this.get) if (!this.get[name]) delete this.get[name];
      //// //console.debug('LIST SET', this.get.filter, set.filter);
      if (this.get.folder && Number(this.get.folder) && $.getItem(this.get.folder)) {
        $.getItem(this.get.folder).focus();
        if ($.getItem(this.get.folder).children.length) {
          this.show($.getItem(this.get.folder).children);
          return
        }
      }
      this.show(this.data[this.get.Title] || []);
      //// //console.debug('LIST SET', this.get);
      if (!this.get.q) return;
      //// //console.debug('LIST SET', this.get.filter, set.filter);
      var get = this.get;
      this.loadget = {};
      "folder, filter, child, q, select".split(", ").forEach(function(name) { if (get[name]) this.loadget[name] = get[name]; });
      delete this.loadget.select;
      new $.HttpRequest($.config.$, 'GET', this.loadget, event => {
        //// //console.debug('list_set', this.responseText, event.body);
        this.show(event.body.value);
      }).send();
      //if (!get.value) this.items = [];
      //var par = Object.assign($.url.par(document.location.search.substr(1)), { q: this.value, search: 'Title, Subject, Summary' }), get = {};
      //'folder, q, filter, search'.split(', ').forEach(function(name) { if (par[name]) get[name] = par[name]; });
      //$.url.set(get);
    },
    async show(items, path) {
			if (Array.isArray(this.items = (await items) || [])) {
        this.viewMap = new Map();
				this.title = path || '';
        this.tag = ((this.items.url||'').match(/\w+\(\d+\)/)||[''])[0];
				if (this.items.url) {
          // const url = new URL(document.location);
          // console.log('this.items.url', this.items.url, document.location.href);
          // url.searchParams.set('p', this.items.url);
          // window.history.pushState('page', '', url);
          // $.history.replaceUrl(url.toString());
          //
          // const url = new URL(this.items.url, document.location.origin);
          // url.searchParams.set('p', )
          // url.hostname = document.location.hostname;
          // this.title = url.pathname = url.pathname.replace(/.*(?=\b\w+\()/,'');
          // url.pathname += document.location.pathname.replace(/.*(?=\/id\/)/,'');
          // // console.log('show', this.title, this.items.url);
          // $.history.replaceUrl(url.toString())
					// this.title = this.items.url.replace(/.*\/api/,'');
					// const url = new URL(this.items.url.replace(/.*\/api/,''), document.location.origin);
					// TODO: werkt niet altijd
          // const match = document.location.pathname.match(/(\/id\/.*)/);
          // if (match) {
          //   url.pathname += match[0];
          //   $.history.replaceUrl(url.toString())
          // }
				}
				itemsVisible = [];
				this.elMeer = null;
				this.filterAttributes = {};
				if (document.getElementById('elBanner')) {
					document.getElementById('elBanner').style.display = 'none';
				}
				if (window.aThree && window.aThree.initdone) {
					return;
				}
				if ($.clipboardtree) {
					if ($.clipboardtree.elSelected) $.clipboardtree.elSelected.removeAttribute('selected');
					if ($.temp.folder) {
						var item = $.getItem($.temp.folder.substr(1).split('?').shift());
						if (item && item.elemTreeLi) ($.clipboardtree.elSelected = item.elemTreeLi).setAttribute('selected', '');
					}
				}
				// const this.viewType = document.body.getAttribute('view');
				// if (this.get.function && this.get.folder && $.config.components.schemas[this.get.folder] && $.config.components.schemas[this.get.folder][this.get.function]) {
				// 	$.config.components.schemas[this.get.folder][this.get.function](this.items);
				// }
				// this.items.sort((a, b) => { return a.index > b.index ? 1 : a.index < b.index ? -1 : 0; });
				// //console.error(this.items);
				this.items = this.items.filter(Boolean).map(item => item instanceof Item ? item : Item.get(item));
        // console.log(this.items);
        this.hasDateData = this.items.some(item => item.data.EndDateTime && item.data.StartDateTime);
        // this.hasChartData = this.items.some(item => item.data.data || (item.data.key && item.data.category && item.data.value));
        this.hasChartData = this.items.some(item => item.data.data && item.data.key);
        this.hasMapsData = this.items.some(item => item.data.Location);
        this.hasModelData = this.items.some(item => item.data.Title && item.data.linkto);
        // console.log('hasMapsData', this.hasMapsData, this.hasChartData);
				this.items.forEach((row, i) => {
					// row = row instanceof Item ? row : Item.get(row);
					// if (row.EndDateTime && row.StartDateTime) this.viewMap.set('ganth', true);
					// //console.error(row.schema, row);
					row.createListRowElement = row.createListRowElement || Item.createListRowElement;
					if (row['@id'] && Item(row['@id'])) row = this.items[i] = Item(row['@id']);
          const properties = row.schema.properties || {};
          const filternames = Object.entries(properties).filter(([name,prop])=>prop.filter);
          row.filterfields = Object.fromEntries(row.filternames.filter(name => row[name]).map(name => [name,row[name]]));
          // console.log(row.filternames, row.filterfields);
          //   Object.entries(properties)
          //   .filter(([name,prop])=>prop.filter && row[name])
          //   .map(([name,prop])=>[name, row[name]])
          // );
					row.filterfields.schemaName = row.schemaName;
          row.filterfields.hasAttach = row.hasAttach ? 'ja' : 'nee';
          // row.filterfields.test1 = 1;
          row.filterfields.state = row.state;
          // //console.log(row.state, row.State)
					// row.filterfields.lastModified = row.lastModified;
					// row.filterfields.created = row.created;
					// if (row.state && properties.state && properties.state.options && properties.state.options[row.state]) {
          //   row.stateColor = properties.state.options[row.state].color;
          // }
					//this.iconsrc = (this.files && this.files.avalue && this.files.avalue[0]) ? this.iconsrc = files.avalue[0].src : (this.class && this.class.className ? apiroot + 'img/icon/' + this.class.className + '.png' : '');
					//$.app.listitem.call(row);
					// var cfgclass = $.config.components.schemas[$.api.find(row.classID)], filterfields = {};
					$.config.components = $.config.components || {};
					$.config.components.schemas = $.config.components.schemas || {};
					var cfgclass = $.config.components.schemas[row.schema] || {};
					var filterfields = {};
					row.filtervalues = [];
					for (var attributeName in row.filterfields) {
						// //console.log(row.properties[attributeName].title);
						var fieldtitle = __(row.properties && row.properties[attributeName] && row.properties[attributeName].title ? row.properties[attributeName].title : attributeName);
						if (cfgclass && cfgclass.fields && cfgclass.fields[attributeName]) var fieldtitle = cfgclass.fields[attributeName].Title || cfgclass.fields[attributeName].placeholder || attributeName;
						row.filtervalues.push(row.filterfields[attributeName]);
						var value = String(row.filterfields[attributeName]).trim().toLowerCase();
						filterfields[attributeName] = value;
            this.filterAttributes[attributeName] = this.filterAttributes[attributeName] || {
              values: [],
              avalues: [],
              Title: fieldtitle
            };
						this.filterAttributes[attributeName].values[value] = this.filterAttributes[attributeName].values[value] || {
							value: value,
							Title: row.filterfields[attributeName],
              items: [],
							checked: false,
						};
            this.filterAttributes[attributeName].values[value].items.push(row);
					};
					row.filterfieldslower = filterfields;
				});
				if (this.viewType === 'chart' && !this.hasChartData) {
					$(document.body).attr('view', '');
				}
				this.filterFields = [];
				for (let [attributeName, attribute] of Object.entries(this.filterAttributes)) {
          attribute.name = attributeName;
          for (let [fieldvalue, value] of Object.entries(attribute.values)) {
						attribute.avalues.push(attribute.values[fieldvalue]);
					}
          // console.log(attributeName, attribute.avalues, attribute.values);
					if (attribute.avalues.length > 1 || attribute.avalues[0].cnt != this.items.length) {
            this.filterFields.push(attribute);
					}
				};
				var searchParams = new URLSearchParams(document.location.search);
				if (searchParams.has('f')) {
					this.activeFilterAttributes = JSON.parse(atob(searchParams.get('f')));
					for (var attributeName in this.activeFilterAttributes) {
						if (!(attributeName in this.filterAttributes)) {
							delete this.activeFilterAttributes[attributeName];
						} else {
							for (var i = 0, val; val = this.activeFilterAttributes[attributeName][i]; i++) if (!(val in this.filterAttributes[attributeName].values)) {
								this.activeFilterAttributes[attributeName].splice(this.activeFilterAttributes[attributeName].indexOf(val), 1);
								i--;
							}
							if (!this.activeFilterAttributes[attributeName].length) {
								delete this.activeFilterAttributes[attributeName];
							}
						}
					}
				}
				this.idxstart = 0;
				this.filterFields.sort((a, b)=> {
					return a.name.localeCompare(b.name, {}, 'numeric');
				});
				this.refilter();
			}
			return this;
    },
    sortby(sortname) {
      this.sortdir = this.sortname == sortname ? -this.sortdir : 1;
      this.sortname = sortname;
      console.debug(sortname);
      this.btns.sort.className = this.sortdir == 1 ? '' : 'asc';
      this.items.sort(function(a, b) {
        return this.sortdir * String(a[this.sortname]).localeCompare(String(b[this.sortname]), {}, 'numeric');
      }.bind(this));
      refilter();
      //this.show();
    },
    sortlist(a, b) {
      //// //console.debug('SORT', a, b);
      if (a.masterID && b.masterID && a.masterID == b.masterID) {
        if (a.index < b.index) return -1;
        if (a.index > b.index) return 1;
        return 0;
      }
      if (a.prio && b.prio && a.prio < b.prio) return -1;
      if (a.prio && b.prio && a.prio > b.prio) return 1;
      if (a.FinishDateTime && !b.FinishDateTime) return 1;
      if (!a.FinishDateTime && b.FinishDateTime) return -1;
      if (a.FinishDateTime && b.FinishDateTime) {
        if (a.FinishDateTime < b.FinishDateTime) return -1;
        if (a.FinishDateTime > b.FinishDateTime) return 1;
      }
      if (a.fav && !b.fav) return -1;
      if (!a.fav && b.fav) return 1;
      //// //console.debug(a, b);
      if (a.lastvisitDT && !b.lastvisitDT) return -1;
      if (!a.lastvisitDT && b.lastvisitDT) return 1;
      if (a.lastvisitDT && b.lastvisitDT) {
        if (a.lastvisitDT.substr(0, 10) < b.lastvisitDT.substr(0, 10)) return -1;
        if (a.lastvisitDT.substr(0, 10) > b.lastvisitDT.substr(0, 10)) return 1;
      }
      if (a.accountprice && !b.accountprice) return -1;
      if (!a.accountprice && b.accountprice) return 1;
      //if (sortname) {
      //    if (a[sortname].value < b[sortname].value) return -1;
      //    if (a[sortname].value > b[sortname].value) return 1;
      //}
      //if (a.EndDateTime && !b.EndDateTime) return -1;
      //if (!a.EndDateTime && b.EndDateTime) return 1;
      if (a.EndDateTime && b.EndDateTime) {
        if (a.EndDateTime < b.EndDateTime) return -1;
        if (a.EndDateTime > b.EndDateTime) return 1;
      }
      //if (a.StartDateTime && !b.StartDateTime) return 1;
      //if (!a.StartDateTime && b.StartDateTime) return -1;
      if (a.StartDateTime && b.StartDateTime) {
        if (a.StartDateTime < b.StartDateTime) return -1;
        if (a.StartDateTime > b.StartDateTime) return 1;
      }
      //if (a.lastvisitDT && b.lastvisitDT) {
      //    if (a.lastvisitDT < b.lastvisitDT) return -1;
      //    if (a.lastvisitDT > b.lastvisitDT) return 1;
      //}
      if (a.searchname && b.searchname) {
        var awords = a.searchname.match(/\w+/g),
        bwords = b.searchname.match(/\w+/g),
        ia = 999,
        ib = 999,
        l = $.temp.search.value.length;
        for (var i = 0, word; word = awords[i]; i++) {
          //// //console.debug(word);
          if (word.indexOf($.temp.search.value) != -1) ia = Math.min(ia, word.indexOf($.temp.search.value) + word.length - l);
          //var pos = word.indexOf($.temp.search.value);
          //ia -= pos != -1 ? l + word.length - pos : 0;
        }
        for (var i = 0, word; word = bwords[i]; i++) {
          //// //console.debug(word);
          if (word.indexOf($.temp.search.value) != -1) ib = Math.min(ib, word.indexOf($.temp.search.value) + word.length - l);
          //var pos = word.indexOf($.temp.search.value);
          //ib -= pos != -1 ? l + word.length - pos : 0;
          //ib += word.length - l + (pos != -1 ? pos - l : 0);
          //ib += pos != -1 ? pos : word.length;
          //ib += word.indexOf($.temp.search.value) || word.length;
        }
        //// //console.debug(a, a.searchname, ia, b, b.searchname, ib);
        //var ia = a.searchname.indexOf($.temp.search.value);
        //var ib = b.searchname.indexOf($.temp.search.value);
        //if (ia == -1 && ib != -1) return 1;
        //if (ia != -1 && ib == -1) return -1;
        if (ia < ib) return -1;
        if (ia > ib) return 1;
      }
      return 0;
    },
    table() {
      const properties = this.getProperties();
      const tableElem = $('table').parent(this.div.text('')).class('list').append(
        $('thead').append(
          $('tr').append(
            $('th'),
            properties.map(propertyName => $('th').class('attrlabel').ttext(propertyName)),
          ),
        ),
        $('tbody').append(
          this.itemsVisible.map(item => $('tr')
          .item(item, 'tableview')
          .on('click', event => $('view').show(item))
          .draggable()
          .append(
            $('td')
            .class('icn', item.schemaName)
            .css('color', item.schemaColor),
            properties.map(propertyName => $('td').text(item.getDisplayValue(propertyName))),
          )),
        ),
      ).resizable();
    },
		_focus(item, event) {
			//console.log(1);
			// item.elemListLi
			// return;
			$.clipboard.setItem([item], 'checked', '');
			clearTimeout(this.arrowTimeout);
			this.arrowTimeout = setTimeout(() => this.select(item), event && event.type === 'keydown' ? 500 : 0);
			$().view(item);
			// //console.log(item.tag, item.header0);
			return;
			if (newFocusElement) {
				//console.log('selectFocusElement', newFocusElement);
				const event = window.event;
				this.setFocusElement(newFocusElement, event);
				// $.view()
				return;
				//console.log(arguments.callee.name, newFocusElement);
			}
		},
		listnode(item) {
			const li = item.elemListLi;
			const [stateOption, stateOptions] = item.options('State');
			const [catOption, catOptions] = item.options('Categories');
			const iconsrc = item.iconsrc;
			let icon;
			if (iconsrc) {
				icon = $('img', {src: iconsrc || ''});
			} else if (item.gui && item.gui.global) {
				icon = $('div', 'gui global').append(
					$('div', 'object').append(
						$('div', item.tag).append(
							$('div', item.tag).append(item.gui.global),
						),
					),
				);
				// [...guiElement.attributes].forEach(attribute => {
				// 	const key = attribute.name[0].toUpperCase() + attribute.name.substr(1);
				// 	if (key === 'Class') return;
				// 	$.HttpRequest($.config.$, this['@id']).select(key).get().then(event => {
				// 		const value = String(this[key]);
				// 		guiElement.setAttribute(attribute.name, value);
				// 	})
				// 	// //console.log(key, this[key]);
				// 	// if (key in this) {
				// 	//   const value = String(this[key]);
				// 	//   if (value) {
				// 	//     childElement.setAttribute(attribute.name, value);
				// 	//     // //console.log(attribute.name, value);
				// 	//   }
				// 	// }
				// });
			}
      if (item.elemListLi) {
        item.elemListLi
  			.text('')
  			.attr('online', item.online)
  			.checked(item.checked)
  			.css('border-color', item.modColor)
  			.attr('viewstate', item.viewstate)
  			.append(
  				$('div').class('itemrow row card noselect aco').append(
  					$('i', 'modified'),
  					$('button').class('abtn stateicon').append(
  						$('i').append(
  							$('i').css('background-color', item.stateColor),
  						),
  						li.elemStateUl = $('ul').class('col').append(
  							// $('li').class('abtn').text('JAdsfg sdfg sd'),
  							// $('li').class('abtn').text('JAdsfg sdfg sd'),
  							// $('li').class('abtn').text('JAdsfg sdfg sd'),
  							// $('li').class('abtn').text('JAdsfg sdfg sd'),
  						)
  					)
  					.on('mouseenter', function (event) {
  						const rect = this.getBoundingClientRect();
  						// //console.log(window.innerHeight,rect.top,li.elemStateUl.elem,li.elemStateUl.elem.clientHeight);
  						// setTimeout(() => //console.log(window.innerHeight,rect.top,li.elemStateUl.elem,li.elemStateUl.elem.clientHeight));
  						li.elemStateUl.css('top', Math.min(rect.top, window.innerHeight-li.elemStateUl.elem.clientHeight-20)+'px').css('left', rect.left+'px');
  					}),
            // $('i', 'stateicon')
            // .contextmenu(stateOptions)
            // .on('select', event => item.state = [...event.path].find(el => el.value).value)
            // .append(
            // 	$('i').css(item.stateColor ? { style: 'background-color:' + item.stateColor } : null),
            // ),
            // ...item.schemaPath.toLowerCase().split(':'),
  					$('div')
            .class('icn itemicon', item.className)
            .css('color', item.schemaColor)
            .append(
  						icon,
  						$('div', 'bt sel').on('click', event => event.stopPropagation(item.checked ^= 1)),
  					),
  					$('div', 'col aco').append(
  						$('div', 'kop row')
  						.attr('hassrc', item.srcID ? 1 : 0)
  						// haslink: li.linkrow ? 1 : 0,
  						.attr('hasattach', item.hasAttach)
  						.attr('type', item.type) // class, copy, inherit
  						.append(
  							$('span', 'aco header title').text(item.header0),
  							$('div', 'icn hdn type').on('click', event => document.location.href = '#id=' + item.srcID),
  							$('div', 'icn del').on('click', event => item.delete()),
  							$('div', 'icn hdn attach'),
  							$('div', 'icn fav').attr('checked', item.fav).on('click', event => {
  								item.fav ^= 1;
  								event.stopPropagation();
  							}),
  							$('div', 'icn flag').on('click', event => {
  								if (!item.FinishDateTime) {
  									item.FinishDateTime = aDate().toISOString();
  								} else {
  									item.FinishDateTime = '';
  									var d = aDate();
  									d.setDate(aDate().getDate() + 6);
  									d.setHours(16, 0, 0, 0);
  									d.toLocal();
  									item.EndDateTime = d.toISOString();
  								}
  							}),
  						),
  						$('div', 'header subject', item.header1),
  						$('div', 'header preview', item.header2).append(
  							item.operations ? item.operations.map(o => $('a', '', o.title, o)) : null,
  						),
  					),
  				)
  			)
      }
			// if (this === $.pageItem) {
			// 	$(listItemElement).classAdd('pageItem');
			// }
			//if (this.hasModified = !$.clipboard.replace[this.id] || new Date($.his[this.id]) < new Date(this.modifiedDT)) createElement('DIV', { className: !$.his[this.id] ? 'created' : 'modified' });
			// kopElement.createElement(item.srcID && item.revertshow ? ['A', 'copy', { par: { id: item.srcID } }] : null);
		},
	}, TreeListview);
	function Treeview (selector) {
    this.construct(...arguments);
    selector.class('col aco atv noselect np')
    .contextmenu(this.menu)
    .append(
      $('nav', 'row top abs btnbar np').append(
        $('button').class('abtn r popout').on('click', event => {
          var url = document.location.origin;
          // var url = 'about:blank';
          const rect = this.elem.getBoundingClientRect();
          console.log(this.win);
          if (this.win) {
            console.log(this.win);
            return this.win.focus();
          }
          const win = this.win = window.open(url, null, `top=${window.screenTop},left=${window.screenLeft+document.body.clientWidth-rect.width},width=${rect.width},height=${rect.height}`);
          window.addEventListener('beforeunload', event => win.close());
          const doc = this.win.document;
          doc.open();
          doc.write(pageHtml);
          doc.close();
          const aim = $;
          win.onload = function (event) {
            const $ = this.$;
            const document = win.document;
            $(document.documentElement).class('app');
            $(document.body).class('col aim om bg').id('body').append(
              // $('section').class('row aco main').id('section_main').append(
                $('section').tree().class('aco').style('max-width:auto;'),
              // ),
              $('footer').statusbar(),
            );
            (async function () {
              await $().translate();
              await $().getApi(document.location.origin+'/api/');
              await $().login();
              if (aim().menuChildren) {
                $().tree(...aim().menuChildren);
              }
              // await $(`/Contact(${$.authProvider.sub})`).details().then(item => $().tree($.user = item));
              // console.log(aim.user.data);
              $().tree(aim.user.data);
            })()
          }
        }),
        $('button').class('abtn pin').on('click', event => {
          $(document.body).attr('tv', $(document.body).attr('tv') ? null : 0);
        }),
        // $('button', 'abtn icn close'),
      ),
			this.listElem = $('div').class('col aco oa list')
    );
		const elem = this.elem;
		const self = this;
    Object.assign(Item.prototype, {
      edit() {
        const elem = $('input')
        .parent(this.elemTreeTitle.text(''))
        .class('aco')
        .value(this.header0)
        .on('focus', event => event.stopPropagation())
        .on('change', event => this.header0 = event.target.value)
        .on('blur', event => this.elemTreeLi.emit('change'))
        .on('keydown', event => {
          event.stopPropagation();
          if (['Enter','Escape'].includes(event.key)) {
            $(event.target).emit('blur');
            this.elemTreeDiv.focus();
            event.preventDefault();
          }
        })
        .focus().select()
      },
      close(event) {
        var item = this.item || this;
        // if (item.opened) item.elemTreeLi.elemTreeDiv.setAttribute('open', item.opened = 0);
      },
      focus(event) {
        self.setFocusElement(this.elemTreeLi);
        return;
        //console.warn('FOCUS');
        return;
        // self.focusElement =
        //if (!event) event = window.event;
        //$.setfocus(navtree);
        if (self.focusElement && self.focusElement.elemTreeLi) {
          self.focusElement.elemTreeLi.removeAttribute('focus');
          // $.clipboard.items.push(self.focusElement);
        }
        // $.clipboard.cancel();
        // $.clipboard.items.forEach(function(item) {
        // 	if (!item.elemTreeLi.getAttribute('checked')) {
        // 		item.elemTreeLi.removeAttribute('checked');
        // 	}
        // });
        // $.targetItem = $.selectEndItem = self.focusItem = this;
        if (!event || event.type !== 'mousemove') {
          $.scrollIntoView(self.focusElement.elemTreeLi.elemTreeDiv.elem);
        }
        if (self.focusElement.elemTreeLi) {
          self.focusElement.elemTreeLi.setAttribute('focus', '');
          //if (!event) return;
          // if (event && event.shiftKey) {
          //   $.clipboard.items = [this];
          //   var selactive = 0;
          //   [...elem.getElementsByTagName('LI')].forEach(listItemElement => {
          //     if (listItemElement.item === $.selectStartItem) {
          //       selactive ^= 1;
          //       if ($.clipboard.items.indexOf(listItemElement.item) === -1) {
          //         $.clipboard.items.push(listItemElement.item);
          //       }
          //     }
          //     if (listItemElement.item === $.selectEndItem) {
          //       selactive ^= 1;
          //       if ($.clipboard.items.indexOf(listItemElement.item) === -1) {
          //         $.clipboard.items.push(listItemElement.item);
          //       }
          //     }
          //     if (selactive && $.clipboard.items.indexOf(listItemElement.item) === -1) {
          //       $.clipboard.items.push(listItemElement.item);
          //     }
          //   });
          //   $.clipboard.items.forEach(listItemElement => {
          //     listItemElement.elemTreeLi.setAttribute('checked', '');
          //   });
          // } else if (event && event.ctrlKey) {
          //   $.clipboard.items.push(this);
          //   $.clipboard.items.forEach(listItemElement => {
          //     listItemElement.elemTreeLi.setAttribute('checked', '');
          //   });
          // } else {
          //   $.clipboard.items = [this];
          //   $.selectStartItem = $.selectEndItem;
          // }
        }
        // //console.error($.clipboard);
      },
      setSelect(event) {
        this.focus();
        if (this.selectedElement) {
          this.selectedElement.removeAttribute('selected');
        }
        if (this.elemTreeLi) {
          (this.selectedElement = this.elemTreeLi).setAttribute('selected', '');
        }
      },
      select(event) {
        $('view').show(this);
        $().list(this.children);
        return;
        //console.log(this, event);
        this.setSelect();
        $.attr(this, 'treeselect', '');
        document.location.href = `#/${this.tag}/children/id/${btoa(this['@id'])}?$select=${$.config.listAttributes}&$filter=FinishDateTime+IS+NULL`;
        // document.location.href = `#/id/${btoa(this['@id'])}?$select=${LIST_ATTRIBUTES}&$filter=FinishDateTime+IS+NULL`;
        // //console.log('JA', btoa(this['@id']));
        // document.location.href = `#/id/${btoa(this['@id'])}`;
      },
      close(event) {
        if (this.elemTreeLi.elemTreeDiv) {
          // this.elemTreeLi.elemTreeDiv.setAttribute('open', 0);
          self.openItemsSave();
        }
      },
      async open(event) {
        return self.open(this);
      },
    });
		$(elem).extend({
			close() {
				$(document.body).attr('tv', 0);
			},
			// cancel() {
			// 	// //console.log('cancel', self.editItem);
			// 	if (self.editItem) {
			// 		self.editItem.createTreenode();
			// 		self.editItem = null;
			// 	}
			// 	return;
			// 	// if (event) return this.item.editclose();
			// 	delete Treeview.elFocus;
			// 	return;
			// 	//this.loaded = false;
			// 	// document.getElementById('ckeTop').style = "display:none;";
			// 	// document.body.appendChild(document.getElementById('ckeTop'));
			// 	if ($.pageEditElement && $.pageEditElement.parentElement === colpage) {
			// 		$.pageEditElement.remove();
			// 	}
			// 	if ($.elCover) $.temp.body.removeChild($.elCover);
			// 	//if ($.elPc) $.elPc.innerText = '';
			// },
			selitems: function() {
				//var items = [];
				$.clipboard.items.forEach(function(item) {
					$.clipitems.push(item);
					event.elemTreeLi.setAttribute('checked', event.type);
				});
			},
			keydown: {
				// Space: event => {
				// 	if (document.activeElement === document.body) {
				// 		if (self.focusElement) {
				// 			self.focusElement.item.select();
				// 		}
				// 		event.preventDefault();
				// 	}
				// },
				ArrowUp: event => this.setFocusElement(this.getPreviousElement(), event),//.focusElement ? this.focusElement.previousElementSibling : null, event),
				shift_ArrowUp: event => this.setFocusElement(this.getPreviousElement(), event),//this.focusElement ? this.focusElement.previousElementSibling : null, event),
				ArrowDown: event => this.setFocusElement(this.getNextElement(), event),//this.focusElement ? this.focusElement.nextElementSibling : null, event),
				shift_ArrowDown: event => this.setFocusElement(this.getNextElement(), event),//this.focusElement ? this.focusElement.nextElementSibling : null, event),
				shift_alt_ArrowDown: event => this.moveDown(event),
				shift_alt_ArrowUp: event => this.moveUp(event),
				ctrl_ArrowDown: event => this.moveDown(event),
				ctrl_ArrowUp: event => this.moveUp(event),
				ArrowLeft(event) {
					if (self.focusElement) {
						const item = self.focusElement.item;
						if (item.elemTreeLi.elemTreeDiv.attr('open') == 1) {
							item.elemTreeLi.elemTreeDiv.attr('open', 0);
						} else if (item.master) {
							item.master.focus();
						}
					}
				},
				ArrowRight(event) {
          return;
					// //console.log('ArrowRight', self.focusElement);
					if (self.focusElement) {
						const item = self.focusElement.item;
						// //console.log('ArrowRight', elem.keydown, elem.keydown.ArrowDown);
            //console.log(event, event.target, elem, elem.open);
						if (elem.open) return elem.open = 1;//self.open(item);
						elem.keydown.ArrowDown(event);
						item.select();
					}
				},
				shift_alt_ArrowLeft: event => this.outdent(event),
				shift_alt_ArrowRight: event => this.ident(event),
				ctrl_ArrowLeft: event => this.outdent(event),
				ctrl_ArrowRight: event => this.ident(event),
				ctrl_Delete(event) {
					if (self.focusElement) {
						const nextElement = self.focusElement.nextElementSibling || self.focusElement.previousElementSibling || self.focusElement.parentElement.parentElement;
						self.focusElement.item.delete();
						self.setFocusElement(nextElement);
					}
				},
				ctrl_Backspace(event) {
					if (self.focusElement) {
						const nextElement = self.focusElement.nextElementSibling || self.focusElement.previousElementSibling || self.focusElement.parentElement.parentElement;
						self.focusElement.item.delete();
						self.setFocusElement(nextElement);
					}
				},
				async Enter(event) {
					// toeboegen sibling
					if (document.activeElement === document.body && self.focusElement) {
						const focusItem = self.focusElement.item;
						// indien listitem niet geselcteerd, dan selecteren
						if (!self.focusElement.hasAttribute('treeselect')) {
							return focusItem.select();
						}
						const schemaName = focusItem.schemaName;
						const parentItem = focusItem.master;
						const schemaIndex = parentItem.children.filter(child => child.schemaName === schemaName).length;
						const item = await parentItem.appendItem(focusItem, {
							schemaName: schemaName,
							Title: schemaName + schemaIndex,
						});
						if (focusItem.isClass) {
							param.srcID = param.masterID = master.id;
						}
						item.focus();
						item.edit();
					}
				},
				// async ctrl_Enter(event) {
				// 	// maak een kopie van het huidige item, idem aan class
				// 	if (document.activeElement === document.body && self.focusElement) {
				// 		const focusItem = self.focusElement.item;
				// 		const schemaName = focusItem.schemaName;
				// 		const parentItem = focusItem.master;
				// 		const schemaIndex = parentItem.children.filter(child => child.schemaName === schemaName).length;
				// 		const item = await parentItem.appendItem(focusItem, {
				// 			schemaName: schemaName,
				// 			Title: schemaName + schemaIndex,
				// 		});
				// 		const sourceID = focusItem.values.Source ? focusItem.values.Source.LinkID : focusItem.ID;
				// 		item.Source = { LinkID: sourceID };
				// 		item.focus();
				// 		item.edit();
				// 	}
				// },
				async Insert(event) {
					// toevoegen child
					if (document.activeElement === document.body && self.focusElement) {
						event.preventDefault();
						//console.debug('keys.tv.Insert', self.focusElement );
						const parentElement = self.focusElement;
						const parentItem = parentElement.item;
						const schemaName = parentItem.schemaName;
						const childItem = {
							schemaName: schemaName,
							Title: schemaName,
						};
						parentItem.appendItem(null, childItem);
					}
				},
				async ctrl_Insert(event) {
					// toevoegen child derived class
					if (document.activeElement === document.body && self.focusElement) {
						const parentItem = self.focusElement.item;
						const schemaName = parentItem.schemaName;
						const schemaIndex = parentItem.children ? parentItem.children.filter(child => child.schemaName === schemaName).length : 0;
						const item = await parentItem.appendItem(null, {
							schemaName: schemaName,
							Title: schemaName + schemaIndex,
						});
						item.Src = { LinkID: parentItem.ID };
						item.focus();
						item.edit();
					}
				},
			}
		});
	}
	Treeview.prototype = Object.assign({
    childnode(child) {
			return (child.elemTreeLi = $('details'))
      .append(
				(child.elemTreeDiv = child.elemTreeLi.elemTreeDiv = $('summary'))
				.class('row', child.reltype, child.srcID == child.masterID ? 'derived' : '')
				.attr('isClass', child.isClass)
				.draggable()
				.attr('groupname', child.groupname)
        .on('click', event => this.select(child, event))
        .on('click', event => document.body.hasAttribute('tv') ? document.body.setAttribute('tv', 0) : null)
        .on('dblclick1', child.toggle)
        .on('moveup', event => this.move(event, -1))
        .on('movedown', event => this.move(event, +1))
			)
      .open($.temp.openItems.includes(child.tag))
      .item(child, 'treeview')
      .on('toggle', async event => {
				if (child.elemTreeLi.open) {
					let children = await child.children || [];
          children.sort((a, b) => a.index > b.index ? 1 : a.index < b.index ? -1 : 0 );
					child.elemTreeLi.append(
            children
            .filter(item => !(item.elemTreeLi || this.childnode(item)).elem.contains(child.elemTreeLi.elem) )
            .map(child => child.elemTreeLi || this.childnode(child))
          );
				}
				this.openItemsSave();
			})
      .on('close', event => this.close(child))
      .on('keyup', event => {
        event.preventDefault();
        event.stopPropagation();
      })
      .on('keydown', event => {
        // console.log('kd', event);
        // if (event.target.tagName === 'INPUT') return event.preventDefault();
        const keydown = {
          Space: event => {
        		if (this.focusElement) {
        			this.focusElement.item.select();
        		}
          },
          // ArrowUp: event => this.setFocusElement(this.getPreviousElement(), event),//.focusElement ? this.focusElement.previousElementSibling : null, event),
          // shift_ArrowUp: event => this.setFocusElement(this.getPreviousElement(), event),//this.focusElement ? this.focusElement.previousElementSibling : null, event),
          // ArrowDown: event => this.setFocusElement(this.getNextElement(), event),//this.focusElement ? this.focusElement.nextElementSibling : null, event),
          // shift_ArrowDown: event => this.setFocusElement(this.getNextElement(), event),//this.focusElement ? this.focusElement.nextElementSibling : null, event),
          // shift_alt_ArrowDown: event => this.moveDown(event),
          // shift_alt_ArrowUp: event => this.moveUp(event),
          // ctrl_ArrowDown: event => this.moveDown(event),
          // ctrl_ArrowUp: event => this.moveUp(event),
          ArrowLeft: event => {
            if (this.focusElement) {
              const item = this.focusElement.item;
              if (this.focusElement.open) {
                this.focusElement.open = false;
              } else if (this.focusElement.parentElement) {
                this.setFocusElement(this.focusElement.parentElement);
              }
            }
          },
          // ArrowRight(event) {
          //   return;
          //   // //console.log('ArrowRight', self.focusElement);
          //   if (self.focusElement) {
          //     const item = self.focusElement.item;
          //     // //console.log('ArrowRight', elem.keydown, elem.keydown.ArrowDown);
          //     //console.log(event, event.target, elem, elem.open);
          //     if (elem.open) return elem.open = 1;//self.open(item);
          //     elem.keydown.ArrowDown(event);
          //     item.select();
          //   }
          // },
          //
          ArrowRight: event => {
            event.preventDefault();
            event.stopPropagation();
            if (this.focusElement) {
              this.focusElement.open = true;
            }
            // child.elemTreeLi.elem.open = false;
          },
          ctrl_Enter: event => {
            //console.log('ctrl_Enter', this.focusElement);
            if (this.focusElement) {
              $()
              .copyFrom(this.focusElement.item.source || this.focusElement.item.class, this.focusElement.parentElement.item, this.focusElement.item.index)
              .then(item => setTimeout(()=>{
                  this.setFocusElement(item.elemTreeLi.elem);
                  item.edit();
                }));
            }
          },
          shift_alt_ArrowLeft: event => this.outdent(event),
          shift_alt_ArrowRight: event => this.ident(event),
          ctrl_ArrowLeft: event => this.outdent(event),
          ctrl_ArrowRight: event => this.ident(event),
          ctrl_Delete: event => {
            const nextElement = this.focusElement.nextElementSibling || this.focusElement.previousElementSibling || this.focusElement.parentElement;
            console.log('ctrl_Delete', nextElement, this.focusElement, this.focusElement.parentElement);
            this.focusElement.item.delete().then(item => setTimeout(() => this.setFocusElement(nextElement)));
          },
          Delete: event => {
            const nextElement = this.focusElement.nextElementSibling || this.focusElement.previousElementSibling || this.focusElement.parentElement;
            console.log('DELETE', nextElement);
            $.link({
              name: 'Master',
              item: this.focusElement.item,
              to: null,
              current: this.focusElement.parentElement.item,
              action: 'move',
            }).then(item => this.setFocusElement(nextElement))
          },
          ctrl_Backspace(event) {
            if (self.focusElement) {
              const nextElement = self.focusElement.nextElementSibling || self.focusElement.previousElementSibling || self.focusElement.parentElement.parentElement;
              self.focusElement.item.delete();
              self.setFocusElement(nextElement);
            }
          },
          async Enter(event) {
            // toeboegen sibling
            if (document.activeElement === document.body && self.focusElement) {
              const focusItem = self.focusElement.item;
              // indien listitem niet geselcteerd, dan selecteren
              if (!self.focusElement.hasAttribute('treeselect')) {
                return focusItem.select();
              }
              const schemaName = focusItem.schemaName;
              const parentItem = focusItem.master;
              const schemaIndex = parentItem.children.filter(child => child.schemaName === schemaName).length;
              const item = await parentItem.appendItem(focusItem, {
                schemaName: schemaName,
                Title: schemaName + schemaIndex,
              });
              if (focusItem.isClass) {
                param.srcID = param.masterID = master.id;
              }
              item.focus();
              item.edit();
            }
          },
          // async ctrl_Enter(event) {
          // 	// maak een kopie van het huidige item, idem aan class
          // 	if (document.activeElement === document.body && self.focusElement) {
          // 		const focusItem = self.focusElement.item;
          // 		const schemaName = focusItem.schemaName;
          // 		const parentItem = focusItem.master;
          // 		const schemaIndex = parentItem.children.filter(child => child.schemaName === schemaName).length;
          // 		const item = await parentItem.appendItem(focusItem, {
          // 			schemaName: schemaName,
          // 			Title: schemaName + schemaIndex,
          // 		});
          // 		const sourceID = focusItem.values.Source ? focusItem.values.Source.LinkID : focusItem.ID;
          // 		item.Source = { LinkID: sourceID };
          // 		item.focus();
          // 		item.edit();
          // 	}
          // },
          async Insert(event) {
            // toevoegen child
            if (document.activeElement === document.body && self.focusElement) {
              event.preventDefault();
              //console.debug('keys.tv.Insert', self.focusElement );
              const parentElement = self.focusElement;
              const parentItem = parentElement.item;
              const schemaName = parentItem.schemaName;
              const childItem = {
                schemaName: schemaName,
                Title: schemaName,
              };
              parentItem.appendItem(null, childItem);
            }
          },
          async ctrl_Insert(event) {
            // toevoegen child derived class
            if (document.activeElement === document.body && self.focusElement) {
              const parentItem = self.focusElement.item;
              const schemaName = parentItem.schemaName;
              const schemaIndex = parentItem.children ? parentItem.children.filter(child => child.schemaName === schemaName).length : 0;
              const item = await parentItem.appendItem(null, {
                schemaName: schemaName,
                Title: schemaName + schemaIndex,
              });
              item.Src = { LinkID: parentItem.ID };
              item.focus();
              item.edit();
            }
          },
          F2: event => {
            if (this.focusElement) {
              this.focusElement.firstChild.disabled = true;
              this.focusElement.item.edit();
            }
          }
        };
        // //console.log('DETAILS KEYDOWN', event.keyPressed, this.focusElement, keydown[event.keyPressed]);
        if (this.focusElement && keydown[event.keyPressed]) {
          event.stopPropagation();
          event.preventDefault();
          keydown[event.keyPressed](event);
        }
      })
      .on('change', event => {
        child.elemTreeLi
        .class('item', child.className)
        .hasChildren(child.hasChildren)
        .name(child.name)
        .attr('inherited', child.isInherited ? 'ja' : 'nee')
        .elemTreeDiv.text('').append(
          $('i', 'open').on('click', event => {
            event.stopPropagation();
            child.elemTreeLi.emit('toggle');
          }),
          $('i', 'state').css('background-color', child.stateColor),
          $('i').class('icn folder', child.className)
          // .src(child.data.src),
          .css('color', child.schemaColor),
          child.elemTreeTitle = $('span').class('title row aco')
          // .caption(child.header0)
					.attr('schemaPath', ((child.data||{}).schemaPath || '').split(':').slice(0,-1).join(' :'))
          .append(
            $('span').class('aco').ttext(child.header0),
            $('i').class('icn',child.type),
          )
          // .attr('flag', '')
          .on('dblclick', event => {
            event.stopPropagation();
            elem.setAttribute('sel', child.IsSelected ^= 1);
          }),
          // $('i').class('icn',child.type),
          // $('i').class('icn flag', child.EndDateTime && !child.FinishDateTime ? 'task' : ''),
        );
      })
      .emit('change')
		},
    close(item) {
			if (item.elemTreeLi && item.elemTreeLi.elemTreeDiv) {
				item.elemTreeLi.elemTreeDiv.attr('open', '0');
				this.openItemsSave();
			}
		},
    set data(data) {
			// this.show(data);
		},
    get data() {
			// return this.items;
		},
		async ident(event) {
      event.preventDefault();
      this.focusElement.previousElementSibling.open = true;
      $.link({
        name: 'Master',
        item: this.focusElement.item,
        to: this.focusElement.previousElementSibling.item,
        // current: this.focusElement.parentElement.item,
        index: 9999999,
        action: 'move',
      }).then(item => item.elemTreeLi.elemTreeDiv.scrollIntoView());
		},
		outdent(event) {
      event.preventDefault();
      const index = [...this.focusElement.parentElement.parentElement.children].indexOf(this.focusElement.parentElement) - 1;
      $.link({
        name: 'Master',
        item: this.focusElement.item,
        to: this.focusElement.parentElement.parentElement.item,
        // current: this.focusElement.parentElement.item,
        index: index + 1,
        action: 'move',
      }).then(item => item.elemTreeLi.elemTreeDiv.scrollIntoView());
		},
    openItemsSave() {
			window.localStorage.setItem(
				'openItems',
				[...this.elem.getElementsByTagName('details')]
				.filter(e => e.item && e.open)
				.map(e => e.item.tag).join()
			)
			// //console.log([...this.elem.getElementsByTagName('details')], window.localStorage.getItem('openItems'));
		},
    on(selector, context) {
			this[selector] = context;
		},
		async select(item, event) {
      event.preventDefault();
      event.stopPropagation();
      if (item.data.src) {
        $('list').load(item.data.src);
        return;
      }
      if (item.data.onclick) {
        item.data.onclick();
        return;
      }
      if (item.data.href) {
        document.location.href = '#/' + item.data.href;
        return;
      }
      this.setFocusElement(item.elemTreeLi.elem, event);
      // console.error(item);
      $().execQuery({
        l:item.data['@id'],
        v:item.data['@id'],
      });
      return;
      $('view').show(item);
      $.clipboard.setItem([item], 'treeselect', '');
      const children = await item.children || [];
      console.log('children', item.header0, children);
			$().list(children, item.header0);
		},
    show(data) {
			[...arguments].forEach(item => {
				if (typeof item === 'object') {
					item = item instanceof Item ? item : Item.get(item);
					this.listElem.append(this.childnode(item));
					//
					//
					// // //console.log(data);
					// this.item.children.push(data);
					// this.open(this.item);
					// this.setFocusElement(data.elemTreeLi);
					// //console.log('treevie.show',this, data);
					// this.DIV = data;
					// const listItemElement = data.elemTreeLi = this.topElement;
					// listItemElement.item = data;
					// data.elemTreeLi.elemTreeUl = this.topElement.createElement('UL', 'col');
					// //console.log(;)
					// this.DIV.open();
					// }
				}
			});
			return this;
		},
		toggle() {
			//console.log($(document.body).attr('tv'));
			$(document.body).attr('tv', $(document.body).attr('tv') ^ 1, true);
		},
	}, TreeListview);
	function Paint(canvas, options) {
		var self = this;
		var opts = options || {};
    this._handleMouseDown = function(event) {
	if (event.which === 1) {
		self._mouseButtonDown = true;
		self._strokeBegin(event);
	}
};
    this._handleMouseMove = function(event) {
			if (self._mouseButtonDown) {
				self._strokeUpdate(event);
			}
		};
    this._handleMouseUp = function(event) {
			if (event.which === 1 && self._mouseButtonDown) {
				self._mouseButtonDown = false;
				self._strokeEnd(event);
			}
		};
    this._handleTouchStart = function(event) {
			if (event.targetTouches.length == 1) {
				var touch = event.changedTouches[0];
				self._strokeBegin(touch);
			}
		};
    this._handleTouchMove = function(event) {
			// Prevent scrolling.
			event.preventDefault();
			var touch = event.targetTouches[0];
			self._strokeUpdate(touch);
		};
    this._handleTouchEnd = function(event) {
			var wasCanvasTouched = event.target === self._canvas;
			if (wasCanvasTouched) {
				event.preventDefault();
				self._strokeEnd(event);
			}
		};
    this._canvas = canvas;
    this._ctx = canvas.context = canvas.getContext("2d");
    // console.log(canvas);
    // canvas.width = canvas.clientWidth;
    // canvas.height = canvas.clientHeight;
    // console.log(canvas.clientWidth,canvas.offsetWidth,canvas.width,canvas.height)
    // canvas.width = 640;
    // canvas.height = 480;
      // //console.log('CANVAS', canvas.getBoundingClientRect(), canvas.height, canvas.clientWidth, canvas.clientHeight, canvas.offsetHeight)
      this.velocityFilterWeight = opts.velocityFilterWeight || 0.7;
      this.minWidth = opts.minWidth || 0.5;
      this.maxWidth = opts.maxWidth || 2.5;
      this.dotSize = opts.dotSize || function() {
        return (this.minWidth + this.maxWidth) / 2;
      };
      this.penColor = opts.penColor || "black";
      this.backgroundColor = opts.backgroundColor || "rgba(0, 0, 0, 0)";
      this.onEnd = opts.onEnd;
      this.onBegin = opts.onBegin;
      // this.clear();
      // we need add these inline so they are available to unbind while still having
      //  access to 'self' we could use _.bind but it's not worth adding a dependency
    // setTimeout(()=>{
      this._handleMouseEvents();
      this._handleTouchEvents();
    // })
	};
	Paint.prototype = {
		clear : function() {
			var ctx = this._ctx,
			canvas = this._canvas;
			ctx.fillStyle = this.backgroundColor;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			this._reset();
		},
		toDataURL : function(imageType, quality) {
			var canvas = this._canvas;
			return canvas.toDataURL.apply(canvas, arguments);
		},
		fromDataURL : function(dataUrl) {
			var self = this,
			image = new Image(),
			ratio = window.devicePixelRatio || 1,
			width = this._canvas.width / ratio,
			height = this._canvas.height / ratio;
			this._reset();
			image.src = dataUrl;
			image.onload = function() {
				self._ctx.drawImage(image, 0, 0, width, height);
			};
			this._isEmpty = false;
		},
		_strokeUpdate : function(event) {
			var point = this._createPoint(event);
			this._addPoint(point);
		},
		_strokeBegin : function(event) {
			this._reset();
			this._strokeUpdate(event);
			if (typeof this.onBegin === 'function') {
				this.onBegin(event);
			}
		},
		_strokeDraw : function(point) {
			var ctx = this._ctx,
			dotSize = typeof (this.dotSize) === 'function' ? this.dotSize() : this.dotSize;
			ctx.beginPath();
			this._drawPoint(point.x, point.y, dotSize);
			ctx.closePath();
			ctx.fill();
		},
		_strokeEnd : function(event) {
			var canDrawCurve = this.points.length > 2,
			point = this.points[0];
			if (!canDrawCurve && point) {
				this._strokeDraw(point);
			}
			if (typeof this.onEnd === 'function') {
				this.onEnd(event);
			}
		},
		_handleMouseEvents : function() {
			this._mouseButtonDown = false;
			this._canvas.addEventListener("mousedown", this._handleMouseDown);
			this._canvas.addEventListener("mousemove", this._handleMouseMove);
			document.addEventListener("mouseup", this._handleMouseUp);
		},
		_handleTouchEvents : function() {
			// Pass touch events to canvas elem on mobile IE.
			this._canvas.style.msTouchAction = 'none';
			this._canvas.addEventListener("touchstart", this._handleTouchStart);
			this._canvas.addEventListener("touchmove", this._handleTouchMove);
			document.addEventListener("touchend", this._handleTouchEnd);
		},
		on : function() {
			this._handleMouseEvents();
			this._handleTouchEvents();
		},
		off : function() {
			this._canvas.removeEventListener("mousedown", this._handleMouseDown);
			this._canvas.removeEventListener("mousemove", this._handleMouseMove);
			document.removeEventListener("mouseup", this._handleMouseUp);
			this._canvas.removeEventListener("touchstart", this._handleTouchStart);
			this._canvas.removeEventListener("touchmove", this._handleTouchMove);
			document.removeEventListener("touchend", this._handleTouchEnd);
		},
		isEmpty : function() {
			return this._isEmpty;
		},
		_reset : function() {
			this.points = [];
			this._lastVelocity = 0;
			this._lastWidth = (this.minWidth + this.maxWidth) / 2;
			this._isEmpty = true;
			this._ctx.fillStyle = this.penColor;
		},
		_createPoint : function(event) {
			var rect = this._canvas.getBoundingClientRect();
			return new Point(
				event.clientX - rect.left,
				event.clientY - rect.top
			);
		},
		_addPoint : function(point) {
			var points = this.points,
			c2, c3,
			curve, tmp;
			points.push(point);
			if (points.length > 2) {
				// To reduce the initial lag make it work with 3 points
				// by copying the first point to the beginning.
				if (points.length === 3) points.unshift(points[0]);
				tmp = this._calculateCurveControlPoints(points[0], points[1], points[2]);
				c2 = tmp.c2;
				tmp = this._calculateCurveControlPoints(points[1], points[2], points[3]);
				c3 = tmp.c1;
				curve = new Bezier(points[1], c2, c3, points[2]);
				this._addCurve(curve);
				// Remove the first elem from the list,
				// so that we always have no more than 4 points in points array.
				points.shift();
			}
		},
		_calculateCurveControlPoints : function(s1, s2, s3) {
			var dx1 = s1.x - s2.x, dy1 = s1.y - s2.y,
			dx2 = s2.x - s3.x, dy2 = s2.y - s3.y,
			m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 },
			m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 },
			l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1),
			l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2),
			dxm = (m1.x - m2.x),
			dym = (m1.y - m2.y),
			k = l2 / (l1 + l2),
			cm = { x: m2.x + dxm * k, y: m2.y + dym * k },
			tx = s2.x - cm.x,
			ty = s2.y - cm.y;
			return {
				c1: new Point(m1.x + tx, m1.y + ty),
				c2: new Point(m2.x + tx, m2.y + ty)
			};
		},
		_addCurve : function(curve) {
			var startPoint = curve.startPoint,
			endPoint = curve.endPoint,
			velocity, newWidth;
			velocity = endPoint.velocityFrom(startPoint);
			velocity = this.velocityFilterWeight * velocity
			+ (1 - this.velocityFilterWeight) * this._lastVelocity;
			newWidth = this._strokeWidth(velocity);
			this._drawCurve(curve, this._lastWidth, newWidth);
			this._lastVelocity = velocity;
			this._lastWidth = newWidth;
		},
		_drawPoint : function(x, y, size) {
			var ctx = this._ctx;
			ctx.moveTo(x, y);
			ctx.arc(x, y, size, 0, 2 * Math.PI, false);
			this._isEmpty = false;
		},
		_drawCurve : function(curve, startWidth, endWidth) {
			var ctx = this._ctx,
			widthDelta = endWidth - startWidth,
			drawSteps, width, i, t, tt, ttt, u, uu, uuu, x, y;
			drawSteps = Math.floor(curve.length());
			ctx.beginPath();
			for (i = 0; i < drawSteps; i++) {
				// Calculate the Bezier (x, y) coordinate for this step.
				t = i / drawSteps;
				tt = t * t;
				ttt = tt * t;
				u = 1 - t;
				uu = u * u;
				uuu = uu * u;
				x = uuu * curve.startPoint.x;
				x += 3 * uu * t * curve.control1.x;
				x += 3 * u * tt * curve.control2.x;
				x += ttt * curve.endPoint.x;
				y = uuu * curve.startPoint.y;
				y += 3 * uu * t * curve.control1.y;
				y += 3 * u * tt * curve.control2.y;
				y += ttt * curve.endPoint.y;
				width = startWidth + ttt * widthDelta;
				this._drawPoint(x, y, width);
			}
			ctx.closePath();
			ctx.fill();
		},
		_strokeWidth : function(velocity) {
			return Math.max(this.maxWidth / (velocity + 1), this.minWidth);
		},
	};
	function Point(x, y, time) {
		this.x = x;
		this.y = y;
		this.time = time || new Date().getTime();
	};
	Point.prototype = {
		velocityFrom : function(start) {
			return (this.time !== start.time) ? this.distanceTo(start) / (this.time - start.time) : 1;
		},
		distanceTo : function(start) {
			return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
		},
	};
	function Bezier(startPoint, control1, control2, endPoint) {
		this.startPoint = startPoint;
		this.control1 = control1;
		this.control2 = control2;
		this.endPoint = endPoint;
	};
	Bezier.prototype = {
		length : function() {
			var steps = 10,
					length = 0,
					i, t, cx, cy, px, py, xdiff, ydiff;
			for (i = 0; i <= steps; i++) {
				t = i / steps;
				cx = this._point(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
				cy = this._point(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
				if (i > 0) {
					xdiff = cx - px;
					ydiff = cy - py;
					length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
				}
				px = cx;
				py = cy;
			}
			return length;
		},
		_point : function(t, start, c1, c2, end) {
			return start * (1.0 - t) * (1.0 - t) * (1.0 - t)
						 + 3.0 * c1 * (1.0 - t) * (1.0 - t) * t
						 + 3.0 * c2 * (1.0 - t) * t * t
						 + end * t * t * t;
		},
	};
	ScriptLoader = function() {
		let loaded = [];
		let loading = [];
		let args = [];
		let callback;
		this.load = function(files) {
			if (files) {
				let difference = files.filter(x => !loaded.includes(x));
				if (!difference.length) return true;
				loading = files;
				callback = arguments.callee.caller;
				args = arguments.callee.caller.arguments;
			}
			if (!loading.length) return callback(...args);
			let src = loading.shift();
			if (loaded.includes(src)) {
				return arguments.callee();
			}
			loaded.push(src);
			//console.log('SCRIPT', src);
			document.head.createElement('script', {
				src: src,
				onload: event => arguments.callee(),
			});
		}
	};
	scriptLoader = new ScriptLoader();
	Popup = function(event) {
		// //console.log('POPUP');
		event = event || window.event;
		let targetElement = event.path.find(targetElement => targetElement.popupmenu || targetElement.contextmenu);
		//console.error('POPUP', targetElement);
		if (!targetElement) return;
		event.preventDefault();
		event.stopPropagation();
		let targetRect = targetElement.getBoundingClientRect();
		let menuItems = targetElement.popupmenu || targetElement.contextmenu;
		// let popupPageElement = targetElement.createElement('DIV', 'popupPage', { oncontextmenu: event => {
		// 	event.stopPropagation();
		// }});
		if (this.handlers.menuElement) {
			this.handlers.menuElement.remove();
		}
		let menuElement = this.handlers.menuElement = targetElement.createElement('DIV', 'col popup', { oncontextmenu: event => {
			event.stopPropagation();
		}});
		targetElement.addEventListener('mouseleave', event => {
			//console.log('mouseleave', event.target === targetElement);
			if (event.target === targetElement) {
				this.close();
			}
			// //console.log('OUT', event.target === menuElement);
		}, true);
		this.close = event => {
			menuElement.remove();
			window.removeEventListener('click', this.close, true);
		};
		// window.addEventListener('mousedown', event => {
		// 	if (event.path.find(elem => elem === menuElement)) {
		// 		return;
		// 	}
		// }, true);
		// var menu = $.mainPopup;
		if (targetElement.popupmenu) {
			targetElement.right = 0;
		}
		// //console.debug('POS', targetElement, targetRect, targetElement.left, targetElement.right);
		// //console.debug('PUMENU', this, this.menu, menu, pos);
		menuElement.innerText = '';
		for (let [menuname, menuitem] of Object.entries(menuItems)) {
			// let title = __(menuitem.header0 || menuname);
			// //console.debug('MENUITEM', menuitem, title);
			if (menuitem.hidden) continue;
			var linkElement = menuElement.createElement('A', {
				name: menuname,
				value: menuname,
				elMenu: menuElement,
				left: 5,
				menuitem: menuitem,
				popupmenu: menuitem.menu,
				// item: this.item,
				onclick: menuitem.onclick || (this.menu ? this.menu.onclick : null) || targetElement.onselect || function (event) {
					//console.log ('MENU CLICK');
					event.stopPropagation();
				},
				// onselect: this.onselect,
				onmouseenter: this.enter
			}, menuitem, {
				className: 'row abtn icn ' + (menuitem.className || menuname),
			});
			if (menuitem.color) {
				linkElement.createElement('icon', {}).style = 'background-color:' + menuitem.color;
			}
			linkElement.createElement('SPAN', 'aco', __(menuitem.header0 || menuname));
			if (menuitem.key) {
				linkElement.createElement('SPAN', '', menuitem.key);
			}
		};
		var top = targetRect.bottom;
		if ('left' in targetElement) {
			// var left = pos.right;
			var left = pos.left;
		} else if ('right' in targetElement) {
			var left = targetRect.right - menuElement.clientWidth, top = targetRect.bottom;
		} else {
			var left = event.clientX, top = event.clientY;
		}
		// //console.log(top, window.screen.availHeight, clientHeight);
		// var innerWidth = window.innerWidth;
		// window.addEventListener('resize', event => {
		// 	//console.log(event, event.currentTarget.innerWidth, event.target.innerWidth);
		// 	resizeLeft = (window.innerWidth - innerWidth) / 2;
		// 	innerWidth = window.innerWidth;
		// 	menu.left += resizeLeft;
		// 	menu.style.left = menu.left + 'px';
		// })
		left = Math.max(0, left);
		// var top = Math.max(48, Math.min(top, window.screen.availHeight - clientHeight - 10));
		menuElement.style.left = left + 'px';
		menuElement.style.top = top + 'px';
		menuElement.style.maxHeight = (window.screen.availHeight - top) + 'px';
	};
	Popup.prototype = {
		handlers: {},
		enter(event) {
			// //console.debug('ENTER', this.elMenu == $.mainPopup);
			event.stopPropagation();
			if (this.elMenu.menuitemFocused) {
				this.elMenu.menuitemFocused.removeAttribute('focus');
			}
			this.elMenu.menuitemFocused = this;
			this.elMenu.menuitemFocused.setAttribute('focus', '');
			if (this === $.mainPopup) {
				$.subPopup.elem.innerText = '';
			}
			if (this.menu) {
				$.subPopup.show.call(this);
			}
		},
	};
	function Msa(config) {
    // console.log(window.msal);
		// if (!window.msal) return this;
		// msalClient = new msal.PublicClientApplication(config);
		// const authProvider = {
		// 	getAccessToken: async () => {
		// 		const token = await this.getToken();
		// 		// //console.log('token', token)
		// 		return token;//await this.getToken();
		// 	}
		// };
		// // //console.log('authProvider', {authProvider});
		// this.graphClient = MicrosoftGraph.Client.initWithMiddleware({authProvider});
		// this.user = JSON.parse($().storage('graphUser') || '{}');
		// // //console.log('graphUser', this.user);
	}
	Msa.prototype = {
		async getUser() {
			return await this.graphClient
			.api('/me')
			// Only get the fields used by the app
			.select('id,displayName,mail,userPrincipalName,mailboxSettings')
			.get();
		},
		async getContacts() {
      console.log('getContacts');
      $()
      .url('https://outlook.office.com/api/v2.0/me/contacts?top=1000')
      .headers({
        "Authorization": "Bearer "+$.user.data.mse_access_token.Value,
        "Accept": "application/json",							// Always accept JSON response.
      })
			// this.graphClient
			// .api('/me/contacts')
			// .top(100)
			.get()
			.then(event => {
        // event.body.value.forEach(row => row.schemaName = 'msaContact');
				let items = event.body.value.map(row => row.data);
        items.forEach(row => row.schema = 'msaContact');
        items = items.map(item => Item.get(item));
        // console.log(items);
        // console.log(items);
				$().list(items);
			})
			.catch(error => {
				//console.error(error, error);
			});
		},
		async getMessages() {
			const user = this.user;
			try {
				let response = await this.graphClient
				.api('/me/messages')
				.top(50)
				.select('subject,header3,isRead,isDraft,from,flag')
				.get();
				// response.value.forEach(row => {
				// 	//console.log(JSON.stringify(Object.fromEntries(Object.entries(row).map(entry => [entry[0],{}])),null,2).replace(/"(\w+)": /gs,'$1: '));
				// });
				response.value.forEach(row => row.schema = 'msaMessage');
				$().list(response.value)
			} catch (error) {
				//console.error(error, error);
			}
		},
		async getNotes() {
			const user = this.user;
			try {
				let response = await this.graphClient
				.api('/me/onenote/notebooks')
				.top(50)
				.get();
				response.value.forEach(row => {
					//console.log(JSON.stringify(Object.fromEntries(Object.entries(row).map(entry => [entry[0],{}])),null,2).replace(/"(\w+)": /gs,'$1: '));
				});
				response.value.forEach(row => row.schema = 'msaNotebook');
				$().list(response.value)
			} catch (error) {
				//console.error(error, error);
			}
		},
		async getEvents() {
			const user = this.user;
			// Convert user's Windows time zone ("Pacific Standard Time")
			// to IANA format ("America/Los_Angeles")
			// Moment needs IANA format
			let ianaTimeZone = getIanaFromWindows(user.mailboxSettings.timeZone);
			//console.log(`Converted: ${ianaTimeZone}`);
			// Configure a calendar view for the current week
			// Get midnight on the start of the current week in the user's timezone,
			// but in UTC. For example, for Pacific Standard Time, the time value would be
			// 07:00:00Z
			let startOfWeek = moment.tz('America/Los_Angeles').startOf('week').utc();
			// Set end of the view to 7 days after start of week
			let endOfWeek = moment(startOfWeek).add(7, 'day');
			try {
				// GET /me/calendarview?startDateTime=''&endDateTime=''
				// &$select=subject,organizer,start,end
				// &$orderby=start/dateTime
				// &$top=50
				let response = await this.graphClient
				.api('/me/calendarview')
				// Set the Prefer=outlook.timezone header so date/times are in
				// user's preferred time zone
				.header("Prefer", `outlook.timezone="${user.mailboxSettings.timeZone}"`)
				// Add the startDateTime and endDateTime query parameters
				.query({ startDateTime: startOfWeek.format(), endDateTime: endOfWeek.format() })
				// Select just the fields we are interested in
				.select('subject,organizer,start,end')
				// Sort the results by start, earliest first
				.orderby('start/dateTime')
				// Maximum 50 events in response
				.top(1)
				.get();
				// response.value.forEach(row => {
				// 	//console.log(JSON.stringify(Object.fromEntries(Object.entries(row).map(entry => [entry[0],{}])),null,2).replace(/"(\w+)": /gs,'$1: '));
				// });
				response.value.forEach(row => row.schema = 'msaEvent');
				$().list(response.value)
				// updatePage(Views.calendar, response.value);
			} catch (error) {
				//console.error(error, error);
				// updatePage(Views.error, {
				// 	message: 'Error getting events',
				// 	debug: error
				// });
			}
		},
		async createNewEvent() {
			const user = this.user;
			// Get the user's input
			const subject = document.getElementById('ev-subject').value;
			const attendees = document.getElementById('ev-attendees').value;
			const start = document.getElementById('ev-start').value;
			const end = document.getElementById('ev-end').value;
			const body = document.getElementById('ev-body').value;
			// Require at least subject, start, and end
			if (!subject || !start || !end) {
				updatePage(Views.error, {
					message: 'Please provide a subject, start, and end.'
				});
				return;
			}
			// Build the JSON payload of the event
			let newEvent = {
				subject: subject,
				start: {
					dateTime: start,
					timeZone: user.mailboxSettings.timeZone
				},
				end: {
					dateTime: end,
					timeZone: user.mailboxSettings.timeZone
				}
			};
			if (attendees)
			{
				const attendeeArray = attendees.split(';');
				newEvent.attendees = [];
				for (const attendee of attendeeArray) {
					if (attendee.length > 0) {
						newEvent.attendees.push({
							type: 'required',
							emailAddress: {
								address: attendee
							}
						});
					}
				}
			}
			if (body)
			{
				newEvent.body = {
					contentType: 'text',
					content: body
				};
			}
			try {
				// POST the JSON to the /me/events endpoint
				await this.graphClient
				.api('/me/events')
				.post(newEvent);
				// Return to the calendar view
				getEvents();
			} catch (error) {
				updatePage(Views.error, {
					message: 'Error creating event',
					debug: error
				});
			}
		},
		async signIn(msalRequest) {
			// Login
			try {
				// Use MSAL to login
				$().storage('msalRequest', JSON.stringify(msalRequest));
				const authResult = await msalClient.loginPopup(msalRequest);
				//console.log('id_token acquired at: ' + new Date().toString());
				// Save the account username, needed for token acquisition
				$().storage('msalAccount', this.username = authResult.account.username);
				// Get the user's profile from Graph
				this.user = await this.getUser();
				// return;
				$().storage('graphUser', JSON.stringify(this.user));
				// updatePage(Views.home);
			} catch (error) {
				//console.error(error);
				// updatePage(Views.error, {
				// 	message: 'Error logging in',
				// 	debug: error
				// });
			}
		},
		signOut() {
			this.account = null;
			$().storage('graphUser', null);
			msalClient.logout();
		},
		async getToken() {
			let account = $().storage('msalAccount');
			if (!account){
				throw new Error(
					'User account missing from session. Please sign out and sign in again.'
				);
			}
			try {
				const msalRequest = JSON.parse($().storage('msalRequest'));
				// First, attempt to get the token silently
				const silentRequest = {
					scopes: msalRequest.scopes,
					account: msalClient.getAccountByUsername(account)
				};
				// //console.log(account, silentRequest);
				const silentResult = await msalClient.acquireTokenSilent(silentRequest);
				return silentResult.accessToken;
			} catch (silentError) {
				// If silent requests fails with InteractionRequiredAuthError,
				// attempt to get the token interactively
				if (silentError instanceof msal.InteractionRequiredAuthError) {
					const interactiveResult = await msalClient.acquireTokenPopup(msalRequest);
					return interactiveResult.accessToken;
				} else {
					throw silentError;
				}
			}
		},
		api() {
			// const res = this.graphClient.api(...arguments)
			// //console.log('API', ...arguments);
			return this.graphClient.api(...arguments)
		}
	};
	function Ganth (data, ganthElement) {
		$('link').attr('rel', 'stylesheet').attr('href', '/v1/src/css/ganth.css').parent(document.head);
		this.el = this.ganthElement = ganthElement.class('row ganth').text('');
		this.startDateTime = dateTime0(new Date());
		this.endDateTime = dateTime0(this.startDateTime, 1);
		this.bars = [];
		dw = 24;
		//console.debug('GANTH START', data);
		if (typeof data === 'string') {
			return new AIM.HttpRequest(AIM.config.$, 'GET', data, event => {
				arguments.callee(event.body, el);
			});
		}
		this.rows = data || this.data;
		this.resetview(this.rows);
		this.rows.forEach(this.writerow, this);
		this.startDateTime = dateTime0(this.startDateTime, 1-this.startDateTime.getDay());
		this.endDateTime = dateTime0(this.endDateTime, 7+8-this.endDateTime.getDay());
		// //console.log(this.startDateTime, this.startDateTime.getDay());
		// while (this.startDateTime.getDay()) {
		//   this.startDateTime.setDate(this.startDateTime.getDate() - 1);
		// }
		// this.startDateTime.setDate(this.startDateTime.getDate() + 1);
		this.bars.forEach(bar => {
			bar.left = this.left(bar.sdt);
			bar.right = this.left(bar.edt);
			bar.css('left', bar.left + 'px');
			bar.css('width', (bar.right - bar.left + 24) + 'px');
		});
		const width = ((this.endDateTime.valueOf() - this.startDateTime.valueOf()) / 3600000) + 'px';
		elGanthTop.css('width', width);
		this.chartDiv.css('width', width);
		this.closeview();
	}
	Ganth.prototype = {
		left(dt) {
			return dt && this.startDateTime ? (dt.valueOf() - dateTime0(this.startDateTime).valueOf()) / 3600000 : 0;
		},
		goToday() {
			this.ganthElement.elem.parentElement.scrollLeft = this.left(new Date()) - 200;
		},
		closeview() {
			dDag = new Date(this.startDateTime);
			for (let dDag = new Date(this.startDateTime); dDag <= this.endDateTime; dDag.setDate(dDag.getDate() + 7)) {
				$('span').parent(elGanthTop2).text('w' + dDag.getWeek()).css('width', (7 * dw) + 'px');
				endDateTime = dDag;
			}
			for (let dDag = new Date(this.startDateTime); dDag < this.endDateTime; dDag.setDate(dDag.getDate() + 1)) {
				$('span').parent(elGanthTop3).class('d d' + dDag.getDay()).text(dDag.getDate()).css('width', dw + 'px')
			}
			for (let v, iDate = 0, dDag = new Date(this.startDateTime); dDag < endDateTime; dDag.setDate(dDag.getDate() + 1)) {
				if (v != dDag.getMonth() + 1) {
					var mdays = dDag.monthDays();
					if (!v) mdays -= this.startDateTime.getDate() - 1;
					$('span').parent(elGanthTop1).text(v = (1900 + dDag.getYear()) + '-' + (dDag.getMonth() + 1)).css('width',(mdays * dw) + 'px')
				}
				iDate += dDag.getDate() + mdays;
				dDag.setDate(dDag.getDate() + mdays);
				dDag.setDate(1);
			}
			this.startDateTime = new Date(this.startDateTime);
			//elGanth.style = 'width:' + ((endDateTime - startDateTime) / 60 / 60 / 1000) + 'px;top:60px;';
			var elToday = $('span').parent(this.chartElement).class('today').attr('time', new Date().toISOString()).css('left',this.left(new Date()) + 'px');
			this.goToday(elToday);
		},
		resetview(rows) {
			this.el.text('').append(
				$('div').class('row top abs np')
				// .operations({
				// 	today: { onclick: this.goToday },
				// 	close: { className: 'r', onclick: function() { this.el.parentElement.removeChild(this.el); }.bind(this) }
				// })
				,
				$('div').class('row folders').append(
					this.elList = $('ul').class('col aco ganthrows ganthlist oa').css('margin-top:60px;overflow:scroll;')
					.on('scroll', event => this.chartDiv.elem.scrollTop = event.target.scrollTop ),
				),
				this.divGantScroll = $('div').class('col aco')
				.css('overflow:scroll hidden;')
				.on('wheel', event => event.preventDefault(this.divGantScroll.elem.scrollLeft += event.deltaY))
				.append(
					elGanthTop = $('div').class('topfixed').append(
						elGanthTop1 = $('div').class('Ganthh'),
						elGanthTop2 = $('div').class('Ganthh'),
						elGanthTop3 = $('div').class('Ganthh ganthchart'),
					),
					this.chartDiv = $('div')
					.class('col aco')
					.css('overflow:hidden scroll;')
					.append(
						this.chartElement = $('ul')
						.class('col aco ganthrows ganthchart')
					)
				),
			);
			return;
			if (plandata.pln) {
				for (var d in plandata.pln) {
					d = AIM.Date.localdate(d);
					elGanth.createElement('SPAN', 'free', {
						style: Ganthstyle(d, AIM.Date.localdate(d.valueOf() + 3600000 * 24))
					});
				}
			}
		},
		writerow(row) {
			//console.log(row);
			// row.bars = row.bars || [];
			// if (!row.StartDateTime && !row.EndDateTime) return;
			// const startDateTime = dateTime0(row.EndDateTime, -1);//row.StartDateTime ? dateTime0(row.StartDateTime) : dateTime0(row.EndDateTime, -1);//row.StartDateTime ? row.StartDateTime : dateTime0(row.EndDateTime, -1);
			// let startDateTime = String(row.StartDateTime);
			// let endDateTime = String(row.EndDateTime);
			// if (startDateTime || endDateTime) {
			//   startDateTime = startDateTime ? dateTime0(startDateTime) : dateTime0(endDateTime);
			//   endDateTime = endDateTime ? dateTime0(endDateTime) : dateTime0(startDateTime);
			//   //console.log(row.title, startDateTime, endDateTime);
			// }
			// const bar = {
			//   sdt: String(row.StartDateTime),
			//   edt: String(row.EndDateTime),
			// };
			// //console.log(row.title,bar.sdt,bar.edt);
			const elGanth = this.elGanth = this.chartElement.append(
				$('li').class(row.state || '', row.hasChildren ? 'sum' : '').append(
					elRow = $('div').class('tr tot rgl').on('click', event => AIM.URL.set({ schema: row.schema, id: row.id })).append(
						elBar = $('div').class('bar').css([row.style || ''].join(' '))
						.attr('sdt', row.startDateTime)
						.attr('edt', row.endDateTime)
						.append(
							$('span').class('title').text(row.header0 || ''),
						),
					),
				)
			);
			this.bars.push(elBar);
			var text = [row.header0 || row.id, row.header1, row.header2].join(', ').replace("\r\n", '');//.replace(row.parent ? row.parent.Title : '', '');
			row.elList = this.elList.append(
				$('li')
				.class(row.className + ' ' + (row.state || ''))
				.assign('elGanth', elGanth)
				.attr('open', row.hasChildren ? '0' : null)
				.append(
					$('div').class('tr tot rgl').text(text)
					.attr('title', [row.title || row.id, row.subject, row.summary, row.hint].join("\r\n"))
					.css(row.style || '')
					.assign('parent', row)
					.assign('elGanth', elGanth)
					.attr('level', row.level = row.level || 1)
					// .on('click', AIM.toggleopen)
					// .on('click', () => AIM.request('/id/' + btoa(row['@id'])))
					.on('open', !row.hasChildren ? null : function(openstate) {
						////console.log(this, ganthElement);
						//var parent = this.parent;
						this.ganthElement.setAttribute('open', this.parentElement.getAttribute('open'));
						//parent.bargroup.el.scrollIntoView();
						//parent.ul = { elList: parent.elList.createElement('UL'), elGanth: parent.elGanth.createElement('UL') };
						//parent.children.forEach(function(row) { if (!row.elList) Ganth.writerow.call(parent.ul, row); });
					})
				)
			);
			let sdt = elBar.attr('sdt');
			let edt = elBar.attr('edt');
			if (!sdt && !edt) {
				return;
			} else if (sdt && !edt) {
				elBar.class('endless');
			} else if (!sdt && edt) {
				elBar.class('milestone');
			}
			elBar.sdt = sdt = sdt ? dateTime0(sdt) : dateTime0(edt);
			elBar.edt = edt = edt ? dateTime0(edt) : dateTime0(sdt);
			if (this.startDateTime.valueOf() >= sdt.valueOf()) {
				this.startDateTime = sdt;
			}
			if (this.endDateTime.valueOf() <= edt.valueOf()) {
				this.endDateTime = dateTime0(edt, 1);
			}
			// row.bars.push({ StartDateTime: String(row.StartDateTime), EndDateTime: String(row.EndDateTime), title: row.title });
			//
			// with (elGanth.createElement('DIV', 'tr tot rgl', { onclick() { AIM.URL.set({ schema: row.schema, id: row.id }); }, })) {
			//   //row.bars = row.bars || [{ StartDateTime: row.StartDateTime, EndDateTime: row.EndDateTime, Title: row.Title, style: 'background:red;' }];
			//   //row.bars.push(row.bargroup = { className: 'bar group' });
			//   row.bars.forEach(bar => {
			//   });
			// }
			// if (startDateTime) {
			//
			// }
			// if (endDateTime && !startDateTime) {
			//   startDateTime = endDateTime
			// }
			// if (row.StartDateTime && row.EndDateTime) {
			// }
			////console.log('ROW', row);
			//if (row.parent) var nextSibling = row.parent.elList.nextElementSibling;
			var parent = row;
			//if (parent.id == '2752892-320') //console.log(parent.id, parent);
			if (parent.children && parent.children.length) {
				parent.ul = { elList: parent.elList.append($('ul')).assign('elGanth', parent.elList.elGanth.append($('ul'))) };
				parent.children.forEach(function(child) {
					child.parent = parent;
					writerow.call(parent.ul, child);
					parent.warning = parent.warning || child.warning;
					if (child.warning) { parent.elList.attr('warning', ''); }
				});
			}
		},
	};
	function Calendar (data, containerElement) {
		$('link').attr('rel', 'stylesheet').attr('href', '/v1/src/css/calendar.css').parent(document.head);
		this.offsetWidth = 10;
		this.elem = containerElement;
		this.items = [];
		// //console.log(containerElement, data);
		this.elem.class('row calendar');
		this.show(containerElement, data);
	}
	Calendar.prototype = {
		app: [],
		dayofweek: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'],
		maand: ['Januari', 'Februarie', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'],
		elcalender: null,
		eldag: null,
		curyear: null,
		curmonth: null,
		//init: function() {
		//    document.getElementById('nav').createElement('BUTTON', { className: "button calender" }).addEventListener("click", this.show);
		//    this.addapp(2014, 6, 6, { name: "overleg", StartDateTime: '2015-06-6 10:00:00' });
		//},
		dataDisciplines(data) {
			for (var i = 0, row; row = this.data[i]; i++) {
				////console.log(row.fields);
				var disiplines = { ME: '', HW: '', SW: '' };
				for (var n in disiplines) {
					if (row.StartDateTime && row.StartDateTime.Value) {// && row.fields[n].Value) {
						prow = { name: row.name + ' ' + n };
						prow.dend = new Date(row.StartDateTime.Value);
						prow.dend.setHours(16, 0, 0, 0);
						prow.dstart = new Date(prow.dend.getTime());
						prow.uren = row.attributes[n] ? row.attributes[n].Value : 0;
						//prow.wdgn = Math.ceil(prow.uren / (8 * row.fields.FTE.Value));
						for (var d = 1; d < prow.wdgn; d++) {
							prow.dstart = new Date(prow.dstart.getTime() - 24 * 60 * 60 * 1000);
							if (prow.dstart.getDay() == 0) prow.dstart = new Date(prow.dstart.getTime() - 24 * 60 * 60 * 1000);
							if (prow.dstart.getDay() == 6) prow.dstart = new Date(prow.dstart.getTime() - 24 * 60 * 60 * 1000);
						}
						prow.dstart.setHours(8, 0, 0, 0);
						//row.dgn = Math.floor(row.wdgn / 5) * 2 + row.wdgn;
						prow.left = (prow.dstart - dstart) / 60 / 60 / 1000;
						prow.width = (prow.dend - prow.dstart) / 60 / 60 / 1000;
						//console.log('PLANROW', prow.dend.toISOString(), 'WD', prow.wdgn, 'D', prow.dgn, prow.upd, prow.dstart.toISOString());
						if (prow.dend > maxdate) maxdate = prow.dend;
						this.items.push(prow);
					}
				}
			}
		},
		show(el, data) {
			//console.log('SHOW CAL');
			this.data = data || this.data;
			this.el = el || this.el;
			//if (!this.elcalender) {
			// dataDisciplines(data);
			this.elem.text('').append(
				this.elcalender = $('div').class("col agenda"),
				this.eldag = $('div').class("col aco").append(
					$('div').class('row top btnbar np').append(
						$('button').class('abtn previous'),
						$('button').class('abtn next'),
						$('button').class('abtn today r'),
						$('button').class('abtn workweek'),
						$('button').class('abtn week'),
						$('button').class('abtn month'),
						$('button').class('abtn close').on('click', event => this.el.parentElement.removeChild(this.el)),
					),
					//with (createElement('DIV', { className: "content col", id: "contentweek" })) {
					//createElement('DIV', { className: "weeks", id: "weeks" });
					//with (createElement('DIV', { className: 'weekview aco oa' })) {
					this.elweekheader = $('div').class('week row weekheader'),
					this.elweek = $('div').class('col aco oa'),
					//createElement('SPAN', { className: "seperator" });
				)
			);
			// this.addappdate({ name: "overleg", StartDateTime: '2017-01-30 10:00:00', EndDateTime: '2017-01-30 12:00:00' });
			// this.addappdate({ name: "overleg", StartDateTime: '2017-01-30 13:00:00', EndDateTime: '2017-01-30 14:00:00' });
			// this.addappdate({ name: "overleg", StartDateTime: '2017-01-30 13:45:00', EndDateTime: '2017-01-30 15:00:00' });
			// this.addappdate({ name: "overleg", StartDateTime: '2017-01-30 14:45:00', EndDateTime: '2017-01-30 16:00:00' });
			// this.addappdate({ name: "overleg", StartDateTime: '2017-01-31 11:00:00', EndDateTime: '2017-01-31 12:30:00' });
			// this.addappdate({ name: "overleg", StartDateTime: '2017-02-02 14:00:00', EndDateTime: '2017-02-02 16:00:00' });
			////console.log(this.app);
			this.vandaag = new Date();
			this.vandaag.setHours(0, 0, 0, 0);
			//gotodate(vandaag);
			this.gotomonth(this.vandaag);
			//}
			//screenfocus({ plan_on: false, cal_on: true });
		},
		addappdate: function(afspraak) {
			afspraak.sDt = new Date(afspraak.StartDateTime);
			afspraak.eDt = new Date(afspraak.EndDateTime);
			var jaar = afspraak.sDt.getFullYear();
			var maand = afspraak.sDt.getMonth();
			var dag = afspraak.sDt.getDate();
			if (!this.app[jaar]) this.app[jaar] = [];
			if (!this.app[jaar][maand]) this.app[jaar][maand] = [];
			if (!this.app[jaar][maand][dag]) this.app[jaar][maand][dag] = [];
			afspraak['duur'] = (afspraak.eDt - afspraak.sDt) / 60 / 1000;
			this.app[jaar][maand][dag].push(afspraak);
		},
		addapp: function(jaar, maand, dag, afspraak) {
			if (!this.app[jaar]) this.app[jaar] = [];
			if (!this.app[jaar][maand]) this.app[jaar][maand] = [];
			if (!this.app[jaar][maand][dag]) this.app[jaar][maand][dag] = [];
			afspraak['duur'] = 1;
			this.app[jaar][maand][dag].push(afspraak);
		},
		moveelement: function() {
			var deltaY = event.clientY - mouseY;
			var deltaX = event.clientX - mouseX;
			//    mouseY = event.clientY;     // Get the horizontal coordinate
			//console.log();
			if (action == 0) {
				//        dayWidth = document.getElementById("week").offsetWidth
				activeElement.style.top = Math.round((activeElementTop + deltaY) / 15) * 15 + 'px';
				//console.log(dayWidth);
				activeElement.style.left = Math.floor((activeElementLeft + deltaX) / dayWidth) * dayWidth + 'px';
			}
			else if (action == 1) {
				activeElement.style.height = Math.round((activeElementHeight + deltaY) / 15) * 15 + 'px';
			}
			else if (action == 2) {
				activeElement.style.top = Math.round((activeElementTop + deltaY) / 15) * 15 + 'px';
				activeElement.style.height = Math.round((activeElementHeight - deltaY) / 15) * 15 + 'px';
			}
		},
		agendacheckmouseup: function() {
			document.removeEventListener("mousemove", this.moveelement, true);
			document.removeEventListener("mouseup", this.agendacheckmouseup, true);
			//console.log(activeElement.parentElement.date.toDateTimeString());
			////console.log(activeElement.this.app.StartDateTime);
			var d = new Date(activeElement.parentElement.date);
			d.setHours(0);
			d.setSeconds(0);
			d.setMinutes(activeElement.offsetTop);
			if (!activeElement.app) activeElement.app = new Object;
			activeElement.app.StartDateTime = d.toDateTimeString();
			var eind = new Date(d);
			eind.setHours(0);
			eind.setSeconds(0);
			eind.setMinutes(activeElement.offsetTop + activeElement.offsetHeight);
			activeElement.app.eindDt = eind.toDateTimeString();
			//console.log(activeElement.app.StartDateTime);
			//console.log(activeElement.app.eindDt);
			//var xhr = new XMLHttpRequest();
			//xhr.open("POST", "../db/itempost.php?a=postitemfield&itemId=" + activeElement.app.itemId, true);
			//params = new FormData();
			//params.append('StartDateTime', activeElement.app.StartDateTime);
			//params.append('eindDt', activeElement.app.eindDt);
			//xhr.onload = function(event) {
			//    //console.log(this.responseText);
			//};
			//xhr.send(params);
			//return xhr;
			resizeelement = null;
			this.appcumcount();
		},
		appcumcount: function() {
			////console.log(this.app);
			if (this.app) for (var y in this.app) {
				for (var m in this.app[y]) {
					for (var d in this.app[y][m]) {
						for (var i = 0, a; a = this.app[y][m][d][i]; i++) {
							//console.log(y, m, d);
							if (a.el) {
								a.cnt = a.cnt || 1;
								a.l = a.l || 1;
								for (var j = i, a2; a2 = this.app[y][m][d][j]; j++) {
									if (a != a2) {
										////console.log(a2.sDt < a.eDt && a2.sDt > a.sDt, a2.eDt > a.sDt && a2.eDt < a.eDt, a, a2);
										if ((a2.sDt < a.eDt && a2.sDt > a.sDt) || (a2.eDt > a.sDt && a2.eDt < a.eDt)) {
											a.cnt += 1;
											a2.cnt = (a2.cnt || 1) + 1;
											a.l += 1;
											//console.log(a);
										}
									}
								}
								a.el.style.width = (100 / a.cnt) + '%';
								if (a.l > 1) a.el.style.left = (100 / a.l) + '%';
							}
						}
						////console.log(this.app[y][m][d]);
					}
				}
			}
		},
		divappointment: function(name) {
			this.el = document.createElement('DIV');
			with (this.el) {
				className = 'appointment';
				with (this.content = appendChild(document.createElement('DIV'))) {
					className = 'content';
					setAttribute("contenteditable", "true");
					innerText = name;
				}
				with (appendChild(document.createElement('DIV'))) {
					className = 'left';
					addEventListener("mousedown", function() {
						mouseY = event.clientY;     // Get the horizontal coordinate
						mouseX = event.clientX;     // Get the horizontal coordinate
						activeElement = this.parentElement;
						action = 0;
						activeElementTop = this.parentElement.offsetTop;
						activeElementLeft = this.parentElement.offsetLeft;
						activeElementHeight = this.parentElement.offsetHeight;
						document.addEventListener("mouseup", this.agendacheckmouseup, true);
						document.addEventListener("mousemove", this.moveelement, true);
					});
				}
				with (appendChild(document.createElement('DIV'))) {
					className = 'start';
					addEventListener("mousedown", function() {
						mouseY = event.clientY;     // Get the horizontal coordinate
						mouseX = event.clientX;     // Get the horizontal coordinate
						this.parentElement.style.width = '100%';
						activeElement = this.parentElement;
						action = 2;
						activeElementTop = this.parentElement.offsetTop;
						activeElementLeft = this.parentElement.offsetLeft;
						activeElementHeight = this.parentElement.offsetHeight;
						document.addEventListener("mouseup", this.agendacheckmouseup, true);
						document.addEventListener("mousemove", this.moveelement, true);
					});
				}
				with (appendChild(document.createElement('DIV'))) {
					className = 'eind';
					addEventListener("mousedown", function() {
						mouseY = event.clientY;     // Get the horizontal coordinate
						mouseX = event.clientX;     // Get the horizontal coordinate
						activeElement = this.parentElement;
						action = 1;
						activeElementHeight = this.parentElement.offsetHeight;
						document.addEventListener("mouseup", this.agendacheckmouseup, true);
						document.addEventListener("mousemove", this.moveelement, true);
					});
				}
			}
			return this.el;
		},
		newappointment: function(event) {
			//console.log('nieuw');
			if (this.innerText == '') {
				with (this.parentElement.parentElement.parentElement.appendChild(this.divappointment(''))) {
					//            value = '';
					style.top = this.offsetTop + 'px';
					this.content.focus();
					this.content.addEventListener("blur", function(event) { if (this.innerText == '') { this.parentElement.parentElement.removeChild(this.parentElement); } });
				}
			}
		},
		gotoweek: function(day) {
			//with (document.getElementById("contentweek")) {
			// this.buttons.title.innerText = startdate.getDate() + '-' + startdate.adddays(6).getDate() + ' ' + this.maand[startdate.getMonth()] + ' ' + startdate.getFullYear();
			var pd = new Date(startdate);
			this.elweekheader.text('').append(
				$('div').append(
					[0,1,2,3,4].map(d => {
						var dag = new Date(startdate);
						dag.setDate(startdate.getDate() + d);
						return $('div').text(dag.getDate() + ' ' + this.dayofweek[dag.getWeekday()]);
					})
				)
			);
			this.elweek.text('').append(
				$('div').class('row aco week weekbody').append(
					[0,1,2,3,4].map(d => {
						var divdate = $('div').class('days aco g');
						const date = new Date(pd);
						const dayWidth = this.elweek.elem.offsetWidth;
						for (var i = 0; i < 48; i++) {
							$('div').parent(divdate).text(d == 0 && i % 2 == 0 ? i / 2 : '').on('click', this.newappointment)
						}
						return divdate
					})
				)
			);
			scrollTop = Math.round((this.elweek.elem.scrollHeight - this.elweek.elem.clientHeight) / 2);
			this.appcumcount();
		},
		gotomonth: function(day) {
			////console.log('d '+day.toDateTimeString());
			firstdayofmonth = new Date(day.adddays(-day.getDate() + 1));
			////console.log('fdom '+firstdayofmonth.toDateString());
			firstdayofcalender = new Date(firstdayofmonth.adddays(-firstdayofmonth.getWeekday()));
			startdate = new Date(day.adddays(-day.getWeekday()));
			//document.getElementById("weeks").innerText = '';
			////console.log('startdate  ' + startdate.toDateTimeString());
			var pd = new Date(firstdayofcalender);
			this.elcalender.text('').append(
				$('div').class('row top').append(
					$('div').class('content').text(firstdayofmonth.getMonth()),
					$('button').class('abtn up').attr('date', firstdayofmonth).on('click', event => {
						var d = this.date.adddays(-1);
						////console.log(d.toDateString());
						Calendar.gotodate(d.adddays(-d.getDate() + 1));
					}),
					$('button').class('abtn down').attr('date', firstdayofmonth).on('click', event => {
						var d = this.date.adddays(+32);
						////console.log(d.toDateString());
						Calendar.gotodate(d.adddays(-d.getDate() + 1));
					}),
				),
				$('div').class('maand').append(
					[' ', 'M', 'D', 'W', 'D', 'V', 'Z', 'Z'].map(d => $('span').text(d)),
					['','','','',''].map((v,i) => $('div').append(
						$('span').text(pd.getWeek()),
						[0,1,2,3,4,5,6].map(
							d => $('button').class('abtn')
							.attr('date', this.date = new Date(pd), pd.setDate(pd.getDate() + 1))
							.text(pd.getDate())
							.attr("vandaag", pd.valueOf() == today.valueOf() ? '' : null)
							.attr("selected", pd.valueOf() >= startdate.valueOf() && pd.valueOf() <= startdate.adddays(4).valueOf() ? '' : null)
							.attr("othermonth", pd.getMonth() != firstdayofmonth.getMonth() ? '' : null)
							.attr("app", this.app[pd.getFullYear()] && this.app[pd.getFullYear()][pd.getMonth()] && this.app[pd.getFullYear()][pd.getMonth()][pd.getDate()] ? '' : null)
							.on('click', event => this.gotodate(this.date))
						)
					))
				),
			);
			this.gotoweek(day);
		},
		loadday: function(day) {
			var jaar = day.getFullYear();
			if (!this.app[jaar]) this.app[jaar] = [];
			var maand = day.getMonth();
			if (!this.app[jaar][maand]) this.app[jaar][maand] = [];
			var xhr = new XMLHttpRequest();
			var params = new FormData();
			params.append('start', '1-' + (maand + 1) + '-' + jaar);
			params.append('p', 'appointments');
			xhr.day = day;
			xhr.open('POST', '../db/details.php', true);
			xhr.onload = function(event) {
				////console.log(this.responseText);
				var data = JSON.parse(this.responseText);
				for (var i = 0, d; d = data[i]; i++) {
					var day = new Date(d.StartDateTime);
					////console.log(day.toString());
					addapp(day.getFullYear(), day.getMonth(), day.getDate(), d);
				}
				this.gotodate(this.day);
			}
			//xhr.send(params);
		},
		gotodate: function(day) {
			////console.log(day.toDateTimeString());
			////console.log(day.getMonth());
			if (typeof this.app[day.getFullYear()] == 'undefined' || typeof this.app[day.getFullYear()][day.getMonth()] == 'undefined') this.loadday(day);
			else if (day.getFullYear() != this.curyear || day.getMonth() != curmonth) this.gotomonth(day);
			else this.gotoweek(day);
		}
	};
	function Media() {}
	Media.prototype = {
		Audio(url) {
			return $.promise('audio', function(resolve, reject) {   // return a promise
				var audio = new Audio(url);                     // create audio wo/ src
				audio.preload = "auto";                      // intend to play through
				audio.autoplay = true;                       // autoplay when loaded
				audio.onerror = reject;                      // on error, reject
				audio.onended = resolve;                     // when done, resolve
				//audio.src = url; // just for example
				// //console.debug(audio);
			});
		},
		onscroll: function() {
			if (this.images && this.images[0]) for (var i1 = 0, imagesElement; imagesElement = this.images[i1]; i1++) {
				var files = imagesElement.files;
				if (files && files.images && files.images[files.slideIdx]) {
					if (checkVisible(files.images[files.slideIdx])) files.images[files.slideIdx].show();
					if (files.images[files.slideIdx].pause) {
						if (checkVisibleAll(files.images[files.slideIdx])) {
							if (!items.player.elPlaying) {
								player.elPlaying = files.images[files.slideIdx];
								$.player.elPlaying.play();
							}
						}
						else
						files.images[files.slideIdx].pause();
					}
				}
			}
		},
		init: function() {
			this.images = colpage.getElementsByClassName('images');
			for (var i1 = 0, imagesElement; imagesElement = this.images[i1]; i1++) {
				var files = imagesElement.files;
				imagesElement.createElement('DIV', { className: 'btr prev', files: files, onclick: function() { this.files.slide(-1); } });
				imagesElement.createElement('DIV', { className: 'btr next', files: files, onclick: function() { this.files.slide(1); } });
				if (files) {
					files.images = files.el.getElementsByClassName('aimage');
					files.slideIdx = 0;
					files.slide();
				}
			}
		},
		play: function(elPrev) {
			var c = colpage.getElementsByTagName('video');
			if (!elPrev) var start = true;
			for (var i = 0, event; event = c[i]; i++) {
				if (start && checkVisibleAll(event)) return event.play();
				if (event == elPrev) var start = true;
			}
		},
		pause: function() {
		},
	};
  function Docs() {}
  Docs.prototype = {
    async _init() {
      if (!this.index) {
        await $().url('/api/').query({request_type:'docbuild'})
        .get().then(event => {
          this.index = Object.assign($.doc, event.body.docs.index);
          const items = this.items = [];
          (function recursive(selector, context){
            if (selector) {
              if (typeof selector === 'string') {
                if (context && typeof context === 'object') {
                  if (context.src) {
                    items.push([selector.replace(/_|-/g,' '),context.src]);
                  }
                  Object.entries(context).forEach(entry => {
                    if (typeof entry[1] === 'object') {
                      recursive(...entry)
                    }
                  });
                }
              } else {
                if (Array.isArray(selector)) {
                  selector.forEach(item => recursive(item))
                } else if (selector instanceof Object) {
                  Object.entries(selector).forEach(entry => recursive(...entry));
                }
              }
            }
          })(this.index);
        });
      }
      return this;
    },
    _write(selector){
      selector = $(selector);
      if (!selector.text()) {
        selector.class('row').append(
          $('button').class('abtn abs close').attr('open', '').on('click', event => $('doc').text('')),
          this.indexLeft = $('ul').class('aco mc-menu left np oa').append(
            $('div').class('ac-header').text('Document overview'),
          ),
          this.contentElement = $('div').class('aco doc-content page counter oa'),
          $('div').class('aco mc-menu right np oa').append(
            $('div').class('ac-header').text('Table of contents'),
            this.indexElement = $('ul')
          ),
        );
        this.indexLeft.navlist(this.index);
      }
      return this;
    },
    find(search){
      const exp = search.split(' ').map(val => `(?=.*\\b${val}\\b)`).join('');
      //console.log(exp);
      const regExp = new RegExp(exp, 'i');
      return this.items.filter(item => item[0].match(regExp))
    },
		_reindex(){
			const all = [...this.contentElement.elem.querySelectorAll("h1, h2, h3")];
			const allmenu = [];
			let i = 0;
			function addChapters (ul, level) {
				for (let elem = all[i]; elem; elem = all[i]) {
					const tagLevel = Number(elem.tagName[1]);
					const title = elem.innerText;
					if (tagLevel === level) {
						$(elem).append(
							$('a').attr('name', 'chapter' + i)
						);
						var li = $('li').parent(ul).append(
							elem.a = $('a').text(elem.innerText).attr('href', '#chapter' + i).attr('open', '0').attr('target', '_self')
						);
						i++;
						allmenu.push(elem.a);
						// all.shift();
					} else if (tagLevel > level) {
						li.append(
							addChapters($('ul'), level+1)
						)
					} else {
						return ul;
					}
				}
				return ul;
			}
			let to;
			this.contentElement.elem.onscroll = event => {
				clearTimeout(to);
				to = setTimeout(() => {
					// //console.log(all, this.elem);
					let elem = all.find(elem => elem.getBoundingClientRect().top > 50);
					elem = all[all.indexOf(elem)-1];
					allmenu.forEach(a => a.attr('open', '0').attr('select', null));
					for (var p = elem.a.elem; p.tagName === 'A'; p=p.parentElement.parentElement.parentElement.firstChild) {
						p.setAttribute('select', '');
						p.setAttribute('open', '1');
					}
					// elem.li.select();
					// $()
					// let elem = all.forEach(elem => //console.log(elem.getBoundingClientRect().top));
					// //console.log(elem, elem.li);
				}, 100);
			};
			addChapters(this.indexElement.text(''), 1);
			return this;
			// return $('ul').append(...[...this.elem.querySelectorAll("h1, h2, h3")].map(elem => $('li').text(elem.innerText)))
			this.addNextPreviousButtons()
		},
		addNextPreviousButtons() {
			return;
			// Nav object
		},
		createWord(html) {
			// //console.log(html);
			var xhr = new XMLHttpRequest();
			//xhr.open('GET', this.menuitem.template, true);//'/moba/utildoc/sjabloon.mht', true);
			xhr.open('GET', '/' + $.host + '/app/mht/template.mht', true);
			xhr.responseType = 'blob';
			//xhr.menuitem = this.menuitem;
			xhr.onload = function () {
				var blob = new Blob([this.response], { type: 'text/html' });
				var reader = new FileReader();
				//reader.menuitem = this.menuitem;
				reader.onload = function () {
					var item = items[get.id], aFilename = [], s = reader.result, today = aDate().toLocaleDateString();
					s = s.split(', ')[1];
					var content = atob(s);
					content = content.replace(/=\r\n/g, '').replace(/=3D/g, '=');
					//aFilename.push(this.menuitem.Title);
					for (var fieldname in item.fields) {
						var re = new RegExp('#' + fieldname + '#', "g");
						content = content.replace(re, item.fields[fieldname].Value || '');
						if (item.fields[fieldname].kop === 0 && item.fields[fieldname].Value) aFilename.push(item.fields[fieldname].Value);
					}
					if (item.elFilesView) {
						content = content.replace('#files#', item.elFilesView.innerHTML);
					}
					var c = Document.elBody.getElementsByTagName('p');
					for (var i = 0, event; event = c[i]; i++) event.className = 'MsoNormal';
					var c = Document.elBody.getElementsByTagName('DIV');
					for (var i = 0, event; event = c[i]; i++) event.className = 'MsoNormal';
					var c = Document.elBody.getElementsByTagName('table');
					for (var i = 0, event; event = c[i]; i++) event.className = 'MsoNormalTable';
					var sIn = html || '';
					sIn = sIn.replace(/[\u00A0-\u2666]/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; });
					content = content.replace('##', sIn);
					//content = content.replace(/#Title#/g, this.menuitem.innerText);
					content = content.replace(/#today#/g, today);
					content = content.replace(/#author#/g, $.accountName);
					content = content.replace(/=/g, '=3D');
					aFilename.push($.accountName);
					aFilename.push(today);
					var s = btoa(content);
					function b64toBlob(b64Data, contentType, sliceSize) {
						contentType = contentType || '';
						sliceSize = sliceSize || 512;
						var byteCharacters = atob(b64Data);
						var byteArrays = [];
						for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
							var slice = byteCharacters.slice(offset, offset + sliceSize);
							var byteNumbers = new Array(slice.length);
							for (var i = 0; i < slice.length; i++) {
								byteNumbers[i] = slice.charCodeAt(i);
							}
							var byteArray = new Uint8Array(byteNumbers);
							byteArrays.push(byteArray);
						}
						var blob = new Blob(byteArrays, { type: contentType });
						return blob;
					}
					var blob = b64toBlob(s, 'text/html');
					url = window.URL.createObjectURL(blob);
					var link = document.createElement('A');
					link.href = url;
					link.setAttribute('download', aFilename.join(' ') + '.mht');
					link.click();
					window.URL.revokeObjectURL(url);
				};
				reader.readAsDataURL(blob);
			};
			xhr.send();
		},
		editor(event) {
			$(event.target.parentElement.previousElementSibling).editor();
		},
		request(event) {
			const url = event.target.parentElement.previousElementSibling.innerText;
			$().url(url).get().then(this.showResponse);
		},
		showResponse(event){
			const http = event.target;
			const request = event.target.request;
			let responseString = `HTTP/1.1 <b>${http.status} ${http.statusText}</b> ${http.response.length} bytes ${new Date().valueOf() - http.startTime.valueOf()}ms\r\n` + http.getAllResponseHeaders() + (http.responseText[0] === "{" ? JSON.stringify(JSON.parse(http.responseText), null, 2) : http.responseText);
			let requestString = `${request.method.toUpperCase()} ${request.URL.toString()}<br>${Object.entries(request.headers || {}).map(arr => arr[0] + ': ' + arr[1]).join('<br>')}`;
			const div = $('div').class('responsepanel').append(
				$('div').class('col').append(
					$('pre').class('code').css('white-space: pre-wrap; word-break: break-all; margin-bottom: 10px;').html(requestString),
					$('pre').class('code oa aco').html(responseString),
					$('div').append(
						$('button').class('abtn close').on('click', event => div.elem.remove())
					)
				)
			)
		},
		config(event) {
			// eval(event.target.parentElement.previousElementSibling.innerText)
			window.open(document.location.origin+document.location.pathname, 'sample');
		},
		allSamples() {
			let all = [...this.contentElement.elem.getElementsByClassName('code')];
			all.forEach(elem => {
				eval(elem.innerText);
				// //console.log('HHHHHHH');
				const formString = `$('form').properties(properties)`;
				this.contentElement.elem.insertBefore(
					$('div').class('apv').css('border:solid 1px #ccc;padding:20px;margin:10px 0;').append(
						$('form').properties(properties)
					).elem,
					elem.nextElementSibling
				);
				this.contentElement.elem.insertBefore(
					$('pre').class('code').text(`$('form').properties(properties)`).elem,
					elem.nextElementSibling
				);
				this.contentElement.elem.insertBefore(
					$('div').class('apv').css('border:solid 1px #ccc;padding:20px;margin:10px 0;').append(
						$('div').properties(properties)
					).elem,
					elem.nextElementSibling
				);
				this.contentElement.elem.insertBefore(
					$('pre').class('code').text(`$('div').properties(properties)`).elem,
					elem.nextElementSibling
				);
				// this.contentElement.elem.insertBefore(
				// 	$('pre').class('code').text(JSON.stringify(properties,null,2)).elem,
				// 	elem.nextElementSibling
				// );
			})
		}
	};
  function Chatroom(params, pageElement) {
		const MESSAGE_TYPE = {
			SDP: 'SDP',
			CANDIDATE: 'CANDIDATE',
		};
		// chatRemoteView = elem.createElement('VIDEO', '', {id: 'chatRemoteView', style: 'width:200px;height:200px;', autoplay: true, playsinline: true });
		// //console.log(params);
		const sender = {
			wall: params.wall,
			client: params.client,
		};
		let from_id = null;
		let connections = {};
		const signaling = $.WebsocketClient.conn;//new WebSocket('wss://aliconnect.nl:444');
		// pageElement.createElement('DIV', '', $.WebsocketClient.socket_id);
		const send = (message_type, content, to) => {
			//console.log('SEND_TO', message_type, to, content);
			signaling.send(JSON.stringify({
				message_type: message_type,
				content: content,
				to: to || ''
			}));
		};
		function Connection (from_id) {
			// //console.log('CREATE Connection', from_id);
			let connectionElement = null;
			this.close = () => {
				if ($(from_id) && $(from_id).parentElement) {
					$(from_id).remove();
				}
				peerConnection.close();
				connections[from_id] = null;
			};
			const createPeerConnection = (signaling) => {
				// //console.log('createPeerConnection');
				const peerConnection = new RTCPeerConnection({
					iceServers: [{ urls: 'stun:stun4.l.google.com:19302' }],
				});
				peerConnection.onconnectionstatechange  = async (event) => {
					// //console.log('onconnectionstatechange', event.target.connectionState);
					if (event.target.connectionState === 'disconnected') {
						this.close();
					}
				};
				peerConnection.onnegotiationneeded = async (event) => {
					// //console.log('onnegotiationneeded', event);
					await createAndSendOffer(signaling, peerConnection);
				};
				peerConnection.onicecandidate = (iceEvent) => {
					// //console.log('onicecandidate', event);
					if (iceEvent && iceEvent.candidate) {
						send( MESSAGE_TYPE.CANDIDATE, iceEvent.candidate, from_id );
					}
				};
				peerConnection.ontrack = (event) => {
					// DEBUG: Return zodat remove video op video object wordt getoont
					caminfo.innerText = 'Remote camera';
					pageElement.style = '';
					video.srcObject = this.stream = window.recordStream = event.streams[0];
					return;
					let connectionElement = pageElement.createElement('DIV', 'col', {id: from_id}, [['DIV', '', from_id]]);
					let remotevideo = connectionElement.createElement('VIDEO', '', {
						style: 'width:200px;height:200px;',
						autoplay: true,
						playsinline: true,
					});
					// //console.log('ontrack', event, from_id);
					if (!remotevideo.srcObject) {
						remotevideo.srcObject = this.stream = event.streams[0];
						// video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
						// video.play();
					}
					//console.log('ontrack', from_id, connections[from_id].getOffer, connections[from_id]);
					// if (!connections[from_id].getOffer) {
					// 	send ('GETOFFER', {}, from_id);
					// }
				};
				return peerConnection;
			};
			const createAndSendOffer = async () => {
				const offer = await peerConnection.createOffer();
				await peerConnection.setLocalDescription(offer);
				send( MESSAGE_TYPE.SDP, offer, from_id );
			};
			this.onmessage = async function (message_type, content) {
				// //console.log('onmessage', message_type, content);
				if (message_type === 'GETOFFER') {
					if (!window.localStream) return;
					window.localStream.getTracks().forEach(track => {
						peerConnection.addTrack(track, window.localStream)
					} );
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
						//console.log('ANSWER', from_id, connections[from_id].stream, connections[from_id]);
						return;
						// DEBUG: Code uitvoeren zodat alle clients zich aanmelden
						if (!connections[from_id].stream) {
							send ('GETOFFER', {}, from_id);
						}
					} else {
						//console.error('Unsupported SDP type.');
					}
				}
			};
			const peerConnection = createPeerConnection(signaling);
		}
		signaling.addEventListener('message', async (message) => {
			const data = JSON.parse(message.data);
			if (!data) return;
			if (data.message_type) {
				try {
					const { message_type, content, to, from } = data;
					//console.debug('MESSAGE_FROM', from, to, message_type, content);
					if (message_type === 'GETOFFER') {
						if (connections[from]) {
							connections[from].close();
						}
					}
					connections[from] = connections[from] || new Connection(from);
					connections[from].onmessage(message_type, content);
				} catch (err) {
					//console.error(err);
				}
			}
		});
		async function startChat (sender) {
			try {
				options = {
					audio: false,
					video: {
						facingMode: 'user',//shouldFaceUser ? 'user' : 'environment'
					},
				};
				var stream = window.recordStream = window.localStream = await navigator.mediaDevices.getUserMedia(options);
				//console.log('createLocalVideo');
				video.srcObject = stream;
				video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
				video.play();
				pageElement.style = '';
				caminfo.innerText = 'Your local camera';
				send( 'CAMERA_EVAIL', sender);
			} catch (err) {
				//console.error(err);
			}
		}
		pageElement = pageElement.createElement('DIV', 'col aco', {style: 'height:50px;'} );
		const caminfo = pageElement.createElement('DIV', 'caminfo' );
		const video = pageElement.createElement('VIDEO', '', {
			style: 'width:100%;',
			autoplay: true,
			playsinline: true,
			onclick() {
				//console.log('SNAP', this.paused);
				if (this.paused) {
					this.play();
				} else {
					this.pause();
				}
			}
		});
		btnbarElement = pageElement.createElement('DIV', 'btnbar');
		btnbarElement.createElement('BUTTON', 'abtn camera', {type:'button', onclick: event => startChat(sender)});
		btnbarElement.createElement('BUTTON', 'abtn snap', {type:'button', onclick: event => video.paused ? video.play() : video.pause() });
		btnbarElement.createElement('BUTTON', 'abtn record', 'start', {type:'button', onclick: event => {
			var recordedChunks = [];
			var stream = window.recordStream;
			//console.log(stream);
			var options = { mimeType: "video/webm; codecs=vp9" };
			mediaRecorder = new MediaRecorder(stream, options);
			mediaRecorder.ondataavailable = handleDataAvailable;
			mediaRecorder.start();
			let filename = new Date().toISOString().replace(/\.|-|:/g,'');
			let i=1;
			function handleDataAvailable(event) {
				// //console.log("data-available");
				if (event.data.size > 0) {
					recordedChunks.push(event.data);
					// //console.log(recordedChunks);
					download();
				} else {
					// ...
				}
			}
			const RESET_TIME = 5000;
			let resetTimeout = setTimeout(() => {
				mediaRecorder.stop();
				recordedChunks=[];
				mediaRecorder.start();
			}, RESET_TIME);
			function download() {
				// //console.log('download', mediaRecorder.state, mediaRecorder.paused)
				clearTimeout(resetTimeout);
				var blob = new Blob(recordedChunks, {
					type: "video/webm"
				});
				reader = new FileReader(),
				reader.onload = event => {
					new $.HttpRequest(
						// $.config.$,
						'post',
						'/api',
						`/?videorecorder&name=${filename+'_'+(i++)}.webm`,
						event.target.result,
						event => {
							// //console.log(event.target.responseText);
							if (mediaRecorder.state === 'recording') {
								resetTimeout = setTimeout(() => {
									mediaRecorder.stop();
									recordedChunks=[];
									mediaRecorder.start();
								}, RESET_TIME);
							}
						}
					).send();
				};
				reader.readAsDataURL(blob);
				return;
				var url = URL.createObjectURL(blob);
				var a = document.createElement("a");
				pageElement.appendChild(a);
				a.style = "display: none";
				a.href = url;
				a.download = "test.webm";
				a.click();
				window.URL.revokeObjectURL(url);
			}
		}});
		btnbarElement.createElement('BUTTON', 'abtn stop', 'stop', {type:'button', onclick: event => {
			mediaRecorder.stop();
		}});
		// pageElement.createElement('BUTTON', 'abtn record', 'stop', {type:'button', onclick: event => {
		// 	var options = { mimeType: "video/webm; codecs=vp9" };
		// 	mediaRecorder = new MediaRecorder(window.localStream, options);
		// }});
		send( 'OPTIONS', sender );
	};
  const Aliconnector = {
		/** @function Aliconnector.outlookImportMail
		*/
		outlookImportMail: function(){
			ws.send({ to: { deviceUID: $.deviceUID }, msg: { external: 'mailimport' } });
		},
		/** @function Aliconnector.outlookImportContacts
		*/
		outlookImportContacts: function(){
			ws.send({ to: { deviceUID: $.deviceUID }, msg: { external: 'mailimport' } });
		},
	};
	const Shop = {
		setCustomer: function(event) {
			if (!$.config.$ || !$.config.$.auth || !$.config.$.auth.sub) {
				return;
			}
			$.shop.customer_id = this.tag || `Contact(${$.config.$.auth.sub})`;
			// //console.log('setCustomer', event);
			if (!$.getItem($.shop.customer_id) && !event) {
				new $.HttpRequest($.config.$, 'GET', '/' + $.shop.customer_id, arguments.callee).send();
				return;
			}
			if ($.shop.customer = $.getItem($.shop.customer_id)) {
				$.shop.customer.Title = $.shop.customer.Title || $.shop.customer.Name;
				// //console.log('setCustomer', $.shop.customer);
				// //console.log($.shop.customer);
				// $.om.navtop.shop.innerText = $.auth.name == $.shop.customer.Title ? '' : $.shop.customer.Title;
				$.shop.init();
			}
		},
		data: {},
		init: function() {
			// //console.log('SHOP INIT');
			// if ($.shop.customer.Product && $.shop.customer.Product.length) return;
			new $.HttpRequest($.config.$, 'GET', '/' + $.shop.customer_id + '/Product', {
				$select: 'files, filterfields, state, Title, Subject, Summary, CatalogPrice, SalesDiscount, Stock',
				$filter: 'IsPublic eq 1',
				$order: 'Title',
			}, event => {
				// //console.log('SHOP INIT DATA', event.body);
				if (!event.body) return;
				event.body.Product = event.body.Product || [];
				// $.om.navtop.shop.setAttribute('cnt', event.body.Product.length);
				//
				// return;
				// $.shop.data = this.data.bag;
				// $.shop.items = this.data.items;
				// if ($.shop.items) for (var i = 0, item; item = $.shop.$.getItem(i]; i++) {
				// 	if (!$.getItem(item.id]) $.getItem(item.id] = $.createItem(item);
				// 	$.getItem(item.id].refresh();
				// }
				// $.shop.refresh();
			}).send();
		},
		// onload: function(event) {
		// 	// //console.log(event.target.responseText);
		// 	return;
		// 	$.shop.data = this.data.bag;
		// 	$.shop.items = this.data.items;
		// 	if ($.shop.items) for (var i = 0, item; item = $.shop.$.getItem(i]; i++) {
		// 		if (!$.getItem(item.id]) $.getItem(item.id] = $.createItem(item);
		// 		$.getItem(item.id].refresh();
		// 	}
		// 	$.shop.refresh();
		// },
		order: function() {
			new $.HttpRequest($.config.$, 'POST', '/Shop/bag/order', {
				exec: '$.shopbag', a: !$.clientID ? 'purchaseorder' : 'createorder',
				//ClientID: $.clientID || $.client.account.id,
				userID: $.auth.sub, hostID: $.auth.aud
			}, event => {
				// //console.debug('ORDER FINISH', this.post, this.responseText);
				$.shop.init();
				$.show({ apnl: 'orderdone' });
			}).send();
		},
		add: function(item, amount) {
			// //console.debug(item, amount);
			new $.HttpRequest($.config.$, 'PATCH', '/' + $.shop.customer_id, {
				Product: {
					LinkID: item.ID,
					max: 999,
					Data: amount,
				},
				// exec: '$.shopbag',
				// a: 'add',
				// //ClientID: $.clientID || $.client.account.id,
				// userID: $.auth.sub,
				// accountID: $.client.account.id,
				// itemID: id,
				// quant: quant,
			}, event => {
				// //console.debug(event.target.responseText);
				// $.shop.init();
			}).send();
			// //console.debug($.shop.data);
			// for (var i = 0; i <= 1; i++) {
			// 	var elBag = $.getItem(id].elBagCnt[i];
			// 	if (elBag) elBag.Value = quant;
			// }
		},
	};
  function Elem (elem) {
    const args = [...arguments];
    elem = this.elem = args.shift();
    this.elem.selector = this.elem.is = this;
    this.map = new Map();
    if (args.length){
      if (typeof this[elem.id] === 'function'){
        // console.debug(elem.id);
        this[elem.id](...args);
      } else {
        args.forEach(arg => {
          if (arg instanceof Object){
            Object.assign(elem, arg);
          } else if (typeof arg === 'string'){
            if ('className' in this){
              this.innerHTML = elem.innerHTML = arg;
            } else if (this.className = arg){
              elem.className = arg;
            }
          }
        })
      }
    }
  }

  [
    'parentElement',
    'nextSibling'
  ].forEach(name => Object.defineProperty(Elem.prototype, name, {
    get() {
      return this.elem[name] ? this.elem[name].is : null;
    },
    enumerable: true,
    configurable: true,
  }));
  [
    'default',
    'autoplay'
  ].forEach(name => Elem.prototype[name] = function attr() {
    return this.attr(name, '');
  });
  [
    'focus',
    'select'
  ].forEach(name => Elem.prototype[name] = function fn() {
    console.log(name, typeof this.elem[name]);
    this.elem[name](...arguments);
    // if (typeof this.elem[name] === 'function'){
    //   this.elem[name](...arguments);
    // }
    return this;
  });
  [
  'draggable'
  ].forEach(name => Elem.prototype[name] = function attrTrue() {
    return this.attr(name, true);
  });
  [
    'checked',
    'disabled',
    'hasChildren',
    'selected'
  ].forEach(name => Elem.prototype[name] = function attrIfTrue(value) {
    return this.attr(name, value ? '' : null)
  });
  [
    'accept',
    'accesskey',
    'action',
    'align',
    'allow',
    'alt',
    'async',
    'autocapitalize',
    'autocomplete',
    'autofocus',
    'background',
    'bgcolor',
    'border',
    'buffered',
    'capture',
    'challenge',
    'charset',
    'cite',
    ' class',
    'code',
    'codebase',
    'color',
    'cols',
    'colspan',
    'content',
    'contenteditable',
    'contextmenu',
    'controls',
    'coords',
    'crossorigin',
    'csp',
    'data',
    'datetime',
    'decoding',
    'defer',
    'dir',
    'dirname',
    'displayvalue',
    'download',
    'enctype',
    'enterkeyhint',
    'for',
    'form',
    'formaction',
    'formenctype',
    'formmethod',
    'formnovalidate',
    'formtarget',
    'headers',
    'height',
    'hidden',
    'high',
    'href',
    'hreflang',
    'hotkey',
    'icon',
    'id',
    'importance',
    'integrity',
    'intrinsicsize',
    'inputmode',
    'ismap',
    'itemprop',
    'keytype',
    'kind',
    'label',
    'lang',
    'language',
    'loading',
    'list',
    'loop',
    'low',
    'manifest',
    'max',
    'maxlength',
    'minlength',
    'media',
    'method',
    'min',
    'multiple',
    'muted',
    'name',
    'novalidate',
    'open',
    'optimum',
    'pattern',
    'ping',
    'placeholder',
    'poster',
    'preload',
    'radiogroup',
    'readonly',
    'referrerpolicy',
    'rel',
    'required',
    'reversed',
    'rows',
    'rowspan',
    'sandbox',
    'scope',
    'scoped',
    'shape',
    'size',
    'sizes',
    'slot',
    'span',
    'spellcheck',
    'src',
    'srcdoc',
    'srclang',
    'srcset',
    'start',
    'step',
    'style',
    'summary',
    'tabindex',
    'target',
    'tag',
    'title',
    'translate',
    'type',
    'usemap',
    'value',
    'width',
    'wrap'
  ].forEach(name => Elem.prototype[name] = function attrValue() {
    return this.attr(name, ...arguments);
  });
  [
    'click',
  ].forEach(name => Elem.prototype[name] = function exec() {
    this.elem[name](...arguments);
    return this;
  });
  [
    'submit',
  ].forEach(name => Elem.prototype[name] = function emit() {
    this.emit(name, ...arguments);
    return this;
  });
  Object.assign(Elem.prototype, {
    action() {
      return this.attr('action', ...arguments)
    },
    append() {
			this.elem = this.elem || document.body;
      // const args = [].concat(...arguments);
      // console.log(arguments, args);
      Array.from(arguments).forEach(arg => {
        if (typeof arg === 'string') {
          this.elem.append(document.createTextNode(arg));
        } else if (Array.isArray(arg)) {
          arg.forEach(arg => this.append(arg));
        } else if (arg instanceof Elem) {
          this.elem.append(arg.elem);
        } else if (arg) {
          this.elem.append(arg);
        }
      });
			// args.forEach(a => a ? this.elem.append(typeof a === 'string' ? document.createTextNode(a) : a.elem || a) : null);
			return this;
		},
    accept_scope(scope, socket_id) {
      const properties = Object.fromEntries(scope.map(val => [val, {
        name: val,
        format: 'checkbox',
        checked: 1,
      }]));
      properties.expire_time = {format: 'number', value: 3600};
      const form = $().promptform($.client.api('/oauth').query('socket_id', socket_id), this.elem, arguments.callee.name, {
        properties: properties,
        btns: {
          deny: { name: 'accept', value:'deny', type:'button' },
          allow: { name: 'accept', value:'allow', type:'submit', default: true },
        }
      })
    },
    attr(selector, context, save) {
      if (save && this.elem.id) {
        $.localAttr.set(this.elem.id, selector, context);
      }
      if (selector) {
        if (typeof selector === 'object') {
          Object.entries(selector).forEach(entry => this.attr(...entry));
        } else {
          if (arguments.length === 1) {
            return this.elem.getAttribute(selector)
          } else if (context === null || context === undefined) {
            this.elem.removeAttribute(selector)
          } else if (typeof context === 'function') {
            this.on(selector, context)
          } else if (typeof context === 'object') {
            this.elem[selector] = context;
          // } else if (selector in this.elem) {
          //   this.elem[selector] = context;
          } else {
            this.elem.setAttribute(selector, [].concat(context).join(' '))
          }
        }
      }
      return this;
    },
    assign(selector, context) {
			if (typeof selector === 'string') {
				this.elem[selector] = context;
			} else if (selector instanceof Object) {
				Object.assign(this.elem, context);
			}
			// //console.log(this.elem);
			return this;
		},
    btns(selector, context) {
      const elem = $('div').parent(this).class('row btns');
      function btn(selector, context) {
        if (typeof selector === 'object') {
          return Object.entries(selector).forEach(entry => btn(...entry));
        }
        $(context.href ? 'a' : 'button').parent(elem).class('abtn').name(selector).caption(selector).attr(context)
      }
      [].concat(...arguments).forEach(
        selector => typeof selector !== 'object' ? null : (
          selector.name
          ? btn(selector.name, selector)
          : Object.entries(selector).forEach(entry => btn(...entry))
        )
      );
      return this;
    },
    cam() {
      const video = this.video = $('video').parent(this).autoplay().on('click', event => {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      }).elem;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          try {
            video.srcObject = stream;
          } catch (error) {
            video.src = window.URL.createObjectURL(stream);
          }
          video.play();
        });
      }
      return this;
    },
    cancel() {
      this.elem.innerText;
			// if (this.elem.innerText) {
			// 	if (this.selector.contains(this.form)) {
			// 		this.form.remove();
			// 	} else {
			// 		this.selector.innerText = '';
			// 	}
			// 	return this;
			// } else {
			// 	return false;
			// }
			// el.innerText = '';
			// targetElement.item = null;
			// if ($.show) $.show({ id: 0 });
			// if (window.onWindowResize) window.onWindowResize();
		},
    caption() {
      return this.attr('caption', __(...arguments))
    },
    calendar(data) {
			new Calendar(data, this);
			return this;
		},
    chat(selector, context){
			const $chat = this.sections.get('chat', selector => {
				$().main().append(
					selector = $('section').id('chat-room').append(
						$('div').id('videos').append(
							$('video').id('self-view').attr('autoplay', ''),
							$('video').id('remote-view').attr('autoplay', ''),
						)
					),
				);
				return selector;
			});
			return this;
		},
    chart(data){
			(async () => {
        data = data.map(item => item.data).filter(item => item.data && item.key);
        let series = data.map(item => item.key).unique().map(key => Object({
          type: "ColumnSeries",
          dataFields: { valueX: key, categoryY: "category" },
          name: key,
          //fill: "#FAFAFA",
          strokeWidth: 1, stroke: '#FAFAFA',
          columns: { tooltipText: "[bold]{name}[/]\n[font-size:14px]{categoryY}: {valueX}" },
          bullets: [{ type: "LabelBullet", locationX: 0.5, label: { text: "{valueX}", fill: "black" } }],
          stacked: true,
        }));
        series.sort((a,b) => a.name.localeCompare(b.name));
        let cat = [].concat(...data.map(item => Object.keys(item.data))).unique();
        // cat =
        // console.log(cat);
        //
        //
        data = cat.map(
          category => Object.fromEntries(
            [['category', category]].concat(
              data.filter( item => item.data[category] ).map(
                item => [
                  item.key,
                  data.filter(
                    row => row.key === item.key && row.data[category]
                  ).map(
                    item => Number(item.data[category])
                  ).reduce(( a, b) => a + b)
                ]
              )
            )
          )
        );
        data.sort((a,b) => a.category.localeCompare(b.category));
        console.log(data);
				$.amcharts4core = $.amcharts4core = await this.script('/api/lib/amcharts4/core.js');
				$.amcharts4charts = $.amcharts4core = await this.script('/api/lib/amcharts4/charts.js');
				$.amcharts4animated = $.amcharts4animated = await this.script('/api/lib/amcharts4/animated.js');
				const config = {
			    cursor: { type: "XYCursor", behavior: "zoomY" },
			    legend: { type: "Legend", position: "right" },
			    scrollbarX: { type: "XYChartScrollbar", scrollbarX: "scrollbarX" },
			    yAxes: [{ type: "CategoryAxis", renderer: { minGridDistance: 20, grid: { location: 0 } }, dataFields: { category: "category" } }],
			    xAxes: [{ type: "ValueAxis" }],
          data: data,
          series: series,
          // data: Object.entries(data).map(([key,value])=>Object.assign({category:key},value)),
          // series: $.Array.unique([].concat(...Object.values(data).map(value => Object.keys(value)))).sort().map(key => Object({
					// 	type: "ColumnSeries",
					// 	dataFields: { valueX: key, categoryY: "category" },
					// 	name: key,
					// 	//fill: "#FAFAFA",
					// 	strokeWidth: 1, stroke: '#FAFAFA',
					// 	columns: { tooltipText: "[bold]{name}[/]\n[font-size:14px]{categoryY}: {valueX}" },
					// 	bullets: [{ type: "LabelBullet", locationX: 0.5, label: { text: "{valueX}", fill: "black" } }],
					// 	stacked: true,
					// })),
			  };
				var chart = am4core.createFromConfig(config, this.elem, "XYChart");
				[...this.elem.getElementsByTagName("g")].find(elem => elem.getAttribute('aria-labelledby') && elem.getAttribute('aria-labelledby').split('-').pop() === 'title').remove();
			})();
			return this;
		},
    checkbox() {
      const property = Object.assign({}, ...arguments);
      // console.log(property);
      const id = 'checkbox' + ($.temp.checkboxInt = $.temp.checkboxInt ? ++$.temp.checkboxInt : 1);
      return [
        this
        .class('check')
        .attr('id', id)
        .value(property.value)
        .name(property.name)
        .checked(property.checked),
        $('label')
        .class('aco')
        .for(id)
        .append(
          $('span')
          .ttext(property.Title || property.title || property.name)
        ),
        $('span')
        .text(property.cnt),
      ];
    },
    class(className) {
			this.elem.className = [].concat(this.elem.className.split(' '), [...arguments]).unique().join(' ').trim();
			return this;
		},
    code(content, format) {
      this.class('code');
      if (typeof content === 'function') {
        format = 'js';
        content = String(content).replace(/^(.*?)\{|\}$/g,'');
      }
      content = format && $.string[format] ? $.string[format](content) : content;
      this.elem.innerHTML = content;
      return this;
    },
    contextmenu(menu){
      // console.warn(menu);
      menu = $.extend({}, ...arguments);
      if (!menu.items) console.warn('no items', menu);
      // console.log(menu);
      const menuitems = new Map(Object.entries(menu.items));
      // console.log(menuitems);
      this.tabindex(0);
      this.on('keydown', event => {
        // console.warn('keydown', event.keyPressed);
        [...menuitems.entries()]
        .filter(([name, menuitem]) => menuitem.key === event.keyPressed && menuitem.on && menuitem.on.click)
        .forEach(([name, menuitem]) => menuitem.on.click(event));
      });
      return this;
      this.on('contextmenu', event => {
        event.preventDefault(event.stopPropagation());
        console.log(menu);
    		const targetElement = this.elem;
    		const targetRect = targetElement.getBoundingClientRect();
        var top = targetRect.bottom;
        if ('left' in menu) {
          var left = menu.left;
        } else if ('right' in menu) {
          var left = menu.right - menuElement.clientWidth;
        } else {
          var left = event.clientX;
          var top = event.clientY;
        }
        this.close = event => {
          window.removeEventListener('contextmenu', this.close, true);
          window.removeEventListener('click', this.close, true);
          window.removeEventListener('keydown', this.onKeydown, true);
          this.elemPopup.remove();
        };
        window.addEventListener('keydown', this.onKeydown = event => event.key === 'Escape' ? this.close(event) : null, true);
        // window.addEventListener('contextmenu', this.close, true);
        window.addEventListener('click', this.close, true);
        this.elemPopup = $('div')
        .parent(document.body)
        .class('col popup')
        .css('top', top+'px')
        .css('left', Math.max(0, left)+'px')
        .css('max-height', (window.screen.availHeight - top) + 'px')
        // .on('contextmenu', event => event.preventDefault(event.stopPropagation()))
        .append(
          [...menuitems.entries()].map(([name, menuitem]) => $('div').class('row abtn icn').extend(menuitem).extend({srcEvent:event})),
        );
        return;
    		if (this.handlers.menuElement) {
    			this.handlers.menuElement.remove();
    		}
    		// window.addEventListener('mousedown', event => {
    		// 	if (event.path.find(elem => elem === menuElement)) {
    		// 		return;
    		// 	}
    		// }, true);
    		// var menu = $.mainPopup;
    		if (targetElement.popupmenu) {
    			targetElement.right = 0;
    		}
    		// //console.debug('POS', targetElement, targetRect, targetElement.left, targetElement.right);
    		// //console.debug('PUMENU', this, this.menu, menu, pos);
    		menuElement.innerText = '';
    		for (let [menuname, menuitem] of Object.entries(menuItems)) {
    			// let title = __(menuitem.header0 || menuname);
    			// //console.debug('MENUITEM', menuitem, title);
    			if (menuitem.hidden) continue;
    			var linkElement = menuElement.createElement('A', {
    				name: menuname,
    				value: menuname,
    				elMenu: menuElement,
    				left: 5,
    				menuitem: menuitem,
    				popupmenu: menuitem.menu,
    				// item: this.item,
    				onclick: menuitem.onclick || (this.menu ? this.menu.onclick : null) || targetElement.onselect || function (event) {
    					//console.log ('MENU CLICK');
    					event.stopPropagation();
    				},
    				// onselect: this.onselect,
    				onmouseenter: this.enter
    			}, menuitem, {
    				className: 'row abtn icn ' + (menuitem.className || menuname),
    			});
    			if (menuitem.color) {
    				linkElement.createElement('icon', {}).style = 'background-color:' + menuitem.color;
    			}
    			linkElement.createElement('SPAN', 'aco', __(menuitem.header0 || menuname));
    			if (menuitem.key) {
    				linkElement.createElement('SPAN', '', menuitem.key);
    			}
    		};
    		var top = targetRect.bottom;
    		if ('left' in targetElement) {
    			// var left = pos.right;
    			var left = pos.left;
    		} else if ('right' in targetElement) {
    			var left = targetRect.right - menuElement.clientWidth, top = targetRect.bottom;
    		} else {
    			var left = event.clientX, top = event.clientY;
    		}
    		left = Math.max(0, left);
    		menuElement.style.left = left + 'px';
    		menuElement.style.top = top + 'px';
    		menuElement.style.maxHeight = (window.screen.availHeight - top) + 'px';
        // new Popup(event, context);
      });
			// this.elem.contextmenu = context;
			return this;
		},
    messagesPanel() {
      this.append(
        $('div')
        .class('col err')
        .append(
          $('div').class('row err hdr').append(
            $('span').class('').text(''),
            $('span').class('').text('System'),
            $('span').class('aco').text('Message'),
            $('span').class('time').text('Start'),
            $('span').class('time').text('Accept'),
            $('span').class('time').text('End'),
          ),
          $().elemMessages = $('div').class('col aco'),
        ),
      );
      return this;
    },
    css(selector, value) {
			const args = [...arguments];
			const elem = this.elem || this.selector;
			if (selector instanceof Object) {
				Object.entries(selector).forEach(entry => arguments.callee.call(this, ...entry))
			} else {
				const css = elem.style.cssText.split(';').filter(s => s.trim()).filter(s => s.split(':')[0].trim() !== selector);
        if (value === '') {
					css.push(selector);
        } else if (value === null) {
				} else {
					css.push(`${selector}:${value}`);
					// let id = elem === document.body ? '_body' : elem.id;
					// if (id) {
					// 	let css = window.localStorage.getItem('css');
					// 	css = css ? JSON.parse(css) : {};
					// 	(css[id] = css[id] || {})[selector] = value;
					// 	window.localStorage.setItem('css', JSON.stringify(css));
					// }
				}
        elem.style.cssText = css.join(';');
			}
			return this;
		},
    dark() {
      if ($().storage('dark') === null) {
        setTimeout(() => {
          const h = new Date().getHours();
          $(document.documentElement).attr('dark', h >= 20 || h <= 7 ? 1 : 0)
        }, 5000);
      } else {
        $(document.documentElement).attr('dark', $().storage('dark'));
      }
      if (this.elem.tagName === 'A') {
        this.on('click', event => $(document.documentElement).attr('dark', $().storage('dark', $().storage('dark')^1).storage('dark')));
      }
      return this;
    },
    displayvalue(selector) {
      if (this.elem.item) {
        this.text(this.elem.item.displayvalue(selector));
      }
      return this;
    },
    draw(options) {
			// this.elem = elem('CANVAS', 'aco');
			// setTimeout(() => this.paint = new Paint(this.elem, options));
      this.paint = new Paint(this.elem, options);
			// if (this.selector) {
			// 	this.selector.append(this.elem);
			// }
			// //console.log(this.elem);
			return this;
		},
    insertBefore(newNode, referenceNode) {
      console.log(newNode, referenceNode);
      this.elem.insertBefore(newNode.elem || newNode, referenceNode ? referenceNode.elem || referenceNode : null)
    },
    extend() {
      $.extend(this, ...arguments);
      return this;
    },
    edit(item) {
      console.log('EDIT', item);
      item.editing = true;
      item.onloadEdit = false;
      function stopVideo() {
        var c = document.getElementsByTagName('video');
  			for (var i = 0, event; event = c[i]; i++) {
          event.pause();
        }
      }
      function users() {
        return;
        // TODO: Item Users
        return ['A', 'c ' + row.ID, row.Value || ($.getItem(row.tag) ? $.getItem(row.tag).Title : row.ID), {
					onclick: Web.Element.onclick,
					id: row.ID,
					// innerText: row.Value || ($.getItem(row.tag] ? $.getItem(row.tag].Title : row.ID),
				},[
					['BUTTON', {
						type: 'BUTTON',
						row: row,
						onclick: $.removeUser = (event)=>{
							event.preventDefault();
							event.stopPropagation();
							// //console.log();
							new $.HttpRequest($.config.$, 'DELETE', `/${this.tag}/Users(${event.target.row.ID})`, event => {
								//console.log(event.target.responseText);
							}).send();
							event.target.parentElement.remove();
							inputElement.focus();
							return false;
						}
					}]
				]];
      }
      item.elemFiles = $('div').files(item, 'Files');
      function openDialog (accept) {
        $('input').type('file').multiple(true).accept(accept).on('change', event => {
          if (event.target.files) {
            [...event.target.files].forEach(item.elemFiles.appendFile)
          }
        }).click().remove()
      }
      const buttons = {
        attach: () => openDialog(''),
        image: () => openDialog('image/*'),
        camera: () => {
          const panelElem = $('div').parent(document.querySelector('#section_main')).class('col aco abs panel').append(
            $('nav').class('row top abs btnbar np').append(
              $('span').class('aco'),
              $('button').class('abtn freedraw').on('click', this.openFreedraw = event => {
                window.event.stopPropagation();
                buttons.freedraw().canvas.context.drawImage(this.cam.video, 0, 0, this.canvas.width, this.canvas.height);
                return this;
              }),
              $('button').class('abtn save').on('click', event => {
                window.event.stopPropagation();
                this.openFreedraw().save().closeFreedraw();
                //
                // const video = this.cam.video;
                // const canvasElem = $('canvas').parent(panelElem).width(video.videoWidth).height(video.videoHeight).draw();
                // const canvas = canvasElem.paint._canvas;
                // const context = canvasElem.paint._ctx;
                // context.drawImage(video, 0, 0, canvas.width, canvas.height);
                // canvas.toBlob(blob => {
                //   item.elemFiles.appendFile(new File([blob], `image_${new Date().toISOString().replace(/\.|:|Z|-/g,'')}.png`));
                //   // canvas.remove();
                // });
              }),
              $('button').class('abtn close').on( 'click', this.closeCam = event => panelElem.remove() )
              // this.panelElem
            ),
            this.cam = $('div').class('aco').cam()
          )
        },
        freedraw: () => {
          const panelElem = $('div').parent(document.querySelector('#section_main')).class('col aco abs panel').append(
            $('nav').class('row top abs btnbar np').append(
              $('span').class('aco'),
              $('button').class('abtn clean').on('click', event => {
                this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
              }),
              $('button').class('abtn save').on('click', this.save = event => {
                window.event.stopPropagation();
                this.canvas.toBlob(blob => {
                  item.elemFiles.appendFile(new File([blob], `image.png`));
                });
                return this;
              }),
              $('button').class('abtn close').on( 'click', this.closeFreedraw = event => panelElem.remove() )
              // this.panelElem
            ),
            this.canvasElem = $('canvas').width(640).height(480).draw()
          );
          this.canvas = this.canvasElem.elem;
          return this;
        },
        close() {
          $().send({
            body: {
              notify: {
                title: `${item.header0} modified`,
                options:  {
                  body: `Bla Bla`,
                  icon: 'https://aliconnect.nl/favicon.ico',
                  image: 'https://aliconnect.nl/shared/265090/2020/07/09/5f0719fb8fa69.png',
                  data: {
                    url: document.location.href,
                  },
                  // actions: [
                  //   {
                  //     action: 'new',
                  //     title: 'New',
                  //     // icon: 'https://aliconnect.nl/favicon.ico',
                  //   },
                  //   {
                  //     action: 'open',
                  //     title: 'Open',
                  //     // icon: 'https://aliconnect.nl/favicon.ico',
                  //   },
                  //   // {
                  //   //   action: 'gramophone-action',
                  //   //   title: 'gramophone',
                  //   //   icon: '/images/demos/action-3-128x128.png'
                  //   // },
                  //   // {
                  //   //   action: 'atom-action',
                  //   //   title: 'Atom',
                  //   //   icon: '/images/demos/action-4-128x128.png'
                  //   // }
                  // ]
                }
              }
            }
          });
          // return;
          // var notification = new Notification('sadfasd');
          // notification.onclick = function(e) {
          //   console.log('CLICKED');
          //   window.focus();
          //   // window.open("http://www.stackoverflow.com");
          //   // window.location.href = 'https://aliconnect.nl';
          // }
          // notification.onclick = event => {
          //   console.log('CLICKED');
          //   window.focus();
          // }
          // return;
          //
          // $().notify(`${item.header0} modified`, {
          //   body: `Bla Bla`,
          //   url: 'https://moba.aliconnect.nl',
          //   icon: 'https://aliconnect.nl/favicon.ico',
          //   image: 'https://aliconnect.nl/shared/265090/2020/07/09/5f0719fb8fa69.png',
          //   data: {
          //     href: document.location.href,
          //     url: 'test',
          //   },
          // });
          return $('view').show(item)
        },
      };
      const edit = $('div').parent(this).class('col aco abs').append(
        $('nav').class('row top abs btnbar np').append(
          $('span').class('aco'),
          Object.entries(buttons).map(([name, fn])=>$('button').class('abtn',name).on('click', fn))
        ),
        this.header(item),
        $('form').class('oa aco').append(
          item.elemFiles,
        ).properties(item.properties),
      );
      return this;
    },
    markup(el) {
      const replace = {
        yaml(str) {
          return str
          .replace(/\n/g, '')
          .replace(/^(.*?)(#.*?|)$/, (s,codeString,cmt) => {
            return codeString
            .replace(/^(\s*)(.+?):/, '$1<span class="hl-fn">$2</span>:')
            .replace(/: (.*?)$/, ': <span class="hl-string">$1</span>')
            + (cmt ? `<span class=hl-cmt>${cmt}</span>` : '')
          });
        }
      }
      this.elem.innerHTML = replace.yaml(this.elem.innerText);
      this.elem.markup = true;
      return this;
    },
    editor(lang) {
      // const statusBar =
      // setTimeout(() => {
      //   console.log('EDITOR', this.parentElement);
      //   this.parentElement.insertBefore($('div').text('ja'), this.nextSibling)
      // })
      // this.parentElement.insertBefore($('div').text('pos'), this.nextSibling);
      this.class('code-editor');
      const his = [];
			const elem = this.elem;
      const rectContainer = this.elem.getBoundingClientRect();
      const html = lang ? $.string[lang](elem.innerText) : elem.innerText;
      let rows;
      let selLine;
      // console.log(html);
      function toggleOpen (el, open) {
        if (open === -1) {
          return s.removeAttribute('open');
        }
        if (el.hasAttribute('open')) {
          open = open === undefined ? el.getAttribute('open') ^1 : open;
          el.setAttribute('open', open);
          for (var s = el.nextSibling;s;s = s.nextSibling) {
            if (s.level <= el.level) break;
            if (open) {
              if (s.level<=el.level+2) {
                s.removeAttribute('hide');
              }
            } else {
              s.setAttribute('hide', '');
              if (s.hasAttribute('open')) {
                s.setAttribute('open', 0);
              }
            }
          }
        }
      }
      this.on('click', e => {
        if (e.offsetX<0) {
          toggleOpen(e.target);
        }
      });
      function checkOpen(el, open = 1) {
        if (!el) return;
        el.level = el.innerText.search(/\S/);
        if (el.nextSibling) {
          el.nextSibling.level = el.nextSibling.innerText.search(/\S/);
          if (el.nextSibling.level > el.level) {
            if (!el.hasAttribute('open')) {
              el.setAttribute('open', open);
            }
          } else if (el.hasAttribute('open')) {
            el.removeAttribute('open');
          }
        } else if (el.hasAttribute('open')) {
          el.removeAttribute('open');
        }
      }
      this.text = content => {
        this.elem.innerText = '';
        this.append(content.split(/\n/).map(l => $('div').text(l).markup()));
        this.append($('div').html('<br>'));
        var children = Array.from(this.elem.children);
        children.forEach(el => {
          checkOpen(el, 0);
          if (el.level > 0) el.setAttribute('hide', '');
        });
        // this.createRows();
      }
      this.src = url => {

      }
      function caret (el) {
        const range = window.getSelection().getRangeAt(0);
        const prefix = range.cloneRange();
        prefix.selectNodeContents(el);
        prefix.setEnd(range.endContainer, range.endOffset);
        return prefix.toString().length;
      }
      function getNode (parent, pos) {
        if (parent.childNodes) {
          for (var node of parent.childNodes) {
            if (node.nodeType == Node.TEXT_NODE) {
              if (pos <= node.length) {
                return [node, pos, true];
              } else {
                pos = pos - node.length;
              }
            } else {
              var [node, pos, done] = getNode(node, pos);
              if (done) {
                return [node, pos, done];
              }
            }
          }
        }
        return [parent, pos];
      };
      function setCaret (parent, pos) {
        var [node, nodepos] = getNode(parent, pos);
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(node, nodepos);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      };

			return this
			.attr('contenteditable','')
			.attr('spellcheck',false)
			// .css("display:inline-block;width:100%;")
      .on('paste', e => {
        // console.log(e);
        e.preventDefault();
        var text = e.clipboardData.getData("text");
        document.execCommand('insertText', false, text.replace(/\r/gs,''));
        var el = e.path.find(el => el.tagName === 'DIV');
        for (var el; el; el = el.nextSibling) {
          checkOpen(el);
          $(el).markup();
          if (el.nextSibling && el.nextSibling.markup) {
            break;
          }
        }
      })
			.on('keydown', e => {
        var range = window.getSelection().getRangeAt(0);
        for (var el = range.startContainer.parentElement; el.tagName !== 'DIV'; el = el.parentElement);
        if (e.keyPressed === 'ctrl_alt_BracketLeft') {
          e.preventDefault();
          toggleOpen(el, 0)
        }
        if (e.keyPressed === 'ctrl_alt_BracketRight') {
          e.preventDefault();
          toggleOpen(el, 1)
        }
				if(e.keyCode==9 && !e.shiftKey){
					e.preventDefault();
					// document.execCommand('insertHTML', false, '&#009');
					document.execCommand('insertHTML', false, '  ');
				}
        setTimeout(() => {
          var sel = window.getSelection();
          var an = sel.focusNode;
          var range = sel.getRangeAt(0);
          for (var el = an.nodeType === 3 ? an.parentNode : an; el.tagName !== 'DIV'; el = el.parentElement);
          var children = Array.from(this.elem.children);
          const row = children.indexOf(el);
          const prefix = range.cloneRange();
          prefix.selectNodeContents(el);
          prefix.setEnd(range.endContainer, range.endOffset);
          var col = prefix.toString().length;
          $.elem.statusbar['pos'].text(`${row+1}:${col+1}`);
          var el = children[row];
          // console.log(el, sel, e.keyCode);
          if (el.hasAttribute('hide')) {
            for (var el; el && el.hasAttribute('hide'); el = e.keyCode >= 39 ? el.nextSibling : el.previousSibling);
            if (el) {
              if (e.keyCode === 37) col=el.innerText.length;
              if (e.keyCode === 39) col=0;
              var range = window.getSelection().getRangeAt(0).cloneRange();
              var [node,pos] = getNode(el, Math.min(col, el.innerText.length));
              // console.log(node,pos);
              range.setEnd(node,pos);
              if (!e.shiftKey) {
                range.setStart(node,pos);
                range.collapse(true);
              }
              sel.removeAllRanges();
              sel.addRange(range);
            }
          }
          rows = Array.from(this.elem.children);
          rows.filter(el => el.hasAttribute('selected')).forEach(el => el.removeAttribute('selected'));
          el.setAttribute('selected', '');
          checkOpen(el);
          checkOpen(el.previousElementSibling);

          // console.log('pos', row, col);
          if (!e.ctrlKey) {
            if (e.keyCode >= 0x30 || e.keyCode == 0x20) {
              const rowsOpen = children.map(el => el.getAttribute('open'));
              $(el).markup();
              console.log(el, col);
              setCaret(el, col);

              //
              //
              // // rowsOpen.forEach(i => children[i].setAttribute('open', ''));
              //
              // return;
              //
              // var content = children.map(el => el.innerText.replace(/\n$/, '')).join('\n');
              // his.push(content);
              // // console.log(content);
              // this.elem.innerText = '';
              // this.append(content.split(/\n/).map(l => $('div').html(replace.yaml(l) || '<br>')));
              // var children = Array.from(this.elem.children);
              // var el = children[row];
              //
              // setCaret(col, el);
              // // this.refresh();
              // // console.log('up');
              // // const pos = caret(elem);
              // //
              // // const range = window.getSelection().getRangeAt(0);
              // // const el = range.startContainer.parentElement;
              // // el.innerHTML = replace.yaml(el.innerText);
              // // // console.log(el, el.innerText, el.innerHTML)
              // // // Array.from(this.elem.children).forEach(el => el.innerText = el.innerText);
              // // // js(el);
              // // // this.attr('showall', 1);
              // // // this.text(elem.innerText.replace(/\n\n/gs, '\n'));
              // // // this.attr('showall', null);
              // // // elem.innerHTML = lang ? $.string[lang](elem.innerText) : elem.innerHTML;
              // // // elem.innerText = elem.innerText.replace(/\n\n/gs, '\n');
              // // setCaret(pos, elem);
            }
          }
          // this.elem.getElementsByTagName('SPAN')

        })
			})
		},
    editorCollapse(){

    },
    emit(selector, detail){
			this.elem.dispatchEvent(new CustomEvent(selector, {detail: detail}));
			return this;
		},
    exists(parent) {
			return (parent || document.documentElement).contains(this.elem)
		},
    files(item, attributeName){
      this.item = item;
      this.files = item[attributeName];
      // console.log('FILES', this.files);
      // this.files = [];
      if (this.files === 'string' && this.files[0] === '[') this.files = JSON.parse(this.files);
      if (this.files === 'string' && this.files[0] === '{') this.files = [JSON.parse(this.files)];
      if (!Array.isArray(this.files)) this.files = [];
      this.appendFile = file => $.promise( 'appendFile', callback => {
        console.log(file, file.type, file.name);
        $.client.api(`/${this.item.tag}/file`)
        .query({
          uid: this.item.data.UID,
          name: file.name,
          lastModified: file.lastModified,
          // lastModifiedDate: file.lastModifiedDate,
          size: file.size,
          type: file.type,
        })
        .post(file)
        .then(event => {
          this.files.push(event.body);
          if (event.body.type === 'application/pdf') {
            $().pdfpages(event.body.src).then(pages => {
              const textpages = pages.map(lines => lines.map(line => line.str).join("\n"));
              let words = [].concat(textpages.map(page => page.match(/\b\w+\b/gs))).map(words => words.map(word => word.toLowerCase()).unique().sort());
              console.log('PDF PAGES', words);
              $.client.api(`/${this.item.tag}/?request_type=words`).patch(words).then(event => {
                console.log('WORDS', event.target.responseText);
              })
            })
          }
          console.log(event.target.responseText, attributeName, this.files);
          // item[attributeName] = { max:999, Value: JSON.stringify(event.body) };
          item[attributeName] = JSON.stringify(this.files);
          // console.log(item[attributeName]);
          this.emit('change');
          callback(event.body);
        })
      });
      this.removeElem = (elem, event) => {
        event.stopPropagation();
        elem.remove();
        this.files = [...this.elem.getElementsByClassName('file')].map(e => e.is.get('ofile'));
        // console.log(this.files);
        item[attributeName] = JSON.stringify(this.files);
        return false;
      };
      return this.class('col files')
      .on('drop', event => {
        event.preventDefault();
        if (event.dataTransfer.files) {
          [...event.dataTransfer.files].forEach(this.appendFile)
        }
      })
      .on('dragover', event => {
        event.dataTransfer.dropEffect = 'link';
        event.preventDefault();
      })
      .on('change', event => {
        this.text('').append(
          this.imagesElem = $('div').class('row images'),
          this.attachElem = $('div').class('row attach'),
        );
        this.files.filter(Boolean).forEach(ofile => {
          let filename = ofile.src.split('/').pop();
          let ext = ofile.ext || ofile.src.split('.').pop();
          filename = filename.split('_');
          if (filename[0].length == 32) filename.shift();
          filename = filename.join('_');
          let href = ofile.src;
          if (ofile.src.match(/jpg|png|bmp|jpeg|gif|bin/i)) {
            const elem = $('span')
            .parent(this.imagesElem)
            .class('row file elplay')
            .set('ofile', ofile)
            .append(
              $('i').class('bt sel'),
              $('img').class('aimage').src(ofile.src).set('ofile', ofile),
              $('div').class('row title').append(
                $('span').class('aco').text(ofile.alt || ofile.name).title(ofile.title),
                $('i').class('abtn del').on('click', event => this.removeElem(elem, event)),
              ),
            );
            // elem.elem.ofile = ofile;
            return;
            // return elem;
            if (ofile.src) {
              this.src(ofile.src);
            }
            return this;
            const access_token = $.auth.access_token;
            const iss = $.auth.access.iss;
            if (!ofile.src) return imgElement;
            var src = (ofile.srcs || ofile.src) + '?access_token=' + access_token;
            imgElement.src = (src.indexOf('http') === -1 ? ofile.host || "https://" + iss : '') + src;
            var src = (ofile.src) + '?' + ofile.lastModifiedDate;
            imgElement.srcl = (src.indexOf('http') === -1 ? ofile.host || "https://" + iss : '') + src;
            imgElement.alt = ofile.name || '';
            // return imgElement;
            return this;
          } else if (ofile.src.match(/3ds/i)) {
            const elem = $('span')
            .parent(this.imagesElem)
            .class('row file elplay')
            .set('ofile', ofile)
            .append(
              $('i').class('bt sel'),
              $('div').class('aimage').set('ofile', ofile).width(120).height(120).tds({src: ofile.src}),
              $('div').class('row title').append(
                $('span').class('aco').text(ofile.alt || ofile.name).title(ofile.title),
                $('i').class('abtn del').on('click', event => this.removeElem(elem, event)),
              ),
            );
          } else if (ofile.src.match(/mp4|webm|mov/i)) {
            const elem = $('span')
            .parent(this.imagesElem)
            .class('row file elplay')
            .set('ofile', ofile)
            .append(
              $('i').class('bt sel'),
              $('video').class('aimage').src(ofile.src).set('ofile', ofile),
              $('div').class('row title').append(
                $('span').class('aco').text(ofile.alt || ofile.name).title(ofile.title),
                $('i').class('abtn del').on('click', event => {
                  event.stopPropagation();
                  elem.remove();
                  item[attributeName] = JSON.stringify([...this.elem.getElementsByClassName('file')].map(e => e.ofile));
                  return false;
                })
              ),
            );
          } else {
            const elem = $('a')
            .parent(this.attachElem)
            .class('row file icn file_'+ext)
            .set('ofile', ofile)
            .href(href)
            .download(ofile.name)
            .draggable()
            .on('click', event => {
              if (ext === 'pdf') {
                const href = ofile.host + ofile.src;
                const iframeElem = $('view').append(
                  $('div').class('col aco iframe').append(
                    $('iframe').class('aco').src(href),
                    $('button').class('abtn close abs').on('click', event => iframeElem.remove()),
                  )
                );
                return false;
              }
            })
            .append(
              $('div').class('col aco').target('file').draggable().append(
                $('div').class('row title').append(
                  $('span').class('aco').text(ofile.alt || ofile.name).title(ofile.title),
                  $('i').class('abtn del').on('click', event => this.removeElem(elem, event)),
                ),
                $('div').class('row dt').append(
                  $('span').class('aco').text(ofile.size ? Math.round(ofile.size / 1000) + 'kB' : ''),
                  $('i').class('abtn download').href(href).download(ofile.name).on('click', event => {
                    event.stopPropagation();
                    if ($().aliconnector_id && href.match(/(.doc|.docx|.xls|.xlsx)$/)) {
                      event.preventDefault();
                      console.log(href);
                      $().ws().sendto($().aliconnector_id, {external: {filedownload: ['http://alicon.nl'+href]}}).then(event => {
                        console.log(event);
                      });
                    }
                  }),
                  // el.elModDate = createElement('SPAN', { className: 'aco', innerText: (ofile.lastModifiedDate ? new Date(ofile.lastModifiedDate).toLocaleString() + ' ' : '') + ((ofile.size) ? Math.round(ofile.size / 1000) + 'kB' : '') });
                  // if (hasEdit) {
                  // 	createElement('A', 'abtn pulldown', { popupmenu: {
                  // 		bewerken: {
                  // 			Title: 'Bewerken',
                  // 			onclick: editFile,
                  // 		},
                  // 	} });
                  // }
                ),
              ),
            );
            elem.elem.ofile = ofile;
            // return elem;
          }
        })
      })
      .emit('change')
    },
		filesNext() {
			this.filesSlide(1);
			if (this.slideIdx == 0 && get.pv) {
				//// //console.debug('NEXT PAGE');
			}
		},
		filesSlide(step) {
			//var elSlide = this.images[this.slideIdx];
			//if (elSlide) {
			//    if (elSlide.pause) this.elSlide.pause();
			//    elSlide.parentElement.removeAttribute('show');
			//}
			this.images = this.elem.getElementsByClassName('aimage');
			//// //console.debug('IMAGES', this.images);
			this.slideIdx += step || 0;
			this.imagesElement.setAttribute('prev', this.slideIdx > 0);
			this.imagesElement.setAttribute('next', this.slideIdx < this.images.length - 1);
			//if (this.slideIdx == 0) this.setAttribute('dir', 'r');
			//if (this.slideIdx < 0) this.slideIdx = this.images.length - 1;
			//// //console.debug(this, step, elSlide, this.slideIdx);
			var elSlide = this.images[this.slideIdx];
			if (!elSlide) {
				this.slideIdx = 0;
				var elSlide = this.images[this.slideIdx];
			}
			if (!elSlide) return;
			elSlide.show();
			if (elSlide.play && checkVisible(elSlide)) {
				if ($.player.elPlaying) items.player.elPlaying.pause();
				elSlide.currentTime = 0;
				//items.player.elPlaying = elSlide;
				elSlide.play();
			}
			//else
			//    items.player.play();
		},
		forEach(fn, selector, context) {
			if (selector) {
				if (typeof selector !== 'object') {
					return fn.apply(this, [...arguments].slice(1))
				} else {
					Object.entries(selector).forEach(entry => fn.call(this, ...entry))
				}
			}
			return this;
		},
    ganth(data) {
			setTimeout(() => new Ganth(data, this));
			return this;
		},
    get() {
      return this.map.get(...arguments);
    },
    has() {
      return this.map.has(...arguments);
    },
    header(item) {
			// let startDate = new Date(this.StartDateTime.replace('000Z','Z'));
			// let endDate = new Date(this.EndDateTime.replace('000Z','Z'));
			// let createdDate = new Date(this.CreatedDateTime.replace('000Z','Z'));
      // if (item.IsPublic) {
			// 	item.publicElement = ['DIV', 'icn IsPublic ' + (item.hostID === 1 ? 'public' : '')];
			// }
			return $('header')
      .class('row header', item.tag)
      .draggable()
      // .item(item, 'view')
      .on('change', function (event) {
        function linkMaster(item, name, elem) {
          if (item && item.data && item.data[name]) {
            const master = $(data = [].concat(item.data[name]).shift());
            elem.insert($('span').itemLink(master), '/');
            if (master && master.details) {
              master.details().then(item => linkMaster(item, name, elem));
            }
          }
          return elem;
        }
        function linkSource(item, name, elem) {
          if (item && item.data && item.data[name]) {
            const master = $(data = [].concat(item.data[name]).shift());
            elem.append(':', $('span').itemLink(master));
            if (master && master.details) {
              master.details().then(item => linkSource(item, name, elem));
            }
          }
          return elem;
        }
        this.is.text('').append(
          // $('div').class('modified'),
					// .contextmenu(this.properties.State.options)
					// .on('contextmenu', event => //console.log(event))
					$('button').class('abtn stateicon')
					.append(
						$('i').append(
							$('i').css('background-color', item.stateColor),
						),
						item.elemStateUl = $('ul').class('col').append(
							$('li').class('abtn').text('JAdsfg sdfg sd'),
							$('li').class('abtn').text('JAdsfg sdfg sd'),
							$('li').class('abtn').text('JAdsfg sdfg sd'),
							$('li').class('abtn').text('JAdsfg sdfg sd'),
						)
					)
					.on('mouseenter', function (event) {
						const rect = this.getBoundingClientRect();
						//console.log(window.innerHeight);
						item.elemStateUl.css('top', (rect.top)+'px').css('left', rect.left+'px');
					}),
          item.IsPublic ? $('div', 'icn IsPublic').class(item.hostID === 1 ? 'public' : '') : null,
          $('div')
          .class('icn itemicon', item.className)
          .css('border-color', item.modColor)
          .css('color', item.schemaColor)
          .append(
            item.gui && item.gui.global
            ? $('div', 'gui').append(
              $('div', 'detail').append(
                $('div', 'object').append(
                  $('div', item.tag, item.gui.detail),
                ),
              ),
            )
            : (item.iconsrc ? $('img').src(item.iconsrc) : null),
          ),
          $('div').class('aco col headername inline').append(
            $('div', 'header title', item.header0).append(
              // linkSource(item, 'Src', $('span').class('path source')),
            ),
            $('div', 'header subject', item.header1),
            $('div', 'header preview', item.header2),
            // linkMaster(item, 'Master', $('div').class('row path master')),
            $('div', 'row date')
            // .contextmenu(item.flagMenu)
            ,
          ),
        );
      }).emit('change')
		},
    html(content, format) {
			const elem = this.elem;
			function removeIdent(content) {
				content = content.split(/\n/);
				const ident = content.filter(line => line.trim());
				if (ident.length) {
					ident = ident[0].search(/\S/);
					content = content.map(line => line.substr(ident));
				}
				content = content.join('\n').trim();
			}
			param = {
				replaceLines(content, params, modifier) {
					return content.split(/\n/).map(line =>{
						return param.replace(line, params, modifier);
					}).join('\n');
				},
				replace(line, replace, modifier) {
					for (let [exp, s] of Object.entries(replace)) {
						// line = line.replace(new RegExp('(?<!<[^>]*?)(?!<span[^>]*?>)(?!.*<)' + exp + '(?![^<]*?<\\/span>)', modifier), s);
						// line = line.replace(new RegExp('(?!<span[^>]*?>)(?!.*<)' + exp + '(?![^<]*?<\\/span>)', modifier), s);
						line = line.replace(new RegExp('(?!<span[^>]*?>)' + exp + '(?![^<]*?<\\/span>)', modifier), s);
						// line = line.replace(new RegExp('(?<!<[^>]*?)(?!<span[^>]*?>)' + exp + '(?![^<]*?<\/span>)', modifier), s);
						// line = line.replace(new RegExp('(?!.*<)(?!<span[^>]*?>)' + exp + '(?![^<]*?<\/span>)', modifier), s);
						// line = line.replace(new RegExp('(?!.*<)' + exp, modifier), s);
						// line = line.replace(new RegExp('(?!.*<)' + exp, modifier), s);
						// line = line.replace(new RegExp(exp, modifier), s);
					}
					return line;
				},
				keywords: {
					js: {
						reserved: {
							class: '',
							abstract: '',
							arguments: '',
							await: '',
							boolean: '',
							break: '',
							byte: '',
							case: '',
							catch: '',
							char: '',
							const: '',
							continue: '',
							debugger: '',
							default: '',
							delete: '',
							do: '',
							double: '',
							else: '',
							enum: '',
							eval: '',
							export: '',
							extends: '',
							false: '',
							final: '',
							finally: '',
							float: '',
							for: '',
							function: '',
							goto: '',
							if: '',
							implements: '',
							import: '',
							in: '',
							instanceof: '',
							int: '',
							interface: '',
							let: '',
							long: '',
							native: '',
							new: '',
							null: '',
							package: '',
							private: '',
							protected: '',
							public: '',
							return: '',
							short: '',
							static: '',
							super: '',
							switch: '',
							synchronized: '',
							this: '',
							throw: '',
							throws: '',
							transient: '',
							true: '',
							try: '',
							typeof: '',
							var: '',
							void: '',
							volatile: '',
							while: '',
							with: '',
							yield: '',
							// Removed
							abstract: '',
							boolean: '',
							byte: '',
							char: '',
							double: '',
							final: '',
							float: '',
							goto: '',
							int: '',
							long: '',
							native: '',
							short: '',
							synchronized: '',
							throws: '',
							transient: '',
							volatile: '',
						},
						methods: {
							Array: '',
							Date: '',
							eval: '',
							function: '',
							hasOwnProperty: '',
							Infinity: '',
							isFinite: '',
							isNaN: '',
							isPrototypeOf: '',
							length: '',
							Math: '',
							NaN: '',
							name: '',
							Number: '',
							Object: '',
							prototype: '',
							String: '',
							toString: '',
							undefined: '',
							valueOf: '',
						},
						properties: {
							alert: '',
							all: '',
							anchor: '',
							anchors: '',
							area: '',
							assign: '',
							blur: '',
							button: '',
							checkbox: '',
							clearInterval: '',
							clearTimeout: '',
							clientInformation: '',
							close: '',
							closed: '',
							confirm: '',
							constructor: '',
							crypto: '',
							decodeURI: '',
							decodeURIComponent: '',
							defaultStatus: '',
							document: '',
							elem: '',
							elements: '',
							embed: '',
							embeds: '',
							encodeURI: '',
							encodeURIComponent: '',
							escape: '',
							event: '',
							fileUpload: '',
							focus: '',
							form: '',
							forms: '',
							frame: '',
							innerHeight: '',
							innerWidth: '',
							layer: '',
							layers: '',
							link: '',
							location: '',
							mimeTypes: '',
							navigate: '',
							navigator: '',
							frames: '',
							frameRate: '',
							hidden: '',
							history: '',
							image: '',
							images: '',
							offscreenBuffering: '',
							open: '',
							opener: '',
							option: '',
							outerHeight: '',
							outerWidth: '',
							packages: '',
							pageXOffset: '',
							pageYOffset: '',
							parent: '',
							parseFloat: '',
							parseInt: '',
							password: '',
							pkcs11: '',
							plugin: '',
							prompt: '',
							propertyIsEnum: '',
							radio: '',
							reset: '',
							screenX: '',
							screenY: '',
							scroll: '',
							secure: '',
							select: '',
							self: '',
							setInterval: '',
							setTimeout: '',
							status: '',
							submit: '',
							taint: '',
							text: '',
							textarea: '',
							top: '',
							unescape: '',
							untaint: '',
						},
						events: {
							onblur: '',
							onclick: '',
							onerror: '',
							onfocus: '',
							onkeydown: '',
							onkeypress: '',
							onkeyup: '',
							onmouseover: '',
							onload: '',
							onmouseup: '',
							onmousedown: '',
							onsubmit: '',
						}
					},
					php: {
						reserved: {
							class: '',
							if: '',
							isset: '',
						},
						// methods: {
						// },
						// properties: {
						// },
						// events: {
						// }
					},
					st: {
						reserved: {
							PROGRAM: '',
							END_PROGRAM: '',
							VAR: '',
							END_VAR: '',
							IF: 'Provides one or more options and selects one (or none) of its statement components for execution. ELEIF and ELSE are optional.',
							THEN: '',
							ELSEIF: '',
							ELSIF: '',
							ELSE: '',
							END_IF: '',
							CASE: 'Select one of several alternative program sections. ELSE are optional.',
							OF: '',
							END_CASE: '',
							FOR: 'Repeat a sequence of statements as long as a control variable is within the specified range of values',
							TO: '',
							BY: '',
							DO: '',
							END_FOR: '',
							REPEAT: 'Repeat a sequence of statements until condition(S) is true. Note minimum one execution.',
							UNTIL: '',
							END_REPEAT: '',
							WHILE: 'Repeat a sequence of statements as long as condition(S) is true.',
							// DO: '',
							END_WHILE: '',
							EXIT: 'Terminates the FOR, WHILE or REPEAT loop in which it resides without regard to any condition',
							RETURN: 'Terminates Program, Function block call',
							ADD: '',
							SQRT: '',
							SIN: '',
							COS: '',
							GT: '',
							MIN: '',
							MAX: '',
							AND: '',
							OR: '',
							BYTE: '8 bit (1 byte)',
							WORD: '16 bit (2 byte)',
							DWORD: '32 bit (4 byte)',
							LWORD: '64 bit (8 byte)',
							INTEGER: 'whole numbers (Considering byte size 8 bits)',
							SINT: 'signed short integer (1 byte)',
							INT: 'signed integer (2 byte)',
							DINT: 'signed double integer (4 byte)',
							LINT: 'signed long integer (8 byte)',
							USINT: 'Unsigned short integer (1 byte)',
							UINT: 'Unsigned integer (2 byte)',
							UDINT: 'Unsigned double integer (4 byte)',
							ULINT: 'Unsigned long integer (8 byte)',
							REAL: 'floating point IEC 60559 (same as IEEE 754-2008)',
							REAL: '(4 byte)',
							LREAL: '(8 byte)',
							TIME: '(4 byte). Literals in the form of T#5m90s15ms',
							LTIME: '(8 byte). Literals extend to nanoseconds in the form of T#5m90s15ms542us15ns',
							DATE: 'calendar date (Size is not specified)',
							LDATE: 'calendar date (Size is not specified)',
							TIME_OF_DAY: 'clock time(Size is not specified)',
							TOD: 'clock time(Size is not specified)',
							LTIME_OF_DAY: 'clock time (8 byte)',
							LTOD: 'clock time (8 byte)',
							DATE_AND_TIME: 'time and date(Size is not specified)',
							DT: 'time and date(Size is not specified)',
							LDATE_AND_TIME: 'time and date(8 byte)',
							LDT: 'time and date(8 byte)',
							CHAR: 'Single-byte character (1 byte)',
							WCHAR: 'Double-byte character (2 byte)',
							STRING: 'Variable-length single-byte character string. Literals specified with single quote, This is a STRING Literal',
							WSTRING: 'Variable-length double-byte character string. Literals specified with a double quote, "This is a WSTRING Literal"',
							STRING: 'escape sequences',
							ANY: '',
							ANY_DERIVED: '',
							ANY_ELEMENTARY: '',
							ANY_MAGNITUDE: '',
							ANY_NUM: '',
							ANY_REAL: 'LREAL, REAL',
							ANY_INT: '',
							ANY_UNSIGNED: 'ULINT, UDINT, UINT, USINT',
							ANY_SIGNED: 'LINT, DINT, INT, SINT',
							ANY_DURATION: 'TIME, LTIME',
							ANY_BIT: 'LWORD, DWORD, WORD, BYTE, BOOL',
							ANY_CHARS: '',
							ANY_STRING: 'STRING, WSTRING',
							ANY_CHAR: 'CHAR, WCHAR',
							ANY_DATE: 'DATE_AND_TIME (DT), DATE_AND_TIME(LDT), DATE, TIME_OF_DAY (TOD), LTIME_OF_DAY(LTOD)',
						},
						methods: {
							LEN: 'Length of string',
							CONCAT: 'Connect two strings',
							LEFT: 'Returns N characters from the left',
							RIGHT: 'Returns N characters from the right',
							MID: 'Returns N1 characters from N2',
							INSERT: 'Insert string at N',
							DELETE: 'Delete a substring',
							REPLACE: 'Replace a substring',
							FIND: 'Find a substring in a string',
							SEL: 'Select',
							MAX: 'Maximum',
							MIN: 'Minimum',
							LIMIT: 'Limit',
							MUX: 'Select from N',
							TP: 'Pulse timer',
							TON: 'On delay timer',
							TOF: 'Off delay timer',
							R_TRIG: 'Rising edge',
							F_TRIG: 'Falling edge',
							TRUNC: 'Returns hole number as DINT',
							TRUNC_INT: 'Returns hole number as INT',
							ROL: 'Rotate left by N',
							ROR: 'Rotate right by N',
							SHL: 'Shift left by N',
							SHR: 'Shift right by N',
							CTU: 'Counter up',
							CTD: 'Counter down',
							CTUD: 'Counter up and down',
							ABS: 'Number',
							SQR: 'Square root',
							LN: 'Natural logarithm',
							LOG: 'Common logarithm',
							EXP: 'E to the power of IN',
							SIN: 'Sine',
							COS: 'Cosine',
							TAN: 'Tangent',
							ASIN: 'Arc sine',
							ACOS: 'Arc Cosine',
							ATAN: 'Arc Tangent',
							EXPT: 'IN1 to the power of IN2',
							'<': 'Less than',
							'>': 'Greather than',
							'<=': 'Less than or equal to',
							'>=': 'Greater than or equal to',
							'=': 'Equal to',
							'<>': 'Not equal to',
							NOT: 'Negation',
							AND: 'And',
							XOR: 'Exclusive or',
							OR: 'Or',
							':=': 'Assignment',
							'\\*': 'Multiplication',
							'/': 'Division',
							'MOD': 'Modolo division',
							'\\+': 'Addition',
							'-': 'Subtraction',
							BOOL_TO_INT:'',
							WORD_TO_DINT:'',
							BYTE_TO_REAL:'',
							REAL_TO_LREAL:'',
							TIME_TO_DINT:'',
						}
					},
					sql: {
						methods: {
							'ADD': 'Adds a column in an existing table',
							'ADD CONSTRAINT': 'Adds a constraint after a table is already created',
							'ALTER': 'Adds, deletes, or modifies columns in a table, or changes the data type of a column in a table',
							'ALTER COLUMN': 'Changes the data type of a column in a table',
							'ALTER TABLE': 'Adds, deletes, or modifies columns in a table',
							'ALL': 'Returns true if all of the subquery values meet the condition',
							'AND': 'Only includes rows where both conditions is true',
							'ANY': 'Returns true if any of the subquery values meet the condition',
							'AS': 'Renames a column or table with an alias',
							'ASC': 'Sorts the result set in ascending order',
							'BACKUP DATABASE': 'Creates a back up of an existing database',
							'BETWEEN': 'Selects values within a given range',
							'CASE': 'Creates different outputs based on conditions',
							'CHECK': 'A constraint that limits the value that can be placed in a column',
							'COLUMN': 'Changes the data type of a column or deletes a column in a table',
							'CONSTRAINT': 'Adds or deletes a constraint',
							'CREATE': 'Creates a database, index, view, table, or procedure',
							'CREATE DATABASE': 'Creates a new SQL database',
							'CREATE INDEX': 'Creates an index on a table (allows duplicate values)',
							'CREATE OR REPLACE VIEW': 'Updates a view',
							'CREATE TABLE': 'Creates a new table in the database',
							'CREATE PROCEDURE': 'Creates a stored procedure',
							'CREATE UNIQUE INDEX': 'Creates a unique index on a table (no duplicate values)',
							'CREATE VIEW': 'Creates a view based on the result set of a SELECT statement',
							'DATABASE': 'Creates or deletes an SQL database',
							'DEFAULT': 'A constraint that provides a default value for a column',
							'DELETE': 'Deletes rows from a table',
							'DESC': 'Sorts the result set in descending order',
							'DISTINCT': 'Selects only distinct (different) values',
							'DROP': 'Deletes a column, constraint, database, index, table, or view',
							'DROP COLUMN': 'Deletes a column in a table',
							'DROP CONSTRAINT': 'Deletes a UNIQUE, PRIMARY KEY, FOREIGN KEY, or CHECK constraint',
							'DROP DATABASE': 'Deletes an existing SQL database',
							'DROP DEFAULT': 'Deletes a DEFAULT constraint',
							'DROP INDEX': 'Deletes an index in a table',
							'DROP TABLE': 'Deletes an existing table in the database',
							'DROP VIEW': 'Deletes a view',
							'EXEC': 'Executes a stored procedure',
							'EXISTS': 'Tests for the existence of any record in a subquery',
							'FOREIGN KEY': 'A constraint that is a key used to link two tables together',
							'FROM': 'Specifies which table to select or delete data from',
							'FULL OUTER JOIN': 'Returns all rows when there is a match in either left table or right table',
							'GROUP BY': 'Groups the result set (used with aggregate functions: COUNT, MAX, MIN, SUM, AVG)',
							'HAVING': 'Used instead of WHERE with aggregate functions',
							'IN': 'Allows you to specify multiple values in a WHERE clause',
							'INDEX': 'Creates or deletes an index in a table',
							'INNER JOIN': 'Returns rows that have matching values in both tables',
							'INSERT INTO': 'Inserts new rows in a table',
							'INSERT INTO SELECT': 'Copies data from one table into another table',
							'IS NULL': 'Tests for empty values',
							'IS NOT NULL': 'Tests for non-empty values',
							'JOIN': 'Joins tables',
							'LEFT JOIN': 'Returns all rows from the left table, and the matching rows from the right table',
							'LIKE': 'Searches for a specified pattern in a column',
							'LIMIT': 'Specifies the number of records to return in the result set',
							'NOT': 'Only includes rows where a condition is not true',
							'NOT NULL': 'A constraint that enforces a column to not accept NULL values',
							'OR': 'Includes rows where either condition is true',
							'ORDER BY': 'Sorts the result set in ascending or descending order',
							'OUTER JOIN': 'Returns all rows when there is a match in either left table or right table',
							'PRIMARY KEY': 'A constraint that uniquely identifies each record in a database table',
							'PROCEDURE': 'A stored procedure',
							'RIGHT JOIN': 'Returns all rows from the right table, and the matching rows from the left table',
							'ROWNUM': 'Specifies the number of records to return in the result set',
							SELECT: 'Selects data from a database',
							'SELECT DISTINCT': 'Selects only distinct (different) values',
							'SELECT INTO': 'Copies data from one table into a new table',
							'SELECT TOP': 'Specifies the number of records to return in the result set',
							SET: 'Specifies which columns and values that should be updated in a table',
							TABLE: 'Creates a table, or adds, deletes, or modifies columns in a table, or deletes a table or data inside a table',
							TOP: 'Specifies the number of records to return in the result set',
							'TRUNCATE TABLE': 'Deletes the data inside a table, but not the table itself',
							UNION: 'Combines the result set of two or more SELECT statements (only distinct values)',
							'UNION ALL': 'Combines the result set of two or more SELECT statements (allows duplicate values)',
							UNIQUE: 'A constraint that ensures that all values in a column are unique',
							UPDATE: 'Updates existing rows in a table',
							VALUES: 'Specifies the values of an INSERT INTO statement',
							VIEW: 'Creates, updates, or deletes a view',
							WHERE: 'Filters a result set to include only records that fulfill a specified condition',
						},
					},
					css: {
						reserved: {
							div: '',
						},
						properties: {
							class: '',
						},
					},
				},
				prg(line, lang, modifier) {
					modifier = modifier || 'g';
					let groups = {};
					let keywords = {
						// '(")([^"]*)("=&gt;)': '$1<span class="hl-attr">$2</span>$3',
						// '(\')([^\']*)(\'=&gt;)': '$1<span class="hl-attr">$2</span>$3',
						// '("[^"]+")(:)': '<span class="hl-attr">$1</span>$2',
						// '(\'[^\']+\')(:)': '<span class="hl-attr">$1</span>$2',
						// 'function\\s(\\w+)(\\s|)\\(': 'function <span class="hl-title">$1</span>$2(',
						// '(&lt;)([^\\s|^&]+)(\\s|&)': '$1<span class="hl-tag">$2</span>$3',
						// '&quot;(.*?)&quot;': '&quot;<span class="hl-string">$1</span>&quot;',
						// '&apos;(.*?)&apos;': '&apos;<span class="hl-string">$1</span>&apos;',
						'`(.*?)`': '`<span class="hl-string">$1</span>`',
						'(\\/\\/[^\n<]+)': '<span class="hl-comt">$1</span>',
					};
					lang.forEach(lang => {
						if (param.keywords[lang]) {
							for (let [groupName, group] of Object.entries(param.keywords[lang])) {
								groups[groupName] = groups[groupName] || [];
								groups[groupName] = groups[groupName].concat(Object.keys(group));
								// var s = Object.keys(group).join('|');
								// if (s) {
								//   keywords[ '\\b(' + s + ')\\b'] = `<span class="hl-${groupName}">$1</span>`;
								// }
							}
						};
					});
					for (let [groupName, group] of Object.entries(groups)) {
						keywords[ '\\b(' + group.join('|') + ')\\b'] = `<span class="hl-${groupName}">$1</span>`;
					};
					// //console.log(keywords);
					// return;
					line = line.
					replace(/</gs, '&lt;')
					.replace(/>/g, '&gt;')
					// .replace(/"/g, '&quot;')
					// .replace(/'/g, '&apos;')
					.replace(/=/g, '&#61;')
					.replace(/\t/g, '  ')
					;
					chars = line.split('');
					line = [];
					for (var i=0, specialChar;i<chars.length;i++) {
						specialChar = chars[i];
						if (['"','`',"'"].includes(specialChar)) {
							line.push(chars[i] + '<span class="hl-string">');
							for (i++;i<chars.length;i++) {
								if (chars[i] === specialChar && chars[i-1] !== '\\') break;
								line.push(chars[i]);
							}
							line.push('</span>');
						} else if (specialChar === '/') {
							if (chars[i+1] === '/') {
								line.push('<span class="hl-comt">');
								for (i;i<chars.length;i++) {
									if (chars[i] === "\n") break;
									line.push(chars[i]);
								}
								line.push('</span>');
							}
						}
						line.push(chars[i]);
					}
					line = line.join('');
					// //console.log(line);
					// return line;
					// //console.log('CHARS', chars);
					// line = line.replace(/\r/g,'');
					// line = createHtml.replace(line, keywords);
					line = line
					.replace(/\r/g,'')
					.replace(/(&lt;!--)/g, '<span class="hl-comt">$1')
					.replace(/(--&gt;)/g, '$1</span>')
					.replace(/(\/\*.*)/g, '<span class="hl-comt">$1')
					.replace(/(.*\*\/)/g, '$1</span>')
					;
					line = param.replace(
						line,
						Object.assign(keywords, {
							'(&lt;)(\\w+)': '$1<span class="hl-tag">$2</span>',
							'(&lt;\\/)(\\w+)': '$1<span class="hl-tag">$2</span>',
							// '([$\\w]+)\\b': '<span class="hl-obju">$1</span>',
							// '(\'[^\']*\')': '<span class="hl-string">$1</span>',
							//
							'(\\w+)(&#61;)': '<span class="hl-attr">$1</span>$2',
							//
							'(\\w+)(\\s|)\\(': '<span class="hl-fn">$1</span>$2(',
							// '\\b([A-Z]+)\\b': '<span class="hl-obju">$1</span>',
							'(\\w+)::': '<span class="hl-class">$1</span>::',
							// '(\\w+)-&gt;': '<span class="hl-obj">$1</span>-&gt;',
							// '\\.(\\w+)\\.': '.<span class="hl-obj">$1</span>.',
							// '(\\w+)\\.': '<span class="hl-obju">$1</span>.',
							'\\.(\\w+)': '.<span class="hl-attr">$1</span>',
							'([\\w-]+)(?=:)': '<span class="hl-attr">$1</span>',
							'([\\w-]+)(?=&#61;)': '<span class="hl-attr">$1</span>',
							//
							// '(\\[)("[^"]+")(\\])': '$1<span class="hl-attr">$2</span>$3',
							// '(\\[)(\'[^\']+\')(\\])': '$1<span class="hl-attr">$2</span>$3',
							// '(\\[)(\\w+)(\\])': '$1<span class="hl-attr">$2</span>$3',
							'([^&#61;])([\\d\\.]+)': '$1<span class="hl-nr">$2</span>',
						}),
						modifier
					);
					return line;
				},
				js: content => {
					//console.log(content, this);
					this.elem.innerHTML = this.prg (content, ['js']);
					return this;
				},
			};
      // [...arguments].forEach(content => this.elem.innerHTML += typeof content === 'function' ? this.prg (String(content).replace(/^(.*?)\{|\}$/g,''), ['js']) : content );
      [].concat(content).forEach(content => {
        if (typeof content === 'function') {
          format = 'js';
          content = String(content).replace(/^(.*?)\{|\}$/g,'');
        }
        content = format && $.string[format] ? $.string[format](content) : content;
        this.elem.innerHTML += content;
      })
			return this;
		},
    write(content) {
      return this.elem.innerHTML += content;
    },
    htmledit(property) {
			const oDoc = this.elem;
			const stateButtons = {};
			function formatDoc(sCmd, sValue) {
				if (oDoc.currentRange) {
					var sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(oDoc.currentRange);
				}
				if (validateMode()) {
					document.execCommand(this.cmd || sCmd, false, this.value || this.name || this.Title || sValue || this.cmd || sCmd);
					oDoc.focus();
				}
			}
			function validateMode() {
				if (!oDoc.codeview || !oDoc.codeview.checked) { return true; }
				alert("Uncheck \"Show HTML\".");
				oDoc.focus();
				return false;
			}
			function setDocMode() {
				var oContent;
				if (oDoc.contentEditable !== 'false') {
					oContent = document.createTextNode(oDoc.innerHTML);
					oDoc.innerHTML = '';
					var oPre = document.createElement('PRE');
					oPre.onfocus = function(event) { this.parentElement.onfocus() };
					oDoc.contentEditable = false;
					oPre.id = 'sourceText';
					oPre.contentEditable = true;
					oPre.appendChild(oContent);
					oDoc.appendChild(oPre);
					document.execCommand('defaultParagraphSeparator', false, 'p');
				}
				else {
					if (document.all) {
						oDoc.innerHTML = oDoc.innerText;
					} else {
						oContent = document.createRange();
						oContent.selectNodeContents(oDoc.firstChild);
						oDoc.innerHTML = oContent.toString();
					}
					oDoc.contentEditable = true;
				}
				oDoc.focus();
			}
			function printDoc() {
				if (!validateMode()) { return; }
				var oPrntWin = window.open('', '_blank', 'width=450, height=470, left=400, top=100, menubar=yes, toolbar=no, location=no, scrollbars=yes');
				oPrntWin.document.open();
				oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + oDoc.innerHTML + "<\/body><\/html>");
				oPrntWin.document.close();
			}
			const contentEditableCheck = (event) => {
				var sel = window.getSelection();
				stateButtons.hyperlink.attr('checked', sel.focusNode.parentElement.tagName === 'A');
				stateButtons.unlink.attr('disabled', !(
					(sel.anchorNode.nextSibling && sel.anchorNode.nextSibling.tagName === 'A' && sel.extentNode.previousSibling && sel.extentNode.previousSibling.tagName === 'A') ||
					(sel.extentNode.nextSibling && sel.extentNode.nextSibling.tagName === 'A' && sel.anchorNode.previousSibling && sel.anchorNode.previousSibling.tagName === 'A') ||
					(sel.anchorNode.parentElement.tagName === 'A' && sel.extentNode.parentElement.tagName !== 'A') ||
					(sel.anchorNode.parentElement.tagName !== 'A' && sel.extentNode.parentElement.tagName === 'A')
				));
				stateButtons.blockquote.attr('checked', sel.anchorNode.parentElement === sel.extentNode.parentElement && sel.extentNode.parentElement.tagName === 'BLOCKQUOTE');
				[
					'bold',
					'italic',
					'underline',
					'strikeThrough',
					'superscript',
					'subscript',
					'insertunorderedlist',
					'insertorderedlist',
					'justifyleft',
					'justifycenter',
					'justifyright',
					'justifyfull'
				].forEach(name => stateButtons[name].attr('checked', document.queryCommandState(name)))
			};
			let keyupTimeout;
			const keysup = {
				shift_alt_ArrowRight() {
					formatDoc('indent');
				},
				shift_alt_ArrowLeft() {
					formatDoc('outdent');
				},
				ctrl_Space() {
					formatDoc('removeFormat');
					oDoc.innerHTML = oDoc.innerHTML.replace(/\r/g,'').replace(/<p><\/p>/g,'');
				},
				ctrl_alt_Digit1() {
					formatDoc('formatblock', 'H1');
				},
				ctrl_alt_Digit2() {
					formatDoc('formatblock', 'H2');
				},
				ctrl_alt_Digit3() {
					formatDoc('formatblock', 'H3');
				},
				ctrl_shift_Period() {
					var startSize = parseInt(window.getComputedStyle(window.getSelection().anchorNode.parentElement, null).fontSize);
					for (var i = 1; i <= 7; i++) {
						formatDoc('fontsize', i);
						if (parseInt(window.getComputedStyle(window.getSelection().anchorNode.parentElement, null).fontSize) > startSize) break;
					}
				},
				ctrl_shift_Comma() {
					//console.log('<');
					var startSize = parseInt(window.getComputedStyle(window.getSelection().anchorNode.parentElement, null).fontSize);
					for (var i = 7; i >= 1; i--) {
						formatDoc('fontsize', i);
						if (parseInt(window.getComputedStyle(window.getSelection().anchorNode.parentElement, null).fontSize) < startSize) break;
					}
				},
			};
			const keysdown = {
				ctrl_KeyD() {
					//console.log('D');
					formatDoc('strikeThrough');
				},
			};
      this
      .contenteditable('')
      .on('paste', event => {
        // event.preventDefault();
        console.log(event, event.clipboardData, event.clipboardData.files, event.clipboardData.types.includes('Files'));
      })
      .on('drop', event => {
        event.preventDefault();
        if (event.dataTransfer.files) {
          [...event.dataTransfer.files].forEach(file => {
            property.item.elemFiles.appendFile(file).then(file => {
              console.log(file);
              // return;
              if (window.getSelection) {
                var sel, range, html;
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                  //let offset = sel.focusOffset;
                  range = sel.getRangeAt(0);
                  range.deleteContents();
                  var elImg = document.createElement('img');
                  elImg.src = file.srcs || file.src;
                  range.insertNode(elImg);
                  range.setStartAfter(elImg);
                  //range.setEnd(elImg, 0);
                  //range.setStart()
                  //range.set
                  //window.getSelection().addRange()
                  //range.setStart(el.childNodes[2], 5);
                  //range.collapse(true);
                  sel.removeAllRanges();
                  sel.addRange(range);
                  //document.activeElement.setSelectionRange(5,5);
                }
              }
              else if (document.selection && document.selection.createRange) {
                document.selection.createRange().text = text;
              }
            });
          })
        }
      })
			.on('focus', event => {
				//console.log('FOCUS')
				oDoc.currentRange = null;
				// setDocMode();
				document.execCommand('defaultParagraphSeparator', false, 'p');
				// if ($.editBtnRowElement) $.editBtnRowElement.remove();
				// switchBox = $.editBtnRowElement.createElement('INPUT', {type:"checkbox", onchange:function(event){setDocMode(this.checked);} });
				// for (var name in btns) $.editBtnRowElement.createElement('span', { className: 'abtn icn ' + name }).createElement('img', Object.assign({
				// 	// onclick: Element.onclick,
				// 	src:'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
				// 	title: __(name),
				// }, btns[name]));
				for (var menuParentElement = oDoc; menuParentElement.tagName !== 'FORM'; menuParentElement = menuParentElement.parentElement);
				if (!$.editBtnRowElement || !$.editBtnRowElement.parentElement) {
					function formatButton(name, classname) {
						return stateButtons[name] = $('button').class('abtn', name, classname).attr('title', name).on('click', event => formatDoc(name))
					}
					$.editBtnRowElement = $('div').parent(document.body).class('row top abs textedit np shdw').append(
						formatButton('undo r'),
						formatButton('redo'),
						formatButton('cut', 'split'),
						formatButton('copy'),
						formatButton('paste'),
						$('button').class('abtn fontname split').append($('ul').append([
							'Arial','Arial Black','Courier New','Times New Roman'
						].map(fontname => $('li').class('abtn').text(fontname).on('click', event => formatDoc('fontname', fontname))))),
						$('button').class('abtn fontsize').append($('ul').append([
							[1, 'Very small'],
							[2, 'A bit small'],
							[3, 'Normal'],
							[4, 'Medium-large'],
							[5, 'Big'],
							[6, 'Very big'],
							[7, 'Maximum'],
						].map(([size, text]) => $('li').class('abtn').text(text).on('click', event => formatDoc('fontsize', size))))),
						$('button').class('abtn switchMode').append($('ul').append([
							['h1', __('Header 1') + ' <h1>'],
							['h2', __('Header 2') + ' <h2>'],
							['h3', __('Header 3') + ' <h3>'],
							['p', __('Paragraph') + ' <p>'],
							['pre', __('Preformated') + ' <pre>'],
						].map(([tag, text]) => $('li').class('abtn').text(text).on('click', event => formatDoc('formatblock', tag))))),
						formatButton('removeFormat', 'split'),
						formatButton('bold', 'split'),
						formatButton('italic'),
						formatButton('underline'),
						formatButton('strikeThrough'),
						formatButton('subscript'),
						formatButton('superscript'),
						$('button').class('abtn backcolor split').append($('ul').append([
							'black','red','orange','yellow','green','blue','white'
						].map(color => $('li').class('abtn', color).text(color).on('click', event => formatDoc('backcolor', color))))),
						$('button').class('abtn forecolor').append($('ul').append([
							'black','red','orange','yellow','green','blue','white'
						].map(color => $('li').class('abtn', color).text(color).on('click', event => formatDoc('forecolor', color))))),
						formatButton('insertunorderedlist', 'split'),
						formatButton('insertorderedlist'),
						formatButton('outdent', 'split'),
						formatButton('indent'),
						formatButton('justifyleft', 'split'),
						formatButton('justifycenter'),
						formatButton('justifyright'),
						formatButton('justifyfull'),
						stateButtons.blockquote = $('button').class('abtn blockquote split').on('click', event => formatDoc('formatblock', 'blockquote')),
						stateButtons.hyperlink = $('button').class('abtn hyperlink split').on('click', event => {
							var sLnk = prompt('Write the URL here', 'http:\/\/');
							if (sLnk && sLnk != '' && sLnk != 'http://') {
								formatDoc('createlink', sLnk)
							}
						}),
						stateButtons.unlink = $('button').class('abtn unlink').on('click', event => formatDoc('unlink')),
						$('button').class('abtn clean split').on('click', event => {
							if(validateMode()&&confirm('Are you sure?')){ this.innerHTML = this.value; }
						}),
						$('button').class('abtn print').on('click', event => printDoc()),
						// $('button').class('abtn paste').attr('cmd', 'paste').on('click', setDocMode),
					).on('click', event => {
						//console.log('CLICK');
						clearTimeout(oDoc.blurTimeout);
					}, true);
				}
			})
			.on('keyup', event => {
				let key = event.keyPressed;
				if (oDoc.innerHTML && oDoc.innerHTML[0] !== '<') {
					oDoc.innerHTML='<p>'+oDoc.innerHTML+'</p>';
					const node = oDoc.childNodes[0];
					const range = document.createRange();
					const sel = window.getSelection();
					range.setStart(node, 1);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);
					event.preventDefault();
				}
				if (keysup[key]) {
					keysup[key]();
					event.preventDefault();
				}
				clearTimeout(keyupTimeout);
				keyupTimeout = setTimeout (contentEditableCheck, 200, event);
			})
			.on('keydown', event => {
				let key = event.keyPressed;
				if (keysdown[key]) {
					keysdown[key]();
					event.preventDefault();
				}
			})
			.on('blur', event => {
				oDoc.blurTimeout = setTimeout(event => $.editBtnRowElement.elem.remove(), 300);
				oDoc.currentRange = window.getSelection().getRangeAt(0);
				for (var i = 0, p; p = event.path[i]; i++) {
					if (p.item) break;
				}
				// let html = oDoc.innerHTML;
				// //console.log(html);
				// html = html.trim()
				// .replace(/<p><\/p>/gis, '')
				// .replace(/<p><br><\/p>/gis, '')
				// .replace(/<div><\/div>/gis, '')
				// .replace(/<div><br><\/div>/gis, '')
				// .replace(/^<p>/is, '')
				// .replace(/<\/p>$/is, '')
				// .replace(/^/is, '<p>')
				// .replace(/$/is, '</p>')
				// ;
				// oDoc.innerHTML = html;
				if (p && p.item && oDoc.name) {
					p.item[oDoc.name] = oDoc.innerHTML;
				}
				if (property) {
						property.value = oDoc.innerHTML;
					}
			})
			.on('mouseup', event => contentEditableCheck);
			return this;
		},
    insert(){
			this.elem = this.elem || document.body;
			const args = [].concat(...arguments);
			args.forEach(a => !a ? null : this.elem.insertBefore(typeof a === 'string' ? document.createTextNode(a) : a.elem || a, this.elem.firstChild));
			return this;
		},
    id(selector) {
			this.elem.setAttribute('id', selector);
      $.map.set(selector, this);
			// this.attr('id', ...arguments);
			if ($.localAttr[selector]) {
				Object.entries($.localAttr[selector]).forEach(entry => this.elem.setAttribute(...entry));
			}
			return this;
		},
    index(docelem){
			const all = [...docelem.elem.querySelectorAll("h1, h2, h3")];
      // console.log(1111, all);
      const topItem = docelem.topItem = all[0];
      const elemTop = docelem.elemTop = docelem.elem.getBoundingClientRect().top;
      const findAll = docelem.findAll = all.slice().reverse();
			const allmenu = docelem.allmenu = [];
			let i = 0;
      var li;
      var path = [];
			function addChapters (ul, level) {
				for (let elem = all[i]; elem; elem = all[i]) {
					const tagLevel = Number(elem.tagName[1]);
          path.slice(0, tagLevel-1);
          // console.log(path);
					const title = elem.innerText;
          path[tagLevel-1] = title.toLowerCase().replace(/ /g,'_');
          const name = path.join('-');
					if (tagLevel === level) {
						$(elem).append(
              // $('a').attr('name', 'chapter' + i)
              $('a').attr('name', name)
						);
						li = $('li').parent(ul).append(
							elem.a = $('a').text(elem.innerText).attr('href', '#' + name).attr('open', '0').attr('target', '_self')
						);
						i++;
						allmenu.push(elem.a);
						// all.shift();
					} else if (li && tagLevel > level) {
						li.append(
							addChapters($('ul'), level+1)
						)
					} else {
						return ul;
					}
				}
				return ul;
			}
			let to;
      var lastScrollTop = 0;
			addChapters(this.text(''), 1);
      // console.error($('navDoc'));
      // (docelem.onscroll = event => {
      //   if (!to) {
      //     // const div = Math.abs(lastScrollTop - docelem.elem.scrollTop);
      //     // clearTimeout(to);
      //     to = setTimeout(() => {
      //       // console.log('re');
      //       to = null;
      //       // if (div > 50) {
      //       lastScrollTop = document.body.scrollTop;
      //       let elem = findAll.find(elem => elem.getBoundingClientRect().top < elemTop) || topItem;
      //       console.log(findAll, elem);
      //       // let elem = all.find(elem => elem.offsetParent );
      //       // console.log(elem.innerText, elemTop, elem.getBoundingClientRect().top, elem.getBoundingClientRect().height, all.indexOf(elem));
      //       // return;
      //       // elem = all[all.indexOf(elem)-1];
      //       allmenu.forEach(a => a.attr('open', '0').attr('select', null));
      //       const path = [];
      //       for (var p = elem.a.elem; p.tagName === 'A' && p.parentElement && p.parentElement.parentElement; p=p.parentElement.parentElement.parentElement.firstChild) {
      //         p.setAttribute('select', '');
      //         p.setAttribute('open', '1');
      //         path.push(p);
      //       }
      //       $(elem.a.elem).scrollIntoView();
      //       if ($('navDoc')) {
      //         $('navDoc').text('').append(...path.reverse().map(elem => ['/', $('a').text(elem.innerText)]))
      //       }
      //       // elem.li.select();
      //       // $()
      //       // let elem = all.forEach(elem => //console.log(elem.getBoundingClientRect().top));
      //       // //console.log(elem, elem.li);
      //       // }
      //     }, 500);
      //   }
      // })();
      // document.body.removeEventListener('scroll', docelem.onscroll);
      // document.body.addEventListener('scroll', docelem.onscroll);
      return this;
			// return $('ul').append(...[...this.elem.querySelectorAll("h1, h2, h3")].map(elem => $('li').text(elem.innerText)))
			this.addNextPreviousButtons()
		},
    item(item, name) {
      if (item) {
        if (name) {
          // console.log(item.elems);
          item.elems = item.elems || new Map();
          // console.log(item.elems, Map, new Map());
          item.elems.set(name, this);
        }
        this.elem.item = item;
        return this;
        this.set('item', item);
      }
      // console.log(elem, elem.item)
      for (var elem = this.elem; elem && !elem.item; elem = elem.parentElement);
      // console.log(elem, elem.item)
      return elem.item;
      // return this;
    },
    itemAttr(items, attributeName, value) {
			items = Array.isArray(items) ? items : [items];
			const a = $.temp.attributeItems = $.temp.attributeItems || {};
			if (a[attributeName]) {
				a[attributeName].forEach(item => {
					delete item[attributeName];
					Object.values(item)
					.filter(value => value instanceof Element)
					.forEach(elem => elem.removeAttribute(attributeName));
				})
			}
			// set attributen van nieuwe lijst
			items.forEach(item => {
				const elements = Object.values(item).filter(value => value instanceof Element);
				if (value === undefined) {
					delete item[attributeName];
					elements.forEach(elem => elem.removeAttribute(attributeName));
				} else {
					item[attributeName] = value;
					elements.forEach(elem => elem.setAttribute(attributeName, value));
				}
			});
			return a[attributeName] = items || [];
		},
    itemLink(link){
      if (link) {
        item = link instanceof Item ? link : $(link);
        return this.append(
          (this.linkElem = $('a'))
          .text(item.header0)
          .item(item)
          .href('#/id/' + item.Id)
          .on('mouseenter', event => {
            console.log('a mouseenter');
            const targetElement = this.linkElem.elem;
            const rect = targetElement.getBoundingClientRect();
            const popupElem = $.popupcardElem = $.popupcardElem || $('div').parent(document.body).class('pucard');
            popupElem
            .style(`top:${rect.top}px;left:${rect.left}px;width:${rect.width}px;height:${rect.height+10}px;`)
            .on('close', event => {
              console.log('div close', this);
              $.popupcardElem = null;
              popupElem.remove();
            })
            .on('mouseleave', event => {
              console.log('div mouseleave', this);
              popupElem.to = clearTimeout(popupElem.to);
              popupElem.emit('close');
            })
            .on('mouseenter', event => {
              console.log('div mouseenter');
              clearTimeout(this.to);
              const divElem = $('div').parent(popupElem.text(''));
              console.log(item);
              this.to = setTimeout(() => item.details().then(item => {
                popupElem.css(`opacity:1;`);
                const infoID = item.tag;
                divElem.append(
                  $('div').class(' shdw col').append(
                    $('div').class('aco point').append(
                      $('div').class('kop0').text(item.header0),
                      $('div').class('kop1').text(item.header1),
                      $('div').class('kop2').text(item.header2),
                    ),
                    $('div').class('row top btnbar').append(
                      Array.isArray(item.Email) ? item.Email.map(email => $('a').class('abtn icn email').text(email.Value).href(`mailto:${property.Value}`)) : null,
                    )
                  ).on('click', event => {
                    popupElem.emit('close');
                    $().preview(item);
                  })
                );
              }),500);
            });
          })
        );
      }
    },
    langtext(value){
      return this.ttext(...arguments);
    },
    list(){
      $().list(this);
      return this;
    },
    async load(src, callback){
      if (src.match(/\w+\(\d+\)/)) {
        return;
      }
      if (src.match(/wiki$/)) {
        src += '/';
      }
      if (src.match(/wiki\/$/)) {
        src += 'Home';
      }
      function hrefSrc (href, src = '/') {
        if (href[0]==='#') return href;
        // console.log(href, src, new URL(src, document.location).href);
        if (href.match(/^http/)) return href;
        href = new URL(href, new URL(src, document.location)).href.replace(/^.*?\//,'/');
          // console.log(href);
        return href;
        // return href.toLowerCase();
      }
      function rawSrc(src) {
        if (!src.match(/githubusercontent/)) {
          // src = src.replace(/\/\/([\w\.-]+)\.github\.io/, '//github.com/$1/$1.github.io');
          // src = src.replace(/\/\/([\w\.-]+)\.github\.io$/, '//github.com/$1/$1.github.io');
          src = src.replace(/\/\/([\w\.-]+)\.github\.io/, '//github.com/$1');
          src = src.replace(/github.com/, 'raw.githubusercontent.com');
        }
        if (src.match(/githubusercontent/)) {
          if (src.match(/\/wiki/)) {
            src = src.replace(/wiki$/,'wiki/Home');
            src = src.replace(/raw.githubusercontent.com\/(.*?)\/wiki/, 'raw.githubusercontent.com/wiki/$1');
          } else if (!src.match(/\/main/)) {
            src = src.replace(/raw.githubusercontent.com\/([\w\.-]+)\/([\w\.-]+)/, 'raw.githubusercontent.com/$1/$2/main');
          }
        } else {
          src = src.replace(/\/main/g, '');
          // src = src.replace(/\/main|\/aliconnect/g, '');
        }
        src = src.replace(/\/tree|\/glob|\/README.md/g, '');
        return src;
      }
      const elem = this;
      elem.paths = elem.paths || [];
      const homePath = document.location.origin;
      const origin = new URL(src, document.location).origin;
      const linksrc = hrefSrc(src).toLowerCase();
      this.links = this.links || [];
      src = rawSrc(src);
      this.loadMenu = async function (src) {
        var wikiPath = rawSrc(src).replace(/[\w\.-]*$/,'');
        if (!elem.paths.includes(wikiPath)) {
          console.log('loadMenu', wikiPath, this.links);
          elem.paths.push(wikiPath);
          await $().url(rawSrc(wikiPath+'_Sidebar.md')).accept('text/markdown').get().catch(console.error)
          .then(event => {
            this.doc.leftElem.md(event.target.responseText);
            [...this.doc.leftElem.elem.getElementsByTagName('A')].forEach(elem => $(elem).href(hrefSrc(elem.getAttribute('href'), linksrc)));
          });
          [...this.doc.leftElem.elem.getElementsByTagName('LI')].forEach(li => {
            if (li.childNodes[0].nodeValue) {
              li.replaceChild($('span').text(li.childNodes[0].nodeValue.trim()).elem, li.childNodes[0]);
            }
            const nodeElem = li.firstChild;
            if (!nodeElem.hasAttribute('open')) {
              nodeElem.setAttribute('open', '0');
              $(nodeElem).attr('open', '0').on('click', event => {
                nodeElem.setAttribute('open', nodeElem.getAttribute('open') ^ 1);
              });
            }
          })
          this.links = [...this.doc.leftElem.elem.getElementsByTagName('LI')].map(elem => elem.firstChild).filter(Boolean);
        }
        console.log('loadMenu2', src, wikiPath, this.links);
      }
      if (!this.doc) {
        this.doc = $().document(
          $('div'),
        );
        await this.loadMenu($().ref.home);

      }
      this.link = this.links.find(link => link.getAttribute('href') && link.getAttribute('href').toLowerCase() === linksrc);

      if (src.match(/wiki/)) {
        if (!this.link) {
          await this.loadMenu(src);
          console.log('LOADMENU', src);
          this.link = this.links.find(link => link.getAttribute('href') && link.getAttribute('href').toLowerCase() === linksrc);
        }
      } else if (!src.match(/\.md$/)) {
        src += '/README';
      }


      if (!src.match(/\.md$/)) {
        src += '.md';
      }
      this.src = src;

      // console.log(111, this.link, this.links);

      this.scrollTop = this.scrollTop || new Map();
      (this.url = $().url(src).accept('text/markdown').get()).then(async event => {
        // const url = new URL(document.location);
        // url.searchParams.set('p', startsrc);
        // $.history.replaceUrl(url.toString());
        // window.history.pushState('page', 'test1', '?md='+startsrc);
        // console.error(src, this.wikiPath);
        if (elem.pageElem && elem.pageElem.elem.parentElement) {
          elem.loadIndex = false;
          // console.log('elem.docElem', elem, elem.docElem && elem.docElem.elem.parentElement);
        } else {
          elem.loadIndex = true;
        }
				let content = event.target.responseText;
        if (callback) {
          content = callback(content);
        }
        const responseURL = event.target.responseURL;
        var title = responseURL.replace(/\/\//g,'/');
        var match = content.match(/^#\s(.*)/);
        if (match) {
          content = content.replace(/^#.*/,'');
          title = match[1];
        } else {
          title = title.match(/README.md$/)
          ? title.replace(/\/README.md$/,'').split('/').pop().split('.').shift().capitalize()
          : title.split('/').pop().split('.').shift().replace(/-/g,' ');
          title = title.replace(/-/,' ');
        }
        const date = event.target.getResponseHeader('last-modified');
				content = content.replace(/<\!-- sample button -->/gs,`<button onclick="$().demo(event)">Show sample</button>`);

				try {
					// eval('content=`'+content.replace(/\`/gs,'\\`')+'`;');
				} catch (err) {
					//console.error(err);
				}

				this.doc.docElem.text('').append(
          this.doc.navElem = $('nav'),
          $('h1').text(title),
          date ? $('div').class('modified').text(__('Last modified'), new Date(date).toLocaleString()) : null,
        )
        .md(content)
        .mdAddCodeButtons();
        [...this.doc.docElem.elem.getElementsByTagName('A')].forEach(elem => $(elem).href(hrefSrc(elem.getAttribute('href'), responseURL)));
        [...this.doc.docElem.elem.getElementsByTagName('IMG')].forEach(elem => {
          // let imgsrc = elem.getAttribute('src')||'';
          // if (imgsrc.match(/\/\//)) {
          //   const url = new URL(imgsrc);
          //   src = url.origin + url.pathname;
          // } else if (src.match(/^\//)) {
          //   const url = new URL(filename);
          //   src = url.origin + src;
          // } else {
          //   const url = new URL(src, filename.replace(/[^\/]+$/,''));
          //   src = url.origin + url.pathname;
          // }
          // src = src.replace(/\/wiki$/, '/wiki/Home');
          // src = src.replace(/github.com/, 'raw.githubusercontent.com');
          // src = src.replace(/raw.githubusercontent.com\/(.*?)\/wiki/, 'raw.githubusercontent.com/wiki/$1');
          // src = src.replace(/\/tree|\/blob/, '');
          elem.setAttribute('src', new URL(elem.getAttribute('src'), new URL(src, document.location)).href.replace(/^.*?\//,'/'));
        });
        setTimeout(() => this.doc.indexElem.index(this.doc.docElem));
        this.doc.docElem.elem.scrollTop = this.scrollTop.get(src);
        // return;
        // if (callback) callback(this.docElem);
        // this.indexElem.index(this.docElem);
        // [...this.docElem.elem.getElementsByClassName('code')].forEach(elem => {
        //   $(elem.previousElementSibling).class('row').append(
        //     $('button').class('abtn copy').css('margin-left: auto'),
        //     $('button').class('abtn edit').on('click', event => $(elem).editor()),
        //     $('button').class('abtn view').on('click', event => {
        //       const block = {
        //         html: '',
        //         css: '',
        //         js: '',
        //       };
        //       for (let codeElem of this.docElem.elem.getElementsByClassName('code')) {
        //         const type = codeElem.previousElementSibling.innerText.toLowerCase();
        //         if (type === 'html') {
        //           block[type] = block[type].includes('<!-- html -->') ? block[type].replace('<!-- html -->', codeElem.innerText) : codeElem.innerText;
        //         } else if (type === 'js') {
        //           block.html = block.html.replace(
        //             /\/\*\* js start \*\*\/.*?\/\*\* js end \*\*\//s, codeElem.innerText
        //           );
        //         } else if (type === 'yaml') {
        //           block.html = block.html.replace(
        //             /`yaml`/s, '`'+codeElem.innerText + '`',
        //           );
        //         } else if (type === 'css') {
        //           block.html = block.html.replace(
        //             /\/\*\* css start \*\*\/.*?\/\*\* css end \*\*\//s, codeElem.innerText
        //           );
        //         }
        //         if (codeElem === elem) break;
        //       }
        //       var html = block.html
        //       .replace('/** css **/', block.css)
        //       .replace('/** js **/', block.js);
        //       // console.log(html);
        //       const win = window.open('about:blank', 'sample');
        //       const doc = win.document;
        //       doc.open();
        //       doc.write(html);
        //       doc.close();
        //     }),
        //   )
        // });
        // // console.error(wikiPath);
        // this.links = this.links || [];
        // if (src.match(/wiki/)) {
        //   console.log(src);
        //   this.link = this.links.find(link => {
        //     console.log(link.getAttribute('href'));
        //     return link.getAttribute('href') === src;
        //   });
        //   if (!this.link) {
        //     var wikiPath = src.replace(/wiki.*/,'wiki');
        //     await $().url(wikiPath+'/_Sidebar.md').accept('text/markdown').get()
        //     .then(event => mdRewriteRef(event, this.leftElem.md(event.target.responseText)))
        //     .catch(console.error);
        //
        //     [...this.leftElem.elem.getElementsByTagName('A')].forEach(link => {
        //       if (!link.hasAttribute('open')) {
        //         link.setAttribute('open', '0');
        //         $(link).attr('open', '0').on('click', event => link.hasAttribute('selected') ? link.setAttribute('open', link.getAttribute('open') ^ 1) : null);
        //       }
        //       // $(link).attr('open', '0');
        //     })
        //     await $().url(wikiPath+'/_Footer.md').accept('text/markdown').get()
        //     .then(event => mdRewriteRef(event, $('section').class('footer').parent(this.docElem).md(event.target.responseText)))
        //     .catch(console.error);
        //   }
        //   this.links = [...this.leftElem.elem.getElementsByTagName('A')];
        //   this.links.forEach(link => link.removeAttribute('selected'));
        //   if (this.link = this.links.find(link => link.getAttribute('href') === src)) {
        //     $(this.link).attr('selected', '');
        //     for (var link = this.link; link; link = link.parentElement.parentElement.previousElementSibling) {
        //       $(link).attr('open', '1');
        //     }
        //   }
        // }
        return this;
			});

      this.links.forEach(link => link.removeAttribute('selected'));
      if (this.link) {
        $(this.link).attr('selected', '');
        for (var link = this.link; link; link = link.parentElement.parentElement ? link.parentElement.parentElement.previousElementSibling : null) {
          $(link).attr('open', '1');
        }
        this.doc.docNavTop.text('');
        if (this.link.parentElement.previousElementSibling) {
          this.doc.docNavTop.append(
            $('a').class('row prev').href(this.link.parentElement.previousElementSibling.firstChild.getAttribute('href')).append(
              $('span').text('←'),
              $('small').text(this.link.parentElement.previousElementSibling.firstChild.innerText),
            )
          )
        }
        if (this.link.parentElement.nextElementSibling) {
          this.doc.docNavTop.append(
            $('a').class('row next').href(this.link.parentElement.nextElementSibling.firstChild.getAttribute('href')).append(
              $('small').class('aco').text(this.link.parentElement.nextElementSibling.firstChild.innerText),
              $('span').text('→'),
            )
          )
        }
      }

      return this.url;
    },
    async maps(selector, referenceNode) {
			const maps = await $.maps();
			// if (!$.maps.script) {
			// 	return $.maps.script = $('script')
			// 	.attr('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAKNir6jia2uSgmEoLFvrbcMztx-ao_Oys&libraries=places')
			// 	.parent(document.head)
			// 	.on('load', event => arguments.callee.apply(this, arguments))
			// }
			// $.maps.showonmap (par.maps, el);
			// referenceNode = referenceNode || $.listview.listItemElement;
			// referenceNode.innerText = '';
			// //console.log('============================');
			// const myLatLng = { lat: -25.363, lng: 131.044 };
			// const map = new google.maps.Map(document.getElementById("map"), {
			// 	zoom: 4,
			// 	center: myLatLng,
			// });
			// new google.maps.Marker({
			// 	position: myLatLng,
			// 	map,
			// 	title: "Hello World!",
			// });
			// referenceNode.style = 'width:100%;height:500px;';
			// this.mapel = referenceNode;//referenceNode.createElement('DIV', { className: 'googlemap', style: 'width:100%;height:100%;' });
			let map = new maps.Map(this.elem, { zoom: 8 });
			bounds = new maps.LatLngBounds();
			geocoder = new maps.Geocoder();
			// var address = selector;//decodeURI(params).split('/').pop();
			// //console.debug(address);
			geocoder.geocode({
				'address': selector
			}, function(results, status) {
				if (status == maps.GeocoderStatus.OK) {
					$.marker = new maps.Marker({
						map: map,
						position: results[0].geometry.location
					});
					bounds.extend($.marker.getPosition());
					map.fitBounds(bounds);
					maps.event.addListenerOnce(map, 'bounds_changed', event => this.setZoom(Math.min(10, this.getZoom())));
				} else {
					// //console.debug('Geocode was not successful for the following reason: ' + status);
				}
			});
			// new $.maps(el, par.maps);
		},
    md(content) {
      console.log($.temp.api_parameters);
      for (let [key,value] of Object.entries($.temp.api_parameters)) {
        content = content.replace(key,value);
      }

      const div = $('div').html($.string.mdHtml(content));

			// this.elem.innerHTML += $.string.mdHtml(s);
      this.elem.append(...div.elem.childNodes);
			return this;
		},
    mdc(s) {
      const newlines = [];
      let level = 0;
      $.string.mdHtml(s).split(/\n/).forEach(line => {
        const match = line.match(/^<h(\d)>(>\s)/);
        if (match) {
          // line = line.replace(/h\d>/g,'summary>')
          // if (match[1]==level) {
          //   newlines.push('</details><details>'+line);
          // } else if (match[1]>level) {
          //   newlines.push('<details>'+line);
          // } else if (match[1]<level) {
          //   newlines.push('</details></details><details>'+line);
          // }
          line = '<summary>'+line.replace(/>\s/,'')+'</summary>';
          if (match[1]==level) {
            newlines.push('</details><details>'+line);
          } else if (match[1]>level) {
            newlines.push('<details>'+line);
          } else if (match[1]<level) {
            newlines.push('</details></details><details>'+line);
          }
          level = match[1];
          return;
        }
        return newlines.push(line);
      });
      this.elem.innerHTML += newlines.join('\n');
      [...this.elem.getElementsByTagName('DETAILS')].forEach(
        el => el.addEventListener('toggle', event => el.open ? ga('send', 'pageview', el.firstChild.innerText) : null)
      );
      //   if (el.open) {
      //     console.log(el.firstChild.innerText);
      //     ga('send', 'pageview', el.firstChild.innerText);
      //   }
      // }))
      // this.on('click', event => {
      //   const el = event.path.filter(el => el.tagName === 'SUMMARY').shift();
      //   if (el && el.firstChild) {
      //     // ga('send', 'event', 'click', el.firstChild.innerText);
      //     ga('send', 'pageview', el.firstChild.innerText);
      //     // ga('send', 'event', {
      //     //   'hitType': 'pageview',
      //     //   'page': 'Testpage'
      //     // });
      //     // ga('send', 'event', 'Videos', 'play', 'Fall Campaign');
      //     // ga('send', 'event', {
      //     //   'eventCategory': 'Category',
      //     //   'eventAction': 'Action'
      //     // });
      //     // ga('set', 'title', el.firstChild.innerText);
      //     console.log(el.firstChild.innerText);
      //   }
      // })
      return this;
    },
    mdAddCodeButtons(){
      [...this.elem.getElementsByClassName('code-header')].forEach(elem => {
        const elemHeader = $(elem);
        const elemCode = $(elem.nextElementSibling);
        elemHeader.append(
          $('button').class('abtn copy').css('margin-left: auto'),
          $('button').class('abtn edit').on('click', event => elemCode.editor(elemHeader.attr('ln'))),
          $('button').class('abtn view').on('click', event => {
            const block = {
              html: '',
              css: '',
              js: '',
            };
            for (let codeElem of this.docElem.elem.getElementsByClassName('code')) {
              const type = codeElem.previousElementSibling.innerText.toLowerCase();
              if (type === 'html') {
                block[type] = block[type].includes('<!-- html -->') ? block[type].replace('<!-- html -->', codeElem.innerText) : codeElem.innerText;
              } else if (type === 'js') {
                block.html = block.html.replace(
                  /\/\*\* js start \*\*\/.*?\/\*\* js end \*\*\//s, codeElem.innerText
                );
              } else if (type === 'yaml') {
                block.html = block.html.replace(
                  /`yaml`/s, '`'+codeElem.innerText + '`',
                );
              } else if (type === 'css') {
                block.html = block.html.replace(
                  /\/\*\* css start \*\*\/.*?\/\*\* css end \*\*\//s, codeElem.innerText
                );
              }
              if (codeElem === elem) break;
            }
            var html = block.html
            .replace('/** css **/', block.css)
            .replace('/** js **/', block.js);
            console.log(html);
            return;
            const win = window.open('about:blank', 'sample');
            const doc = win.document;
            doc.open();
            doc.write(html);
            doc.close();
          }),
        )
      });
      return this;
    },
    media: new Media(),
    menuitems: {
			copy: { Title: 'Kopieren', key: 'Ctrl+C', onclick: function() { app.selection.copy(); } },
			cut: { Title: 'Knippen', key: 'Ctrl+X', onclick: function() { app.selection.cut(); } },
			paste: { Title: 'Plakken', key: 'Ctrl+V', onclick: function() { app.selection.paste(); } },
			hyperlink: { Title: 'Hyperlink plakken', key: 'Ctrl+K', onclick: function() { app.selection.link(); } },
			del: { Title: 'Verwijderen', key: 'Ctrl+Del', onclick: function() { app.selection.delete(); } },
			//add: {
			//    Title: 'Nieuw',
			//    click: function() { // //console.debug(this); },
			//    menu: {
			//        map: { Title: 'Map', key: 'Ctrl+N', },
			//        contact: { Title: 'Contact', },
			//    }
			//},
			move: {
				Title: 'Verplaatsen',
				popupmenu: {
					moveup: { Title: 'Omhoog', key: 'Alt+Shift+Up', },
					movedown: { Title: 'Omlaag', key: 'Alt+Shift+Dwon', },
					ident: { Title: 'Inspringen', key: 'Alt+Shift+Right', },
					outdent: { Title: 'Terughalen', key: 'Alt+Shift+Left', },
				}
			},
			//cat: {
			//    Title: 'Categoriseren',
			//    menu: {
			//        Ja: { Title: 'Ja', color: 'black', },
			//        Nee: { Title: 'Nee', color: 'red', },
			//        Groen: { Title: 'Groen', color: 'green', },
			//        Blauw: { Title: 'Blauw', color: 'blue', },
			//    }
			//},
			state: {
				Title: 'Status',
				//menu: this.item.class.fields.state.options
			},
		},
    modelDigraph(data){
      const schemas = $().schemas();
      (async () => {
        const element = this.elem;
        function init() {
          if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
          var $ = go.GraphObject.make;  // for conciseness in defining templates
          var make = $;
          myDiagram =
          $(go.Diagram, element,  // must be the ID or reference to div
          {
            initialAutoScale: go.Diagram.UniformToFill,
            initialContentAlignment : go.Spot.Center,
            "commandHandler.zoomFactor": 1.01,
            layout: $(go.LayeredDigraphLayout)
            // other Layout properties are set by the layout function, defined below
          });
          // define the Node template
          myDiagram.nodeTemplate =
          $(
            go.Node,
            "Spot",
            {
              locationSpot: go.Spot.Center
            },
            $(
              go.Shape,
              "Rectangle",
              {
                fill: "lightgray",  // the initial value, but data binding may provide different value
                stroke: null,
                desiredSize: new go.Size(120, 30)
              },
              new go.Binding("fill", "fill")
            ),
            $(
              go.TextBlock,
              new go.Binding("text", "text")
            )
          );
          // define the Link template to be minimal
          myDiagram.linkTemplate =
          $(go.Link,
            { selectable: false },
            $(go.Shape,
              {
                strokeWidth: 3,
                // stroke: "#333",
                // stroke: "red",
              },
              new go.Binding("stroke", "stroke"),
            )
          );
          fill = make(go.Brush, "Radial", { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" } );
          shape = make(go.Shape, { fill: fill, stroke: null } );
          textBlock = make(go.TextBlock, { textAlign: "center", font: "10pt helvetica, arial, sans-serif", stroke: "#555555", margin: 4 }, new go.Binding("text", "text") );
          let link = make(go.Panel, "Auto", shape, textBlock );
          let linkFrom = make(go.Shape, { stroke: "color" });
          let linkTo = make(go.Shape, { toArrow: "standard", stroke: null });
          // replace the default Link template in the linkTemplateMap
          myDiagram.linkTemplate = make(go.Link, linkFrom, linkTo, link);
          // generate a tree with the default values
          // nodeArray = [
          //   {key:1, text:'1', fill:go.Brush.randomColor()},
          //   {key:2, text:'1', fill:go.Brush.randomColor()},
          // ];
          // linkArray = [
          //   { from: 1, to: 2 }
          // ];
          //console.log(data.items);
          function getSchema(schemaPath) {
            // console.log(schemaPath, schemas.get(schemaPath));
            // , $().schemas().has(schemaPath));
            // console.log($().schemas().get(schemaPath));
            return schemas.get(schemaPath) || {};
            // return schemaPath.split(':').filter(schemaName => $().schemas().has(schemaName)).map(schemaName => $().schemas().get(schemaName)).shift() || {};
          }
          // data.items.forEach(item => item.fill = go.Brush.randomColor());
          // data.items.forEach(item => item.fill = 'blue');
          data.items.forEach(item => item.fill = getSchema(item.schemaPath).color || 'red');
          // data.items.forEach(item => {
          //   console.log(item);
          //   item.fill = 'red';
          // });
          colors = {
            link: 'red',
            parent: 'green',
            copyfrom: 'blue',
          };
          data.links.forEach(link => link.stroke = colors[link.category] );
          myDiagram.model.nodeDataArray = data.items;//nodeArray;
          myDiagram.model.linkDataArray = data.links;//linkArray;
          layout();
        }
        function layout() {
          myDiagram.startTransaction("change Layout");
          var lay = myDiagram.layout;
          lay.direction = 180;
          lay.direction = 0;
          lay.direction = 90;
          lay.direction = 270;
          lay.layerSpacing = 25;
          lay.columnSpacing = 25;
          lay.cycleRemoveOption = go.LayeredDigraphLayout.CycleDepthFirst;
          lay.cycleRemoveOption = go.LayeredDigraphLayout.CycleGreedy;
          lay.layeringOption = go.LayeredDigraphLayout.LayerLongestPathSource;
          lay.layeringOption = go.LayeredDigraphLayout.LayerLongestPathSink;
          lay.layeringOption = go.LayeredDigraphLayout.LayerOptimalLinkLength;
          lay.initializeOption = go.LayeredDigraphLayout.InitDepthFirstOut;
          lay.initializeOption = go.LayeredDigraphLayout.InitDepthFirstIn;
          lay.initializeOption = go.LayeredDigraphLayout.InitNaive;
          lay.aggressiveOption = go.LayeredDigraphLayout.AggressiveNone;
          lay.aggressiveOption = go.LayeredDigraphLayout.AggressiveMore;
          lay.aggressiveOption = go.LayeredDigraphLayout.AggressiveLess;
          lay.packOption = parseInt(0, 10);
          // lay.packOption |= parseInt(1, 10);
          // lay.packOption |= parseInt(2, 10);
          lay.packOption |= parseInt(4, 10);
          lay.setsPortSpots = false;
          myDiagram.commitTransaction("change Layout");
          myDiagram.alignDocument(go.Spot.Center, go.Spot.Center);
          // return;
          //
          // var direction = getRadioValue("direction");
          // direction = parseFloat(direction, 10);
          // lay.direction = direction;
          //
          // var layerSpacing = document.getElementById("layerSpacing").value;
          // layerSpacing = parseFloat(layerSpacing, 10);
          // lay.layerSpacing = layerSpacing;
          //
          // var columnSpacing = document.getElementById("columnSpacing").value;
          // columnSpacing = parseFloat(columnSpacing, 10);
          // lay.columnSpacing = columnSpacing;
          //
          // var cycleRemove = getRadioValue("cycleRemove");
          // if (cycleRemove === "CycleDepthFirst") lay.cycleRemoveOption = go.LayeredDigraphLayout.CycleDepthFirst;
          // else if (cycleRemove === "CycleGreedy") lay.cycleRemoveOption = go.LayeredDigraphLayout.CycleGreedy;
          //
          // var layering = getRadioValue("layering");
          // if (layering === "LayerOptimalLinkLength") lay.layeringOption = go.LayeredDigraphLayout.LayerOptimalLinkLength;
          // else if (layering === "LayerLongestPathSource") lay.layeringOption = go.LayeredDigraphLayout.LayerLongestPathSource;
          // else if (layering === "LayerLongestPathSink") lay.layeringOption = go.LayeredDigraphLayout.LayerLongestPathSink;
          //
          // var initialize = getRadioValue("initialize");
          // if (initialize === "InitDepthFirstOut") lay.initializeOption = go.LayeredDigraphLayout.InitDepthFirstOut;
          // else if (initialize === "InitDepthFirstIn") lay.initializeOption = go.LayeredDigraphLayout.InitDepthFirstIn;
          // else if (initialize === "InitNaive") lay.initializeOption = go.LayeredDigraphLayout.InitNaive;
          //
          // var aggressive = getRadioValue("aggressive");
          // if (aggressive === "AggressiveLess") lay.aggressiveOption = go.LayeredDigraphLayout.AggressiveLess;
          // else if (aggressive === "AggressiveNone") lay.aggressiveOption = go.LayeredDigraphLayout.AggressiveNone;
          // else if (aggressive === "AggressiveMore") lay.aggressiveOption = go.LayeredDigraphLayout.AggressiveMore;
          //
          // //TODO implement pack option
          // var pack = document.getElementsByName("pack");
          // var packing = 0;
          // for (var i = 0; i < pack.length; i++) {
          //   if (pack[i].checked) packing = packing | parseInt(pack[i].value, 10);
          // }
          // lay.packOption = packing;
          //
          // var setsPortSpots = document.getElementById("setsPortSpots");
          // lay.setsPortSpots = setsPortSpots.checked;
          //
          // myDiagram.commitTransaction("change Layout");
        }
        init();
      })();
			return this;
		},
    modelLinks(data){
			(async () => {
        // $.amcharts4core = $.amcharts4core = await this.script('/api/lib/amcharts4/core.js');
				$.script.importGraph = $.script.importGraph = await this.script('https://aliconnect.nl/v1/api/js/graph.js');
        // return;
				const make = go.GraphObject.make;  // for conciseness in defining templates
				const diagram = make(go.Diagram, this.elem, {
					initialAutoScale: go.Diagram.Uniform,  // an initial automatic zoom-to-fit
					contentAlignment: go.Spot.Center,  // align document to the center of the viewport
					layout: make(go.ForceDirectedLayout, {
						maxIterations: 200,
						defaultSpringLength: 30,
						defaultElectricalCharge: 100
					})
				});
				// define each Node's appearance
				let fill = make(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" } );
				let shape = make(go.Shape, "RoundedRectangle", { fill: fill, stroke: "black" }, new go.Binding("fill", "fill") );
				let textBlock = make(go.TextBlock, { font: "bold 10pt helvetica, bold arial, sans-serif", margin: 4 }, new go.Binding("text", "text") );
				diagram.nodeTemplate = make(go.Node, "Auto", { locationSpot: go.Spot.Center }, shape, textBlock);
				fill = make(go.Brush, "Radial", { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" } );
				shape = make(go.Shape, { fill: fill, stroke: null } );
				textBlock = make(go.TextBlock, { textAlign: "center", font: "10pt helvetica, arial, sans-serif", stroke: "#555555", margin: 4 }, new go.Binding("text", "text") );
				let link = make(go.Panel, "Auto", shape, textBlock );
				let linkFrom = make(go.Shape, { stroke: "color" });
				let linkTo = make(go.Shape, { toArrow: "standard", stroke: null });
				// replace the default Link template in the linkTemplateMap
				diagram.linkTemplate = make(go.Link, linkFrom, linkTo, link);
				diagram.toolManager.clickSelectingTool.standardMouseSelect = function(event) {
					//// //console.log('CLICK', event, this);
					var diagram = this.diagram;
					if (diagram === null || !diagram.allowSelect) return;
					var event = diagram.lastInput;
					var count = diagram.selection.count;
					var curobj = diagram.findPartAt(event.documentPoint, false);
					// //console.log('CLICK', event, this, event, count, curobj);
					if (curobj !== null) {
						// //console.log('standardMouseSelect', curobj);
						// $().request(curobj.Cg.item.$id);
					} else if (event.left && !(event.control || event.meta) && !event.shift) {
						// left click on background with no modifier: clear selection
						diagram.clearSelection();
					}
				};
				diagram.model = new go.GraphLinksModel(data.items, data.links);
			})();
			return this;
		},
    modelTraverse(data){
      (async () => {
        var names = {}; // hash to keep track of what names have been used
        const element = this.elem;
        function init() {
          if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
          var $ = go.GraphObject.make;  // for conciseness in defining templates
          myDiagram =
          $(go.Diagram, element,
          {
            initialAutoScale: go.Diagram.UniformToFill,
            // define the layout for the diagram
            layout: $(go.TreeLayout, { nodeSpacing: 5, layerSpacing: 30 })
          });
          // Define a simple node template consisting of text followed by an expand/collapse button
          myDiagram.nodeTemplate =
          $(go.Node, "Horizontal",
          { selectionChanged: nodeSelectionChanged },  // this event handler is defined below
          $(go.Panel, "Auto",
          $(go.Shape, { fill: "#1F4963", stroke: null }),
          $(go.TextBlock,
            {
              font: "bold 13px Helvetica, bold Arial, sans-serif",
              stroke: "white", margin: 3
            },
            new go.Binding("text", "text"))
          ),
          $("TreeExpanderButton")
        );
        // Define a trivial link template with no arrowhead.
        myDiagram.linkTemplate =
        $(go.Link,
          { selectable: false },
          $(go.Shape));  // the link shape
          // create the model for the DOM tree
          //console.log(data, data.items)
          myDiagram.model =
          $(go.TreeModel, {
            isReadOnly: true,  // don't allow the user to delete or copy nodes
            // build up the tree in an Array of node data
            nodeDataArray: data.links,
            // [
            //   {key:'a', name:'aasfa', },
            //   {key:'c', name:'aasfa', parent: 'a'},
            //   {key:'a1', name:'basdfa', parent: 'a'},
            //   {key:'c1', name:'basdfa', parent: 'c'},
            //   {key:'c1', name:'basdfa', parent: 'a'},
            // ],//traverseDom(document.activeElement)
          });
        }
        // Walk the DOM, starting at document, and return an Array of node data objects representing the DOM tree
        // Typical usage: traverseDom(document.activeElement)
        // The second and third arguments are internal, used when recursing through the DOM
        function traverseDom(node, parentName, dataArray) {
          if (parentName === undefined) parentName = null;
          if (dataArray === undefined) dataArray = [];
          // skip everything but HTML Elements
          if (!(node instanceof Element)) return;
          // Ignore the navigation menus
          if (node.id === "navindex" || node.id === "navtop") return;
          // add this node to the nodeDataArray
          var name = getName(node);
          var data = { key: name, name: name };
          dataArray.push(data);
          // add a link to its parent
          if (parentName !== null) {
            data.parent = parentName;
          }
          // find all children
          var l = node.childNodes.length;
          for (var i = 0; i < l; i++) {
            traverseDom(node.childNodes[i], name, dataArray);
          }
          return dataArray;
        }
        // Give every node a unique name
        function getName(node) {
          var n = node.nodeName;
          if (node.id) n = n + " (" + node.id + ")";
          var namenum = n;  // make sure the name is unique
          var i = 1;
          while (names[namenum] !== undefined) {
            namenum = n + i;
            i++;
          }
          names[namenum] = node;
          return namenum;
        }
        // When a Node is selected, highlight the corresponding HTML element.
        function nodeSelectionChanged(node) {
          if (node.isSelected) {
            names[node.data.name].style.backgroundColor = "lightblue";
          } else {
            names[node.data.name].style.backgroundColor = "";
          }
        }
        init();
      })();
			return this;
		},
    mse: {
			Contacts: {
				/** @function $.mse.Contacts.find
				*/
				find: function() {
					if (!$.mse.loggedin === undefined) setTimeout(arguments.callee.bind(this), 500);
					var url = "/api/v2.0/me/contacts?$select=DisplayName&$top=1000&$order=LastModifiedDateTime+DESC";
					$.https.request ({ hostname: "outlook.office.com", path: url, headers: $.mse.headers }, function(event) {
						//console.log("OUTLOOK contacts", event.body);
						if (!event.body || !event.body.Value) return;
						event.body.Value.forEach(function(row){
							row.req = {headers: $.mse.headers, path: row['@odata.id'] };
							row.Title = row.DisplayName
						});
						Listview.show(event.body.Value);
					});
				},
			},
			Messages: {
				/** @function $.mse.Messages.find
				*/
				find: function(){
					//console.log(this);
					var url = "/api/v2.0/me/messages?$select=*&$top=10&order=LastModifiedDateTime DESC";
					$.https.request ({ hostname: "outlook.office.com", path: url, headers: $.mse.headers }, function(event) {
						//console.log("OUTLOOK messsages", event.body);
						if (!event.body || !event.body.Value) return;
						event.body.Value.forEach(function(row){
							row.req = {headers: $.mse.headers, path: row['@odata.id'] };
							row.Title = row.From.EmailAddress.Name;
							row.Subject = row.Subject;
						});
						Listview.show(event.body.Value);
					});
				},
			},
			Events: {
				/** @function $.mse.Events.find
				*/
				find: function(){
					var url = "/api/v2.0/me/es?$select=*&$top=10";
					$.https.request ({ hostname: "outlook.office.com", path: url, headers: $.mse.headers }, function(event) {
						event.body.Value.forEach(function(row){
							row.Title = row.Subject;
							row.Subject = row.Start.DateTime + row.End.DateTime;
							row.Summary = row.BodyPreview;
							row.req = {headers: $.mse.headers, path: row['@odata.id'] };
						});
						Listview.show(event.body.Value);
						//console.log("OUTLOOK DATA", this.getHeader("OData-Version"), event.body);
					});
				},
			},
			Calendarview: {
				/** @function $.mse.Calendarview.find
				*/
				find: function() {
					var url = "/api/v2.0/me/calendarview?startDateTime=2017-01-01T01:00:00&endDateTime=2017-03-31T23:00:00&$select=Id, Subject, BodyPreview, HasAttachments&$top=100";
					$.https.request ({ hostname: "outlook.office.com", path: url, headers: $.mse.headers }, function(event) {
						event.body.Value.forEach(function(row){
							row.Title = row.Subject;
							row.req = {headers: $.mse.headers, path: row['@odata.id'] };
						});
						Listview.show(event.body.Value);
						//console.log("OUTLOOK DATA", this.getHeader("OData-Version"), event.body);
					});
				},
			},
			userdata: {},
			login: function() {
				return;
				if (!$.paths || !$.paths['/mse/login']) return $.mse.loggedin = null;
				$.api.request ({ path: '/mse/login' }, function(event) {
					if (!event.body || !event.body.access_token) return $.mse.loggedin = false;
					$.mse.loggedin = true;
					this.userdata = event.body;
					var mse_access_token = event.body.access_token.split('-');
					var access = mse_access_token[0].split('.');
					var header = JSON.parse(atob(access[0]));
					this.payload = JSON.parse(atob(access[1]));
					// //console.log("RT", event.body.refresh_token);
					// //console.log("RT", event.body.refresh_token.split('.'));
					// for (var i=0, c=event.body.refresh_token.split('-'), code;i<c.length;i++) {
					// 	//console.log("C1", i, c[i]);
					// 	try { //console.log("E1", i, atob(c[i])); } catch(err) {}
					// 	for (var i2=0, c2=c[i].split('_'), code2;i2<c2.length;i2++) {
					// 		//console.log("C1", i, "C2", i2, c2[i2]);
					// 		try { //console.log("C1", i, "E2", i2, atob(c2[i2])); } catch(err) {}
					// 	}
					// }
					// //console.log("MSE", event.body.refresh_token.split('-'));
					var timeleft = Math.round(this.payload.exp * 1000 - new Date().getTime());
					// //console.log("MSE USER DATA", this.responseText, header, this.payload);
					this.headers = {
						"Authorization": "Bearer " + this.userdata.access_token,
						"Accept": "application/json",
						"client-request-id": $().client_id,
						"return-client-request-id": "true",
						"X-AnchorMailbox": this.userdata.preferred_username,
					};
					setTimeout(this.login, timeleft<0 ? 5000 : timeleft-10);
					rowinfo.createElement('SPAN', 'mse', this.payload.unique_name);
					this.userdata.login_url = this.userdata.login_url + "&state=" + btoa(document.location.href);
					// , href: "https://login.microsoftonline.com/common/oauth/v2.0/authorize?response_type=code&client_id=24622611-2311-4791-947c-5c1d1b086d6c&redirect_uri=https://aliconnect.nl/$/v1/api/mse.php&state=" + [$.config.$.domain].join("+") + "&prompt=login&scope=openid offline_access profile email https://outlook.office.com/mail.readwrite https://outlook.office.com/calendars.readwrite https://outlook.office.com/contacts.readwrite https://outlook.office.com/people.read"
					// rowinfo.createElement('SPAN').createElement('A', {innerText: 'login', href: $.mse.btnLogin.href = this.userdata.login_url = this.userdata.login_url + "&state=" + btoa(document.location.href) });
				}.bind(this));
			},
		},
    navlist(selector, context) {
			(function init(parent, selector, context) {
				if (selector) {
					if (typeof selector === 'string') {
						const li = $('li').parent(parent);
						const a = $('a').parent(li).attr('id', 'nav'+selector).text(selector.replace(/^\d+-/,''));
						if (context && typeof context === 'object') {
							Object.entries(context).forEach(entry => {
								if (typeof entry[1] === 'object') {
									a.attr('open', a.attr('open') || '0');
									const ul = li.ul = li.ul || $('ul').parent(li);
									init(ul, ...entry);
								} else if (typeof entry[1] === 'function') {
									a.elem[entry[0]] = entry[1];
								} else {
									a.attr(...entry);
								}
							});
							a.class('abtn')
						}
					} else {
						if (Array.isArray(selector)) {
							selector.forEach(item => init(parent, item))
						} else if (selector instanceof Object) {
							Object.entries(selector).forEach(entry => init(parent, ...entry));
						}
					}
				}
			})(this, ...arguments);
			return this;
		},
    on(selector, context) {
			if (typeof selector === 'object') {
				Object.entries(selector).forEach(entry => this.on(...entry))
			} else {
				// //console.log(selector, 'on'+selector in this.elem, this.elem['on'+selector])
				if (('on'+selector in this.elem) && !this.elem['on'+selector]) {
					this.elem['on'+selector] = context
					// //console.log('JA', this.elem['on'+selector])
				} else {
					this.elem.addEventListener(...arguments);
				}
			}
			// //console.log(this.elem, ...arguments);
			return this;
		},
    open(state) {
      if (!arguments.length) {
        return this.elem.hasAttribute('open')
      }
			if ('open' in this.elem) {
        this.elem.open = state;
      } else {
        this.attr('open', state ? '' : null);
      }
      return this;
    },
    operations(selector){
			this.append(Object.entries(selector).map(entry =>
				$('button').class('abtn', entry[0]).attr(name, entry[0]).assign(entry[1])
			))
		},
    payform(params){
			// if (!$.shop.customer || !$.shop.customer.Product) return;
			let subtotal = 0;
			function nr(val) {
				return Number(val).toLocaleString(undefined, {minimumFractionDigits: 2});
			}
			this.append(
				$('form')
				.class('col aco payform doc-content')
				.attr('action', '/?order')
				.attr('novalidate', 'true')
				// .on('submit', event => {
				// 	//console.log('submit', order);
				// 	event.preventDefault();
				// 	for (var i=0, el;el=this.elements[i];i++) {
				// 		if (el.required && el.offsetParent && !el.value) {
				// 			el.focus();
				// 			// return false;
				// 		}
				// 	}
				// 	this.order.value = JSON.stringify(order);
				// 	new $.HttpRequest($.config.$, 'POST', '/?order', this);
				// 	return false;
				// })
				.append(
					$('fieldset').append(
						$('legend').text('Vul je gegevens in'),
						$('div').text('Heb je al een account? Dan kun je inloggen.'),
						$('div').properties({
							Type: { format:'radio', required:true, options: {
								particulier: { },
								zakelijk: {},
							}},
							CompanyName: {required1: true, autofocus: true, value: params.customer.Title},
							FirstName: { required1: true },
							LastName: { required1: true },
							BusinessPhone0: { type: 'tel', required1: true },
							EmailAddress0: { type: 'email', required1: true, autocomplete: false },
							gender: { format:'radio', options: {
								male: { color: 'red' },
								female: { color: 'green' },
							} },
							OtherAddress: { format: 'address' },
							hasBusinessAddress: { format: 'checkbox' },
							BusinessAddress: { format: 'address' },
							NewsLetter: { format: 'checkbox', title: 'Ja, ik wil nieuwsbrieven ontvangen.' },
							SendDeals: { format: 'checkbox', title: 'Ja, stuur mij relevante deals afgestemd op mijn interesses' },
							CreateAccount: { format: 'checkbox', title: 'Ik wil een account aanmaken' },
							Password: { type: 'password', autocomplete:'new-password' },
							day: { type:'number', min: 1, max: 31, value:'1' },
							month: { type:'number', min: 1, max: 12, value:'1' },
							year: { type:'number', min: 1900, max: 2020, value:'2000' },
						}),
					),
					$('fieldset').append(
						$('legend').text('Kies een verzendmethode'),
						$('div').text('Maak een keuze: (zie Verzendkosten)'),
						$('div').properties({
							verzending: { format:'radio', required:true, className:'col', options: {
								afleveradres: {
									title: 'Bezorgen op het afleveradres',
									checked:1,
								},
								westerfoort: {
									title: 'Afhalen in Westerfoort',
									info: 'Openingstijden: di/wo/vr: 9:00-18:00\Ado: 9:00-20:00, za: 09:00-17:00\AAdres: Hopjesweg 12A, 1234AB, Westerfoort',
								},
								dhl: {
									title: 'Afhalen bij een DHL ServicePoint'
								},
							}}
						}),
					),
					$('fieldset').append(
						$('legend').text('Kies een betaalmethode'),
						$('div').text('Kies de betaalmethode die je makkelijk vindt.'),
						$('div').properties({
							paymethod: { format:'radio', required:true, options: {
								oprekening: {
									title: 'Achteraf betalen',
									unit: '+2%',
									checked: 1,
								},
								contant: {
									title: 'Contant bij afhalen',
								},
								ideal: {
									title: 'iDEAL',
								},
								paypal: {
									title: 'PayPAL',
									unit: '+2%',
									disabled: true,
								},
								mastercard: {
									disabled: true,
								},
								visa: {
									disabled: true,
								},
								meastro: {
									disabled: true,
								},
							}},
							issuer_id: {
								title: 'Kies bank.',
								id: 'issuerID',
								options: {
									0031: 'ABN Amro bank',
									0761: 'ASN Bank',
									0802: 'bunq',
									0721: 'ING',
									0801: 'Knab',
									0021: 'Rabobank',
									0771: 'RegioBank',
									0751: 'SNS Bank',
									0511: 'Triodos Bank',
									0161: 'Van Lanschot Bankiers',
								}
							}
						}),
					),
					$('fieldset').append(
						$('legend').text('Waardebon- of actiecode invoeren'),
					).properties({
						discountcode: { title: 'Waardebon- of actiecode invoeren' },
						// }).operations({
						// 	activate: { type: 'button' },
					}),
					$('fieldset').class('col').append(
						$('legend').text('Overzicht van je bestelling'),
						$('table').append(
							$('thead').append(
								$('tr').append(
									'Omschrijving,Aantal,Prijs,Totaal'.split(',').map(val => $('th').text(val)),
								),
							),
							$('tbody').append(
								params.rows.map(
									row => $('tr').append(
										Object.values(row).map(
											val => $('td').text(
												isNaN(val)
												? val
												: nr(val, subtotal += row.tot = Math.round(row.amount * row.price * 100) / 100)
											)
										)
									)
								),
								$('tr').append(
									$('td').text('Verzendkosten').attr('colspan', 3),
									$('td').text(nr(params.verzendkosten, subtotal += params.verzendkosten)),
								),
								$('tr').append(
									$('td').text('Transactiekosten').attr('colspan', 3),
									$('td').text(nr(params.transactiekosten, subtotal += params.transactiekosten)),
								),
								$('tr').append(
									$('td').text(`BTW ${params.btw}% over ${nr(subtotal)}`).attr('colspan', 3),
									$('td').text(nr(params.btw = Math.round(subtotal * params.btw) / 100, subtotal += params.btw)),
								),
								$('tr').append(
									$('td').text('TE BETALEN').attr('colspan', 3),
									$('td').text(nr(subtotal)),
								),
							),
						),
						$('input').attr('hidden', '').attr('name', 'order'),
						$('div').text('Als je op de bestelknop klikt ga je akkoord met onze algemene leveringsvoorwaarden.'),
						// $('div').class('row btns').operations({
						// 	activate: { label: 'Bestellen en betalen', default:true },
						// }),
						$('div').text('Door op de bestelknop te klikken rond je de bestelling af.'),
						$('div').text('Als je nu bestelt, gaan we direct aan de slag!'),
					),
				),
			)
		},
    prompts() {
      this.append([...arguments].map(name=>$('a').class('abtn', name).caption(name).href('#?prompt='+name)));
      return this;
    },
    parent(selector){
			$(selector).append(this.elem);
			return this;
		},
    path(){
			const path = [];
			for (let p = this.elem; p ;p = p.parentElement) {
				// //console.log(p);
				path.push(p);
			}
			return path;
		},
    properties(properties) {
      [...arguments].filter(Boolean).forEach(properties => {
        let elem = this.elem;
  			let parent = this;
  			let selector = parent;
  			const format = {
          address: {
  					edit() {
  						const addressField = this.property;
              const item = this.property.item;
              const prefix = this.property.name;
              // console.log(prefix);
              function onchange (event) {
  							const formElement = event.target.form;
                item[event.target.name] = event.target.value;
  							event.target.modified = true;
  							let address = [
                  ['Street', 'Number'].map(name => formElement[prefix + name].value).filter(Boolean).join('+'),
                  ['PostalCode', 'City'].map(name => formElement[prefix + name].value).filter(Boolean).join('+'),
                  ['Country'].map(name => formElement[prefix + name].value).filter(Boolean).join('+'),
  							].join(',');
                // console.log(address, formElement);
  							$().url('https://maps.googleapis.com/maps/api/geocode/json').query({
  								address: address,
  								key: 'AIzaSyAKNir6jia2uSgmEoLFvrbcMztx-ao_Oys',
  							}).get().then(event => {
  								let compnames = {
  									route: prefix + 'Street',
  									sublocality_level_2: prefix + 'Street',
  									sublocality: prefix + 'Street',
  									street_number: prefix + 'Number',
  									postal_code: prefix + 'PostalCode',
  									locality: prefix + 'City',
  									administrative_area_level_2: prefix + 'Town',
  									administrative_area_level_1: prefix + 'State',
  									country: prefix + 'Country',
  								};
  								event.body.results.forEach(result => {
  									if (result.address_components) {
  										result.address_components.forEach(comp => {
  											comp.types.forEach(type => {
  												fieldname = compnames[type];
                          // console.log(type);
  												if (formElement[fieldname] && !formElement[fieldname].modified) {
  													item[fieldname] = formElement[fieldname].value = comp.long_name;
  												}
  											})
  										});
  									}
  								});
  							});
  						};
              function prop (selector, options) {
                return $('span').class('col aco prop input').append(
                  $('input').id(prefix + selector).name(prefix + selector).value(item[prefix + selector]).class('inp')
                  .placeholder(' ').on('change', onchange),
                  $('label').for(prefix + selector).ttext('Address' + selector),
                  $('i'),
                )
              }
              this.selector.append(
                $('div').class('row wrap').append(prop('Street'), prop('Number')),
                $('div').class('row wrap').append(prop('PostalCode'), prop('City')),
                $('div').class('row wrap').append(prop('Town'), prop('State'), prop('Country')),
              );
  					},
  				},
          cam: {
  					className: 'doc-content',
  					createInput: function() {
  						let snap = 0;
  						let camElement = this.elEdit.createElement('div', 'cam col', [
  							['div', 'row top w', [
  								['button', 'abtn icn r save', 'save', {onclick() {
  									$('video').pause();
  									let canvas = camElement.createElement('canvas', {
  										width: 640,
  										height: 480,
  									});
  									let context = canvas.getContext("2d");
  									context.drawImage(video, 0, 0, 640, 480);
  									data = canvas.toDataURL("image/png");
  									//console.log(data);
  									// UPLOAD DATA
  									canvas.remove();
  									// App.files.fileUpload(this.item, { name: 'photo.png' }, $('canvas').toDataURL("image/png"));
  								}}],
  							]],
  							['video', 'aco', { id:'video', autoplay: true, width: 640, height: 480, onclick() {
  								let video = $('video');
  								if (video.paused) {
  									$('video').play();
  								} else {
  									$('video').pause();
  								}
  							}}],
  						]);
  						if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  							navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  								try {
  									$('video').srcObject = stream;
  								} catch (error) {
  									$('video').src = window.URL.createObjectURL(stream);
  								}
  								if ($('video')) {
  									$('video').play();
  								}
  							});
  						}
  					},
  				},
          // check: {
  				// 	createInput: function() {
  				// 		this.elEdit.className += ' fw';
  				// 		var values = this.value.split(', ');
  				// 		this.elInp = this.elEdit.createElement('DIV', { className: 'inp row wrap' });
  				// 		this.options = this.options || this.enum;
  				// 		for (var optionname in this.options) {
  				// 			var option = this.options[optionname];
  				// 			var elInpOption = this.elInp.createElement('span', { className: 'radiobtn check' });
  				// 			elInpOption.createElement('INPUT', {
  				// 				el: this.elInp, type: 'checkbox', id: this.name + optionname, value: optionname, checked: (values.indexOf(optionname) != -1) ? 1 : 0, onclick: function(event) {
  				// 					var c = this.elEdit.getElementsByTagName('INPUT');
  				// 					var a = [];
  				// 					for (var i = 0, event; event = c[i]; i++) if (event.checked) a.push(event.value);
  				// 					this.elEdit.newvalue = a.join(', ');
  				// 				}
  				// 			});
  				// 			elInpLabel = elInpSpan.createElement('LABEL', { for: this.name + optionname  });
  				// 			elInpLabel.createElement('icon').style.backgroundColor = option.color;
  				// 			elInpLabel.createElement('span', { innerText: option.Title });
  				// 		}
  				// 		//this.elEdit.createElement('LABEL', { innerText: this.placeholder });
  				// 	}
  				// },
          checkbox: {
  					view() {
              $('div')
  						.parent(this.selector)
  						.class('row prop check',this.property.format,this.property.name)
  						.append(
                $('label').class('check').text(this.property.title || this.property.name),
  							$('label').ttext(this.displayvalue)
  						);
  						return this;
  					},
  					edit() {
              const property = this.property;
              let value = this.value || this.defaultValue;
              // var forId = ['property',this.name].join('_');
              console.log('CEHCKBOX', this.name);
							$('div').parent(this.selector).class('col input check',this.format || this.type || '',this.property.name).append(
                $('div').class('row check').append(
                  $('input')
                  .on('change', event => this.value = event.target.checked ? 'on' : null)
                  .type('checkbox')
                  // .name(this.name)
                  // .attr(this)
                  .checkbox(this, this.property, this.attributes),
                )
							);
              // return;
              // const elements = [];
  						// const inputElement = this.selector;
              //
              //
  						// let el = inputElement.createElement('DIV', ['col input check',property.format,property.name].join(' '));
              //
              // let value = this.value || this.defaultValue || '';
  						// if (property.options) {
  						// 	value = value.split(',');
  						// 	var options = property.options || {   };
  						// 	el.createElement('LABEL', '', __(property.title || property.name));
  						// 	el = el.createElement('DIV', 'row');
  						// 	function createElem(tag, option) {
  						// 		var forId = ['property',property.name,tag].join('_');
  						// 		el.createElement('DIV', 'row check', [
  						// 			['INPUT', {
  						// 				type: 'checkbox',
  						// 				// name: tag,
  						// 				id: forId,
  						// 				checked: value.includes(tag),
  						// 			}],
  						// 			['LABEL', 'caption', { for: forId }, [
  						// 				['I', option.color ? {style : `background-color:${option.color};`} : null],
  						// 				['SPAN', '', __(option.title || tag)],
  						// 			]],
  						// 		]);
  						// 	}
  						// 	Object.entries(options).forEach(entry => createElem(...entry));
  						// } else {
  						// 	var forId = ['property',property.name].join('_');
  						// 	el.createElement('DIV', 'row check', [
  						// 		['INPUT', {
  						// 			type: 'checkbox',
  						// 			name: property.name,
  						// 			id: forId,
  						// 			checked: value ? 1 : 0,
  						// 		}],
  						// 		['LABEL', 'caption', { for: forId }, [
  						// 			['I'],
  						// 			['SPAN', '', __(property.title || property.name)],
  						// 		]],
  						// 	]);
  						// }
  					},
  				},
          checklist: {
  					createInput: function() {
  						this.elInp = this.elEdit.createElement('select', {});
  						for (var optionname in this.options) this.elInp.createElement('option', { value: optionname, innerText: this.options[optionname].Title || optionname });
  					},
  				},
  				default: {
            showDetails() {
  						if (lastLegend !== legend) {
  							const currentLegend = lastLegend = legend;
  							$('div').parent(parent).append(
  								this.selector = selector = $('details').class('col')
                  .parent(parent)
  								.open($().storage(currentLegend))
  								.on('toggle', event => $().storage(currentLegend, event.target.open))
  								.append(
  									$('summary').class('focus').text(currentLegend)
  								)
  							)
  						}
              return this;
  					},
  					view(property) {
  						$('div')
              .parent(this.selector)
              .class(
                'row prop', this.format || this.type || '',
                this.property.name,
              )
              .append(
  							$('label').ttext(this.title),
								$('span')
                .class(
                  'aco pre wrap',
                  this.className,
                  // data.some(data => data.SrcID == ID) ? 'ownprop' : '',
                  // data.some(data => data.SrcID != ID) ? 'srcprop' : '',
                )
                .html(this.displayvalue),
  						)
  					},
  					edit(property) {
              console.log(property);
							$('div').parent(this.selector).class('col prop input',this.format || this.type || '',this.property.name).append(
								this.input = $('input')
                .class(
                  'inp focus aco',
                  this.className,
                  // data.some(data => data.SrcID == ID) ? 'ownprop' : '',
                  // data.some(data => data.SrcID != ID) ? 'srcprop' : '',
                )
                .id(this.name)
                .name(this.property.name)
                .attr(this)
                // .attr(this.attributes)
                .value(this.ownprop || !this.srcprop ? this.value : '')
                .placeholder(this.srcprop ? this.value : ' ')
								.on('change', event => this.value = event.target.value),
								$('label').class('row aco').ttext(this.title || this.name).for(this.name),
								$('i').pattern(this.pattern),
							)
  					},
  				},
          draw: {
  					view(property) {
  					},
  					edit(property) {
  						$(this.selector).append(
                $('div').append(
                  $('canvas').width(640).height(480).style('border:solid 1px gray;').draw()
                )
              );
  					},
  				},
          email: {
						type: 'email',
						pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
  				},
          files: {
  					createInput() {
  						//console.log('FILESSSSS', attributeName, attribute, this.elEdit, this.item);
  						const files = new Files(this, this.elEdit);
  						if (this.item && this.item.editBarElement) {
  							if (!this.item.files) {
  								this.item.files = files;
  								this.item.editBarElement.createElement('button', 'abtn attach', {type: 'button', accept: '', onclick: files.openDialog});
  								this.item.editBarElement.createElement('button', 'abtn image', {type: 'button', accept: 'image/*', onclick: files.openDialog});
  							}
  						}
  						this.elEdit.append(files.elem);
  						// apr.item.editBarElement = $.pageEditElement.createElement('DIV', 'row top abs btnbar np', { id: 'pageEditTopBar', operations: {
  						// 	close: {Title: 'Sluit formulier' },
  						// 	attach: {type: 'button', accept: '', onclick: files.openDialog},
  						// 	image: {type: 'button', accept: 'image/*', onclick: files.openDialog},
  						// 	camera: {type: 'button', item: this, onclick: $.prompt.camera},
  						// 	freedraw: {type: 'button', item: this, onclick: $.prompt.freedraw},
  						// }});
  						// this.elEdit.append(new Files(this).elem);
  					},
  					createView() {
  						const files = new Files(this);
  						this.item.files = this.item.files || files;
  						// elForm.filesAttribute = elForm.filesAttribute || files;
  						// this.elSpan = this.elView.append(files.elem);
  						return this.elView = files.elem;
  						// new Files(this, this.elSpan);
  					},
  				},
          hidden: {
  					edit() {
  						const is = $('input')
              .attr(this.property)
              .parent(this.selector)
              .name(this.name)
              .attr('tabindex', -1);
  						if (this.property.format === 'hidden') {
  							is.class('hide_input');
  						}
  					}
  				},
          html: {
						view(property) {
  						$('div').parent(this.selector).class('col prop', this.format || this.type || '', this.property.name).append(
  							$('label').ttext(this.title),
  							$('span').class('aco pre wrap doc-content',this.className).html(this.displayvalue),
  						)
  					},
  					edit() {
							// let html = (this.value||'').trim()
							// 				.replace(/<p><\/p>/gis, '')
							// 				.replace(/<p><br><\/p>/gis, '')
							// 				.replace(/<div><\/div>/gis, '')
							// 				.replace(/<div><br><\/div>/gis, '')
							// 				.replace(/^<p>/is, '')
							// 				.replace(/<\/p>$/is, '')
							// 				.replace(/^/is, '<p>')
							// 				.replace(/$/is, '</p>')
							// 				;
							// 				html='';
							// //console.log(html);
							let html = this.value || '';
              $('div').class('prop col').parent(this.selector).append(
                $('div')
                .class('inp doc-content')
                .placeholder('')
                .html(html)
                .htmledit(this.property),
								$('label').text(this.property.title || this.property.name),
              );
  					},
  				},
          json: {
  					createInput: function() {
  						this.elEdit.className = 'field col fw';
  						this.elInp = this.elEdit.createElement('CODE').createElement('TEXTAREA', { className: 'inp oa', style: 'white-space:nowrap;', value: editor.json(this.value) });
  						this.elInp.addEventListener('change', function() { try { JSON.parse(this.value, true) } catch (err) { alert('JSON format niet in orde;'); } });
  						this.elEdit.createElement('LABEL', { innerText: this.placeholder });
  						this.elInp.onkeyup = function(event) {
  							if (this.style.height < 300) {
  								this.style.height = 'auto';
  								this.style.height = Math.min(this.scrollHeight + 20, 300) + 'px';
  							}
  						};
  						setTimeout(function(el) { this.elEdit.onkeyup(); }, 100, this.elInp);
  					},
  				},
          linkedin: {
  				},
          location: {
  					className: 'doc-content',
  					createInput: function() {
  						let mapsElement = this.elEdit.createElement('DIV', {
  							id:'map',
  							style: 'width:100%;height:400px;',
  						});
  						let map = new google.maps.Map(mapsElement, {
  							zoom: 8,
  							// zoomControl: true,
  							// scaleControl: false,
  							// scrollwheel: false,
  							// disableDoubleClickZoom: true,
  							// gestureHandling: 'greedy',
  							// gestureHandling: 'none',
  							// gestureHandling: 'auto',
  							gestureHandling: 'cooperative',
  						});
  						bounds = new google.maps.LatLngBounds();
  						geocoder = new google.maps.Geocoder();
  						if (navigator.geolocation) {
  							navigator.geolocation.getCurrentPosition(function(position) {
  								var pos = {
  									lat: position.coords.latitude,
  									lng: position.coords.longitude
  								};
  								//console.log('CURRENT POS', position);
  								var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  								$.currgeocoder = $.currgeocoder || new google.maps.Geocoder();
  								$.currgeocoder.geocode({
  									'location': myLatlng
  								}, function (results, status) {
  									if (status == google.maps.GeocoderStatus.OK) {
  										let marker = new google.maps.Marker({
  											map: map,
  											position: results[0].geometry.location
  										});
  										bounds.extend(marker.getPosition());
  										map.fitBounds(bounds);
  										google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
  											this.setZoom(Math.min(10, this.getZoom()));
  										});
  									} else {
  										//console.error('Geocode was not successful for the following reason: ' + status);
  									}
  								});
  							}, function() {
  								// handleLocationError(true, infoWindow, map.getCenter());
  							});
  						} else {
  							alert('NOT navigator.geolocation');
  							// Browser doesn't support Geolocation
  							handleLocationError(false, infoWindow, map.getCenter());
  						}
  					},
  				},
          meter: {
  					view() {
  						this.selector.createElement('DIV', ['row prop',this.property.format,this.property.name].join(' '), [
  							['LABEL', '', this.property.title || this.property.name, {for: this.property.name } ],
  							['METER', 'aco', '2 outof 10', this.property, {id: this.property.name } ],
  						]);
  					},
  					edit() {
  						this.selector.createElement('DIV', ['row input',this.property.format,this.property.name].join(' '), [
  							['LABEL', '', {for: this.property.name } ],
  							['METER', 'aco', '2 outof 10', this.property, {id: this.property.name } ],
  						]);
  					},
  				},
          number: {
						type: 'number',
  				},
          password: {
						type: 'password',
  				},
          radio: {
  					view() {
  						$('div')
  						.parent(this.selector)
  						.class('row prop',this.property.format,this.property.name)
              .setProperty('btbg', ((this.property.options||{})[this.value]||{}).color)
  						.append(
  							$('label').class('check').text(this.property.title || this.property.name),
  							$('label').ttext(this.displayvalue)
  						);
  						return this;
  					},
            edit() {
  						const property = this.property;
  						let value = this.value || this.defaultValue;
  						function option(tag, option){
                option.value = tag;
                option.checked = tag === value;
  							const forId = ['property',property.name, tag].join('_');
  							if (property.required && !value) {
  								value = this.value = tag;
  							}
  							return $('div')
                .class('row')
                .setProperty('btbg', option.color)
                .append(
                  $('input')
                  .type('radio')
                  .on('change', event => {
                    property.value = tag;
                    this.changed = event.target;
                  })
                  .on('keydown', event => {
                    if (this.changed === event.target && event.code === 'Space' && !property.required) {
                      event.target.checked ^= 1;
                      property.value = event.target.form[event.target.name].value = event.target.checked ? event.target.value : null;
                      this.changed = null;
                      event.preventDefault();
                    }
                  })
                  .on('click', event => {
                    if (this.changed === event.target && !property.required) {
                      event.target.checked ^= 1;
                      property.value = event.target.form[event.target.name].value = event.target.checked ? event.target.value : null;
                      this.changed = null;
                    }
                  })
                  .checkbox(property, option)
  							)
  						}
  						this.selector.append(
  							$('div').class('col prop input',property.format,property.name).append(
  								$('label').text(property.title || property.name),
  								$('div').class('row wrap').append(
  									Object.entries(property.options||{}).map(entry => option(...entry))
  								)
  							)
  						);
  						return this;
  					},
  				},
          select: {
            get textvalue() {
              return 'ja';
            },
            view(property) {
              // console.log(this.textvalue, this.property.options, this.property.value);
  						$('div')
              .parent(this.selector)
              .class(
                'row prop', this.format || this.type || '',
                this.property.name,
              )
              .append(
  							$('label').ttext(this.title),
								$('span')
                .class(
                  'aco pre wrap',
                  this.className,
                  // data.some(data => data.SrcID == ID) ? 'ownprop' : '',
                  // data.some(data => data.SrcID != ID) ? 'srcprop' : '',
                )
                .item(this.property.item, this.name+'view')
                .displayvalue(this.property.name),
                // .html(this.displayvalue),
  						)
  					},
            createInput() {
              console.log(this.textvalue);
  						this.elInp = this.elEdit.createElement('select', 'inp row aco', { item: this.item, name: this.name });
  						this.elEdit.createElement('LABEL', '', this.title || this.name);
  						let selected = [];
  						let value = this.value || this.defaultvalue || '';
  						// //console.log(value);
  						if (this.type === 'array') {
  							this.elInp.setAttribute('multiple', '');
  							selected = value ? String(value).split(',') : [];
  							// //console.log(selected);
  						}
  						if (Object.prototype.toString.call(this.options) === '[object Array]') {
  							for (var i = 0, optionvalue; optionvalue = this.options[i]; i++) {
  								var optionElement = this.elInp.createElement('option', '', optionvalue, { value: optionvalue, selected: selected.includes(optionvalue) });
  							}
  						} else {
  							for (let [optionName, option] of Object.entries(this.options)) {
  								// //console.log(selected, option.value);
  								var optionElement = this.elInp.createElement('option', '', typeof option === 'object' ? option.title || optionName : option, { value: optionName });
  								if (selected.includes(optionName)) {
  									optionElement.setAttribute('selected', '');
  								}
  							}
  						}
  						//this.elInp.value = 'pe';
  						// //console.debug(this.value, this);
  						this.elInp.addEventListener('change', event => {
  							this.value = [...event.target.options].filter(option => option.selected).map(option => option.value).join(',');
  							//console.log(this.value);
  							// //console.log(event, [...event.target.options].filter(option => option.selected).map(option => option.value).join(','), event.target.value);
  							// this.elInp.value = [...event.target.options].filter(option => option.selected).map(option => option.value).join(',');
  							// // event.target.value = event.target.
  							// //console.log(this.elInp.value);
  						}, true);
  						// this.elInp.value = '1,2';
  						this.elInp.value = this.value;
  					},
            edit() {
              console.log(this.value, this.property);
              this.selector.append(
  							$('div').class('row prop input',this.format || this.type || '',this.property.name).append(
  								this.input = $('select')
                  .class(
                    'inp focus aco',
                    this.className,
                  )
                  .id(this.name)
                  .name(this.name)
                  .placeholder(' ')
                  .attr(this.property)
  								.attr(this.attributes)
                  .append(
                    Object.entries(this.property.options||{}).map(([optionName,option])=>$('option').value(optionName).text(option.title).selected(optionName === this.value ? 'JA': null))
                  )
                  // .value(this.value)
  								.on('change', event => {
                    console.log(event.target, event.target.value);
                    this.property.value = event.target.value;
                  }),
  								$('label').class('row aco').ttext(this.title || this.name).attr('for', this.name),
  								$('i').attr('pattern', this.attributes ? this.attributes.pattern : null),
  							)
  						)
  					},
  				},
          selectitem: {
            view() {
  						const property = this.property;
  						const data = [].concat(this.property.item.data[property.name]).shift();
              // console.log(this.name, this.property.item.data, this.property.item.Master);
  						$('div').parent(this.selector)
  						.class('row prop', this.format || this.type || '', this.property.name)
  						.append(
  							$('label').ttext(property.title),
                $('span').itemLink(data)
  						)
  					},
  					edit() {
  						const property = this.property;
              const items = [...$.props.values()]
              .unique()
              .filter(item => item instanceof Item)
              .filter(item => this.schema && (this.schema === '*' || this.schema.includes(item.schemaName)));
  						const listElement = $.temp.listElement = $.temp.listElement || $('datalist')
              .parent(document.body)
              .id('listitems')
              .on('updateList', event => {
                listElement.text('');
                const value = event.detail.value.toLowerCase();
                // console.log('updateList', event.detail, schemaName, finditems);
                event.detail.items
                .filter(item => item.header0.toLowerCase().includes(value))
                .forEach(item => $('option').parent(listElement).text(item.subject).value(item.header0 === item.tag ? item.header0 : item.header0 + ' ' + item.tag))
              });
              // console.log(this.selector, selector);
              selector.append(
  							$('div').class('col prop', property.format, property.name).append(
  								this.inputElem = $('input').class('inp')
                  .value(this.oldValue = this.value)
                  .name(this.name)
                  .autocomplete('none')
                  .placeholder(' ')
                  .attr('list', 'listitems')
                  .attr(property)
                  .on('drop', event => {
                    let data = (event.dataTransfer || event.clipboardData).getData("aim/items");
                    if (data) {
                      event.stopPropagation();
                      event.preventDefault();
                      data = JSON.parse(data);
                      const linkitem = data.value[0];
                      // console.log(item, this.property.item);
                      // return;
                      if (linkitem) {
                        this.property.item.attr(this.name, {
                          AttributeID: this.data ? this.data.AttributeID : null,
                          LinkID: linkitem.ID,
                        }, true).then(item => {
                          console.log('updated');
                          // this.inputElem.value($(linkitem).header0);
                          item.details(true).then(item => $('view').show(item, true));
                        })
                      }
                      // console.log(item, $(item));
                    }
                  })
                  .on('change', event => {
                    this.oldValue = event.target.value;
                    const [tag] = event.target.value.match(/\b[\w_]+\(\d+\)/);
                    if (tag) {
                      const item = items.find(item => item.tag === tag);
                      if (item) {
                        this.value = {
                          LinkID: item.ID,
                        }
                      }
                    }
                  })
                  .on('keyup', event => {
                    //console.log(event.type);
                    if (this.oldValue === event.target.value) return;
                    const value = this.oldValue = event.target.value;
                    listElement.emit('updateList', {value: event.target.value, items: items});
                    if (this.request) return;
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                      return;
                      this.request = $.$().$.api(`/${attribute.schema}`)
                      .select('Title')
                      .search(inputElement.value)
                      .top(20)
                      .get()
                      .then(event => {
                        $.temp.listElement.updateList(property.schema, value, this.request = null);
                      });
                    },500);
                  }),
  								$('label').text(property.title || property.name),
  							),
  						);
  					},
  				},
          sharecam: {
  					createInput: function() {
  						//console.log('SHARE CAM', this);
  						this.wall = this.item.tag;
  						this.client = $.access.sub;
  						new Chat(this, this.elEdit);
  					},
  				},
          skype: {
  				},
          tel: {
						type: 'tel',
						pattern: '[0-9]{10,11}',
  				},
          text: {
						type: 'text',
  				},
          textarea: {
  					view() {
  						return;
  						this.selector.createElement('DIV', ['row prop check',this.property.format,this.property.name].join(' '), [
  							['LABEL', '', this.property.title || this.property.name],
  							['SPAN', '', this.value],
  						]);
  					},
  					edit() {
  						function resize (event) {
  							event.target.style.height = '0px';
  							event.target.style.height = (event.target.scrollHeight + 24) + 'px';
  						}
  						return;
  						let el = this.selector.createElement('DIV', ['col input',this.property.format,this.property.name].join(' '), [
  							['LABEL', '', this.property.title || this.property.name],
  							['TEXTAREA', 'inp', {value: this.value, onkeyup: resize }],
  						]);
  					},
  				},
          url: {
  				},
          yaml: {
  					view() {
  						this.selector.createElement('DIV', ['row prop check',this.property.format,this.property.name].join(' '), [
  							['LABEL', '', this.property.title || this.property.name],
  							['SPAN', '', this.value],
  						]);
  					},
  					edit() {
  						function resize (event) {
  							event.target.style.height = '0px';
  							event.target.style.height = (event.target.scrollHeight + 24) + 'px';
  						}
  						let el = this.selector.createElement('DIV', ['col input',this.property.format,this.property.name].join(' '), [
  							['LABEL', '', this.property.title || this.property.name],
  							['TEXTAREA', 'inp', {value: this.value, onkeyup: resize }],
  						]);
  					},
  				},
          bedieningen: {
            view() {
              return this.selector.append(
                $('div').class('col').append(
                  $('button').class('abtn')
                  .ttext(this.property.title || this.property.name)
                  // .click(this.property.item[this.name].bind(this.property.item))
                  .on('click', event => {
                    console.log(this.property.item.tag);
                    $().send({
                      // to: { aud: $.authProvider.access.aud },
                      path: `/${this.property.item.tag}/${this.name}()`,
                      method: 'post',
                      // forward: $.forward || $.WebsocketClient.socket_id,
                    })
                  })
                  // event => {
                  //   console.log(this.property.item, this.name, this.property.item[this.name]);
                  //   // property.item.handVerkeerslichtenGedoofd.call(property.item);
                  // })
                )
              );
            },
            edit() {
              return this.view();
            },
          },
          besturingen: {
            view() {
              return this.selector.append(
                $('div').class('col').append(
                  $('button').class('abtn')
                  .ttext(this.property.title || this.property.name)
                  // .click(this.property.item[this.name].bind(this.property.item))
                  .on('click', event => {
                    console.log(this.property.item.tag);
                    $().send({
                      // to: { aud: $.authProvider.access.aud },
                      path: `/${this.property.item.tag}/${this.name}()`,
                      method: 'post',
                      // forward: $.forward || $.WebsocketClient.socket_id,
                    })
                  })
                  // event => {
                  //   console.log(this.property.item, this.name, this.property.item[this.name]);
                  //   // property.item.handVerkeerslichtenGedoofd.call(property.item);
                  // })
                )
              );
            },
            edit() {
              return this.view();
            },
          },
          autonoom_processen: {
            view() {
              return this.selector.append(
                $('div').class('col').append(
                  $('button').class('abtn')
                  .ttext(this.property.title || this.property.name)
                  // .click(this.property.item[this.name].bind(this.property.item))
                  .on('click', event => {
                    console.log(this.property.item.tag);
                    $().send({
                      // to: { aud: $.authProvider.access.aud },
                      path: `/${this.property.item.tag}/${this.name}()`,
                      method: 'post',
                      // forward: $.forward || $.WebsocketClient.socket_id,
                    })
                  })
                  // event => {
                  //   console.log(this.property.item, this.name, this.property.item[this.name]);
                  //   // property.item.handVerkeerslichtenGedoofd.call(property.item);
                  // })
                )
              );
            },
            edit() {
              return this.view();
            },
          },
  			};
  			const path = parent.path();
  			const isForm = path.some(elem => elem.tagName === 'FORM');
  			let legend = '';
  			let lastLegend = '';
        for (let [name, property] of Object.entries(properties)) {
          function Property () {
            if (!property) return;
            this.property = property;
            this.selector = selector;
            this.name = name;
            // if (this.enum && !this.options) {
            // 	if (Array.isArray(this.enum)) {
            // 		this.options = this.enum;
            // 	} else if (typeof this.enum === 'object') {
            // 		this.options = this.enum;
            // 		this.enum = Object.keys(this.options);
            // 		if (this.enum.length === 2 && Object.values(this.options).filter(Boolean).length === 1) {
            // 			this.format = 'checkbox';
            // 		}
            // 	}
            // }
            // if (this.options && !this.enum) {
            // 	this.enum = Object.keys(this.options);
            // 	// property.format = property.format || 'radio';
            // }
            if (this.schema) {
              this.format = 'selectitem';
            }
            if (!this.format) {
              if (this.enum && this.type !== 'array') {
                this.format = this.enum.length > 4 ? 'select' : 'radio';
              }
            }
            if (!this.type) {
              if (this.enum) {
                this.type = this.enum.some(v => typeof v === 'string') ? 'string' : 'number';
              }
            }
            if (property.stereotype) {
              property.format = property.format || property.stereotype;
              property.legend = property.legend || __(property.stereotype);
            }
            Object.assign(this, property, format.default, format[this.type], format[this.format]);
            this.placeholder = this.placeholder || ' ';
            this.data = this.item ? this.item.data[name] : {};
            this.title = this.title || this.name;
            legend = this.legend = property.legend || legend;
            if (this.property.item) {
              const ID = this.property.item.ID;
              const data = [].concat(this.data, this.item);
              // console.log('CLASSNAME', data);
              this.ownprop = data.some(data => data && data.Value && data.SrcID && data.SrcID == ID );
              this.srcprop = data.some(data => data && data.Value && data.SrcID && data.SrcID != ID);
              this.className = [
                this.ownprop ? 'ownprop' : '',
                this.srcprop ? 'srcprop' : '',
              ].join(' ')
              // console.log('CLASSNAME', this.name, this.className, data, this);
            }
            // console.log(property, typeof property.value);
            if (isForm) {
              if (elem.elements[this.property.name]) return;
              this.showDetails().edit();
              if (this.autofocus && this.input) {
                setTimeout(() => this.input.focus(),500);
              }
            } else if (this.displayvalue !== null || ['bediening','besturing','autonoom_proces'].includes(property.stereotype)) {
              if (property.type === 'hidden') return;
              this.showDetails().view();
            }
          }
          Property.prototype = Object.create(property, {
            displayvalue: {
              get() {
                return $.attr.displayvalue(this.value, property);
              },
            },
          });
          new Property();
        }
      });
			return this;
		},
    qr(selector, context) {
			const elem = this.elem;
      (async function(){
        if (!window.QRCode) {
          await $.script.import($.config.apiPath + '/js/qrcode.js');
        }
        new QRCode(elem, selector);
        if (elem.tagName === 'IMG') {
				elem.src = elem.firstChild.toDataURL("image/png");
				elem.firstChild.remove();
			}
      })()
			return this;
		},
    remove(selector) {
      if (selector) {
        if (this.elem.hasAttribute(selector)) {
          this.elem.removeAttribute(selector)
        } else {
          (this.elem || this.selector).removeEventListener(...arguments);
        }
      } else {
        this.elem.remove()
      }
      return this;
    },
    resizable() {
      this.class('resizable');
      const table = this.elem;
      const row = table.getElementsByTagName('tr')[0];
      if (!row) return;
      const cols = [...row.children];
      cols.forEach(elem => {
        $('i').parent(elem).class('resizer').on('mousedown', function (e) {
          let pageX,curCol,nxtCol,curColWidth,nxtColWidth;
          table.style.cursor = 'col-resize';
          curCol = e.target.parentElement;
          nxtCol = curCol.nextElementSibling;
          pageX = e.pageX;
          let padding = paddingDiff(curCol);
          curColWidth = curCol.offsetWidth - padding;
          if (nxtCol) {
            nxtColWidth = nxtCol.offsetWidth - padding;
          }
          function mousemove (e) {
            if (curCol) {
              let diffX = e.pageX - pageX;
              if (nxtCol)
              clearTimeout(to);
              to = setTimeout(() => {
                // nxtCol.style.width = (nxtColWidth - (diffX))+'px';
                curCol.style.width = (curColWidth + diffX)+'px';
              }, 100);
            }
          }
          function mouseup (e) {
            table.style.cursor = '';
            curCol = nxtCol = pageX = nxtColWidth = curColWidth = undefined;
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
          }
          document.addEventListener('mousemove', mousemove);
          document.addEventListener('mouseup', mouseup);
        });
        elem.style.width = elem.offsetWidth + 'px';
      });
      table.style.tableLayout = 'fixed';
      let to;
      function paddingDiff(col){
        if (getStyleVal(col,'box-sizing') == 'border-box') {
          return 0;
        }
        var padLeft = getStyleVal(col,'padding-left');
        var padRight = getStyleVal(col,'padding-right');
        return (parseInt(padLeft) + parseInt(padRight));
      }
      function getStyleVal(elm,css){
        return (window.getComputedStyle(elm, null).getPropertyValue(css))
      }
    },
    sample(selector, sample) {
			const htmlScript = `
			<html>
			<head>
			<link rel="stylesheet" href="https://aliconnect.nl/v1/api/css/web.css" />
			<script src="https://aliconnect.nl/v1/api/js/aim.js"></script>
			<style><!-- style --></style>
			<script><!-- script --></script>
			</head>
			<body>
			</body>
			`;
			const head = `<script src="/v1/api/js/aim.js"></script><script src="/v1/api/js/web.js"></script>`;
			function codeJs (f) {
				let content = String(f);
				content = String(content).replace(/^(.*?)\{|\}$/g,'').split(/\n/);
				let ident = content.filter(line => line.trim());
				if (ident.length) {
					ident = ident[0].search(/\S/);
					content = content.map(line => line.substr(ident));
				}
				// //console.log(content);
				return content.join('\n').trim();
			}
			//console.log(selector);
      const ref = {};
      sample.template = sample.template || htmlScript;
      // const elemHtml = $('td', 'code');
      if (sample.type === 'iframe') {
				this.elem.append(
 					$('table').append(
	          $('tr').append(
	            $('th', '', 'script'),
	            $('th', '', 'iframe'),
	          ),
	          $('tr').append(
	            $('td', 'code', $().toHtml(codeJs(sample.script), 'js')),
	            $('td').append(sampleBody = $('iframe')),
	          ),
					),
        );
        const doc = sampleBody.elem.contentWindow.document;
        const html = sample.template.replace(/<\!-- script -->/, script);
        doc.open();
        doc.write(html);
        doc.close();
      } else {
        ref.table = $('table').append(
          $('tr').append(
            $('th', '', 'script'),
            $('th', '', 'div'),
          ),
          $('tr').append(
            $('td', 'code', $().toHtml(codeJs(sample.script), 'js')),
            $('td').append(sampleBody = $('div')),
          ),
        );
        document._body = sampleBody.elem;
        //console.log(document._body);
        sample.script();
        document._body = null;
      }
			this.elem.append(
				$('h1', '', selector),
			);
			return this;
		},
		scrollIntoView(options = { block: "nearest", inline: "nearest" }) {
			this.elem.scrollIntoView(options);
			return this;
		},
    script(src) {
			return $.promise('script', resolve => $('script').src(src).parent(this).on('load', resolve))
		},
    _select(event) {
			const elem = this.elem;
			const setOpen = open => {
				//console.log('setOpen', open, elem);
				open = Number(open);
				$(elem).attr('open', open);
				if (elem.label) {
					var foldersOpen = $.temp.cookie.foldersOpen
					? $.temp.cookie.foldersOpen.split(', ').filter(x => x !== elem.label)
					: [];
					if (open) {
						foldersOpen.push(elem.label);
					}
					$.temp.cookie = {
						foldersOpen: foldersOpen.join(', ')
					};
				}
				if (open) {
					if (elem.onopen && !elem.loaded) {
						elem.loaded = elem.onopen();
					}
				} else {
					if (elem.onclose) {
						elem.onclose();
					}
				}
			};
			if (!elem.label) {
				// //console.log('elementSelect', elem);
				for (var par = elem.parentElement; par; par = par.parentElement) {
					if (!['UL', 'LI'].includes(par.tagName)) {
						break;
					}
				}
				[...par.getElementsByTagName('A')].forEach(el => {
					if (el.hasAttribute('open') && el !== elem) {
						if (el.hasAttribute('selected')) {
							el.removeAttribute('selected');
						}
						if (el.getAttribute('open') === '1') {
							el.setAttribute('open', 0);
						}
					}
				});
				for (var el = elem.parentElement; el; el = el.parentElement) {
					[el, el.firstChild].forEach(el => {
						if (['A','DIV'].includes(el.tagName) && el.getAttribute && el.getAttribute('open') === '0' && el !== elem) {
							el.setAttribute('open', 1);
						}
					});
				}
			}
			if (event && event.type === 'click' && elem.tagName === 'A') {
				if (elem.href && elem.href.match(/#(\w)/)) {
					return;
				}
				if (elem.hasAttribute('selected')) {
					if (elem.getAttribute('open') === '1') {
						return setOpen(0);
					}
				}
			} else {
				if (elem.getAttribute('open') === '1') {
					return setOpen(0);
					// for (var el = elem.nextElementSibling; el && el.tagName != elem.tagName; el = el.nextElementSibling) {
					// 	el.style.display = 'none';
					// }
				}
			}
			if (elem.getAttribute('open') === '0') {
				return setOpen(1);
				// for (var el = elem.nextElementSibling; el && el.tagName != elem.tagName; el = el.nextElementSibling) {
				// 	el.style.display = '';
				// }
			}
			elem.setAttribute('selected', '');
			elem.scrollIntoViewIfNeeded(false);
			// //console.log('OPEN', elem.label);
			return this;
		},
    seperator(pos) {
			const ZINDEX = 6;
			const selector = this;
			const elem = selector.elem;
			let targetElement;
			function start(event) {
				if (event.which === 1) {
					if (!event) event = window.event;
					event.stopPropagation();
					event.preventDefault();
					window.getSelection().removeAllRanges();
					targetElement = elem.hasAttribute('right') ? elem.nextElementSibling : elem.previousElementSibling;
					elem.clientX = event.clientX;
					selector.css('left', elem.moveX = 0).css('z-index', 300).attr('active', '');
					document.addEventListener("mouseup", checkmouseup, true);
					document.addEventListener("mousemove", doresizeelement, true);
				}
			};
			function doresizeelement(event) {
				selector.css('left', (elem.moveX = event.clientX - elem.clientX) + 'px');
			};
			function checkmouseup (event) {
				document.removeEventListener('mousemove', doresizeelement, true);
				document.removeEventListener('mouseup', checkmouseup, true);
				$(targetElement).css('max-width', (targetElement.offsetWidth + (elem.hasAttribute('right') ? -elem.moveX : elem.moveX)) + 'px');
				$().storage(targetElement.id + '.width', targetElement.style.maxWidth);
				// //console.log(targetElement.id + 'Width', targetElement.style.maxWidth);
				selector.css('left', elem.moveX = 0).css('z-index', ZINDEX).attr('active', null);
			};
			selector
			.attr(pos, '')
			// .class('seperator')
			.class('seperator noselect')
			.on('mousedown', start)
			.css('z-index',ZINDEX);
			return this;
		},
    set() {
      return this.map.set(...arguments);
    },
    show(item, doEdit) {
      // TODO: wijzig rechten
      // var edit = !Number(this.userID) || this.userID == $.auth.sub;
      item.details().then(event => {
        ItemSelected = item;
        this.item = item;
        document.title = item.header0;
        $().ga('send', 'pageview');
        // if (item.data.Id) {
        //   const url = new URL(document.location);
        //   url.searchParams.set('id', item.data.Id);
        //   $.history.replaceUrl(url.toString());
        //
        //   // $.history.replaceUrl(document.location.origin+document.location.pathname.replace(/\/id\/.*/,'')+'/id/'+item.data.Id+document.location.search)
        // }
        function logVisit() {
          if (item.data.ID) {
            clearTimeout($.temp.viewTimeout);
            $.temp.viewTimeout = setTimeout(() => {
              $.client.api('/').query('request_type','visit').query('id',item.data.ID).get().then(event => {
                $().history[item.data.ID] = new Date().toISOString();
              })
            },1000);
          }
        }
        item.data.fav = [
          {
            '@id': '/Contact(265090)',
            LinkID: 265090,
            Value: 'Max van Kampen',
            AttributeID: 1,
          },
          {
            '@id': '/Contact(265091)',
            LinkID: 265091,
            Value: 'Text Alicon',
            AttributeID: 1,
          },
        ];
        const fav = [].concat(item.data.fav).map(item => $(item));
        const isFav = fav.some(item => item === $.user);
        function users() {
          return;
          // TODO: Item Users
          fieldsElement.createElement('DIV', 'row users', [
  					__('To') + ': ',
  					['DIV', 'row aco', userElement],
  				]);
          if (Array.isArray(this.Users)) {
  					this.Users.forEach((row)=>{
  						userElement.push(['A', 'c ' + row.ID, row.Value || ($.getItem(row.tag) ? $.getItem(row.tag).Title : row.ID), {
  							// onclick: Web.Element.onclick,
  							href: '#'+row.tag,
  							// id: row.ID,
  							// innerText: row.Value || ($.getItem(row.tag] ? $.getItem(row.tag].Title : row.ID),
  						}], ';\u00A0');
  					});
  				}
        }
        function printmenu() {
          return;
          // TODO:
          //if (this.printmenu) for (var menuname in this.printmenu) {
          //	menuitem = this.printmenu[menuname];
          //	menuitem.name = menuname;
          //	menuitem.id = this.id;
          //	//menuitem.href = this.href;
          //	menuitem.item = this;
          //	//// //console.debug('MENU ITEM ', menuname);
          //	break;
          //	//// //console.debug('menuitem href', menuitem.href);
          //	//if (this.ref) this.printmenu[menuname].href = this.href+'/'+
          //	if (!menuitem.href) this.printmenu[menuname].onclick = menuitem.ref ? $.url.objbyref(menuitem.ref).event : function(event) {
          //		if (this.menuitem.object) {
          //			if (window[this.menuitem.object]) window[this.menuitem.object].onload(this.menuitem.id);
          //			else window[this.menuitem.script] = document.body.createElement('script', { src: this.menuitem.script, menuitem: this.menuitem, onload: function() { window[this.menuitem.object].onload(this.menuitem.id) } });
          //			return false;
          //		}
          //		if (this.menuitem.href) return true;// document.location.href = this.menuitem.href;
          //		this.menuitem.post = this.menuitem.post || {};
          //		this.menuitem.get = this.menuitem.get || {};
          //		this.menuitem.get.name = this.menuitem.name;
          //		this.menuitem.get.Title = this.menuitem.Title;
          //		this.menuitem.get.id = this.menuitem.id;
          //		//// //console.debug('MENUITEM PRINT', this.menuitem.post, this.menuitem.src);
          //		//if ($.url.byref())
          //		new $.HttpRequest({
          //			menuitem: this.menuitem,
          //			item: this.menuitem.item,
          //			api: this.menuitem.api ? this.menuitem.api : rpt ? this.menuitem.item.class.name + '/' + this.menuitem.id + '/' + this.menuitem.rpt + '.html' : null,
          //			src: this.menuitem.src,
          //			post: this.menuitem.post,
          //			get: this.menuitem.get,
          //			onload: $.Docs.onload
          //		});
          //	};
          //}
        }
        this.showMessages = event => {
          let date;
          let time;
          let author;
          $.client.api(`/${item.tag}/Messages`)
          .top(100)
          .select('schemaPath,BodyHTML,CreatedDateTime,CreatedByID,CreatedByTitle,files')
          .get()
          .then(event => {
            console.log(event.body, $.authProvider.access.sub);
            let el;
            this.messagesElem.text('').append(
              $('summary').text('Messages'),
              $('div').class('oa').append(
                event.body.value.map(message => {
                  const dt = new Date(message.data.CreatedDateTime);
                  const messageDate = dt.toLocaleDateString();
                  const messageTime = dt.toLocaleTimeString().substr(0,5);
                  const messageAuthor = message.data.CreatedByID;
                  return el = $('div').class('msgbox row', $.authProvider.access.sub == message.data.CreatedByID ? 'me' : '').append(
                    $('div').append(
                      $('div').class('small').append(
                        author === messageAuthor ? null : $('span').class('author').text(author = messageAuthor),
                        date === messageDate ? null : $('span').text(date = messageDate),
                        time === messageTime ? null : $('span').text(time = messageTime),
                        $('i').class('icn del').on('click', event => {
                          event.target.parentElement.parentElement.remove();
                          message.delete();
                        }),
                      ),
                      $('div').class('body').html(message.BodyHTML || 'Empty'),
                    ),
                  )
                })
              )
            );
            el.scrollIntoView();
          })
        };
        logVisit();
        const itemdata = {};
        let properties;
        function breakdown_data() {
          return $.client.api(`/${item.tag}`).query('request_type', 'build_breakdown').get().then(event => {
            const data = event.body.value;
            let items = [];
            (function row(item, level) {
              item.level = level;
              item[item.schemaPath] = item.header0;
              items.push(item);
              data.filter(child => child.data.MasterID === item.ID).forEach(item => row(item, level+1))
            })(data.find(child => child.ID == item.data.ID), 1);
            const schemaNames = items.map(item => item.schemaPath).unique();
            const schemas = [...Object($().schemas()).entries()].filter(([schemaName, schema]) => schemaNames.includes(schemaName));
            const schemaKeys = schemas.map(([schemaName, schema]) => schemaName);
            // properties = ['ID', 'level','schemaPath','schemaName','header0','header1','header2'].concat(...schemas.map(([schemaName, schema]) => schemaName), ...schemas.map(([key, schema]) => Object.keys(schema.properties))).unique();
            const schema_values = {};
            items.forEach(item => {
              let value = '';
              schemaKeys.forEach(schemaName => {
                if (value) {
                  item[schemaName] = schema_values[schemaName] = null;
                } else if (item.schemaPath === schemaName) {
                  value = item[schemaName] = schema_values[schemaName] = item.header0;
                } else {
                  item[schemaName] = schema_values[schemaName];
                }
              })
            });
            return items;
          });
        }
        function build_map(fn) {
          if (itemdata.build_map) {
            $('list').text('').append($('div').text('Generate document'));
            setTimeout(() => fn(itemdata.build_map));
          } else {
            $('list').text('').append($('div').text('Loading data'));
            $.client.api(`/${item.tag}`).query('request_type', 'build_breakdown').get().then(event => {
              const data = event.body.value;
              let items = [];
              (function row(item, level) {
                item.level = level;
                item[item.schemaPath] = item.header0;
                items.push(item);
                data.filter(child => child.data.MasterID === item.ID).forEach(item => row(item, level+1))
              })(data.find(child => child.ID == item.data.ID), 1);
              const schemaNames = items.map(item => item.schemaPath).unique();
              const schemas = [...Object($().schemas()).entries()].filter(([schemaName, schema]) => schemaNames.includes(schemaName));
              const schemaKeys = schemas.map(([schemaName, schema]) => schemaName);
              // properties = ['ID', 'level','schemaPath','schemaName','header0','header1','header2'].concat(...schemas.map(([schemaName, schema]) => schemaName), ...schemas.map(([key, schema]) => Object.keys(schema.properties))).unique();
              const schema_values = {};
              items.forEach(item => {
                let value = '';
                schemaKeys.forEach(schemaName => {
                  if (value) {
                    item[schemaName] = schema_values[schemaName] = null;
                  } else if (item.schemaPath === schemaName) {
                    value = item[schemaName] = schema_values[schemaName] = item.header0;
                  } else {
                    item[schemaName] = schema_values[schemaName];
                  }
                })
              });
              fn(itemdata.build_map = items);
            });
          }
        }
        function linkElem(link) {
          const elem = $('span').itemLink(link).append(
            $('button')
            .type('button')
            .on('click', event => {
              event.preventDefault();
              event.stopPropagation();
              elem.remove();
              item.elemTo.emit('change');
            })
          );
          return elem;
        }
        const to = [].concat(item.data.to||[]);
        this.text('').append(
          $('nav').class('row top abs btnbar np').append(
            this.schema === 'Company' ? $('button').class('abtn shop').on('click', event => $.shop.setCustomer.bind(this)) : null,
            $('button').class('abtn refresh r').on('click', event => item.details(true).then(item => $('view').show(item))),
            $('button').class('abtn view').append($('ul').append(
              $('li').class('abtn dashboard').text('Dashbord').on('click', event => this.showDashboard()),
              $('li').class('abtn slide').text('Slideshow').on('click', event => {
                var el = document.documentElement, rfs = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
                rfs.call(el);
                $.show({ sv: this.item.id });
              }),
              $('li').class('abtn model3d').text('Build 3D Model').on('click', event => {
                const elem = $('div').parent($('list')).class('col abs').append(
                  $('div').class('row top abs btnbar').append(
                    $('button').class('abtn icn r refresh').on('click', event => this.rebuild() ),
                    $('button').class('abtn icn close').on('click', event => elem.remove()),
                  ),
                  this.three = $('div').class('col aco').three(
                    this.init = three => (this.rebuild = event => $.client.api('/'+item.tag).query('three', '').get().then(three.build))()
                  ),
                );
              }),
              $('li').class('abtn network').text('Netwerk').on('click', event => {
                (function init() {
                  const elem = $('div').parent($('list')).class('col abs').append(
                    $('div').class('row top abs btnbar').append(
                      $('button').class('abtn icn r refresh').on('click', event => {
                        elem.remove();
                        init();
                      }),
                      $('button').class('abtn icn close').on('click', event => elem.remove()),
                    ),
                  );
                  $.client.api(`/${item.tag}`).query('request_type','build_link_data').get().then(
                    event => $('div').class('col aco').parent(elem).style('background:white;').modelDigraph(event.body)
                  );
                })();
              }),
              !this.srcID ? null : $('li').class('abtn showInherited').attr('title', 'Toon master-class').on('click', event => {
                items.show({ id: this.item.srcID })
              }),
              !this.srcID ? null : $('li').class('abtn clone').attr('title', 'Overnemen class eigenschappen').on('click', event => {
                this.setAttribute('clone', 1, { post: 1 })
              }),
              //revert: { disabled: !this.srcID, Title: 'Revert to inherited', item: this, onclick: function() { this.item.revertToInherited(); } },
              // $('li').class('abtn sbs').text('SBS').on('click', event => {}),
              // $('li').class('abtn').text('Api key').href(`api/?request_type=api_key&sub=${item.ID}`),
              $('li').class('abtn').text('Api key').on('click', event => {
                $.client.api('/').query('request_type', 'api_key').query('expires_after', 30).post({
                  sub: item.ID,
                  aud: item.ID
                }).get().then(event => {
                  $('dialog').open(true).parent(document.body).text(event.target.responseText);
                  console.log(event.target.responseText);
                })
              }),
              // $('li').class('abtn').text('Secret JSON Unlimited').attr('href', `api/?request_type=secret_json&release&sub=${this.ID}&aud=${$.auth.access.aud}`),
              // $('li').class('abtn doc').text('Breakdown').click(event => build_map(items => $().list(items))),
              $('li').class('abtn doc').text('Breakdown').on('click', event => {
                $().list([]);
                $.client.api(`/${item.tag}`).query('request_type', 'build_breakdown').get().then(event => {
                  const data = event.body.value;
                  console.log(data);
                  const topitem = data.find(child => child.ID == item.data.ID);
                  const items = [];
                  (function build(item, tagname) {
                    console.log(item);
                    // if (!item) return;
                    items.push(item);
                    item.data.Tagname = tagname = (tagname ? tagname + '.' : '') + (item.data.Prefix || '') + (item.data.Tag || item.data.Name || '');
                    item.data.children = data
                    .filter(child => child.data.MasterID == item.data.ID)
                    .sort((a,b) => String(a.data.idx||'').localeCompare(b.data.idx||'', undefined, {numeric: true}))
                    .map(child => build(child, tagname));
                    return item;
                  })(topitem);
                  items.forEach(item => {
                    if (item.data && item.data.link) {
                      const link = item.data.link.shift();
                      const linkItem = $(link.LinkID);
                      item.data.LinkTagname = linkItem.data.Tagname;
                      linkItem.data.LinkTagname = item.data.Tagname;
                      // item.data.Linktagname = $(item.data.link.shift().LinkID).data.Tagname;
                    }
                  });
                  // items.sort((a,b) => (a.data.Tagname || '').localeCompare(b.data.Tagname || ''));
                  return $().list(items);
                });
              }),
              $('li').class('abtn doc').text('Doc').on('click', event => {
                (async function init() {
                  const elem = $('div').parent($('list')).class('col abs').append(
                    $('div').class('row top abs btnbar').append(
                      $('button').class('abtn icn r refresh').on('click', event => {
                        elem.remove();
                        init();
                      }),
                      $('button').class('abtn icn close').on('click', event => elem.remove()),
                    ),
                  );
                  breakdown_data().then(event => {
                    const items = event.body.value;
                    console.log(items);
                    const topitem = items.find(child => child.ID == item.data.ID);
                    function chapter(item, level) {
                      // console.log(item.schema, item.schemaPath);
                      // const schemaName = item.schemaPath.split(':').pop();
                      const properties = Object.entries(item.schema.properties)
                      .filter(([propertyName, property])=> item[propertyName])
                      .map(([propertyName, property])=> $('li').class('prop').append(
                        $('label').text(propertyName+': '),item[propertyName],
                      ));
                      return [
                        $('h'+level).text(item.header0),
                        // $('div').text('inleiding'),
                        $('ul').append(properties),
                      ].concat(...items.filter(child => child.data.MasterID === item.ID).map(item => chapter(item, level+1)));
                    }
                    $('div').parent(elem).class('row doc aco').append(
                      (this.docElem = $('div')).class('aco doc-content counter oa').append(
                        chapter(topitem, 1)
                      ),
                      $('div').class('mc-menu right np oa').append(
                        $('div').class('ac-header').text('Table of contents'),
                        $('ul').index(this.docElem)
                      ),
                    )
                  });
                })();
              }),
              // $('li').class('abtn download').text('Data JSON').attr('href', `api/?request_type=data_json&id=${this.ID}`),
              $('a').class('abtn download').text('Build_2to1').href(`https://schiphol.aliconnect.nl/api/item(${item.data.ID})?request_type=build_2to1&download`),
            )),
            $('button').class('abtn msg').attr('cnt', item.data.Messages ? item.data.Messages.length : 0).on('click', this.showMessages),
            $('button').class('abtn send').on('click', event => {
              new $.HttpRequest($.config.$, 'GET', `/${this.item.schema}(${this.item.id})?mailing`, event => {
                // //console.debug(this.responseText);
                alert(this.responseText);
              }).send();
              return false;
            }),
            $('button').class('abtn fav').attr('checked', isFav).on('click', event => event => this.fav ^= 1),
            $('button').class('abtn edit').name('edit').on('click', event => this.edit(item)).append(
              $('ul').append(
                // $('li').class('row').append(
                //   $('a').class('aco abtn share').text('share').href('#?prompt=share'),
                // ),
                $('li').class('abtn share').text('share').on('click', event => event.stopPropagation()).on('click', event => $().prompt('share_item')),
                $('li').class('abtn read').text('readonly').attr('disabled', '').on('click', event => event.stopPropagation()),
                $('li').class('abtn public').text('public').on('click', event => this.scope = 'private').on('click', event => event.stopPropagation()),
                $('li').class('abtn private').text('private').on('click', event => this.scope = 'public').on('click', event => event.stopPropagation()),
                $('li').class('abtn upload mailimport').text('Importeer mail uit outlook')
                // .attr('hidden', !$.Aliconnector.connected)
                .on('click', event => external.Mailimport())
                .on('click', event => event.stopPropagation()),
                $('li').class('abtn clone').text('clone').on('click', event => item.clone()),
                $('li').class('abtn del').text('delete').on('click', event => item.delete()),
              ),
            ),
            $('button').class('abtn popout').on('click', event => {
              const rect = this.elem.getBoundingClientRect();
              item.popout(window.screenX+rect.x, window.screenY+rect.y+window.outerHeight-window.innerHeight, rect.width, rect.height)
            }),
            $('button').class('abtn close').name('close').on('click', event => {
              this.text('');
              delete ItemSelected;
              $.history.replaceUrl(document.location.pathname.replace(/\/id\/.*/,'')+'?'+document.location.search);
            }),
          ),
          this.header(item),
          this.main = $('main')
          .class('aco oa')
          .on('dragover', event => {
            event.preventDefault();
          })
          .on('drop', event => {
            event.stopPropagation();
            const eventData = event.dataTransfer || event.clipboardData;
            const type = $.temp.keyEvent && $.temp.keyEvent.shiftKey ? 'link' : event.type;
            if (data = eventData.getData("aim/items")) {
              data = JSON.parse(data);
              data.type = data.type || (event.ctrlKey ? 'copy' : 'cut');
              //console.log('ja1', data.value, data.value.length);
              data.value.forEach(link => {
                link = Item.get(link.tag);
                console.log(([].concat(item.data.link).shift()||{}).AttributeID);
                item.attr('link', {
                  AttributeID: event.ctrlKey ? null : ([].concat(item.data.link).shift()||{}).AttributeID,
                  LinkID: link.data.ID,
                  max: 999,
                  type: event.ctrlKey ? 'append' : '',
                }, true)
                .then(item => item.details(true).then(item => $('view').show(item)));
              });
              //console.log('DROP', data.value);
            } else if (eventData.files) {
              event.preventDefault();
              [...eventData.files].forEach(item.elemFiles.appendFile)
            }
          })
          .append(
            item.elemTo = $('div')
            .class('row editlinks to')
            .text('to:')
            .on('change', event => {
              const items = [...event.target.getElementsByTagName('A')].map(e=>e.item);
              items.filter(item => !to.find(to => to.LinkID == item.ID)).forEach(to => item.to = { LinkID: to.ID });
              to.filter(to => !items.find(item => to.LinkID == item.ID)).forEach(to => item.to = { AttributeID: to.AttributeID, LinkID: null, Value: null });
            })
            .on('drop', event => {
              event.preventDefault();
              event.stopPropagation();
              const eventData = event.dataTransfer || event.clipboardData;
              const type = $.temp.keyEvent && $.temp.keyEvent.shiftKey ? 'link' : event.type;
              if (data = eventData.getData("aim/items")) {
                data = JSON.parse(data);
                data.type = data.type || (event.ctrlKey ? 'copy' : 'cut');
                data.value.forEach(item => event.target.is.append(linkElem(item)));
                event.target.is.emit('change')
              }
            })
            .append(to.map(linkElem)),
            item.elemFiles = $('div').files(item, 'Files'),
          )
          .properties(item.properties),
          this.messagesElem = $('details').class('message-list').attr('open', 1),
          $('form').class('message-new col msgbox')
          .on('keydown', event => {
            if (event.keyPressed === 'Enter') {
              event.preventDefault();
              event.target.dispatchEvent(new Event('submit'));
            }
          })
          .on('submit', event => {
            event.preventDefault();
            let html = this.msgElem.elem.innerHTML.replace(/<p><br><\/p>/g,'');
            if (!html) return;
            event.target.BodyHTML.value = html;
            this.msgElem.elem.innerHTML = '<p><br></p>';
            $.client.api(`/${item.tag}/Messages`).post(event.target).then(event => this.showMessages());
            return false;
          })
          .append(
            // $().files(),
            $('input').type('hidden').name('BodyHTML'),
            $('input').type('hidden').name('masterId').value(this.id),
            $('div').class('row aco msgbox').append(
              this.msgElem = $('div').class('aco').html('<p><br></p>').placeholder('Write message or add attachements').htmledit(),
              $('div').class('row np').append(
                $('button').class('abtn send').type('submit'),
                $('button').class('abtn image').type('button').attr('accept', 'image/*').on('click', event => {}),
                $('button').class('abtn image').type('button').attr('accept', '').on('click', event => {}),
              )
            )
          )
        );
        // console.log('FILES',item, item.data.files);
        //
        //
        // if (item.data.files) {
        //   JSON.parse(item.data.files).forEach(item.elemFiles.appendFile)
        // }
        // return console.log('SHOW', item);
        $.clipboard.setItem([item], 'selected', '');
        let link;
        if (item.data.link) {
          // console.log(item.data.link);
          link = [].concat(item.data.link).map(link => Object.assign(link, {item: $(link)}));
          this.main.append(link.map(link => link.item.schemaName).unique().map(
            schemaName => $('details')
            .class('col')
            .open(window.localStorage.getItem('detailsLink'))
            .on('toggle', event => window.localStorage.setItem('detailsLink', event.target.open))
            .append(
              $('summary').text(schemaName),
              $('div')
              .class('row editlinks')
              .append(
                link.filter(link => link.item.schemaName === schemaName).map(
                  link => $('span').itemLink(link).append(
                    $('button')
                    .type('button')
                    .on('click', event => {
                      event.preventDefault();
                      event.stopPropagation();
                      item.attr('link', {
                        AttributeID: link.AttributeID,
                        LinkID: null,
                        Value: null,
                      }, true)
                      .then(item => item.details(true).then(item => $('view').show(item)));
                    })
                  )),
                )
              )
          ));
        }
        if (item.onloadEdit = item.onloadEdit || doEdit) {
  				return this.edit(item);
  			}
      });
      return this;
    },
    showpage(item) {
      item.details().then(item => {
        $('list').text('').append(
          this.elemDiv = $('div').class('aco col').append(
            $('h1').text(item.header0),
            $('div').text(item.header1),
            $('div').html(item.BodyHTML||''),
          )
        );
        $.client.api(`/${item.tag}/children`).select('*').get().then(async event => {
          console.log(event);
          this.elemDiv.append(
            (await item.children).map(item => $('div').append(
              $('h2').text(item.header0),
              $('div').text(item.header1),
              $('div').html(item.BodyHTML||''),
            ))
          );
        });
      })
    },
    async showMenuTop(item) {
      const children = await item.children;
      if (this.webpage = children.find(item => item instanceof Webpage)) {
        $.client.api(`/${this.webpage.tag}/children`).query('level', 3).get().then(async event => {
          $.elem.menuList = $('ul').parent(this.elem);
          function addChildren(elem, item, level) {
            if (Array.isArray(item.data.Children)) {
              item.data.Children.forEach(data => {
                const item = $(data);
                const elemLi = $('li').parent(elem);
                $('a').parent(elemLi).text(item.header0).on('click', event => {
                  event.stopPropagation();
                  $.elem.menuList.style('display:none;');
                  $('view').showpage(item);
                });
                if (level < 3) {
                  addChildren($('ul').parent(elemLi), item, level + 1);
                }
              });
            }
          }
          addChildren($.elem.menuList, this.webpage, 1);
          this.on('mouseenter', event => $.elem.menuList.style(''))
        });
      }
    },
    showLinks(item) {
			$.client.api(`/${item.tag}`).query('request_type','build_link_data').get().then(event => {
				//console.log(event.body);
				$('div').style('display:block;width:100%;height:400px;background:white;border:solid 1px red;')
				.attr('height',400)
				.width(400)
				.parent(this.main)
				// .modelLinks(event.body)
				// .modelTraverse(event.body)
				.modelDigraph(event.body)
			});
		},
    sort: {
      Title: function(a, b) { return String(a.Title.toLowerCase()).localeCompare(String(b.Title.toLowerCase())) },
      index: function(a, b) {
        if (a.index != undefined && b.index == undefined) return -1;
        if (a.index != undefined && b.index == undefined) return 1;
        if (a.index > b.index) return 1;
        if (a.index < b.index) return -1;
        return 0;
      },
      id: function(a, b) {
        if (a.id < b.id)
        return -1;
        if (a.id > b.id)
        return 1;
        return 0;
      },
      filter: function(a, b) {
        if (a.cnt > 0 && b.cnt == 0) return -1;
        if (a.cnt == 0 && b.cnt > 0) return 1;
        return a.value.localeCompare(b.value, {}, 'numeric');
      },
      value: function(a, b) {
        var va = (isNaN(a.value)) ? a.value.toLowerCase() : a.value;
        var vb = (isNaN(b.value)) ? b.value.toLowerCase() : b.value;
        if (va < vb) return -1;
        if (va > vb) return 1;
        return 0;
      },
      prijs: function(a, b) {
        if (Number(isnull(a.Prijs, 0)) < Number(isnull(b.Prijs, 0)))
        return -1;
        if (Number(isnull(a.Prijs, 0)) > Number(isnull(b.Prijs, 0)))
        return 1;
        return 0;
      },
      prijsLaagHoog: function(a, b) {
        if (Number(isnull(a.field.Prijs.Value, 0)) < Number(isnull(b.field.Prijs.Value, 0)))
        return -1;
        if (Number(isnull(a.field.Prijs.Value, 0)) > Number(isnull(b.field.Prijs.Value, 0)))
        return 1;
        return 0;
      },
      prijsHoogLaag: function(a, b) {
        if (Number(isnull(a.field.Prijs.Value, 0)) < Number(isnull(b.field.Prijs.Value, 0)))
        return 1;
        if (Number(isnull(a.field.Prijs.Value, 0)) > Number(isnull(b.field.Prijs.Value, 0)))
        return -1;
        return 0;
      },
      nameAz: function(a, b) {
        if ((a.field.Name.Value || '').toLowerCase() < (b.field.Name.Value || '').toLowerCase())
        return -1;
        if ((a.field.Name.Value || '').toLowerCase() > (b.field.Name.Value || '').toLowerCase())
        return 1;
        return 0;
      },
      nameZa: function(a, b) {
        if ((a.field.Name.Value || '').toLowerCase() < (b.field.Name.Value || '').toLowerCase())
        return 1;
        if ((a.field.Name.Value || '').toLowerCase() > (b.field.Name.Value || '').toLowerCase())
        return -1;
        return 0;
      },
      prijsdesc: function(a, b) {
        if (Number(isnull(a.Prijs, 0)) < Number(isnull(b.Prijs, 0)))
        return 1;
        if (Number(isnull(a.Prijs, 0)) > Number(isnull(b.Prijs, 0)))
        return -1;
        return 0;
      },
      idx1: function(a, b) {
        if (a.index < b.index)
        return -1;
        if (a.index > b.index)
        return 1;
        return 0;
      },
      az: function(a, b) {
        if (isnull(a.Name, '') < isnull(b.Name, ''))
        return 1;
        if (isnull(a.Name, '') > isnull(b.Name, ''))
        return -1;
        return 0;
      },
      za: function(a, b) {
        if (isnull(a.Name, '') < isnull(b.Name, ''))
        return -1;
        if (isnull(a.Name, '') > isnull(b.Name, ''))
        return 1;
        return 0;
      },
      cntdn: function(a, b) {
        if (a.cnt < b.cnt)
        return 1;
        if (a.cnt > b.cnt)
        return -1;
        return 0;
      },
    },
    statusbar() {
      $.elem.statusbar = this.class('row statusbar np').append(
        ['ws','aliconnector','http','checked','clipboard','pos','source','target','main'].map(name => this[name] = $('span').class(name)),
      );
      this.progress = $('progress').parent(this.main.class('aco'));
      return this;
    },
    setProperty(selector, context) {
      this.elem.style.setProperty('--'+selector, context);
      return this;
    },
    slider(element){
      console.error('SLIDER');
  		const elements = [...document.getElementsByClassName('aimage')].filter(elem => elem.is.has('ofile'));
      let imageNr = elements.indexOf(element);
  		elements.forEach(element => { if (element.pause) element.pause() });
  		// let imageNr = 0;
      this.show = element => {
        const elem = element.is;
        const ofile = elem.get('ofile') || {};
        const src = ofile.src;
        console.log(imageNr, elements.length, src);
        this.titleElem.text(
          element.alt,
          ofile.lastmodifieddate ? new Date(ofile.lastmodifieddate).toLocaleString(): null,
  				ofile.size ? ofile.size + 'kB': null,
  			);
  			if (this.srcElem) {
  				this.srcElem.remove();
  			}
        this.scrollPlay = () => {
          this.srcElem.elem.currentTime = frameNumber;
          //window.requestAnimationFrame(scrollPlay);
        };
        if (ofile.src.match(/jpg|png|bmp|jpeg|gif|bin/i)) {
          this.srcElem = $('img')
          .parent(this.containerElem)
          .class(element.className)
          .src(ofile.src)
        } else if (ofile.src.match(/3ds/i)) {
          this.srcElem = $('div')
          .parent(this.containerElem)
          .class(element.className)
          .tds({src:ofile.src, hasControls: true})
        } else if (ofile.src.match(/mp4|webm|mov/i)) {
          frameNumber = 0;
          this.srcElem = $('video')
          .parent(this.containerElem)
          .class(element.className)
          .src(ofile.src)
          .controls('')
          .autobuffer('')
          .preload('')
          .autoplay('')
          .on('click', event => {
            if (!this.srcElem.elem.paused) {
              this.srcElem.elem.pause();
              frameNumber = this.srcElem.elem.currentTime;
            } else {
              this.srcElem.elem.play();
            }
          })
          .on('wheel', event => {
            if (!this.srcElem.elem.paused) {
              this.srcElem.elem.pause();
              frameNumber = this.srcElem.elem.currentTime;
            }
            frameNumber += event.deltaY / 1000;
            window.requestAnimationFrame(this.scrollPlay);
          });
          window.requestAnimationFrame(this.scrollPlay);
          // this.srcElement.onended = event => {
          // 	this.next();
          // };
        }
      };
      this.prior = event => {
        console.warn(imageNr, elements.length);
        this.show(elements[imageNr = imageNr ? imageNr - 1 : elements.length - 1]);
  		};
  		this.next = event => {
        console.warn(imageNr, elements.length);
  			this.show(elements[imageNr = imageNr < elements.length - 1 ? imageNr + 1 : 0]);
  		};
  		const onkeydown = event => {
  			if (event.code === "ArrowLeft") {
          event.stopPropagation(event.preventDefault(this.prior(event)))
        } else if (event.code === "ArrowRight") {
          event.stopPropagation(event.preventDefault(this.next(event)))
        } else if (event.code === "Escape") {
          event.stopPropagation(event.preventDefault(this.closeSlider(event)))
        }
  		};
  		document.addEventListener('keydown', onkeydown, true);
  		this.closeSlider = event => {
  			document.removeEventListener('keydown', onkeydown, true);
  			this.sliderElem.remove();
  			// this.elem = null;
  		};
      this.sliderElem = $('div')
      .class('imageSlider')
      .parent(this.elem)
      .on('click', event => event.stopPropagation())
      .append(
        $('div').class('row top').append(
          $('button').class('abtn icn close abs').on('click', this.closeSlider),
          this.titleElem = $('div').class('aco'),
        ),
        this.containerElem = $('div').class('Image').append(
          $('div').class('sliderButton prior').on('click', this.prior).append(
            $('span'),
          ),
          $('div').class('sliderButton next').on('click', this.next).append(
            $('span'),
          ),
        ),
      );
  		// swipedetect(divElement, swipedir => {
  		// 	if (swipedir === 'left') next();
  		// 	else if (swipedir === 'right') prior();
  		// });
      this.show(element);
    },
    text(value) {
			if (arguments.length) {
        this.elem.innerText = [].concat(...arguments).join(' ');
        return this;
			}
      return this.elem.innerText;
		},
    three(callback){
			const SELECT_OPACITY = 0.8; // opacity value for ThreeD objects selected
			const BASE_OPACITY = 1; // default opacity value for ThreeD objects
      const el = this.elem;
      const container = this.elem;
      const mouse = { x: 0, y: 0 };
      const dmouse = { x: 0, y: 0 };
      let targetList = [];
      let objectList = [];
      const baseopacity = 1;
      const hoveropacity = 0.8;
      const selectopacity = 0.6;
      let controls;
            // this.objectList = $.threeObjects = [];
      (async () => {
        var url = new URL($.config.apiPath);
        await $.script.import(url.origin + '/lib/three/build/three.js');
        await $.script.import(url.origin + '/lib/three/examples/js/controls/OrbitControls.js');
        var textureLoader = new THREE.TextureLoader();
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setClearColor(0xcfcfcf, .5);
        this
        .on('mouseenter', event => {
          controls = new THREE.OrbitControls(camera, renderer.domElement);
          controls.zoomSpeed= 0.1;
					controls.addEventListener('change', render);
        })
        .on('mouseleave', event => {
          controls.dispose();
        })
        .on('mousedown', event => {
          console.log('DOWN');
    			var rect = container.getBoundingClientRect();
    			mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    			mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
    			var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    			vector.unproject(camera);
    			var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    			console.log(targetList);
    			var intersects = ray.intersectObjects(targetList);
    			console.log(intersects);
    			if (intersects.length > 0) {
    				this.objectclick = intersects[0].object;
    			}
    			console.log(this.objectclick);
    			render();
        })
        .on('mouseup', event => {
          var rect = container.getBoundingClientRect();
    			mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    			mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
    			var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    			vector.unproject(camera);
    			var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    			var intersects = ray.intersectObjects(targetList);
    			if (intersects.length > 0) {
    				var p = this.objectclick = intersects[0].object;
    				while (p && !p.itemID) p = p.parent;
    				var itemID = p.itemID;// || Three.objectclick.parent.itemID || Three.objectclick.parent.parent.itemID;
    				if (itemID) {
    					// console.log('HIT',itemID);
    					this.objectselect = this.objectclick;
    					for (var i = 0, e; e = targetList[i]; i++) { e.material.opacity = baseopacity; }
    					//intersects[0].object.selected = true;
    					this.objectselect.material.opacity = selectopacity;
    					console.log("Hit @ ", this.objectselect, itemID, $({tag:`System(${itemID})`}));
              $('view').show($({tag:`Equipment(${itemID})`}));
    					// Aim.URL.set({ schema:'item', id: itemID });
    				}
    			}
    			render();
        })
        .on('mousemove', event => {
          var rect = container.getBoundingClientRect();
    			mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    			mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
    			var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    			vector.unproject(camera);
    			var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    			var intersects = ray.intersectObjects(targetList);
    			if (this.objecthover) {
    				//hoverelement.object.material.color = hoverelement.orgcolor;
    				this.objecthover.material.opacity = this.objecthover.opacity;
    			}
    			if (intersects.length > 0) {
    				this.objecthover = intersects[0].object;
    				if (!this.objecthover.opacity) this.objecthover.opacity = this.objecthover.material.opacity;
    				if (!this.objecthover.color) this.objecthover.color = this.objecthover.material.color;
    				this.objecthover.material.opacity = hoveropacity;
    				//hoverelement.object.material.color = { r: 255, g: 0, b: 0 };
    			}
    			if (this.objectselect) this.objectselect.material.opacity = selectopacity;
    			render();
        });
        el.appendChild( renderer.domElement );
        window.addEventListener( 'resize', onWindowResize );
        // animate();
        this.build = params => {
          console.log('BUILD', params.body);
          targetList = [];
          objectList = [];
          data3d = params.body || params.target.data;
          scale = data3d.scale || 1;
          size = {
            x: data3d.object.w / scale,
            y: data3d.object.depth / scale,
            // x: data3d.object.sizeX / scale,
            // y: data3d.object.sizeY / scale,
          };
          data3d.object.depth = null;
          data3d.object.w = null;
          if (group) {
            clearThree(group);
          } else {
            console.log(size);
            camera.position.set(0, size.x / 2, size.y / 2);
            camera.lookAt(scene.position);
            //var floorMaterial = new THREE.MeshBasicMaterial({ map: loader.load("https://aliconnect.nl" + data3d.floorplan.src), side: THREE.DoubleSide });
            // data3d.floorplan.src = "https://aliconnect.nl" + data3d.floorplan.src;
            if (data3d.floorplan) {
              var floorMaterial = data3d.floorplan.src
              ? new THREE.MeshBasicMaterial({ map: textureLoader.load('https://aliconnect.nl' + data3d.floorplan.src) })
              : new THREE.MeshBasicMaterial({ color: data3d.floorplan.color ? parseInt(data3d.floorplan.color) : 0x999999 });
              var floorGeometry = new THREE.PlaneGeometry(size.x, size.y, 0, 0);
              var floor = new THREE.Mesh(floorGeometry, floorMaterial);
              floor.rotation.x = -Math.PI / 2;
              scene.add(floor);
            }
            group = new THREE.Group();
            group.position.x = -size.x / 2;
            group.position.z = size.y / 2;
            group.rotation.y = Math.PI * (data3d.object.r + 180) / 180;
            var s = 1 / scale;
            group.scale.set(s, s, s);
            scene.add(group);
          }
          redraw();
        };
        callback(this);
        console.log('INIT');
        let group;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(100, 1, 0.1, 8000);
        var light = new THREE.PointLight(0xffffff, 0.8, 0, 20);
        camera.add(light);
        scene.add(camera);
        var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
        hemiLight.position.set(0, 500, 0);
        scene.add(hemiLight);
        // scene.background = new THREE.Color( 0xdddddd );
        // camera.position.z = 400;
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( el.clientWidth, el.clientHeight );
        function clearThree(obj) {
          if (obj.children) {
            while (obj.children.length > 0) {
              clearThree(obj.children[0]);
              obj.remove(obj.children[0]);
            }
          }
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) obj.material.dispose();
          if (obj.texture) obj.texture.dispose();
        }
        function redraw() {
          createObject(data3d.object, group);
          setTimeout(render, 1);
        }
        function shape(shapename, fx) {
          var apts = [];
          if (!data3d.shape[shapename]) return console.error(shapename);
          var vectors = data3d.shape[shapename].vectors.slice(0);
          var width = 0;
          var left = 9999999;
          var height = 0;
          var minheight = 9999999;
          var vecbottom = 999999;
          var vecleft = 999999;
          for (var i = 0; i < vectors.length; i += 2) {
            vectors[i] *= -1;
            vecbottom = Math.min(vecbottom, vectors[i + 1]);
            vecleft = Math.min(vecleft, vectors[i]);
          }
          for (var i = 0; i < vectors.length; i += 2) {
            vectors[i + 1] -= vecbottom;
            vectors[i] -= vecleft;
            left = Math.min(left, vectors[i]);
            width = Math.max(width, vectors[i]);
            height = Math.max(height, vectors[i + 1]);
          }
          for (var i = 0; i < vectors.length; i += 2) {
            if (fx) vectors[i] = -vectors[i] + width / 2;
            else vectors[i] -= width / 2;
            var pts = new THREE.Vector2(vectors[i], vectors[i + 1]);
            apts.push(pts);
          }
          var shape = new THREE.Shape(apts);
          shape.left = left;
          shape.width = width;
          shape.height = height;
          return shape;
        }
        function createObject(obj, grp) {
          // if (obj.geo && data3d.geo[obj.geo]) {
          //   Object.assign(obj, data3d.geo[obj.geo]);
          //   console.log(obj.geo, data3d.geo[obj.geo], obj);
          // }
          obj.baseColor = obj.color || '0x999999';
          if (grp.src) {
            if (obj.left != undefined && obj.right != undefined) {
              obj.w = grp.src.w - obj.left - obj.right;
            } else if (!obj.w) {
              obj.w = grp.src.w;
            }
            if (obj.left != undefined) {
              obj.x = -grp.src.w / 2 + obj.left + obj.w / 2;
            } else if (obj.right != undefined) {
              obj.x = grp.src.w / 2 - obj.right - obj.w / 2;
            }
            if (!obj.h) {
              obj.h = grp.src.h - (obj.bottom || 0) - (obj.top || 0);
            }
            if (obj.bottom != undefined) {
              obj.y = obj.bottom;
            } else if (obj.top != undefined) {
              obj.y = grp.src.h - obj.top - obj.h;
            }
            if (obj.begin != undefined && obj.end != undefined) {
              obj.depth = grp.src.depth - obj.begin - obj.end;
            } else if (!obj.depth) {
              obj.depth = grp.src.depth - 10; if (obj.z == undefined) obj.z = 5;
            }
            if (obj.begin != undefined) {
              obj.z = obj.begin;
            } else if (obj.end != undefined) {
              obj.z = grp.src.depth - obj.end - obj.src.depth;
            }
          }
          var mesh;
          for (let [key, value] of Object.entries(obj)) {
            if (key in THREE) {
              // //console.error(key,value);
              if (obj.texture) {
                var material = new THREE.MeshBasicMaterial( {
                  map: textureLoader.load( obj.texture )
                } );
              } else if (obj.material) {
                material = new THREE.MeshBasicMaterial( Object.assign(obj.material, {transparent: true}) );
              } else if (obj.color) {
                material = new THREE.MeshBasicMaterial( {
                  color: obj.color,//parseInt(obj.color),
                  reflectivity: 0,
                  // opacity: obj.opacity,
                  transparent: true,
                  // alphaMap: 0.1,
                } );
              }
              var geometry = new THREE[key](...value);
              mesh = new THREE.Mesh( geometry, material );
              break;
            }
          }
          // console.log(mesh);
          // if (obj.l && obj.w && obj.h) {
          //   obj.geo = obj.geo || 'BoxBufferGeometry';
          // }
          if (obj.geo) {
            // console.log(obj.geo, data3d.geo[obj.geo], obj);
            // if (data3d.geo[obj.geo]) {
            // }
            // if (obj.texture) {
            //   var material = new THREE.MeshBasicMaterial( {
            //     map: textureLoader.load( obj.texture )
            //   } );
            // } else if (obj.color) {
            //   material = new THREE.MeshBasicMaterial( {
            //     color: parseInt(obj.color),
            //     reflectivity: 0,
            //     transparent: true,
            //     // side: THREE.DoubleSide,
            //   } );
            // }
            // var geometry = new THREE[obj.geo]( obj.w, obj.h, obj.l );
            // var mesh = new THREE.Mesh( geometry, material );
            // // var box = new THREE.Box3().setFromObject( mesh );
            // // mesh.position.y -= box.min.y;
            // // mesh.position.x += box.min.x;
            // // mesh.position.z += box.min.z;
            //
            // // //console.log( box );
          }
          if (obj.shape) {
            obj.shape = shape(obj.shape, obj.fx);
            var geometry = new THREE.ExtrudeGeometry(obj.shape, { depth: obj.depth });
            if (obj.shape.color) {
              obj.baseColor = obj.shape.color;
            }
            if (obj.shininess === -1) {
              var material = new THREE.MeshStandardMaterial({
                color: parseInt(obj.baseColor),
                reflectivity: 0,
                transparent: true,
              });
            } else {
              var material = new THREE.MeshPhongMaterial({
                color: parseInt(obj.baseColor),
                //shininess: obj.shininess || 80,
                reflectivity: .5,
                transparent: true,
              });
            }
            var mesh = obj.mesh = new THREE.Mesh(geometry, material);
            if (obj.h) {
              mesh.scale.y = obj.h / obj.shape.height; //// //console.log('SCALE', this, mesh, mesh.scale);
            }
            if (obj.w) {
              mesh.scale.x = obj.w / obj.shape.width;
            }
            targetList.push(mesh);
          } else {
            var mesh = obj.mesh || new THREE.Group();
          }
          mesh.colorSet = function(color) {
            if (obj.material) {
              obj.material.color.setHex(parseInt(color || obj.src.baseColor));
            }
            obj.children.forEach(child => child.colorSet(color))
          };
          // mesh.src = grp;
          // mesh.obj = obj;
          // obj.mesh = mesh;
          mesh.src = obj;
          // mesh.onchange = obj.onchange;
          if (obj.name) {
            objectList.push(objectList[obj.name] = mesh);
          }
          if (obj.itemID) {
            // console.log(obj.itemID, mesh);
            //stateitemlist.push(obj.id);
            meshitems[obj.itemID] = mesh;
            mesh.itemID = obj.itemID;
            // mesh.item = obj;
          }
          // DEBUG: Uitgezet ivm nieuwe opzet !!!!!, werkt tunnel sim nog wel?
          //mesh.position.set((-obj.x || 0), (obj.y || 0), (obj.z || 0) );
          grp.posz = grp.posz || 0;
          grp.posx = grp.posx || 0;
          if (obj.z != undefined) grp.posz = obj.z;
          if (obj.x != undefined) grp.posx = -obj.x;
          mesh.position.z = grp.posz;
          mesh.position.x = grp.posx;
          mesh.position.y = obj.y || 0;
          if (obj.ry == 180) {
            mesh.position.z += obj.depth;
          }
          if (obj.ry == 90) {
            grp.posz += obj.w;
            grp.posx -= obj.depth
          } else if (obj.ry == -90) {
            grp.posz += obj.w;
            grp.posx += obj.depth
          } else {
            grp.posz += obj.depth;
          }
          mesh.rotation.x = (obj.rx || 0) / 180 * Math.PI;
          mesh.rotation.y = (-obj.ry || 0) / 180 * Math.PI;
          mesh.rotation.z = (obj.rz || 0) / 180 * Math.PI;
          mesh.absr = (grp.absr || 0) + (obj.rz || 0);
          if (mesh.absr == 90) {
            mesh.position.x += obj.depth;
          }
          grp.add(mesh);
          // if (obj.geo) {
          //   console.log(obj.geo, obj, mesh);
          // }
          if (obj.children) {
            obj.children.forEach(child => createObject(child, mesh) );
          }
        }
        // if (params.body) build(params);
        function render() {
          renderer.render(scene, camera);
        }
        function animate() {
          requestAnimationFrame( animate );
          controls.update();
          renderer.render( scene, camera );
        }
        function onWindowResize() {
          camera.aspect = el.clientWidth / el.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize( el.clientWidth, el.clientHeight );
        }
      })();
			return this;
		},
    tds(options = {}) {
      var container, controls;
      var camera, scene, renderer;
      container = this.elem;
      // console.log(this.elem, this.width(), this.height());
      // container.style = 'width:120px;';
      const width = this.width() || container.offsetWidth;
      const height = this.height() || container.offsetHeight;
      // console.log([...document.getElementsByTagName('SCRIPT')].find(s => s.src === '/lib/three/examples/js/controls/TrackballControls.js'));
      (async () => {
        await $.script.import('/lib/three/build/three.js');
        await $.script.import('/lib/three/examples/js/controls/TrackballControls.js');
        await $.script.import('/lib/three/examples/js/loaders/TDSLoader.js');
        console.log(container.offsetWidth, container.offsetHeight);
        camera = new THREE.PerspectiveCamera( 60, width / height, 0.1, 10 );
        camera.position.z = 2;
        scene = new THREE.Scene();
        scene.add( new THREE.HemisphereLight() );
        var directionalLight = new THREE.DirectionalLight( 0xffeedd );
        directionalLight.position.set( 0, 0, 2 );
        scene.add( directionalLight );
        //3ds files dont store normal maps
        // var loader = new THREE.TextureLoader();
        // // var normal = loader.load( '/lib/three/examples/models/3ds/portalgun/textures/normal.jpg' );
        // var normal = loader.load( '/shared/upload/normal.jpg' );
        var loader = new THREE.TDSLoader( );
        // loader.setResourcePath( '/lib/three/examples/models/3ds/portalgun/textures/' );
        // loader.setResourcePath( '/shared/upload/' );
        // loader.load( '/lib/three/examples/models/3ds/portalgun/portalgun.3ds', function ( object ) {
        loader.load( options.src, function ( object ) {
          // object.traverse( function ( child ) {
          //
          // 	if ( child.isMesh ) {
          //
          // 		child.material.normalMap = normal;
          //
          // 	}
          //
          // } );
          scene.add( object );
        } );
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        // renderer.setSize( width, height );
        this.append( renderer.domElement );
        controls = new THREE.TrackballControls( camera, renderer.domElement );
        // console.log(window);
        $(window).on('resize', resize, false).emit('resize');
        setTimeout(() => {
          renderer.render( scene, camera );
        },200);
        if (options.hasControls) {
          animate();
        }
        // requestAnimationFrame( animate );
        // animate();
      })();
			function resize() {
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
				renderer.setSize( width, height );
			}
			function animate() {
				controls.update();
				renderer.render( scene, camera );
				requestAnimationFrame( animate );
			}
      return this;
    },
    treelist(){
			if (!Array.isArray(par.treelist)) return;
			var treelist = treelist || {};
			par.treelist.sort($.sort.index);
			par.treelist.forEach(row => {
				var elLI = el.createElement('LI', 'col', treelist.li || {
					onmouseenter: event => elLI.hasAttribute('open') ? elLI.setAttribute('open', 1) : null,
					onmouseleave: event => elLI.hasAttribute('open') ? elLI.setAttribute('open', 0) : null,
					onclick: event => elLI.hasAttribute('open') ? elLI.setAttribute('open', 0) : null,
					draggable: 1
				});
				var elA = elLI.createElement('A', { href: `#${row.tag}`, href: '#/id/' + btoa(row['@id']), innerText: row.Title, });
				row.Children = row.Children || row.items;
				if (row.Children && row.Children.length) {
					elLI.setAttribute('open', treelist.opendefault || 0);
					elLI.createElement('UL', 'bg', {open: 1, treelist: row.Children});
				}
			});
		},
    ttext(value){
      this.elem.innerText = [].concat(...arguments).map(s => __(s)).join(' ');
			return this;
		},
    toggle() {
			this.open(!this.open());
      return this;
    },
    toHtml() {
			return web.html(...arguments);
		},
    tree(){
      $().tree(this);
      return this;
    },
    type(){
			return this.attr('type', ...arguments);
		},
    openLinkInIframe(src) {
      return this.append(
        this.iframePanelElem = $('div').class('col aco iframe').append(
          $('div').class('row top').append(
            $('button').class('abtn download').href(src).download().target("_blank"),
            $('button').class('abtn print').on('click', event => this.iframeElem.elem.contentWindow.print()),
            $('button').class('abtn close').on('click', event => this.iframePanelElem.remove()),
          ),
          this.iframeElem = $('iframe').class('aco').src(src),
        )
      );
    },
    openHtmlInIframe(html) {
      this.append(
        this.iframePanelElem = $('div').class('col aco iframe').append(
          $('div').class('row top').append(
            $('button').class('abtn download').href(src).download().target("_blank"),
            $('button').class('abtn print').on('click', event => this.iframeElem.elem.contentWindow.print()),
            $('button').class('abtn close').on('click', event => this.iframePanelElem.remove()),
          ),
          this.iframeElem = $('iframe').class('aco'),
        )
      );
      const doc = this.iframeElem.elem.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
      return this;
    },
    window(event) {
			this.url = apiorigin + "/" + $.config.$.domain + "/" + $.version + "/app/form/?select*&schema=" + this.schema + "&id=" + (this.detailID || this.id) + (this.uid ? "&uid=" + this.uid : "");
			if ($.temp.handles[this.url]) {
				$.temp.handles[this.url].focus();
			}
			else {
				$.temp.handles[this.url] = window.open(this.url, this.url, 'width=600, height=800, left=' + (event.screenX || 0) + ', top=' + (event.screenY || 0));
				$.temp.handles[this.url].name = this.url;
				$.temp.handles[this.url].onbeforeunload = function() { $.temp.handles[this.name] = null };
			}
		},
		sampleWindow(url) {
			const height = 600;
			const width = 1200;
			let rect = document.body.getBoundingClientRect();
			let top = window.screenTop + window.innerHeight - height + 50 - 20;
			let left = window.screenLeft + window.innerWidth - width - 20;
			return window.open(url, 'sample', `top=${top},left=${left},width=${width},height=${height},toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes`);
		},
		tileboard (menuname) {
			if (menuname) return ($.$.menu.items[menuname]) ? $.tileboard.call($.$.menu.items[menuname]) : null;
			if (this.el) return $.elBrd.appendChild(this.el);
			with (this.el = $.elBrd.createElement('DIV', 'col aco start aimitems')) {
				with (createElement('DIV', 'row')) {
					for (var menuname in this.items) {
						var menuitem = this.items[menuname];
						if (menuitem) {
							with (menuitem.elTegel = createElement('DIV', { className: 'col card' })) {
								menuitem.get = menuitem.get || { bv: menuname };
								createElement('DIV', { className: 'row bgd' }).createElement('A', {
									name: menuname, className: 'row aco abtn icn ' + menuitem.className, innerText: menuitem.Title, menuitem: menuitem,
									par: menuitem.get,
									onclick: Element.onclick,
									//href: '#' + $.url.stringify(menuitem.get || { bv: menuname })
								});
								if (menuitem.showbody) menuitem.showbody();
								for (var itemname in menuitem.items) {
									var item = $.$.menu.items[itemname];
									if (item) {
										item.elLink = createElement('DIV', { className: 'row bgd' }).createElement('A', {
											name: itemname, className: 'row aco abtn icn ' + item.className, innerText: item.Title, menuitem: item,
											//par: { mn: this.name },
											par: item.get,
											onclick: Element.onclick,
											//href: '#' + $.url.stringify({ mn: itemname })
										});
										if (item.showtitle) item.showtitle();
									}
								}
							}
						}
					}
					for (var i = 0; i < 4; i++) createElement('DIV', { className: 'card ghost' });
				}
			}
		},
    panel(parent) {
      return this.parent(parent || $('list')).class('col abs').append(
        this.elemBar = $('div').class('row top abs btnbar').append(
          $('span').class('aco'),
          $('button').class('abtn close').on('click', event => this.elem.remove()),
        ),
        this.elemMain = $('main').class('aco oa'),
      );
      // return this.parent($('list')).class('col abs').append(
      //   this.elemBar = $('div').class('row top abs btnbar').append(
      //     $('span').class('aco'),
      //     $('button').class('abtn close').on('click', event => this.elem.remove()),
      //   ),
      //   this.elemMain = $('main').class('aco oa'),
      // );
    },
	});
  // console.log(Object.getOwnPropertyDescriptors(Elem.prototype));
  // console.log(Object.getOwnPropertyDescriptors(Aim));
  // console.log(Object.getOwnPropertyDescriptors(Aim.prototype));
  Aim.PublicClientApplication = function(config) {
    const accounts = new Map();
    this.acquireTokenSilent = function (silentRequest) {
      return new Promise (async callback => {
        const account = accounts.get(silentRequest.account.username);
        // return accounts.get(username);
        // const account = accounts.find(account => account.username === request.username);
        // console.log('');
        callback({
          accessToken: account.id_token,
        });
      });
    };
    this.getAccountByUsername = function (username) {
      const account = accounts.get(username);
      return account;
      // if (account) {
      //   return {
      //     // environment: "login.windows.net",
      //     // homeAccountId: "f40f8462-da7f-457c-bd8c-d9e5639d2975.09786696-f227-4199-91a0-45783f6c660b",
      //     // tenantId: "09786696-f227-4199-91a0-45783f6c660b",
      //     username: account.username,
      //   }
      // }
    };
    this.logout = function () {
      // https://login.microsoftonline.com/common/oauth2/v2.0/logout
      const url = new URL('https://login.aliconnect.nl/api/oauth');
      url.searchParams.set('prompt', 'logout');
      // url.searchParams.set('post_logout_redirect_uri', config.redirectUri);
      url.searchParams.set('redirect_uri', config.auth.redirectUri);
      // url.searchParams.set('client-request-id', config.auth.clientId);
      url.searchParams.set('client_id', $().client_id);
      // return console.log(url.toString());
      document.location.href = url.toString();
    };
    this.loginPopup = function (aimRequest) {
      return new Promise (async callback => {
        const ws = new window.WebSocket('wss://aliconnect.nl:444');
        let win;
        ws.onopen = event => {
          ws.send(JSON.stringify({
            hostname: 'aliconnect',
          }));
        },
        ws.onmessage = event => {
          const data = JSON.parse(event.data);
          console.log('message', data);
          if (data.socket_id) {
            const state = Math.ceil(Math.random() * 99999);
            const query = {
              response_type: 'code',
              client_id: $().client_id,//config.auth.client_id || config.auth.clientId,
              redirect_uri: config.auth.redirect_uri || config.auth.redirectUri || document.location.origin,
              state: state,
              scope: aimRequest.scopes.join(' '),
              socket_id: data.socket_id,
            };
            const url = $().url('https://login.aliconnect.nl/api/oauth').query(query).toString();
            win = window.open(
              url,
              'login',
              `top=${10},left=${10},width=400,height=500,resizable=0,menubar=0,status=0,titlebar=0`
            );
          }
          if (data.body) {
            const body = data.body;
            if (body.url) {
              // const url = new URL(body.url);
              // console.log(url.searchParams.get('code'));
              win.close();
              const id = JSON.parse(atob(body.id_token.split('.')[1]));
              const username = id.unique_name;
              accounts.set(username, {
                username: username,
                id_token: body.id_token,
              });
              callback({
                account: id,
              });
            }
          }
          // return;
        };
        // callback({});
      })
    };
    this.request = function (options = {}) {
      return {
        email(selector) {
          options.email = selector;
          console.log(this);
          return this;
        },
        select(selector) {
          options.select = selector;
          return this;
        },
        scopes(selector) {
          options.scopes = selector;
          return this;
        },
        sub(selector) {
          options.sub = selector;
          return this;
        },
        get() {
          return new Promise (async callback => {
            const ws = new window.WebSocket('wss://aliconnect.nl:444');
            ws.onopen = event => {
              ws.send(JSON.stringify({
                hostname: 'aliconnect',
              }));
            },
            ws.onmessage = event => {
              const data = JSON.parse(event.data);
              console.log('message request', data);
              if (data.socket_id) {
                ws.send(JSON.stringify({
                  to: { sub: options.sub },
                  body: {
                    accept: {scopes: options.scopes}
                  }
                }))
              }
              if (data.body) {
                const body = data.body;
                if (body.url) {
                  const url = new URL(body.url);
                  console.log(url.searchParams.get('code'));
                  callback({
                    id_token: body.id_token
                  });
                }
              }
            };
          })
        },
      }
    };
  };
  Aim.Client1 = {
    initWithMiddleware(options) {
      console.log('initWithMiddleware', options);
      function Client() {
        this.options = options;
      }
      Client.prototype = {
        api(path) {
          const url = $().url((options.url || 'https://aliconnect.nl/api') + path);
          return {
            select() {
              url.select(...arguments);
              return this;
            },
            get() {
              return new Promise(async callback => {
                const access_token = await options.authProvider.getAccessToken();
                url.headers('Authorization', 'Bearer ' + access_token);
                url.get().then(event => callback(event.body))
              })
            }
          }
        }
      };
      return new Client();
    }
  };
  $().history = [];
  $.temp.openItems = window.localStorage.getItem('openItems');
	apiorigin = $.httpHost === 'localhost' && $().storage === 'api' ? 'http://localhost' : $.origin;
  (function () {
    const config = {};
    (new URL(document.currentScript.src)).searchParams.forEach((value, key)=>$.extend(config, minimist([key,value])));
    [...document.currentScript.attributes].forEach(attribute => $.extend(config, minimist(['--'+attribute.name.replace(/^--/, ''), attribute.value])));
    // [...document.currentScript.attributes].forEach(attribute => $.extend($.config, minimist([attribute.name, attribute.value])));
    (new URLSearchParams(document.location.search)).forEach((value,key)=>$.extend(config, minimist([key,value])));
    $.extend({config:config});
    // console.log(777, config);
  })()
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    // deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    // showInstallPromotion();
    // Optionally, send analytics event that PWA install promo was shown.
    console.error(`LETOP 'beforeinstallprompt' event was fired.`);
    // alert('install');
  });
  // alert('install1');
  // (new URLSearchParams(document.location.search)).forEach((value,key)=>$().extend(minimist([key,value])));
  // (new URL(document.currentScript.src)).searchParams.forEach((value, key) => $.config[key] = value);
  // [...document.currentScript.attributes].forEach(attribute => $().extend(minimist(['--'+attribute.name, attribute.value])));
  $.config.apiPath = document.currentScript.src.split('/js')[0];
  if ($.config.libraries){
    console.log($.config.libraries);
    $.config.libraries.split(',').forEach(selector => $[selector] ? $[selector]() : null);
    // (function recursive (name){
    //
    //   // console.debug(name);
    //   if (name){
    //     const elem = document.head.appendChild(document.createElement('script'));
    //     elem.setAttribute('src', apiPath + '/js/' + name + '.js');
    //     elem.onload = event => recursive(libraries.shift());
    //   }
    // })(libraries.shift())
    // $.config.libraries.split(',').forEach(console.debug);
    // const libs = {
    // 	maps: [
    // 		'https://maps.googleapis.com/maps/api/js?key=AIzaSyAKNir6jia2uSgmEoLFvrbcMztx-ao_Oys&libraries=places',
    // 	],
    // 	gapi: [
    // 		'https://apis.google.com/js/platform.js',
    // 	],
    // 	zip: [
    // 		'/lib/jszip.js',
    // 		'/lib/xlsx.full.min.js',
    // 		'/lib/FileSaver.js',
    // 		'/lib/crypto-js.js',
    // 	]
    // };
    // const styles = {
    // 	web: ['web', 'icon'],
    // 	// ganth: ['ganth'],
    // 	// calendar: ['calendar'],
    // 	login: ['login'],
    // 	aliconnector: ['aliconnector'],
    // };
    // const scripts = [];
    // const css = [];
    // $.config.libraries.split(',').forEach(name => {
    // 	(styles[name] || []).forEach(src => $.headAppend('LINK', {rel:'stylesheet', href: apiPath + '/css/' + src + '.css' }));
    // 	(libs[name] || [apiPath + '/js/' + name + '.js']).forEach(src => $.headAppend('SCRIPT', {type:'text/javascript', charset:'UTF-8', src: src }));
    // 	// (libs[name] || [apiPath + '/js/' + name + '.js']).forEach(src => scripts.push(src));
    // });
  }
  window.addEventListener('load', event => {
    console.debug('AIM LOAD');
    $.script.import($.config.apiPath + '/js/qrscan.js')
    $().emit('load').then(event => {
      $().emit('ready').then(event => {
        // console.debug('AIM READY')
        $(window).emit('popstate');
        $(window).emit('focus');
      });
    })
  })
})();
