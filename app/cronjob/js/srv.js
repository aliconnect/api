var version='v1';
var tasklist = [], tasks = {
  mailer: { src: '/aim/'+version+'/api/srv/mailertask.php' },
  mailer2: { src: 'https://aliconnect.nl/api/?request_type=mail' },
  archive: { src: '/aim/'+version+'/api/srv/archivemail.php' },
  checkbonnen: { src: '/airo/'+version+'/api/pakbon/?monitor' },
}
onload = function () {
  if (!tasklist.length) for (var name in tasks) tasklist.push(tasks[name]);
  iframe.onload=function(){setTimeout(onload, 2000);}
  iframe.src=tasklist.shift().src;
}
