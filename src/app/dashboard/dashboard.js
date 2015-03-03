(function() {
  angular.module('lk.dashboard', ['ui.router', 'lk.charts'])



  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state( 'dashboard', {
      url: '/dashboard',
      views: {
        'main': {
          controller: 'DashboardCtrl',
          controllerAs: 'vm',
          templateUrl: 'dashboard/dashboard.tpl.html'
        }
      }
    });
  }])



  .controller('DashboardCtrl', [
    '$scope', 
    '$state', 
    'ProjectFactory',
    'UserFactory',
  function (
    $scope, 
    $state,
    ProjectFactory,
    UserFactory
  ) {
    var vm = this;
    vm.title = 'Dashboard';
    vm.team = 'Wolverines';
    vm.current = 0;
    vm.totalStories = 1;
    vm.finishedStories = 1;
    vm.currentStories = 1;
    vm.bugs = 1;
    vm.projectNums = [1, 1, 1, 1];

    ProjectFactory.getProjects().then(onProjectsSuccess, onFailure);

    vm.getUser = function() {
      UserFactory.getUser().then(onSuccess, onFailure);
    };

    function onSuccess(response) {
      vm.user = response.data;
    }

    // get projects and store all id's in new array
    function onProjectsSuccess(response) {
      vm.projects = response.data.projects;
      vm.title = response.data.projects[vm.current].project_name;
      vm.projectIDs = vm.projects.map(function (project) {
        return project.project_id;
      });
      vm.getProjectData(vm.projectIDs[0]);
      vm.getProjectStories(vm.projectIDs[0]);
    }

    function onFailure(info) {
      console.log('ERROR: ' + JSON.stringify(info));
    }

    // get detailed project info
    vm.getProjectData = function(id) {
      ProjectFactory.getProject(id).then(projectSuccess, onFailure);
    };

    vm.getProjectStories = function(id) {
      ProjectFactory.getProjectStories(id).then(storiesSuccess, onFailure);
    };

    function projectSuccess(response) {
    }

    function storiesSuccess(response) {
      vm.stories = response.data;

      vm.unstartedStories = vm.stories.filter(function(story) {
        return story.estimate != null && story.current_state === 'planned';
      });

      vm.bugs = vm.stories.filter(function(story) {
        return story.story_type === 'bug' && story.current_state === 'accepted';
      });

      vm.newBugs = vm.stories.filter(function(story) {
        return story.story_type === 'bug' && story.current_state === 'unstarted';
      });

      // need to apply these scope changes in directive
      vm.projectNums = [vm.bugs.length, vm.unstartedStories.length, vm.newBugs.length, vm.stories.length];
    }

    vm.changeData = function() {
      vm.projectNums = [
        Math.floor(Math.random() * 50), 
        Math.floor(Math.random() * 50), 
        Math.floor(Math.random() * 50), 
        Math.floor(Math.random() * 50)
      ];
    };

    vm.getNext = function() {
      ProjectFactory.getProjects().then(function success(response) {
        vm.projectCount = response.data.projects.length;
        vm.title = response.data.projects[vm.current].project_name;
        vm.projectIDs = vm.projects.map(function (project) {
          return project.project_id;
        });
      }, onFailure);
      if(vm.current % vm.projectCount === 0) {
        vm.current = 0;
        console.log(vm.current);
        ProjectFactory.getProjectStories(vm.projectIDs[++vm.current]).then(function success(response) {
          vm.stories = response.data;

          vm.unstartedStories = vm.stories.filter(function(story) {
            return story.estimate != null && story.current_state === 'planned';
          });

          vm.finishedBugs = vm.stories.filter(function(story) {
            return story.story_type === 'bug' && story.current_state === 'accepted';
          });

          vm.bugs = vm.stories.filter(function(story) {
            return story.story_type === 'bug' && story.current_state === 'unstarted';
          });

          vm.projectNums = [vm.finishedBugs.length, vm.unstartedStories.length, vm.bugs.length, vm.stories.length];
          
        }, function failure(info) {
          console.log(info);
        });
      }
      else {
        ProjectFactory.getProjectStories(vm.projectIDs[++vm.current]).then(function success(response) {
          vm.stories = response.data;
          console.log(vm.current);


          vm.unstartedStories = vm.stories.filter(function(story) {
            return story.estimate != null && story.current_state === 'planned';
          });

          vm.finishedBugs = vm.stories.filter(function(story) {
            return story.story_type === 'bug' && story.current_state === 'accepted';
          });

          vm.bugs = vm.stories.filter(function(story) {
            return story.story_type === 'bug' && story.current_state === 'unstarted';
          });

          vm.projectNums = [vm.finishedBugs.length, vm.unstartedStories.length, vm.bugs.length, vm.stories.length];
          
        }, function failure(info) {
          console.log(info);
        });
      }
    };

    // Init user to get projects
    vm.getUser();

  }]);
}());