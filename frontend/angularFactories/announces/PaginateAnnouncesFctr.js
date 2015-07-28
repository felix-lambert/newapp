angular.module('InTouch')

.factory('PaginateAnnounces', PaginateAnnounces);

function PaginateAnnounces(Announce) {

  function PaginateAnnounces(page, size) {
    console.log("advanced announce factory");
    console.log(this);
    console.log(arguments);
    Announce.apply(this, arguments);
  };

  PaginateAnnounces.prototype = new Announce();

  function getPaginateEvents() {
    var self = this;

    return $http.get(apiUrl + 'users/' + this.username + '/events').then(function(response) {
      // attach the events API result to our user profile
      self.profile.events = response.data;
      // promises should always return a result
      return response;
    });

  }
  return AdvancedAnnounces;
}






}

//   function Announce(page, size) {
//     this.page = page;
//     this.size = size;
//     this.announces = [];
//     this.total = 0;
//   };

//   Announce.prototype = {
//     constructor: Announce,
//     getAnnounces: getAnnounces,
//     postAnnounce: postAnnounce,
//     getAnnouncesPerPage: getAnnouncesPerPage,
//     getAnnounces: getAnnounces,
//     getAnnouncesFromUser: getAnnouncesFromUser,
//     getAnnounceById: getAnnounceById,
//     deleteAnnounce: deleteAnnounce,
//     putAnnounce: putAnnounce,
//     statusAnnounce: statusAnnounce,
//     searchAnnounces: searchAnnounces,
//     pressSearchAnnounces: pressSearchAnnounces

//   };

//   function getAnnounces() {
//     var self = this;
//     return $http.get('/api/announces/' + this.page + '/' + this.size).then(function(data) {
//       var announces = data.data.announces;
//       for (var i = 0; i < announces.length; i++) {
//         if (announces[i].title.length > 34) {
//           announces[i].title = vm.announces[i].title.substring(0, 35) + '...';
//         }
//         if (announces[i].content.length > 34) {
//           console.log(announces[i].content.length);
//           announces[i].content = announces[i].content.substring(0, 35) + '...';
//         }
//       }
//       self.announces = announces;
//       self.total = data.data.total;
//       return data;
//     });
//   }
//   return Announce;
// }
