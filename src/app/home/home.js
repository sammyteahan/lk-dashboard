(function () {
  angular.module( 'lk.home', [
    'ui.router.state',
    'lk.authentication'
  ])



  .config(config)

  .controller('HomeCtrl', HomeCtrl);



  config.$inject = ['$stateProvider'];

  function config ($stateProvider) {
    $stateProvider.state( 'home', {
      url: '/',
      views: {
        "main": {
          controller: 'HomeCtrl',
          controllerAs: 'home',
          templateUrl: 'home/home.tpl.html'
        }
      }
    });
  }



  function HomeCtrl () {
    var vm = this;

    vm.title = "Welcome to the home page!";
  }
})();