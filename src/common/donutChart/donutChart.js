(function() {
  angular.module('lk.charts', [])

  .directive('donutChart', [function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'donutChart/donutChart.tpl.html',
      link: function (scope, iElement, iAttrs) {

        var color = d3.scale.category10();
        var el = iElement[0];
        var width = el.clientWidth;
        var height = el.clientHeight;
        var min = Math.min(width, height);
        var pie = d3.layout.pie().sort(null);
        var arc = d3.svg.arc()
          .outerRadius(min / 2 * 0.9)
          .innerRadius(min / 2 * 0.5);

        var svg = d3.select(el).append('svg')
          .attr({width: width, height: height})
          .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        svg.on('mousedown', function(d) {
          // yo angular, the code in this callback might make a change to the scope!
          // so be sure to apply $watch's and catch errors.
          scope.$apply(function(){
            if(scope.onClick) {
              scope.onClick();
            }
          });
        });

        function arcTween(a) {
          // see: http://bl.ocks.org/mbostock/1346410
          var i = d3.interpolate(this._current, a);
          this._current = i(0);
          return function(t) {
            return arc(i(t));
          };
        }
        
      }
    };
  }]);

}());