// var version='v1';
var tasklist = [], tasks = {
  mailer: { src: '/aim/v1/api/srv/mailertask.php' },
  mailer2: { src: 'https://aliconnect.nl/api/?request_type=mail' },
  archive: { src: '/aim/v1/api/srv/archivemail.php' },
  checkbonnen: { src: '/airo/v1/api/pakbon/?monitor' },
}
onload = function () {
  if (!tasklist.length) for (var name in tasks) tasklist.push(tasks[name]);
  iframe.onload=function(){setTimeout(onload, 2000);}
  const src = tasklist.shift().src;
  console.log('SRC', src);
  iframe.src=src;
}
