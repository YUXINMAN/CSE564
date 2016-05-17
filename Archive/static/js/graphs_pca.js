queue()
    .defer(d3.json, "/pcaData")
    .await(makeGraphs);

function makeGraphs(error, JsonData) {
	

	var data_pca = JsonData['data_pca'];
	var data_mds = JsonData['data_mds'];
	var data_isomap = JsonData['data_isomap'];
	var ratio = JsonData['dim_ratios'];
	//Create a Crossfilter instance


    var svg = d3.select('#elbow_chart')
      .append('svg')
      .attr('width', 500)
      .attr('height', 400);

    var x = d3.scale.linear()
      .domain([0,ratio.length - 1])
      .range([40, 580]);

    var y = d3.scale.linear()
      .domain([0, 1])
      .range([360, 40]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(ratio.length);

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(10);

    svg.append('g')
      .attr('class','axis')
      .attr('transform', 'translate(0,360)')
      .call(xAxis)
      .append('text')
      .text('dim');

    svg.append('g')
      .attr('transform', 'translate(40,0)')
      .attr('class','axis')
      .call(yAxis)
      .append('text')
      .text('ratio');

    var line = d3.svg.line()
      .x(function(d, i) { return x(i+1); })
      .y(function(d) { return y(d); })
      //.interpolate('step-after');
      .interpolate('monotone');

    var path = svg.append('path')
      .attr('d', line(ratio))
      .style("fill","#F00")
	  .style("fill","none")
	  .style("stroke-width",1)
	  .style("stroke","#F00")
	  .style("stroke-opacity",0.9);

    drawScatterPlot(data_pca,'#pca_chart');
    drawScatterPlot(data_mds,'#mds_chart');
    drawScatterPlot(data_isomap,'#isomap_chart');
};

function drawScatterPlot(data, eleID){
    var max1 =  max2 = -9000000;
    var min1 = min2 = 9000000;

	data.forEach(function(x){
	    x[0] = +x[0];
	    if (x[0] > max1){
	        max1 = x[0];
	    }
	    if (x[0] < min1){
	        min1 = x[0];
	    }
	    x[1] = +x[1];
	    if (x[1] > max2){
	        max2 = x[1];
	    }
	    if (x[1] < min2){
	        min2 = x[1];
	    }
	});

    var ndx = crossfilter(data);
	var chart = dc.scatterPlot(eleID);
    var dim = ndx.dimension(function(d) { return d; });
    var group = dim.group();
    chart
        .width(550)
        .height(400)
        .x(d3.scale.linear().domain([min1,max1]))
        .y(d3.scale.linear().domain([min2,max2]))
        .yAxisLabel("")
        .dimension(dim)
        .group(group);
    chart.render();

}