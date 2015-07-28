angular.module('InTouch')

.factory('Announce', Announce);

Announce.$inject = ['$http', '$rootScope'];

function Announce($http, $rootScope) {

  var Announce = function() {
    this._id = '';
    this._page = 0;
    this._announces = [];
    this._announce = {};
    this._total = 0;
    this._search = '';
    this._searchField = {};
    this._announceField = {};
    this._activated = true;
  };

  Announce.prototype = {
    constructor: Announce,
    setAnnouncePagination: setPage,
    setSearchField: setSearchField,
    setSearch: setSearch,
    setAnnounceField: setAnnounceField,
    setAnnounceFieldForEdit: setAnnounceFieldForEdit,
    setId: setId,
    setStatusAnnounce: setStatusAnnounce,
    deleteAnnounce: deleteAnnounce,
    getAnnounces: getAnnounces,
    getAnnouncesFromUser: getAnnouncesFromUser,
    statusAnnounce: statusAnnounce,
    pressSearchAnnounces: pressSearchAnnounces,
    postAnnounce: postAnnounce,
    putAnnounce: putAnnounce,
    getAnnounceById: getAnnounceById,
    searchAnnounces: searchAnnounces
  };

  return Announce;

  function setId(id) {
    this._id = id;
  }

  function setSearch(search, page) {
    this._search = search;
    this._page = page;
  }

  function setSearchField(search) {
    this._searchField = search;
  }

  function setAnnounceFieldForEdit(id, title, content, price) {
    this._id = id;
    this._announceField = {
      title: title,
      content: content,
      price: price
    };
  }

  function setAnnounceField(title, content, type, category, price, selectedImages, activated, tags) {
    this._announceField = {
      title: title,
      content: content,
      type: type,
      category: category,
      price: price,
      selectedImages: selectedImages,
      activated: activated,
      tags: tags
    };
  }

  function setStatusAnnounce(activate, id) {
    this._activated = activate;
    this._id = id
  }

  function setPage(page) {
    this._page = page;
  }

  function getAnnounces() {
    var self = this;
    console.log(self);
    return $http.get('/api/paginateannounces/' + self._page)
    .then(function(announcesData) {
      console.log(announcesData);
      announcesData.data.announces.forEach(function(announce) {
        console.log(announce);
        if (announce.title.length > 34) {
          announce.title = announce.title.substring(0, 35) + '...';
        }
        if (announce.content.length > 34) {
          console.log(announce.content.length);
          announce.content = announce.content.substring(0, 35) + '...';
        }
      });
      self._announces = announcesData.data.announces;
      self._total = announcesData.data.total;
      return announcesData;
    });
  }

  function searchAnnounces() {
    var self = this;
    return $http.get('api/searchannounces/' + self._search)
      .then(function(response) {
        console.log('test');
        if (response.data.announce) {
          self._announces = response.data.announce;
        }
        return response;
    });
  }

  function pressSearchAnnounces() {
    var self = this;
    return $http.post('api/searchannounces/', self._searchField).then(function(response) {
      self._announces = response.data.announce;
      return response;
    }); 
  }

  function getAnnouncesFromUser() {
    var self = this;
    return $http.get('/api/userannounces/' + self._page)
    .then(function(response) {
      response.data.announces.forEach(function(announce) {
        if (announce.title.length > 18) {
          announce.title = announce.title.substring(0, 19) + '...';
        }
      });
      self._announces = response.data.announces;
      self._total = response.data.announces;
      return response;
    });
  }

  function getAnnounceById() {
    var self = this;
    return $http.get('/api/announces/' + self._id).success(function(data) {
      if (data.title.length > 34) {
        data.title = data.title.substring(0, 35) + '...';
      }
      if (data.content.length > 34) {
        data.content = data.content.substring(0, 35) + '...';
      }
      self._announce = data;
      return data;
    });
    
  }

  function deleteAnnounce() {
    var self = this;
    return $http.delete('/api/announces/' + self._id).then(function(response) {
      console.log(response);
      this._announce = response.data;
      return response;
    });
  }

  function putAnnounce() {
    var self = this;
    console.log(self._announceField);
    console.log(self._id);
    return $http.put('/api/announcesput/' + self._id, self._announceField).then(function(response) {
      self._id = response._id;
      return response;
    });
  }

  function statusAnnounce() {
    var self = this;
    return $http.put('/api/statusannounce/' + self._activated + '/' + self._id)
    .then(function(data) {
      return data;
    });;
  }

  function postAnnounce() {
    var self = this;
    return $http.post('/api/announces/', this._announceField).then(function(data) {
      return data;
    });
  }
}
  

  // 



  // 
  //   console.log(announce);
  //   var deferred = $q.defer();
  //   .success(function(data) {
  //       deferred.resolve(data);
  //     }).error(function() {
  //       deferred.reject();
  //     });
  //   return deferred.promise;
  // }
// }
