angular.module('InTouch')
.factory('Announce', ['$resource', Announce]);

function Announce($resource) {
  return $resource('api/announces/:id:page/:limit', {
      id: '@id',
      page: '@page',
      limit: '@limit',
      user:'@user'
  }, {
      list: {method: 'GET', isArray: true},
      paginate: {method: 'GET'},
      save: {method: 'POST'},
      remove: {method: 'DELETE'}
  });
}
