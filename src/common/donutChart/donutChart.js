(function() {
  angular.module('lk.charts', [])

  .directive('donutChart', [function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        data: '='
      },
      // bindToController: true,
      templateUrl: 'donutChart/donutChart.tpl.html',
      link: function (scope, iElement, iAttrs) {

        // console.log(data);

        var element = iElement[0];
        var svg = d3.select(element).append("svg").append("g");
        svg.append("g").attr("class", "slices");
        svg.append("g").attr("class", "labels");
        svg.append("g").attr("class", "lines");

        var width = 450,
            height = 450,
            radius = Math.min(width, height) / 2;

        var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) {
            return d.value;
          });

        var arc = d3.svg.arc()
          .outerRadius(radius * 0.8)
          .innerRadius(radius * 0.5);

        var outerArc = d3.svg.arc()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9);

        svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // do i need dis??? 
        var key = function(d){ return d.data.label; };

        var color = d3.scale.ordinal()
          .domain(["Unstarted Stories", "Currently working on", "Open Bugs", "Stories ready for review"])
          .range(["#2ecc71", "#e67e22", "#e74c3c", "#3498db"]);

        // Put scope.data values into an array and put them in the labels map function to map to the correct ordinal numbers
        function randomData (){
          var labels = color.domain();
          var counter = 0;
          var values = scope.data.map(function(value) {
            return value;
          });
          return labels.map(function(label){
            return { label: label, value: Math.random() };
          });
        }

        change(randomData());

        d3.select(".randomize")
          .on("click", function(){
            change(randomData());
          });

        function change(data) {

          /**
          * PIE SLICES
          */
          var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data), key);

          slice.enter()
            .insert("path")
            .style("fill", function(d) { return color(d.data.label); })
            .attr("class", "slice");

          slice   
            .transition().duration(1000)
            .attrTween("d", function(d) {
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                return arc(interpolate(t));
              };
            });

          slice.exit()
            .remove();

          /**
          * TEXT LABELS
          */
          var text = svg.select(".labels").selectAll("text")
            .data(pie(data), key);

          text.enter()
            .append("text")
            .attr("dy", ".35em")
            .style('fill', '#ffffff')
            .attr('font-size', '28px')
            .text(function(d) {
              return d.data.label;
            });
          
          function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
          }

          text.transition().duration(1000)
            .attrTween("transform", function(d) {
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
              };
            })
            .styleTween("text-anchor", function(d){
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
              };
            });

          text.exit().remove();

          /**
          * SLICE TO TEXT POLYLINES
          */
          var polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(data), key);
            
          polyline.enter()
            .append("polyline");

          polyline.transition().duration(1000)
            .attrTween("points", function(d){
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
              };      
            });
          
          polyline.exit().remove();

          // // ---- NEED TO UPDATE ON SCOPE CHANGE ---- //
          // scope.$watch('data', function(data){
          //   slice.data(pie(data), key).transition().attrTween('d', change(randomData()));
          // });

          // our data changed! update the arc paths
          // scope.$watch('data', function(data) {
          //   slice.data(pie(data), key).transition().attrTween('d', change(randomData()));
          // });

        } // END OF CHANGE FUNCTION


      }
    };
  }]);

}());