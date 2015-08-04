angular.module('InTouch')
  .factory('SearchInterface', SearchInterface);

SearchInterface.$inject = ['appLoading', '$http', 'Search', 'Friend', '$rootScope', 'Notification', 'Session', '$localStorage'];

function SearchInterface(appLoading, $http, Search, Friend, $rootScope, Notification, Session, $localStorage) {
  
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

    // $localStorage.currentUser = this._profile;
    // $rootScope.currentUser = $localStorage.currentUser;
    // $http.defaults.headers.common['auth-token'] = $rootScope.currentUser.token;
    console.log(self);
    if ($rootScope.currentUser) {
      console.log('inside currentuser');
      friend.getFriendsFromUser()
      .then(function() {
        var usernames = friend._friends;
        console.log(friend._friends); 
          for (var i = 0; i < usernames.length; i++) {
            usernames[i] = usernames[i].accepted ?
            usernames[i].accepted : usernames[i].wait;
          }
          console.log(usernames);
          
          console.log('test data follow');
          for (var j = 0; j < self._searchResult.length; j++) {
            self._searchResult[j].username = arrayIndexOf(usernames, self._searchResult[j]._source.username) < 0 ?
            {
              'follow': self._searchResult[j]._source.username,
              'friendId': self._searchResult[j]._id,
            } : {
              'notFollow': self._searchResult[j]._source.username
            };
            if (self._searchResult[j].username.notFollow) {
              for (var k = 0; k < usernames.length; k++) {
                if (self._searchResult[j].username.notFollow === usernames[k].wait) {
                  console.log('wait result');
                  self._searchResult[j].username.notFollow = {'wait' : usernames[k].wait};
                } else if (self._searchResult[j].username.notFollow === usernames[k].accepted) {
                  console.log('accepted result');
                  self._searchResult[j].username.notFollow = {'accept' : usernames[k].accepted};
                }
              }
            }
          }
          self._usernameStatus   = usernames;
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
