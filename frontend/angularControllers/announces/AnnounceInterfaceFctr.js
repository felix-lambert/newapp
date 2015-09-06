angular.module('InTouch')
  .factory('AnnounceInterface', AnnounceInterface);

AnnounceInterface.$inject = ['$http', 'Announce', '$rootScope', 'Notification', 'Session', '$localStorage'];

function AnnounceInterface($http, Announce, $rootScope, Notification, Session, $localStorage) {
  
  var AnnounceInterface = function() {
    Announce.prototype.setField.apply(this, arguments);
  };

  AnnounceInterface.prototype = Object.create(Announce.prototype);
  AnnounceInterface.prototype.constuctor = AnnounceInterface;

  AnnounceInterface.prototype.getAnnouncesFromUser =  function() {
    var announce = Announce.prototype.postAnnounce.apply(this, arguments);

    var self = this;
    return announce.then(function() {
      // before returning the result,
      // call our new private method and bind "this" to "self"
      // we need to do this because the method is not part of the prototype
      return getAnnouncesFromUser.call(self);
    });
  }

  return AnnounceInterface;

  function getAnnouncesFromUser() {
    var self = this;
    return $http.get('/api/userannounces/' + self._page)
    .then(function(response) {
      // response.data.announces.forEach(function(announce) {
      //   if (announce.title.length > 18) {
      //     announce.title = announce.title.substring(0, 19) + '...';
      //   }
      // });
      self._announces = response.data.announces;
      self._total = response.data.announces;
      return response;
    }); 
  }
}
