(function() {
  angular.module('lk.charts', [])

  .directive('donutChart', [function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        data: '='
      },
      transclude: false,
      bindToController: true,
      templateUrl: 'donutChart/donutChart.tpl.html',
      link: function (scope, iElement, iAttrs) {

        var color = d3.scale.category10();
        var element = iElement[0];
        var width = 750;
        var height = 750;
        var min = Math.min(width, height);
        var pie = d3.layout.pie().sort(null);
        var arc = d3.svg.arc()
          .outerRadius(min / 2 * 0.9)
          .innerRadius(min / 2 * 0.5);

        var svg = d3.select(element).append('svg')
          .attr({
            width: width,
            height: height
          })
          .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        function arcTween(a) {
          var i = d3.interpolate(this._current, a);
          this._current = i(0);
          return function(t) {
            return arc(i(t));
          };
        }
        
        // add the paths for each arc slice
        var arcs = svg.selectAll('path').data(pie(scope.data))
          .enter().append('path')
          .style('stroke', 'white')
          .attr('fill', function(d, i) { 
            return color(i); 
          })
          // store the initial angles
          .each(function(d) { 
            this._current = d;
            return this._current; 
        });
        
        // update the arcs
        scope.$watch('data', function(data){
          arcs.data(pie(data)).transition().attrTween('d', arcTween);
        });

        // our data changed! update the arc <path>s
        scope.$watch('data', function(data) {
          arcs.data(pie(data)).attr('d', arc);
        });

      }
    };
  }]);

}());