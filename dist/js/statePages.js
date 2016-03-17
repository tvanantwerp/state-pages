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

      this.height = 500;
      this.width = 500;
      this.x = d3.scale.log().range([0, this.width])
        .domain(d3.extent(this.summaryData, function(d) { return d[0]; }));
      this.y = d3.scale.linear().range([this.height, 0])
        .domain(
          [d3.min(this.summaryData, function(d) { return d[1]; }),
          d3.max(this.summaryData, function(d) { return d[5]; })]);
      this.xAxis = d3.svg.axis().scale(this.x).orient('bottom');
      this.yAxis = d3.svg.axis().scale(this.y).orient('left');

      this.drawChart();
    },

    drawChart: function() {
      var chartSvg = d3.select('.state-rate-chart');
      chartSvg.append('svg')
        .attr('height', this.height)
        .attr('width', this.width);

      for (var i = 0, j = 6; i < j; i++) {
        this.drawLine(chartSvg, this.summaryData, i);
      }

      
    },

    drawLine: function(selection, bracketData, statistic) {
      var theLine = d3.svg.line()
        .x(function(d) { return chart.x(bracketData[0]); })
        .y(function(d) { return chart.y(bracketData[statistic]); });

        selection.append('path')
          .datum(bracketData)
          .attr('d', theLine);
    }
  }
}());
