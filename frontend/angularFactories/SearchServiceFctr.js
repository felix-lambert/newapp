angular.module('InTouch').factory('CustomerSearchService', ['$rootScope',
    function($rootScope) {

      var service = {

        state: {
          sortOrder: 1,
          strSearch: '',
          currentFilter: 'CustomersShowAll',
          viewMode: 'Tiles',
        },

        SaveState: function() {
          sessionStorage.CustomerSearchService = angular.toJson(service.state);
        },

        RestoreState: function() {
          service.state = angular.fromJson(sessionStorage.CustomerSearchService);
        }
      }

      $rootScope.$on("savestate", service.SaveState);
      $rootScope.$on("restorestate", service.RestoreState);

      return service;
    }
  ]);