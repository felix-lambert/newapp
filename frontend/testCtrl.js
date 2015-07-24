var app = angular.module('InTouch');

  app.controller('testController', [
    '$scope', 'CustomerSearchService',
    function($scope, customerSearchService) {

      var vm = this;

      vm.config = customerSearchService;
      
      vm.changeState = function() {
        vm.config.state.sortOrder = 2;
        vm.config.state.strSearch = 'Keyword here';
        vm.config.state.currentFilter = 'ShowWithEmail';
        vm.config.state.viewMode = 'List';
      };
    }
  ]);