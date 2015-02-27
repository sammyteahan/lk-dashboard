(function () {
  angular.module( 'lkScaffold', [
    'templates-app',
    'templates-common',
    'lk.home',
    'lk.authentication',
    'ui.router.state',
    'ui.router'
  ])



  .config(config)

  .run(run)

  .controller('AppCtrl', AppCtrl);



  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise( '/' );
  }



  function run () {
    // Anthing that needs to run when the app starts
  }



  AppCtrl.$inject = ['$scope', '$location'];

  function AppCtrl ($scope, $location) {
    // Anything to "controll" for the whole app goes here
  }
})();