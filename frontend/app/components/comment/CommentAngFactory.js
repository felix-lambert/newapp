

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
