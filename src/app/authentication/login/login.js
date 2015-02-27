(function() {
  angular.module( 'lk.authentication', [
    'lk.authentication.token',
    'ui.router.state'
  ])



  .config(config)

  .controller('LoginCtrl', LoginCtrl);



  config.$inject = ['$stateProvider'];

  function config ($stateProvider) {
    $stateProvider.state( 'login', {
      url: '/login',
      views: {
        "main": {
          controller: 'LoginCtrl',
          controllerAs: 'login',
          templateUrl: 'authentication/login/login.tpl.html'
        }
      }
    });
  }



  LoginCtrl.$inject = ['$state', 'AuthTokenFactory'];

  function LoginCtrl ($state, AuthTokenFactory) {
    var vm = this;

    vm.title = "Ready to Login?";
  }
})();
