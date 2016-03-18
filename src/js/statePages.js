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

      this.margin = 30;
      this.height = 500 - 2 * this.margin;
      this.width = 500 - 2 * this.margin;
      this.xMax = 1.2 * d3.max(this.summaryData, function(d) { return +d.income; });
      this.x = d3.scale.pow()
        .exponent(0.3)
        .rangeRound([this.margin, this.width])
        .domain([0, this.xMax]);
      this.y = d3.scale.linear()
        .rangeRound([this.height, this.margin])
        .domain(
          [d3.min(this.summaryData, function(d) { return +d.min; }),
           d3.max(this.summaryData, function(d) { return +d.max; })]);
      this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient('bottom')
        .tickValues([0, 10000, 50000, 200000, 500000, 1000000])
        .tickSize(6, 0);
      this.yAxis = d3.svg.axis().scale(this.y).orient('left');

      this.drawChart();
    },

    drawChart: function() {
      var chartSvg = d3.select('.state-rate-chart').append('svg')
        .attr('height', chart.height + 2 * chart.margin)
        .attr('width', chart.width + 2 * chart.margin)
        .append('g')
        .attr('transform', 'translate(' + chart.margin + ', ' + chart.margin + ')');

      chart.keys.forEach(function(key) {
        var data = [];
        var previousData;
        chart.summaryData.map(function(d) { 
          if (previousData >= 0) {
            data.push({x: +d.income, y: previousData})
          }

          data.push({x: +d.income, y: +d[key]}); 
          previousData = +d[key];
        });
        data.push({x: chart.xMax, y: d3.max(chart.summaryData, function(d) { return +d[key]; })});
        chart.drawLine(chartSvg, data);
      });

      chartSvg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + chart.height + ')')
        .call(chart.xAxis);

      chartSvg.append('g')
        .attr('class', 'y axis')
        .call(chart.yAxis);
      
    },

    drawLine: function(selection, bracketData) {
      var theLine = d3.svg.line()
        .x(function(d) { return chart.x(d.x); })
        .y(function(d) { return chart.y(d.y); });

        selection.append('path')
          .datum(bracketData)
          .attr('fill', 'none')
          .attr('stroke', '#000000')
          .attr('stroke-width', 1)
          .attr('d', theLine);
    }
  }
}());
