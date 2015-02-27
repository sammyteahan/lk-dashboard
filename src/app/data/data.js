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



  .factory('ProjectFactory', ['$http', function ($http) {
    
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

    }

    return {
      getProjects: getProjects,
      getProject: getProject
    };
  }]);

}());