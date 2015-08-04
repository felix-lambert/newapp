angular.module('InTouch')

.factory('Actuality', Actuality);

Actuality.$inject = ['$q', '$http'];

function Actuality($q, $http) {

  var Actuality = function() {
    this._id = '';
    this._actuality = '';
    this._actualityField = null;
    this._actualities = null;
  };

  Actuality.prototype = {
    setId: setId,
    setActualityField: setActualityField,
    postActuality: postActuality,
    getActualities: getActualities,
    deleteActuality: deleteActuality
  };

  return Actuality;

  function setId(id) {
    this._id = id;
  }

  function setActualityField(status, content) {
    this._actualityField = {
      status: status,
      content: content
    };
  }

  function postActuality() {
    var self = this;
    return $http.post('/api/actuality', self._actualityField)
    .then(function(response) {
      return response;
    });
  }

  function getActualities() {
    var self = this;
    return $http.get('/api/actuality/').then(function(response) {
      self._actualities = response.data;
      return response;
    });
  }

  function deleteActuality() {
    var self = this;
    return $http.delete('/api/actuality/' + self._id).then(function(response) {
      return response;
    });
  }
}
