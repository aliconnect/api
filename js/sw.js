// Listen for install event, set callback
self.addEventListener('install', function(event) {
  console.log('install',event);
});
self.addEventListener('activate', function(event) {
  console.log('activate',event);
});

$ = {
  showNotification: function (title, options) {
    console.log('showNotificationshowNotificationshowNotification', self.registration);
    self.registration.showNotification(title, options);
    // return;
    // self.registration.showNotification('Vibration Sample', {
    //   actions: [
    //     { action:'accept', title:'Accept request', icon:'' },
    //     { action:'deny', title:'Deny request', icon:'' },
    //   ],
    //   body: 'Buzz! Buzz!',
    //   icon: '../images/touch/chrome-touch-icon-192x192.png',
    //   vibrate: [200, 100, 200, 100, 200, 100, 200],
    //   tag: 'vibration-sample'
    // });
  }
}

self.ws = new WebSocket('wss://aliconnect.nl:444');
self.ws.onopen = function() {
  console.log('SW WS OPEN');
  console.log('SELF.REGISTRATIONREGISTRATIONREGISTRATION', self.registration);
}
// console.log("SW WS OPENING", Notification.permission);
// if (Notification.permission !== "denied" && Notification.permission !== "granted") {
//   Notification.requestPermission();
// }


self.addEventListener('message', function(event) {
  console.log('SELF.REGISTRATION', self.registration);

  // var data = JSON.parse(event.data);
  // self.registration.showNotification('title');
  // self.registration.showNotification('title');
  const data = event.data;
  console.log(self);
  // setInterval(() => {
  //   // console.log();
  //   self.registration.showNotification('title');
  // }, 5000);

  // if (Notification.permission === "granted") {
  //   var notification = new Notification('TEST', {});
  // }




  console.log("SW Received Message:",data);
  self.clients.matchAll().then(clients => {
    console.log(clients);
    clients.forEach(client => client.postMessage(data));
  });
  // const channel = new BroadcastChannel('sw-messages');
  // channel.postMessage({title: 'Hello from SW broadcast'});

  return;
  // console.log(data);
  if (self.access_token != data.access_token) {
    $.access = JSON.parse(atob(($.access_token = data.access_token).split('.')[1]));
    $.id_token = data.id_token;
    // self.device_id = data.device_id;
    $.refresh_token = data.refresh_token;
    $.hostname = data.hostname;
    // console.log('WS CONNECT');
    self.ws = new WebSocket('wss://aliconnect.nl:444');
    self.ws.onopen = function(event) {
      // console.log('WS OPEN',event);
      self.ws.send(JSON.stringify({ headers: { Authorization: 'Bearer ' + $.access_token } }));
    }
    self.ws.onmessage = function(event) {
      var response = JSON.parse(event.data);
      // console.log('WS MESSAGE', $.access.nonce, response.nonce);
      // if (response.hostname != self.hostname) return;
      if ($.access.nonce == response.nonce) return;
      // console.log('WS MESSAGE', response);
      for (var name in response) {
        // console.log(name,response[name],$[name]);
        if (typeof $[name] == 'function') $[name].apply(this,response[name]);
      }
    }
  }
});

/** Fetch wordt itgeveord bij wijziging in href */
self.addEventListener('fetch', function(event) {
  // console.log('fetch',event);
});


self.addEventListener('push', function(event) {
  // console.log("Push recieved");
});

self.addEventListener('sync', function(event) {
  // console.log('sync',event);
});


// self.addEventListener('notificationclick', function(event) {
//   console.log('notificationclick', event);
//   return;
//   if (!event.action) {
//     // Was a normal notification click
//     console.log('Notification Click.');
//     return;
//   }
//
//   switch (event.action) {
//     case 'coffee-action':
//       console.log('User ❤️️\'s coffee.');
//       break;
//     case 'doughnut-action':
//       console.log('User ❤️️\'s doughnuts.');
//       break;
//     case 'gramophone-action':
//       console.log('User ❤️️\'s music.');
//       break;
//     case 'atom-action':
//       console.log('User ❤️️\'s science.');
//       break;
//     default:
//       console.log(`Unknown action clicked: '${event.action}'`);
//       break;
//   }
// });

self.addEventListener('notificationclick1', function(event) {
  console.log('notificationclick',event);
  event.notification.close(); // Android needs explicit close.

  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      // if (client.url == '/' && 'focus' in client)
      //   return client.focus();
      if ('focus' in client) {
        client.focus();
        // console.log(client);
        client.postMessage(event.notification.data);
        // client.location.url = '#jkhlkjh';
        return;
      }
    }
    if (clients.openWindow) {
      return clients.openWindow(event.notification.data.url);
    }
  }));
  // const data = event.notification.data;
  // console.log(a);
  // clients.openWindow(data.href);
  // clients.openWindow(event.notification.data.url);

  // self.clients.matchAll().then(clients => {
  //   // console.log(clients);
  //   // clients.forEach(client => client.postMessage(data));
  //   clients.forEach(client => client.focus());
  // });
  // event.waitUntil(promiseChain);
  return;

  self.clients.matchAll().then(clients => {
    console.log('notificationclick', clients);
    clients.forEach(client => client.postMessage(data));
  });

  // self.ws.send(JONS.stringify({to: }))
  return;
  // if (!event.notification) return;
  if (event.notification.click_action) {
    return clients.openWindow(event.notification.click_action);
  }
  switch(event.action) {
    case 'open_url':
    url = event.notification.data.click_action;
    // var getting = windows.getAll({
    //   populate: true,
    //   windowTypes: ["normal"]
    // });
    // function onError(error) {
    //   console.log(`Error: ${error}`);
    // }
    // function logTabsForWindows(windowInfoArray) {
    //   for (windowInfo of windowInfoArray) {
    //     console.log(`Window: ${windowInfo.id}`);
    //     console.log(windowInfo.tabs.map((tab) => {return tab.url}));
    //   }
    // }
    // // getting.then(logTabsForWindows, onError);
    // event.waitUntil(self.clients.claim().then(() => {
    //   return self.clients.matchAll({type: 'window'});
    // }).then(clients => {
    //   return clients.map(client => {
    //     console.log(url, client.url, client);
    //     console.log('step1', client.url, url);
    //     client.hostname = client.url.split('://').pop().split('/').shift();
    //     var hostname = url.split('://').pop().split('/').shift();
    //     if (client.hostname == hostname) {
    //       url = client.url+'#'+url.split('#').shift().split(hostname).pop();
    //       console.log('step2', client.url, url);
    //     }
    //
    //     if ('navigate' in client) client.navigate(url);
    //     if ('focus' in client) client.focus();
    //     return;
    //     // Check to make sure WindowClient.navigate() is supported.
    //     // if ('navigate' in client) return client.navigate(url);
    //   });
    // }));
    // return;
    //
    event.waitUntil(
      clients.matchAll({type: 'window'}).then( windowClients => {
        // Check if there is already a window/tab open with the target URL
        // console.log('windowClients', windowClients);
        for (var i = 0; i < windowClients.length; i++) {
          var client = windowClients[i];
          console.log('step1', client.url, url);
          client.hostname = client.url.split('://').pop().split('/').shift();
          var hostname = url.split('://').pop().split('/').shift();
          if (client.hostname == hostname) {
            url = client.url+'#'+url.split('#').shift().split(hostname).pop();
            console.log('step2', client.url, url);
          }

          if ('navigate' in client) client.navigate(url);
          if ('focus' in client) client.focus();
          return;
        }
        // If not, then open the target URL in a new window/tab.
        if ('openWindow' in clients) {
          return clients.openWindow(url);
        }
      })
    );
    // clients.openWindow(event.notification.data.url); //which we got from above
    break;
    case 'any_other_action':
    clients.openWindow("https://www.example.com");
    break;
  }
  // console.log(event);
  // event.notification.close();
  // if (event.action === 'archive') {
  //   // Archive action was clicked
  //   archiveEmail();
  // } else {
  //   // Main body of notification was clicked
  //   clients.openWindow('/inbox');
  // }
});
