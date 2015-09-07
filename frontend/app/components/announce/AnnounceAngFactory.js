angular.module('InTouch')

.factory('Announce', Announce);

Announce.$inject = ['$http'];

function Announce($http) {

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
    setPage: setPage,
    setSearchField: setSearchField,
    setSearch: setSearch,
    setField: setField,
    setAnnounceFieldForEdit: setAnnounceFieldForEdit,
    setId: setId,
    setStatusAnnounce: setStatusAnnounce,
    deleteAnnounce: deleteAnnounce,
    getAnnounces: getAnnounces,
    statusAnnounce: statusAnnounce,
    pressSearchAnnounces: pressSearchAnnounces,
    postAnnounce: postAnnounce,
    putAnnounce: putAnnounce,
    getAnnounceById: getAnnounceById,
    searchAnnounces: searchAnnounces,
    getAnnouncesFromUser: getAnnouncesFromUser
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
      self._total = response.data.total;
      return response.data;
    }); 
  }

  function setField(title, content, type, category, price, selectedImages, activated, tags) {
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
    return $http.get('/api/paginateannounces/' + self._page)
    .then(function(response) {
      response.data.announces.forEach(function(announce) {
        if (announce.title.length > 34) {
          announce.title = announce.title.substring(0, 35) + '...';
        }
        if (announce.content.length > 34) {
          announce.content = announce.content.substring(0, 35) + '...';
        }
      });
      self._announces = response.data.announces;
      self._total = response.data.total;
      return response;
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

  function getAnnounceById() {
    var self = this;
    return $http.get('/api/announces/' + self._id).success(function(response) {
      if (response.title.length > 34) {
        response.title = response.title.substring(0, 35) + '...';
      }
      if (response.content.length > 34) {
        response.content = response.content.substring(0, 35) + '...';
      }
      self._announce = response;
      return response;
    });
    
  }

  function deleteAnnounce() {
    var self = this;
    return $http.delete('/api/announces/' + self._id).then(function(response) {
      self._announce = response.data;
      return response;
    });
  }

  function putAnnounce() {
    var self = this;
    return $http.put('/api/announcesput/' + self._id, self._announceField)
    .then(function(response) {
      self._id = response._id;
      return response;
    });
  }

  function statusAnnounce() {
    var self = this;
    return $http.put('/api/statusannounce/' + self._activated + '/' + self._id)
    .then(function(response) {
      return response;
    });
  }

  function postAnnounce() {
    var self = this;
    return $http.post('/api/announces/', self._announceField).then(function(response) {
      return response;
    });
  }
}