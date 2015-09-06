angular.module('InTouch')

.factory('Comment', Comment);

Comment.$inject = ['$http'];

function Comment($http) {

  var Comment = function() {
    this._id = '';
    this._commentField = {};
    this._comments = {};
    this._comment = {};
  };

  Comment.prototype = {
    constructor: Comment,
    setId: setId,
    setField: setField,
    postComment: postComment,
    getAnnounceComments: getAnnounceComments,
    deleteComment: deleteComment
  };

  return Comment;

  function setId(id) {
    this._id = id;
  }

  function setField(comment) {
    this._commentField = {
      announceComment: comment
    };
  }

  function postComment() {
    var self = this;
    return $http.post('/api/announceComment/' + self._id, self._commentField)
    .then(function(response) {
      return response;
    });
  }

  function getAnnounceComments() {
    var self = this;
    return $http.get('/api/announceComment/' + self._id).then(function(response) {
      self._comments = response.data;
      return response;
    });
  }

  function deleteComment() {
    var self = this;
    return $http.delete('/api/announceComment/' + self._id)
    .then(function(response) {
      console.log(response.data);
      self._comment = response.data;
      return response;
    });
  }
}
