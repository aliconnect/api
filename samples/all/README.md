# Get started

## Instructie
- Ieder voorbeeld bevat een knop `Run`. Deze knop opend een window met het voorbeeld.
- Bouw je de code zelf op dan moet je bij ieder stap de bijbehorende tekst vervangen. Bij een `js` code voorbeeld vervang je `/** js start **/` tot en met `/** js end **/` voor het code voorbeeld.

# Basis voor een HTML file `index.html`

```html
<!DOCTYPE html>
<html>
<head>
	<script src="https://aliconnect.nl/src/js/aim.js"></script>
	<!-- html -->
	<script>
	/** js start **/
	/** js end **/
	</script>
</head>
<body></body>
</html>
```

# Basis opbouw van een Javascript
Alle javascript plaatsen we binnen een `script` sectie.

De javascript kan ook worden opgenomen in een los `javascript` bestand.
In dat geval maken we een submap `/js` aan met bijvoorbeelde het bestand `index.js`.
We verwijzen we naar het bestand in de `html` file
door de tag `<script src="js/index.js"></script>`
op te nemen in de `head` sectie.

Alle code plaatsen we binnen een functie zodat functies en variabelen alleen zichtbaar zijn binnen deze functie
en niet globaal aangemaakt worden.

```js
(function() {
	/** js start **/
	/** js end **/
})();
```

# Pagina load events

We gebruiken het `ready` event van `aim` om te starten met onze applicatie code.
Het event `ready` wordt uitgevoerd voor het `window.onload` event in de scripts geladen na `aim.js`.

Hieronder een voorbeeld hoe event worden afgehandeld.
```js
/** js start **/
console.log('start script');
aim().on('load', event => console.log('execution of LOAD code'))
window.addEventListener('load', event => console.log('execution of window.onload event') );
window.addEventListener('load', event => console.log('execution of window.onload true event'), true);
aim().on('ready', event => console.log('execution of READY code'));
console.log('end script');
/** js end **/
```

Ons basis javascript.
```js
aim().on('ready', event => {
	/** js start **/
	console.log('ready');
	/** js end **/
});
```

# De web api

Voor het bouwen van frontend applicaties gebruiken we de `web` api van `aim` door het inladen van het `web.js` script
```html
<script src="https://aliconnect.nl/src/js/web.js"></script>
<!-- html -->
```

# Opbouw aim instructie

De aim instructie bestaat uit het commande `aim(selector, context)` gevolg door de gewenste instructie.
De aim bibliotheek bied een RAD oplossing en zorgt ervoor dat uw applicatie codde eenvoudig en overzchtelijk is
en dat iedere instructie voldoet aan de laatste stand der techniek.

We beginnen met een voorbeeld van een lege pagina met de tekst `hello world`.
```js
/** js start **/
aim(document.body).text('Hello world');
/** js end **/
```

Voor het plaatsen van de html `<div>my div element</div>` gebruiken we onderstaande code.
```js
/** js start **/
aim('div').text('my div element');
/** js end **/
```

We voegen style informatie zoals `<div style="color:red;"></div>` toe met het css commando.
```js
/** js start **/
aim('div').text('Hello red world').css('color:red;');
/** js end **/
```

# style tag
Alle style code plaatsen we binnen een `style` sectie.

De style kan ook worden opgenomen in een los `stylesheet` bestand.
In dat geval maken we een submap `/css` aan met bijvoorbeelde het bestand `index.css`.
We verwijzen we naar het bestand in de `html` file
door de tag `<link rel="stylesheet" href="css/web.css" />`
op te nemen binnen de `head` sectie.

In de uitgewerkte voorbeelden werken we binnen de `html` tussen de `style` tags.
We nemen de op binnen de `head` sectie.

```html
<!-- html -->
<style>
/** css start **/
/** css end **/
</style>
```

# Document style definitie

Nu kunnen we aan class namen een styl definieren.
Deze wordt toegepast bij alle elementen met de betreffende class naam.

```css
/** css start **/
.color_red{
	color:red;
}
/** css end **/
```

```js
/** js start **/
aim('div').class('color_red').text('Hello world with class');
/** js end **/
```

Hieronder staat een korte notatie voor het aanmaken van een `div` element met een `class` en `html` text.
```js
/** js start **/
aim('div', 'color_red', 'Hello world inline');
aim('div', 'color_red', 'Hello world inline');
/** js end **/
```

# Dynamisch document style

We kunnen ook dynamisch met javascript een document style toevoegen met de volgende software instructie.
```js
/** js start **/
aim().css('.light', 'color: green;');
aim('div', 'light', 'Message world');
/** js end **/
```

# Werken met attributen
Naast class namen kunnen we ook attributen toevoegen.
Hiermee kunnen we de visualisatie van een element eenvoudig aanpassen.


Met dynamische css.
```js
/** js start **/
aim().css('.light[state="0"]', 'color: red;');
aim().css('.light[state="1"]', 'color: green;');
aim('div', 'light', 'LIGHT').attr('state', 0);
aim('div', 'light', 'LIGHT').attr('state', 1);
/** js end **/
```

Of met style code.

```css
/** css start **/
.light[state="0"]{
	color: red;
}
.light[state="1"]{
	color: green;
}
.light[state="0"]:after{
	content: "STOP";
}
.light[state="1"]:after{
	content: "GO";
}
/** css end **/
```

```js
/** js start **/
aim('div', 'light').attr('state', 0);
aim('div', 'light').attr('state', 1);
/** js end **/
```

# Figuur stylen

Eenvoudige vormen kunnen we visualiseren door css code.
De gewenste visualisatie kan worden geselcteerd met de waarde van een attribute.

```css
/** css start **/
.light[state]:before{
	content: "";
	display: inline-block;
	width: 50px;
	height: 50px;
	border-radius: 50px;
	color: white;
}
.light[state="0"]:before{
	background-color: red;
}
.light[state="1"]:before{
	background-color: green;
}
.light[state="0"]:after{
	content: "STOP";
}
.light[state="1"]:after{
	content: "GO";
}
/** css end **/
```

# Dynamisch veranderen van visualisatie

Met javascript kunnen we de visualisatie aanpassen door het wijzigen van een attribute waarde.
```js
/** js start **/
const trafficLight = aim('div', 'light').attr('state', 0);
setInterval(() => trafficLight.attr('state', trafficLight.attr('state')^1) ,1000);
/** js end **/
```

# De aim web stylesheet

Het aim framework bevat een uitgebreide stylesheet welke de aim javascript object ondersteund.
Deze nemen we op binnen de `head` sectie van ons `html` document.
```html
<link rel="stylesheet" href="https://aliconnect.nl/src/css/web.css" />
<!-- html -->
```

# Icons
Voor het toevoegen van icons (kleine afbeeldingen) op knoppen voegen we een icon bibliotheek toe.
Deze nemen we op binnen de `head` sectie van ons `html` document.
```html
<link rel="stylesheet" href="https://aliconnect.nl/src/css/icon.css" />
<!-- html -->
```

# Een web applicatie
Voor een webapplicatie namen we een aantal instructies op.

Een class `app` aan het document `<head>` element zodat de pagina zich gedraagt
als een app en geen oneindig lange webpagina.
```js
aim(document.documentElement).class('app');
/** js start **/
/** js end **/
```

De `body` layout is
```
------------------------------------------------------------
| navtop                                                   |
------------------------------------------------------------
|                                                          |
|                                                          |
|                                                          |
| main                                                     |
|                                                          |
|                                                          |
|                                                          |
------------------------------------------------------------
| statusbar                                                |
------------------------------------------------------------
```
De `main` sectie bestaat uit volgende kolommen.
```
------------------------------------------------------------
|         |          |                    |                |
|         |          |                    |                |
|         |          |                    |                |
| navleft | treeview |      listview      |    pageview    |
|         |          |                    |                |
|         |          |                    |                |
|         |          |                    |                |
------------------------------------------------------------
```

Enkele class namen zodat secties goed kunnen worden toegevoegd aan de body.
```js
aim(document.body).class('col aim om bg');
/** js start **/
/** js end **/
```

Een stuk applicatie informatie
```js
aim('info', { title: 'myApp' });
/** js start **/
/** js end **/
```

Een eigen kleur aan de boven balk
```js
aim().css('.row.top.bar', 'background-color:#1B60DB; color:white;');
/** js start **/
/** js end **/
```


Een boven navigatie balk. Een hoofd sectie in het midden en een statusbalk.
```js
aim().navtop();
aim().main();
aim().status(['main','http','select','clipboard','source','target','ws','progress']);
/** js start **/
/** js end **/
```

# Applicatie menu
Het aanmaken van een applicatie menu
```js
/** js start **/
aim().navleft({
	Home: {
		items: {
			Contact: {

			}
		}
	}
});
/** js end **/
```

# Lijst weergave
Deze heet binnen `aim` een `listview`
en wordt aangeroepen met de instructie `list`.
```js
/** js start **/
const value = [
	{ title: 'MyItem 1' },
	{ title: 'MyItem 2' },
	{ title: 'MyItem 3' },
];
aim().navleft();
aim().list(value);
aim().view();
/** js end **/
```

# Een folder weergave
Deze heet binnen `aim` een `treeview`
en wordt aangeroepen met de instructie `tree`.
```js
/** js start **/
const item = {
	title: 'MyItem 1', children: [
		{ title: 'MyItem 1.1' },
		{ title: 'MyItem 1.2' },
		{ title: 'MyItem 1.3' },
	]
};
aim().navleft();
aim().tree(item);
aim().list();
aim().view();
/** js end **/
```

# Een pagina weergave
Deze heet binnen `aim` een `pageview`
en wordt aangeroepen met de instructie `view`.



# *UNDER CONSTRUCTION*



1. create a file `index.html`

```html
<!DOCTYPE html>
<html>
<head>
	<title>Samples all</title>
  <!-- stylesheets -->
  <link rel="stylesheet" href="https://aliconnect.nl/src/css/web.css" />
  <link rel="stylesheet" href="https://aliconnect.nl/src/css/icon.css" />
  <link rel="stylesheet" href="css/index.css" />
  <!-- scripts -->
  <script src="https://aliconnect.nl/src/js/aim.js"></script>
  <script src="https://aliconnect.nl/src/js/web.js"></script>
	<script src="js/index.js"></script>
</head>
<body class="doc-content">
</body>
</html>
```

1. create a folder `css`
1. create a file `css/index.css`
```css
body{}
```


1. create a folder `js`
1. create a file `js/index.js`
```js
(function() {
  // private constants
  // private functions
  // function executed after page is loaded
})();
```





```js
// public declerations
(function() {
  // private constants
  const SECONDS_IN_MINUTE = 60;
  // private functions
  function minutesToSeconds (minutes) {
    return minutes * SECONDS_IN_MINUTE;
  }
  // function executed after page is loaded
  aim().on('ready', event => {
    aim('div', '', minutesToSeconds(5) );
  })
})();
```

## class
```js
css: `.alert{color:red;}`,
aim().on('load', event => {
  aim('p', 'alert', 'this is an alert');
})

```

```js
aim('div').text(aim('aim').prop('a','valueof a').prop);
```



```js
aim('div').text( aim('aim').prop('a','valueof 1').prop.get('a') );
aim('div').text( aim('aim').prop('a','valueof 2').prop().get('a') );
aim('div').text( aim('aim').prop('a','valueof 3').prop('a') );
aim('aim').prop('a', 'value 4')
aim('div').text( aim('aim').prop('a'));
```
<!-- sample button -->


```js
aim('div').text(aim().prop('a','valueof a').prop.get('a'));
aim('div').text(aim().prop('a','valueof a').prop().get('a'));
aim('div').text(aim().prop('a','valueof a').prop('a'));
```
```js
```



## Load event
```js
(function() {
  aim()
  .on('load', event => {
    aim('div', '', 'page loaded' );
  })
  .on('ready', event => {
    aim('div', '', 'aim ready' );
  })
})();

```

element toevoegen aan dom
```js
aim().on('load', event => {
  aim('p', '', 'this is a p element');
})

```

```js
aim('table').append(
  aim('tr').append(
    aim('td', '', 'JA')
  ),
);
```

```js
aim('table').append(
  aim('tr').append(
    aim('td', '', 'JA')
  ),
);
```
```js
aim('div', 'code').text(aim().url('/sub/').prop('url'))
```
```js
aim().url('/sub/').query('top', 0).prop('url'),
```
```js
aim().url('https://aliconnect.nl/api').api('/Contact(1234)').prop('url'),
aim().api('/Contact(1234)').prop('url'),
```
```js
aim('aim').url('https://aliconnect.nl/api').prop('url'),
aim('aim').api('/Contact(1234)').prop('url'),
```
```js
aim('aim').api('/Contact').top(10).prop('url'),
aim('aim').api('/Contact').select('*').prop('url'),
aim('aim').api('/Contact').filter('Lastname eq kampen').prop('url'),
aim('aim').api('/Contact').order('Lastname,Firstname').prop('url'),
```
```js
aim('aim').access_token('sdfasd...asfasdf').access_token(),
```
```js
aim('aim').login();
```

# extend aim with custom property
```js
aim().extendProperties({
  a(value, extra){
    console.log('a set', ...arguments);
  },
  b(){},
});
aim().extend({
  myfunction() {
    console.log(this.a, this.b)
    return this.a * this.b;
  },
  myfunctionPlus() {
    return Number(this.a) + Number(this.b);
  },
  myfunctionString() {
    return this.a + this.b;
  },
  myfunctionString1() {
    return this.a().get('n') + this.a().get('m') + this.b;
  },
})
const calc1 = aim();
calc1.a(10);
calc1.b(5);
aim('pre').text([ 'calc1 a   ', calc1.myfunction() ] );
calc1.b(6);
aim('pre').text([ 'calc1 b   ', calc1.myfunction() ] );
calc1.a(6);
aim('pre').text([ 'calc1 b   ', calc1.myfunction() ] );
// return;

aim('pre').text( aim().a({
  n: 2,
  m: 5
}).b('B').myfunctionString1() );



aim('pre').text([ 'sample 1 ', aim().a(5, 7).myfunction() ]);
aim('pre').text([ 'sample 2 ', aim().a({n:1}).b('B').myfunctionString1() ]);
aim('pre').text([ 'sample 3 ', aim().a(8, 'test').b(3).myfunction() ]);
aim('pre').text([ 'sample 4 ', aim().a(5).b(8).myfunctionPlus() ]);
aim('pre').text([ 'sample 5 ', aim().a(5).b(8).myfunctionString() ]);
aim('pre').text([ 'sample 6 ', aim().a('A').b('B').myfunctionString() ]);

aim('pre').text([ 'sample 1 ', aim().a(5).myfunction() ]);


aim('pre').text([ 'sample 7 ', aim().a('A',1,2).b('B').myfunctionString() ]);




// aim('div', '', 'entries:' + JSON.stringify(aim().a('a',1).a().entries()));
// aim('div', '', 'functie' + aim().a('a',1).a().entries());
// aim().ar({a: 1});
// aim().ar('b', 2, 'nogwat');
// aim('div', '', 'entries:' + JSON.stringify(aim().ar.entries()));
// aim().ar.set('c', {n:1}, 'geen functie');
// aim('div', '', 'entries:' + JSON.stringify(aim().ar.entries()));
// aim().ar.append('a', 3, 'extra a');
// aim('div', '', 'entries:' + JSON.stringify(aim().ar.entries()));
// aim('div', '', 'keys:' + JSON.stringify(aim().ar.keys()));
// aim('div', '', 'values:' + JSON.stringify(aim().ar.values()));
// aim('div', '', 'values a:' + JSON.stringify(aim().ar.values('a')));
// aim('div', '', 'get b:' + JSON.stringify(aim().ar.get('b')));
// aim('div', '', 'get a:' + JSON.stringify(aim().ar.get('a')));


```
