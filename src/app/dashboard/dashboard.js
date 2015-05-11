(function() {
  angular.module('lk.dashboard', ['ui.router', 'lk.charts'])



  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state( 'dashboard', {
      url: '/dashboard',
      views: {
        'main': {
          controller: 'DashboardCtrl',
          controllerAs: 'vm',
          templateUrl: 'dashboard/dashboard.tpl.html',
          resolve: {
            userData: ['UserFactory', function(UserFactory) {
              return UserFactory.getUser();
            }],
            projectData: ['ProjectFactory', function(ProjectFactory) {
              return ProjectFactory.getProjects();
            }]
          }
        }
      }
    });
  }])



  .controller('DashboardCtrl', [
    '$scope', 
    '$state', 
    'ProjectFactory',
    'UserFactory',
    'userData',
    'projectData',
  function (
    $scope, 
    $state,
    ProjectFactory,
    UserFactory,
    userData,
    projectData
  ) {
    var vm = this;
    vm.title = 'Dashboard';
    vm.team = 'Wolverines';
    vm.current = 0;
    vm.totalStories = 1;
    vm.finishedStories = 1;
    vm.currentStories = 1;
    vm.bugs = 1;

    // vm.projectNums = [1, 1, 1, 1];
    vm.projectNums = [
      Math.floor(Math.random()*100), 
      Math.floor(Math.random()*100), 
      Math.floor(Math.random()*100), 
      Math.floor(Math.random()*100)
    ];

    vm.user = userData.data;

    // ProjectFactory.getProjects().then(onProjectsSuccess, onFailure);

    vm.projects = projectData.data.projects;
    vm.title = vm.projects[vm.current].project_name;
    vm.projectIds = vm.projects.map(function (project) {
      return project.project_id;
    });

    vm.projects.forEach(function(project) {
      console.log(project);
    });

    // get projects and store all id's in new array
    function onProjectsSuccess(response) { /*** take this func out ***/
      vm.getProjectData(vm.projectIDs[0]); /*** re-do these calls to get specific project story info ***/
      vm.getProjectStories(vm.projectIDs[0]);
    }

    function onFailure(info) {
      console.log('ERROR: ' + JSON.stringify(info));
    }

    // get detailed project info
    vm.getProjectData = function(id) {
      ProjectFactory.getProject(id).then(projectSuccess, onFailure);
    };

    vm.getProjectStories = function(id) { /*** take this out and replace with api calls with parameters ***/
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
        ProjectFactory.getProjectStories(vm.projectIDs[vm.current]).then(function success(response) {
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

    vm.changeData = function() {
      vm.projectNums = [
        Math.floor(Math.random() * 50), 
        Math.floor(Math.random() * 50), 
        Math.floor(Math.random() * 50), 
        Math.floor(Math.random() * 50)
      ];
    };

    // vm.printNext() = function() {
    //   vm.current++;
    //   if(vm.current % vm.projects.length === 0) {
    //     vm.current = 0;
    //     console.log(vm.projects[vm.current]);
    //   }
    // }

  }]);
}());
