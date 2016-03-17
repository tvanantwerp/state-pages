(function() {
  'use strict';

  var chart;
  var brackets;
  var CHART_PATH = 'data/rates_samples.csv';
  var BRACKETS_PATH = 'data/bracket_sample.csv';

  (function() {
    queue()
      .defer(d3.csv, CHART_PATH)
      .defer(d3.csv, BRACKETS_PATH)
      .await(function(error, summary, brackets) {
        if (error) { console.log(error); }

        chart.initialize(summary, brackets);
      });
  })();

  chart = {
    initialize: function(summary, brackets) {
      this.summaryData = summary;
      this.bracketsData = brackets;
      this.keys = ['min', 'firstQuartile', 'median', 'thirdQuartile', 'max'];

      this.height = 500;
      this.width = 500;
      this.x = d3.scale.pow()
        .rangeRound([0, this.width])
        .domain(d3.extent(this.summaryData, function(d) { return +d.income; }));
      this.y = d3.scale.linear()
        .rangeRound([this.height, 0])
        .domain(
          [d3.min(this.summaryData, function(d) { return +d.min; }),
           d3.max(this.summaryData, function(d) { return +d.max; })]);
      this.xAxis = d3.svg.axis().scale(this.x).orient('bottom');
      this.yAxis = d3.svg.axis().scale(this.y).orient('left');

      this.drawChart();
    },

    drawChart: function() {
      var chartSvg = d3.select('.state-rate-chart').append('svg');
      chartSvg
        .attr('height', chart.height)
        .attr('width', chart.width);

      chart.keys.forEach(function(key) {
        var data = chart.summaryData.map(function(d) { return {x: d.income, y: d[key]}; });
        chart.drawLine(chartSvg, data);
      })

      
    },

    drawLine: function(selection, bracketData) {
      var theLine = d3.svg.line()
        .x(function(d) { return chart.x(+d.x); })
        .y(function(d) { return chart.y(+d.y); });
console.log(chart.x(50000));
        selection.append('path')
          .datum(bracketData)
          .attr('fill', 'none')
          .attr('stroke', '#000000')
          .attr('stroke-width', 1)
          .attr('d', theLine);
    }
  }
}());
