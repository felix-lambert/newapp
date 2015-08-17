angular.module('InTouch').factory('Search', Search);

Search.$inject = ['$q', '$http', '$rootScope'];

function Search($q, $http, $rootScope) {

  var Search = function() {
    this._id = '';
    this._search = '';
    this._searchResult = null;
    this._searchText = '';
    this._usernameStatus = null;
  };

  Search.prototype = {
    setId: setId,
    setSearch: setSearch,
    setSearchResult: setSearchResult,
    getUsers: getUsers
  };

  return Search;

  function setId(id) {
    this._id = id;
  }

  function setSearch(searchText) {
    console.log('set search');
    console.log(searchText);
    this._searchText = searchText;
  }

  function setSearchResult() {
    this._imageName = imageName;
    this._defaultImage = defaultImage;
  }

  function getUsers() {
    var self = this;
    console.log(self._searchText);
    return $http.get('/search/' + '?term=' + self._searchText).then(function(response) {
      if (response.data.length > 0) {
        $rootScope.page = true;
      } else {
        $rootScope.page = false;
      }
      self._searchResult = response.data;
      return response;
    });
  }
}
