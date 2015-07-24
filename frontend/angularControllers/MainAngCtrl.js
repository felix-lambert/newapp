angular.module('InTouch')
  .controller('MainAngCtrl', MainAngCtrl)
  .controller('OtherController', OtherController);

MainAngCtrl.$inject = ['$http', '$scope', '$injector', '$location',
'$rootScope', '$localStorage'];

function MainAngCtrl($http, $scope, $injector, $location, $rootScope, $localStorage) {

  console.log('*****mainctrl******');

  var vm         = this;

  // Requirements
  var Auth                  = $injector.get('Auth');
  var appLoading            = $injector.get('appLoading');
  var Announce              = $injector.get('Announce');
  var CustomerSearchService = $injector.get('CustomerSearchService');
  
  vm.register               = register;
  vm.Search                 = Search;
  vm.paginate               = paginate;
  vm.searchPaginate         = searchPaginate;
  vm.initListAnnounce       = initListAnnounce;
  vm.like                   = like;
  vm.pageChanged            = pageChanged;

  appLoading.ready();
  
  vm.pages = [
    {
      title: 'Rechercher une annonce',
      content: '<blockquote>"Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem." <br>— Aliquam Libero</blockquote><ol><li>Lorem ipsum dolor sit amet</li><li>Nullam dignissim convallis est</li><li>Praesent mattis</li></ol><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>'
    },
    {
      title: 'Présentation',
      content: '<div class="container"><div class="row"><div class="col-md-9"><div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="//www.youtube.com/embed/mpE8UMMZa9w?rel=0"></iframe></div>'
    },
    {
      title: 'S\'inscrire',
      content: '<div class="row"> <div class="container"> <div <div class="col-md-7 col-md-offset-1"> <div class="panel panel-login"> <div class="panel-body" > <div class="row"> <div class="col-lg-12" > <form id="register-form" class="form" name="form" novalidate ng-submit="auth.register()"> <div class="form-group"> <input class="form-control" type="text" name="usernameReg" minlength="5" maxlength="30" ng-model="auth.username" username-available-validator placeholder="Nom ou pseudo" required autocomplete="off"/> <p class="form-help" ng-show="auth.usernameReg && form.usernameReg.$error.unique"> That username is already taken. </p><div ng-if="form.$submitted || form.usernameReg.$dirty" ng-messages="form.usernameReg.$error" class="errors"> <div class="text-danger" ng-message="required">Vous n\'avez pas entré votre pseudo</div><div class="text-danger" ng-message="minlength">Votre pseudo doit comporter plus de 4 caractères</div><div class="text-danger" ng-message="maxlength">Votre pseudo est trop long</div><div class="text-danger" ng-message="usernameAvailable">Ce pseudo a déjà été pris</div></div></div><div class="form-group"> <input type="email" class="form-control" name="emailReg" ng-model="auth.email" placeholder="Email Address" class="input" required autofocus on-focus email-available-validator autocomplete="off"/> <p class="text-danger">{{auth.error.registeredMail}}</p><div ng-if="form.$submitted || form.emailReg.$touched" ng-messages="form.emailReg.$error" class="errors"> <div class="text-danger" ng-message="required">Vous n\'avez pas entré votre email</div><div class="text-danger" ng-message="email">Votre adresse mail n\'est pas valide</div><div class="text-danger" ng-message="emailAvailable">Cet email a déjà été enregistré</div></div></div><div class="form-group"> <input class="form-control" type="password" class="input" name="passwordReg" minlength="5" maxlength="60" ng-model="auth.password" placeholder="Mot de passe" password-characters-validator autocomplete="off"/> <div ng-if="form.$submitted || form.passwordReg.$touched" ng-messages="form.passwordReg.$error" class="errors"> <div class="text-danger" ng-message="required">Vous n\'avez pas entré votre mot de passe</div><div class="text-danger" ng-message="minlength">Votre mot de passe est trop court</div><div class="text-danger" ng-message="maxlength">Votre mot de passe est trop long</div><div class="text-danger" ng-message="pattern">Votre mot de passe doit avoir des caractères alphanumériques</div></div></div><div class="pwstrength_viewport_progress"></div><div class="form-group"> <input class="form-control" type="password" class="input" name="passwordRegRepeat" required ng-model="auth.passwordConfirmation" placeholder="Mot de passe confirmation" compare-to-validator="auth.password" autocomplete="off"/> <div ng-if="form.$submitted || form.passwordRegRepeat.$touched || form.passwordReg.$touched" ng-messages="form.passwordRegRepeat.$error" class="errors"> <div class="text-danger" ng-message="required">Vous devez entrer un mot de passe de confirmation</div><div class="text-danger" ng-message="compareTo">Les mots de passe sont différents</div></div></div><div class="form-group"> <div class="row"> <div class="col-sm-6 col-sm-offset-3"> <input type="submit" name="register-submit" id="register-submit" tabindex="4" class="form-control btn btn-register" value="Valider"> <img ng-if="form.dataLoading" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/> </div></div></div></form> </div></div></div></div></div></div>'
    }
  ];


  if ($rootScope.currentUser) {
    var userToken                               = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
  }
  
  vm.page        = 1;
  vm.total       = 0;
  vm.searchState = false;
  vm.announces   = [];
  vm.currentPage = 1;
  vm.currentPage = 1;
  vm.pageSize = 10;

  vm.searchField = $localStorage.searchField ? $localStorage.searchField : null;

  if (vm.searchField) {
    console.log('do search');
    console.log(vm.searchField);
    Announce.pressSearchAnnounces({searchField: vm.searchField})
    .then(function(response) {
      vm.searchState            = true;
      $rootScope.searchAnnonces = response.announce;
      vm.announces = response.announce;
      console.log(vm.announces);
      console.log('end search');
      vm.total = response.total;
      console.log(vm.total);
    });
  }
  /////////////////////////////////////////////////////////////

  function pageChanged(currentPage) {
    console.log('Page changed to: ' + currentPage);
    vm.page = currentPage;
    if (vm.searchState === false) {
      console.log('paginate');
      vm.paginate(vm.page);
    } else if (vm.searchField) {
      console.log('search paginate');

    }
  }

  // for (var i = 1; i <= 100; i++) {
  //   var dish = dishes[Math.floor(Math.random() * dishes.length)];
  //   var side = sides[Math.floor(Math.random() * sides.length)];
  //   $scope.meals.push('meal ' + i + ': ' + dish + ' ' + side);
  // }

  vm.meals = [
    'noodles',
    'sausage',
    'beans on toast',
    'cheeseburger',
    'battered mars bar',
    'crisp butty',
    'yorkshire pudding',
    'wiener schnitzel',
    'sauerkraut mit ei',
    'salad',
    'onion soup',
    'bak choi',
    'avacado maki'
  ];

  vm.pageChangeHandler = function(num) {
    console.log('meals page changed to ' + num);
  };

  function like(announceId, usernameDes, userDesId) {
    console.log('like');
    vm.suggestions = '';
    Notifications.postNotification({
      userDes: usernameDes,
      userDesId: userDesId,
      type: 'like'
    }).then(function(response) {
      console.log('notifications success');
    });

    Like.postLike({
      id: announceId,
      userDes: usernameDes,
      userDesId: userDesId,
      likeType: 'announce'
    }).then(function(response) {
      console.log('notifications success');
    });

    vm.paginate(vm.page);
    console.log('toaster');
    toaster.pop('success', 'Vous avez envoyé une requête d\'amitié');
    socket.emit('sendLike', {
      user: $rootScope.currentUser.username,
      userDes: usernameDes,
      userDesId: userDesId,
      id: $rootScope.currentUser._id
    });
  }

  function Search() {
    console.log('search');
    var vm = this;
    vm.dataLoading = true;
    if (vm.searchField) {
      $localStorage.searchField = vm.searchField;
      console.log($scope.$storage);
      vm.searchTerm = vm.searchField;
      console.log('yes');
      Announce.pressSearchAnnounces({searchField: vm.searchField})
      .then(function(response) {
        vm.searchState    = true;
        $rootScope.searchAnnonces = response.announce;
        for (var i = 0; i < 10; i++) {
          vm.announces[i] = response.announce[i];
        }
        console.log('end search');
        vm.total = response.total;
        console.log(vm.total);
      });
    } else {
      vm.searchState    = false;
      vm.paginate(vm.page);
    }


  }

  function searchPaginate() {
    console.log('__________pagination__________');
    console.log(vm.searchTerm);
    console.log(vm.page);
    vm.searchState    = true;
    console.log($rootScope.searchAnnonces);
    console.log('end search');
  }

  function paginate(page) {

    vm.page = page;
    Announce.getAnnounces({
      page : vm.page,
      limit : vm.maxSize
    }).then(function(data) {
      console.log('paginate');
      console.log(data);
      vm.announces   = data.announces;
      console.log(vm.announces);
      for (var i = 0; i < vm.announces.length; i++) {
        if (vm.announces[i].title.length > 34) {
          vm.announces[i].title = vm.announces[i].title.substring(0, 35) + '...';
        }
        if (vm.announces[i].content.length > 34) {
          console.log(vm.announces[i].content.length);
          vm.announces[i].content = vm.announces[i].content.substring(0, 35) + '...';
        }
      }
      vm.total = data.total;
    });
  }
  function initListAnnounce() {
    console.log('__AnnouncesCtrl $scope.initListAnnounce__');
    if (!vm.searchField) {
      vm.paginate(vm.page);
    }
  }

  function register() {
    console.log('**************register*********************');
    console.log(this);
    var vm = this;
    vm.dataLoading = true;
    Auth.createUser({
      email: vm.email,
      username: vm.username,
      password: vm.password,
      confPassword: vm.passwordConfirmation
    },
    function(err) {
      vm.errors = {};
      if (!err) {
        console.log('works');
        swal('Votre compte a été créé avec succès', '', 'success');
        $rootScope.currentUser.notificationsCount = 0;
        $location.path('/');
      }
    });
  }
}

function OtherController($scope) {
  $scope.pageChangeHandler = function(num) {
    console.log('going to page ' + num);
  };
}