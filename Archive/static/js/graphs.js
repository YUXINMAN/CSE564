var page = 0;
function locatepage(n) {
    page = n;
}

queue()
    .defer(d3.json, "/data")
    .defer(d3.json, "static/geojson/us-states.json")
    .defer(d3.json, "/fincpbywork1")
    .defer(d3.json, "/fincpbywork2")
    .defer(d3.json, "/fincpbywork3")
    .defer(d3.json, "/fincpbywork4")
    .defer(d3.json, "/fincpbywork5")
    .defer(d3.json, "/fincpbyhouse1")
    .defer(d3.json, "/fincpbyhouse2")
    .defer(d3.json, "/fincpbyhouse3")
    .defer(d3.json, "/fincpbyhouse4")
    .defer(d3.json, "/fincpbyhouse5")
    .await(makeGraphs);

function makeGraphs(error, JsonData, statesJson, finByWork1, finByWork2, finByWork3, finByWork4, finByWork5, finByHou1, finByHou2, finByHou3, finByHou4, finByHou5) {
	if (page == 1) {
	    var ndx = crossfilter(JsonData);

        //BAR CHART PART
        var barchart = dc.barChart("#bar_chart");
        var bardim = ndx.dimension(function(d) { return d.FINCP; });
        var bargroup = bardim.group(function(d){
                if (d == 0) return 0;
                if (d < 0) {
                    return 0-Math.floor(Math.log(-d)/Math.log(10));
                }
                return Math.floor(Math.log(d)/Math.log(10));
            });
        var barreduceCount = bargroup.reduceCount();

        var minFINCP = bardim.bottom(1)[0].FINCP;
        var maxFINCP = bardim.top(1)[0].FINCP;
        if (minFINCP == 0) {
            minFINCP = 0;
        } else if (minFINCP < 0) {
            minFINCP = 0-Math.floor(Math.log(-minFINCP)/Math.log(10));
        } else {
            minFINCP = Math.floor(Math.log(minFINCP)/Math.log(10));
        }
        maxFINCP = Math.floor(Math.log(maxFINCP)/Math.log(10))
        console.log(minFINCP + " " + maxFINCP);
        barchart
            .width(450)
            .height(400)
            .yAxisLabel(" ")
            .xAxisLabel("FINC(10^x)")
            .dimension(bardim)
            .group(barreduceCount)
            .x(d3.scale.linear().domain([minFINCP,maxFINCP]));

        barchart.render();


        //PIE CHART PART
        var piechart = dc.pieChart("#pie_chart");
        var piedim = ndx.dimension(function(d) { return d.FINCP; });
        var piegroup = piedim.group(function(d){
                if (d == 0) return 0;
                if (d < 0) {
                    return 0-Math.floor(Math.log(-d)/Math.log(10));
                }
                return Math.floor(Math.log(d)/Math.log(10));
            });
        var piereduceCount = piegroup.reduceCount();

        piechart
            .width(450)
            .height(400)
            .dimension(piedim)
            .group(piereduceCount)
            .colors(d3.scale.category20())
            .label(function(p){
                if (isNaN(p["key"])){
                    return "";
                }
                return "10^" + p["key"] + "$";}
            )
            .title(function(p){
                if (isNaN(p["key"])){
                    return "";
                }
                return p["value"]+" families have income in 10^"+
                    p["key"] + " scale";
            });

        piechart.render();


        //MAP CHART PART
        var usChart = dc.geoChoroplethChart("#map_chart");
        var stateDim = ndx.dimension(function(d) {
                var result;
                if (d.ST <10){
                    result = "0" + d.ST;
                } else {
                    result = "" + d.ST;
                }
                return result;
            });
        var incByState = stateDim.group().reduceSum(function(d){return d.FINCP;});
        var max_state = incByState.top(1)[0].value;
        var statesIdToName = {};
        var i;
        for (i = 0; i < statesJson["features"].length; i++){
            statesIdToName[statesJson["features"][i]["id"]] = statesJson["features"][i]["properties"]["name"];
        }
        usChart.width(600)
            .height(600)
            .dimension(stateDim)
            .group(incByState)
            .colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
            .colorDomain([0, max_state])
            .overlayGeoJson(statesJson["features"], "state", function (d) {
                return d.id;
            })
            .projection(d3.geo.albersUsa()
                        .scale(750)
                        .translate([300, 250]))
            .title(function (p) {
                if (isNaN(p["value"])){
                    return "State: " + statesIdToName[p["key"]]
                        + " has no record.";
                }
                return "State: " + statesIdToName[p["key"]]
                        + "\n"
                        + "Total Family Income: " + Math.round(p["value"]) + " $";
            });
        usChart.render();
	}

	function barchart(data){
        var ndx = crossfilter(data);
        //console.log("drawing bar chart");
        //console.log(ndx);
        var barchart ;
        if (page == 1) barchart = dc.barChart("#bar_chart");
        else if (page == 2) barchart = dc.barChart("#Wbarchart");
        else if (page == 3) barchart = dc.barChart("#Hbarchart");
//        var bardim = ndx.dimension(function(d) {
//             if(d.WORKSTAT == 1){
//                console.log("choosing items");
//                return d.FINCP;
//             }
//          });
        var bardim = ndx.dimension(function(d) { return d.FINCP; });
        var bargroup = bardim.group(function(d){
                if (d == 0) return 0;
                if (d < 0) {
                    return 0-Math.floor(Math.log(-d)/Math.log(10));
                }
                return Math.floor(Math.log(d)/Math.log(10));
            });
        var barreduceCount = bargroup.reduceCount();

        var minFINCP = bardim.bottom(1)[0].FINCP;
        var maxFINCP = bardim.top(1)[0].FINCP;
        if (minFINCP == 0) {
            minFINCP = 0;
        } else if (minFINCP < 0) {
            minFINCP = 0-Math.floor(Math.log(-minFINCP)/Math.log(10));
        } else {
            minFINCP = Math.floor(Math.log(minFINCP)/Math.log(10));
        }
        maxFINCP = Math.floor(Math.log(maxFINCP)/Math.log(10))
        console.log(minFINCP + " " + maxFINCP);
        barchart
            .width(600)
            .height(400)
            .yAxisLabel(" ")
            .xAxisLabel("FINC(10^x)")
            .dimension(bardim)
            .group(barreduceCount)
            .x(d3.scale.linear().domain([minFINCP,maxFINCP]));

        barchart.render();

//        if (page == 1) {
//            //MAP CHART PART
//            var usChart = dc.geoChoroplethChart("#map_chart");
//            var stateDim = ndx.dimension(function(d) {
//                    var result;
//                    if (d.ST <10){
//                        result = "0" + d.ST;
//                    } else {
//                        result = "" + d.ST;
//                    }
//                    return result;
//                });
//            var incByState = stateDim.group().reduceSum(function(d){return d.FINCP;});
//            var max_state = incByState.top(1)[0].value;
//            var statesIdToName = {};
//            var i;
//            for (i = 0; i < statesJson["features"].length; i++){
//                statesIdToName[statesJson["features"][i]["id"]] = statesJson["features"][i]["properties"]["name"];
//            }
//            usChart.width(600)
//                .height(600)
//                .dimension(stateDim)
//                .group(incByState)
//                .colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
//                .colorDomain([0, max_state])
//                .overlayGeoJson(statesJson["features"], "state", function (d) {
//                    return d.id;
//                })
//                .projection(d3.geo.albersUsa()
//                            .scale(750)
//                            .translate([300, 250]))
//                .title(function (p) {
//                    if (isNaN(p["value"])){
//                        return "State: " + statesIdToName[p["key"]]
//                            + " has no record.";
//                    }
//                    return "State: " + statesIdToName[p["key"]]
//                            + "\n"
//                            + "Total Family Income: " + Math.round(p["value"]) + " $";
//                });
//            usChart.render();
//        }
    };
    function piechart(data){
        var ndx = crossfilter(data);
        var piechart ;
        if (page == 1) piechart = dc.pieChart("#pie_chart");
        else if (page == 2) piechart = dc.pieChart("#Wpiechart");
        else if (page == 3) piechart = dc.pieChart("#Hpiechart");
        var piedim = ndx.dimension(function(d) { return d.FINCP; });
        var piegroup = piedim.group(function(d){
                if (d == 0) return 0;
                if (d < 0) {
                    return 0-Math.floor(Math.log(-d)/Math.log(10));
                }
                return Math.floor(Math.log(d)/Math.log(10));
            });
        var piereduceCount = piegroup.reduceCount();

        piechart
            .width(600)
            .height(400)
            .dimension(piedim)
            .group(piereduceCount)
            .colors(d3.scale.category20())
            .label(function(p){
                if (isNaN(p["key"])){
                    return "";
                }
                return "10^" + p["key"] + "$";}
            )
            .title(function(p){
                if (isNaN(p["key"])){
                    return "";
                }
                return p["value"]+" families have income in 10^"+
                    p["key"] + " scale";
            });

        piechart.render();
//        if (page == 1) {
//            //MAP CHART PART
//            var usChart = dc.geoChoroplethChart("#map_chart");
//            var stateDim = ndx.dimension(function(d) {
//                    var result;
//                    if (d.ST <10){
//                        result = "0" + d.ST;
//                    } else {
//                        result = "" + d.ST;
//                    }
//                    return result;
//                });
//            var incByState = stateDim.group().reduceSum(function(d){return d.FINCP;});
//            var max_state = incByState.top(1)[0].value;
//            var statesIdToName = {};
//            var i;
//            for (i = 0; i < statesJson["features"].length; i++){
//                statesIdToName[statesJson["features"][i]["id"]] = statesJson["features"][i]["properties"]["name"];
//            }
//            usChart.width(600)
//                .height(600)
//                .dimension(stateDim)
//                .group(incByState)
//                .colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
//                .colorDomain([0, max_state])
//                .overlayGeoJson(statesJson["features"], "state", function (d) {
//                    return d.id;
//                })
//                .projection(d3.geo.albersUsa()
//                            .scale(750)
//                            .translate([300, 250]))
//                .title(function (p) {
//                    if (isNaN(p["value"])){
//                        return "State: " + statesIdToName[p["key"]]
//                            + " has no record.";
//                    }
//                    return "State: " + statesIdToName[p["key"]]
//                            + "\n"
//                            + "Total Family Income: " + Math.round(p["value"]) + " $";
//                });
//            usChart.render();
//        }
    };

    dataset = JsonData;
    barchart(dataset);
    piechart(dataset);


    d3.select("#ws1")
		.on("click", function(){
			dataset = finByWork1;
			barchart(dataset);
			piechart(dataset);
		});
	d3.select("#ws2")
		.on("click", function(){
			dataset = finByWork2;
			barchart(dataset);
			piechart(dataset);
		});
	d3.select("#ws3")
		.on("click", function(){
			dataset = finByWork3;
			barchart(dataset);
			piechart(dataset);
		});
	d3.select("#ws4")
		.on("click", function(){
			dataset = finByWork4;
			barchart(dataset);
			piechart(dataset);
		});
	d3.select("#ws5")
		.on("click", function(){
			dataset = finByWork5;
			barchart(dataset);
			piechart(dataset);
		});
	d3.select("#ht1")
		.on("click", function(){
			dataset = finByHou1;
			barchart(dataset);
			piechart(dataset);
		});
	d3.select("#ht2")
		.on("click", function(){
			dataset = finByHou2;
			barchart(dataset);
			piechart(dataset);
		});
	d3.select("#ht3")
		.on("click", function(){
			dataset = finByHou3;
			barchart(dataset);
			piechart(dataset);
		});
	d3.select("#ht4")
		.on("click", function(){
			dataset = finByHou4;
			barchart(dataset);
			piechart(dataset);
		});
	d3.select("#ht5")
		.on("click", function(){
			dataset = finByHou5;
			barchart(dataset);
			piechart(dataset);
		});
};