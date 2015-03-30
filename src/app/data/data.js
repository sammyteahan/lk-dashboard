(function() {
  angular.module('lk.data', ['ui.router'])



  // set up in app.js to get correct user environment info
  .service('settings', [function () {
    
    var rootUrl;

    this.setRootUrl = function(url) {
      rootUrl = url;
    };

    this.$get = [function() {
      var settings = {};
      settings.rootUrl = rootUrl;
      return settings;
    }];
  }])



  .factory('DashboardFactory', ['$http', function ($http) {
  
    return {

    };
  }])



  .factory('UserFactory', ['$http', function ($http) {
    
  
    return {
  
    };
  }])



  .factory('UserFactory', ['$http', function ($http) {

    var baseUrl = 'https://www.pivotaltracker.com/services/v5/';
    var config = {
      headers: {
        'X-TrackerToken': '67d138fc3e57c3948143a65060ebdec8'
      }
    };
    
    function getUser() {
      return $http.get(baseUrl + 'me', config);
    }
  
    return {
      getUser: getUser
    };
  }])



  .factory('ProjectFactory', ['$http', function ($http) {

    function Project(id, name, color) {
      this.id = id;
      this.name = name;
      this.color = color;
    }

    Project.prototype.print = function() {
      console.log(this.name + " " + this.id);
    };
    
    var projects = [];
    var baseUrl = 'https://www.pivotaltracker.com/services/v5/';
    var config = {
      headers: {
        'X-TrackerToken': '67d138fc3e57c3948143a65060ebdec8'
      }
    };
  
    // instead of hitting baseurl we will hit settings.rootUrl once we integrate with django
    function getProjects() {
      return $http.get(baseUrl + 'me', config);
    }

    function getProject(id) {
      return $http.get(baseUrl + 'projects/' + id, config);
    }

    function getProjectStories(id) {
      return $http.get(baseUrl + 'projects/' + id + '/stories?with_state=started', config);
    }

    function getFinishedAndReadyForReview(id) {
      return $http.get(baseUrl + 'projects/' + id + '/stories?with_state=finished', config);
    }

    function getUnstartedStories(projectId) {
      return $http.get(baseUrl + 'projects/' + projectId + '/stories?with_state=planned', config);
    }

    return {
      getProjects: getProjects,
      getProject: getProject,
      getProjectStories: getProjectStories,
      getFinishedAndReadyForReview: getFinishedAndReadyForReview,
      getUnstartedStories: getUnstartedStories,
      projects: projects
    };
  }]);

}());
