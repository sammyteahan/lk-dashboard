(function () {
  angular.module('lk.period-selector', [])



  .directive('datePicker', [function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'common/datePicker/datePicker.tpl.html',
    };
  }]);
})();
