(async function() {
  const $ = Aim;
  console.log('START CONTROL');
  $().on({
    ready() {
      $().getApi(document.location.origin+'/api/').then(event => {
        $().login().then(event => {
          $().api('/')
          .query('request_type', 'data_json')
          .query('sub', 2804342)
          .query('sub', 3251656)
          .patch()
          .then(event => {
            console.log('UP');
          });
        });
      });
    },
  });
})();
