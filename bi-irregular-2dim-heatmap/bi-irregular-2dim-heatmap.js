/*
Created by Ralf Becher - ralf.becher@web.de - (c) 2015 irregular.bi, Leipzig, Germany
Tested on Qlik Sense 1.1.0

Based on: d3 day/hour heatmap for Qlik Sense
Source  : http://branch.qlik.com/projects/showthread.php?348-d3-day-hour-heatmap-for-Qlik-Sense
GitHub  : https://github.com/borodri/Sense_d3calendarheatmap
Author  : https://github.com/borodri

irregular.bi takes no responsibility for any code.
Use at your own risk. 
*/
define(["jquery", "qlik", "text!./styles/bi-irregular-2dim-heatmap.css", "./scripts/d3.min"], function($, qlik, cssContent) {'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 3,
					qHeight : 500
				}]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 2,
					max : 2
				},
				measures : {
					uses : "measures",
					min : 1,
					max : 1
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
					items : {						
						 colors: {
								  ref: "ColorSchema",
								  type: "string",
								  component: "dropdown",
								  label: "Color and legend",
								  options: 
									[ {
										value: "#ffffe5, #fff7bc, #fee391, #fec44f, #fe9929, #ec7014, #cc4c02, #993404, #662506",
										label: "Sequencial"
									}, {
										value: "#662506, #993404, #cc4c02, #ec7014, #fe9929, #fec44f, #fee391, #fff7bc, #ffffe5",
										label: "Sequencial (Reverse)"
									}, {
										value: "#d73027, #f46d43, #fdae61, #fee090, #ffffbf, #e0f3f8, #abd9e9, #74add1, #4575b4",
										label: "Diverging RdYlBu"
									}, {
										value: "#4575b4, #74add1, #abd9e9, #e0f3f8, #ffffbf, #fee090, #fdae61, #f46d43, #d73027",
										label: "Diverging BuYlRd (Reverse)"
									}, {
										value: "#f7fbff, #deebf7, #c6dbef, #9ecae1, #6baed6, #4292c6, #2171b5, #08519c, #08306b",
										label: "Blues"
									}, {
										value: "#fff5f0, #fee0d2, #fcbba1, #fc9272, #fb6a4a, #ef3b2c, #cb181d, #a50f15, #67000d",
										label: "Reds"
									}, {
										value: "#ffffd9, #edf8b1, #c7e9b4, #7fcdbb, #41b6c4, #1d91c0, #225ea8, #253494, #081d58",
										label: "YlGnBu"
									}
									
									
									],
								  defaultValue: "#ffffe5, #fff7bc, #fee391, #fec44f, #fe9929, #ec7014, #cc4c02, #993404, #662506"
							   },
						dim1LabelSize:{
							ref: "dim1LabelSize",
							type: "integer",
							label: "Dim1 Label Size (left)",
							defaultValue: 12
						},
						dim2LabelSize:{
							ref: "dim2LabelSize",
							type: "integer",
							label: "Dim2 Label Size (right)",
							defaultValue: 2
						},
						maxGridColums:{
							ref: "maxGridColums",
							type: "integer",
							label: "Max. Columns for Grid",
							defaultValue: 18,
							expression: "optional"
						},
						leastTiles:{
							ref: "leastTiles",
							type: "integer",
							label: "Least Tiles in Row",
							defaultValue: 1,
							expression: "optional"
						},
						showCondition:{
							ref: "showCondition",
							type: "integer",
							label: "Show Condition",
							defaultValue: 1,
							expression: "optional"
						}
					}					
				}				
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element,layout) {
			var _this = this,
				app = qlik.currApp();
			
			// get qMatrix data array
			var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
			
//console.log(qMatrix);		
	
			// create a new array that contains the dimension labels
			var dimensionLabels = layout.qHyperCube.qDimensionInfo.map(function(d) {
				return d.qFallbackTitle;
			});
	
			// create a new array that contains the measure labels
			var measureLabels = layout.qHyperCube.qMeasureInfo.map(function(d) {
				return d.qFallbackTitle;
			});
//console.log(layout.qHyperCube.qDimensionInfo);
			// var qFields = layout.qHyperCube.qDimensionInfo.map(function(d) {
				// return d.qGroupFieldDefs[0];
			// });
			
			var qDimensionType = layout.qHyperCube.qDimensionInfo.map(function(d) {
				return d.qDimensionType;
			});

			var qDimSort = layout.qHyperCube.qDimensionInfo.map(function(d) {
				return d.qSortIndicator;
			});

			// Create a new array for our extension with a row for each row in the qMatrix
			var data = qMatrix.map(function(d) {
				// for each element in the matrix, create a new object that has a property
				// for the grouping dimension(s), and the metric(s)
				return {
					"Dim1": d[0].qText,
					"Dim2": d[1].qText,
					"Dim2Num": d[1].qNum,
					"Element1": d[0].qElemNumber,
					"Element2": d[1].qElemNumber,
					"Metric1": d[2].qNum
				}
			});
			
			var colorpalette = layout.ColorSchema.split(", "),
				dim1LabelSize = layout.dim1LabelSize,
				dim2LabelSize = layout.dim2LabelSize,
				maxGridColums = layout.maxGridColums,
				leastTiles = layout.leastTiles,
				showCondition = layout.showCondition;
						
			 // Chart object width
			var width = $element.width(); // space left for scrollbar
			// Chart object height
			var height = $element.height();
			// Chart object id
			var id = "container_" + layout.qInfo.qId;
		 
			$element.html("");
			$element.append($('<div />').attr("id", id).css({ height: height, width: width, overflow: 'auto' }))
			
			viz(_this,app,data,qDimensionType,qDimSort,width,height,id,colorpalette,dimensionLabels,measureLabels,dim1LabelSize,dim2LabelSize,maxGridColums,leastTiles,showCondition);				
		}
	}
});

var viz = function(_this,app,data,qDimensionType,qDimSort,width,height,id,colorpalette,dimensionLabels,measureLabels,dim1LabelSize,dim2LabelSize,maxGridColums,leastTiles,showCondition) {

    var formatLegend = d3.format("0,");
    var formatTitle = d3.format("0,.2f");

	var rollup_dim1 = d3.nest()
		.key(function(d) { return d.Dim1; })
		.rollup(function(leaves) { return {element: leaves[0].Element1, count: leaves.length}; })
		.entries(data);
	var rollup_dim2 = d3.nest()
		.key(function(d) { return d.Dim2; })
		.rollup(function(leaves) { return {element: leaves[0].Element2, count: leaves.length, num: leaves[0].Dim2Num}; })
		.entries(data);

	var dim1Lookup = [];
	if (leastTiles > 1 && rollup_dim2.length > leastTiles) {
		// Filter rows with too few tiles:	
		rollup_dim1 = rollup_dim1.filter(function(e){
							return e.values.count >= leastTiles;
						});
		dim1Lookup = rollup_dim1.map(function(e){
							return e.key;			
						});	
		data = data.filter(function(e){
							return $.inArray(e.Dim1, dim1Lookup) != -1;			
						});
	}

	var gridSize = -1,
		legendElementWidth = -1,
		buckets = 9,
		colors = colorpalette,
		dots = "..",
		smallSize = 15;
	  
	var dim1keys = [], dim2keys = [], dim1LabelsShort = [], dim1Obj = [], dim2Obj = [], dim2LabelsShort = [], dim1Elements = [], dim2Elements = [];
	
	dim2Obj = rollup_dim2.map(function(e){return {
					"dim2key": e.key, 
					"dim2LabelShort": e.key.substr(e.key.length -dim2LabelSize),
					"dim2Element": e.values.element,
					"dim2Num": e.values.num
				};
			});
	// Sorting Dim2
	if (qDimensionType[1] == "N") {
		// Numeric
		if (qDimSort[1] == "A") {
			dim2Obj.sort(function(o1,o2){ return o1.dim2Num - o2.dim2Num; });
		} else {
			dim2Obj.sort(function(o1,o2){ return o2.dim2Num - o1.dim2Num; });
		}
	} else {
		// Alphabetic
		if (qDimSort[1] == "A") {
			dim2Obj.sort(function(a, b) {
				var x = a.dim2key.toLowerCase(), y = b.dim2key.toLowerCase();   
				return x < y ? -1 : x > y ? 1 : 0;
			});
		} else {
			dim2Obj.sort(function(a, b) {
				var y = a.dim2key.toLowerCase(), x = b.dim2key.toLowerCase();   
				return x < y ? -1 : x > y ? 1 : 0;
			});
		}
	}
	
	dim2keys = dim2Obj.map(function(e){return e.dim2key;});
	dim2LabelsShort = dim2Obj.map(function(e){return e.dim2LabelShort;});
	dim2Elements = dim2Obj.map(function(e){return e.dim2Element;});

	var marginLeft = function(){ return (dim1LabelSize * 7) + 10; };
	var margingRight = 10, marginTop = 50, marginButton = 10;
	var gridDivider = Math.max(maxGridColums * 1, dim2keys.length); 

	if (Math.floor((width -marginLeft() -margingRight)/ gridDivider) < smallSize) {
		dim1LabelSize = Math.min(3, dim1LabelSize);
		dots = ".";
	}

	dim1Obj = rollup_dim1.map(function(e){return {
					"dim1key": e.key,
					"dim1LabelShort": e.key.substr(0, dim1LabelSize) + (e.key.length > dim1LabelSize ? dots : ""),
					"dim1Element": e.values.element
				};
			});
	dim1keys = dim1Obj.map(function(e){return e.dim1key;});
	dim1LabelsShort = dim1Obj.map(function(e){return e.dim1LabelShort;});
	dim1Elements = dim1Obj.map(function(e){return e.dim1Element;});

	var margin = { top: marginTop, right: margingRight, bottom: marginButton, left: marginLeft()};
		//width = width - margin.left - margin.right,
		//height = height - margin.top - margin.bottom;
	width = Math.max(150, width -8);  // space for scrollbar
	
	var colorScale = d3.scale.quantile()
		.domain([0, d3.mean(data,function(d) { return +d.Metric1}), d3.max(data, function (d) { return d.Metric1; })])
		.range(colors);

	gridSize = Math.floor((width - margin.left - margin.right) / gridDivider);
	legendElementWidth = Math.floor((gridSize * gridDivider) / (colorScale.quantiles().length +1));
 
	var svg = d3.select("#"+id).append("svg")
		.attr("width", width)
		.attr("height", Math.max(height -4, 38 + (dim1keys.length * (gridSize + 2))))
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var dim1Labels = svg.selectAll(".dim1Label")
		.data(dim1LabelsShort)
		.enter().append("text")
		.text(function (d) { return d; })
		.attr("x", 0)
		.attr("y", function (d, i) { return i * gridSize; })
		.style("text-anchor", "end")
		.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
		.attr("class", function (d, i) { return ("dim1Label mono" + (gridSize < smallSize ? "-small" : "") + " axis axis-dim1"); })
		.on("click", function(d, i) {
			_this.backendApi.selectValues(0, [dim1Elements[i]], true);
			})
		.append("title").text(function(d, i) { return dimensionLabels[0] + ": " + dim1keys[i] });

	var dim2Labels = svg.selectAll(".dim2Label")
		.data(dim2LabelsShort)
		.enter().append("text")
		.text(function(d) { return d; })
		.attr("x", function(d, i) { return i * gridSize; })
		.attr("y", 0)
		.style("text-anchor", "middle")
		.attr("transform", "translate(" + gridSize / 2 + ", -6)")
		.attr("class", function(d, i) { return ("dim2Label mono" + (gridSize < smallSize ? "-small" : "") + " axis axis-dim2"); })
		.on("click", function(d, i) {
			_this.backendApi.selectValues(1, [dim2Elements[i]], true);
			})
		.append("title").text(function(d, i) { return dimensionLabels[1] + ": " + dim2keys[i] });

	if (showCondition == 0) return;

	var heatMap = svg.selectAll(".dim2")
		.data(data)
		.enter().append("rect")
		.attr("x", function(d) { return $.inArray(d.Dim2, dim2keys) * gridSize; })
		.attr("y", function(d) { return $.inArray(d.Dim1, dim1keys) * gridSize; })
		.attr("rx", 4)
		.attr("ry", 4)
		.attr("class", "dim2 bordered")
		.attr("width", gridSize)
		.attr("height", gridSize)
		.style("fill", colors[0]);

	heatMap.transition().duration(200)
		.style("fill", function(d) { return colorScale(d.Metric1); });

	heatMap.on("click", function(d, i) {
			_this.backendApi.selectValues(0, [d.Element1], true);
			_this.backendApi.selectValues(1, [d.Element2], true);
		})
		.append("title").text(function(d) { return dimensionLabels[0] + ": " + d.Dim1 + "\n" + dimensionLabels[1] + ": " + d.Dim2 + "\n" + measureLabels[0] + ": " + formatTitle(d.Metric1); });
	
	var legend = svg.selectAll(".legend")
		.data([0].concat(colorScale.quantiles()), function(d) { return d; })
		.enter().append("g")
		.attr("class", "legend");

	legend.append("rect")
		.attr("x", function(d, i) { return legendElementWidth * i; })
		.attr("y", -38) //height
		.attr("width", legendElementWidth)
		.attr("height", 8)
		.style("fill", function(d, i) { return colors[i]; });

	legend.append("text")
		.attr("class", "mono" + (gridSize < smallSize ? "-small" : ""))
		.text(function(d) { return (gridSize < smallSize ? "" : "≥ ") + formatLegend(Math.round(d)); })
		.attr("x", function(d, i) { return legendElementWidth * i; })
		.attr("y", -40);  // height + gridSize
};