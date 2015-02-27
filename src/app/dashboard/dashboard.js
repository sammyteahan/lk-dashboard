(function() {
  angular.module('lk.dashboard', ['ui.router', 'lk.charts'])

  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state( 'dashboard', {
      url: '/dashboard',
      views: {
        'main': {
          controller: 'DashboardCtrl as vm',
          templateUrl: 'dashboard/dashboard.tpl.html'
        }
      }
    });
  }])


  .controller('DashboardCtrl', [
    '$scope', 
    '$state', 
    'ProjectFactory',
  function (
    $scope, 
    $state,
    ProjectFactory
  ) {
    var vm = this;
    vm.title = 'Dashboard';
    vm.team = 'Wolverines';

    vm.getUser = function() {
      ProjectFactory.getUser().then(onSuccess, onFailure);
    };

    vm.getProjects = function() {
      ProjectFactory.getProjects().then(onProjectsSuccess, onFailure);
    };

    function onSuccess(response) {
      vm.user = response.data;
    }

    function onProjectsSuccess(response) {
      vm.projects = response.data.projects;
    }

    function onFailure(info) {
      console.log('ERROR: ' + JSON.stringify(info));
    }


  }]);

}());