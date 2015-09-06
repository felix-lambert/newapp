angular.module('InTouch')
  .factory('SearchInterface', SearchInterface);

SearchInterface.$inject = ['$http', 'Search', 'Friend', '$rootScope'];


function arrayIndexOf(myArray, searchTerm) {
  for (var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i] === searchTerm) {
      return i;
    }
  }
  return -1;
}


function SearchInterface($http, Search, Friend, $rootScope) {
  
  var SearchInterface = function() {
    Search.prototype.setSearch.apply(this, arguments);
  };

  if ($rootScope.currentUser) {
    var userToken                               = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
  }

  SearchInterface.prototype = Object.create(Search.prototype);
  SearchInterface.prototype.constuctor = SearchInterface;

  SearchInterface.prototype.getSearch =  function() {

    var search = Search.prototype.getUsers.apply(this, arguments);

    var self = this;
    return search.then(function() {
      // before returning the result,
      // call our new private method and bind "this" to "self"
      // we need to do this because the method is not part of the prototype
      return getFriends.call(self);
    });

  }

  return SearchInterface;

  function getFriends() {
    var self = this;

    var friend = new Friend();

    if ($rootScope.currentUser) {
      console.log('inside currentuser');
      return friend.getFriendsFromUser()
      .then(function() {
        var usernames = [];
         
        for (var i = 0; i < friend._friends.length; i++) {
          usernames[i] = friend._friends[i].accepted ?
          friend._friends[i].accepted : friend._friends[i].wait;
        }
        for (var j = 0; j < self._searchResult.length; j++) {
          self._searchResult[j].username = arrayIndexOf(usernames, self._searchResult[j]._source.username) < 0 ?
          {
            'follow': self._searchResult[j]._source.username,
            'friendId': self._searchResult[j]._id,
          } : {
            'notFollow': self._searchResult[j]._source.username
          };
          if (self._searchResult[j].username.notFollow) {
            for (var k = 0; k < friend._friends.length; k++) {
              if (self._searchResult[j].username.notFollow === friend._friends[k].wait) {
                self._searchResult[j].username.notFollow = {'wait' : friend._friends[k].wait};
              } else if (self._searchResult[j].username.notFollow === friend._friends[k].accepted) {
                self._searchResult[j].username.notFollow = {'accept' : friend._friends[k].accepted};
              }
            }
          }
        }
        appLoading.ready();
      });
    } else {
      console.log('_______tester le data___');
      console.log(self._searchResult);
      for (var j = 0; j < self._searchResult.length; j++) {
        self._searchResult[j] = {
            'noAuth': self._searchResult[j]._source.username,
            'profileImage': self._searchResult[j]._source.profileImage,
            'userId': self._searchResult[j]._id
        };
      }
      appLoading.ready();
    }
  }

  


}
