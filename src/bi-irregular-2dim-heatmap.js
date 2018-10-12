/*
Created by Ralf Becher - ralf.becher@web.de - (c) 2015 irregular.bi, Leipzig, Germany
Tested on Qlik Sense 2.2.4
Modified by Loïc Formont and Xavier Le Pitre
Tested on Qlik Sense 2.0.1

Based on: d3 day/hour heatmap for Qlik Sense
Source  : http://branch.qlik.com/projects/showthread.php?348-d3-day-hour-heatmap-for-Qlik-Sense
GitHub  : https://github.com/borodri/Sense_d3calendarheatmap
Author  : https://github.com/borodri

irregular.bi takes no responsibility for any code.
Use at your own risk. 
*/
define([
    "jquery", 
    "qlik", 
    "./scripts/d3.min", 
    "./scripts/lasso_adj", 
    "css!./styles/bi-irregular-2dim-heatmap.css", 
    "./scripts/irregularUtils"
], function ($, qlik, d3, lasso) {
    'use strict';

        var panelSliderLabel = function () {
            return this.labelText + " (" + arguments[0][this.ref] + ")";
        };

        return {
            initialProperties: {
                version: 1.0,
                qHyperCubeDef: {
                    qDimensions: [],
                    qMeasures: [],
                    qInitialDataFetch: [{
                        qWidth: 4,
                        qHeight: 2500
				}]
                }
            },
            definition: {
                type: "items",
                component: "accordion",
                items: {
                    dimensions: {
                        uses: "dimensions",
                        min: 2,
                        max: 2
                    },
                    measures: {
                        uses: "measures",
                        min: 1,
                        max: 2
                    },
                    sorting: {
                        uses: "sorting"
                    },
                    addons: {
                        uses: "addons",
                        items: {
                            dataHandling: {
                                uses: "dataHandling"
                            }
                        }
                    },
                    settings: {
                        uses: "settings",
                        items: {

                            options: {
                                label: "Options",
                                type: "items",
                                items: {

                                    colors: {
                                        ref: "ColorSchema",
                                        type: "string",
                                        component: "dropdown",
                                        label: "Color Schema",
                                        options: [
                                            {
                                                value: "#3C52A1, #3A82C4, #69ACDE, #9FD0F1, #CFEAFA, #EEDCC5, #F4AA73, #E67A56, #CD473E, #AE1C3E",
                                                label: "Qlik Sense Diverging"
										}, {
                                                value: "#AE1C3E, #CD473E, #E67A56, #F4AA73, #EEDCC5, #CFEAFA, #9FD0F1, #69ACDE, #3A82C4, #3C52A1",
                                                label: "Qlik Sense Diverging (Reverse)"
										}, {
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
                                                value: "#d73027, #fdae61, #ffffbf, #abd9e9, #4575b4",
                                                label: "Diverging BuYlRd 5 values"
										}, {
                                                value: "#4575b4, #abd9e9, #ffffbf, #fdae61, #d73027",
                                                label: "Diverging BuYlRd 5 values (Reverse)"
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
                                    
                                    LabelColorPicker: {
                                        ref: "labelColor",
                                        label:"Label Color",
                                        component: "color-picker",
                                        dualOutput: true,
                                        type: "object",  
                                        defaultValue: {
                                            index: -1,
                                            color: "#595959"
                                        }
                                    },
                                    useMeanScale: {
                                        type: "boolean",
                                        component: "switch",
                                        translation: "Use Mean in Scale",
                                        ref: "useMeanScale",
                                        defaultValue: true,
                                        trueOption: {
                                            value: true,
                                            translation: "properties.on"
                                        },
                                        falseOption: {
                                            value: false,
                                            translation: "properties.off"
                                        }
                                    },
                                    fixedScale: {
                                        type: "boolean",
                                        component: "switch",
                                        translation: "Fixed Scale",
                                        ref: "fixedScale",
                                        defaultValue: false,
                                        trueOption: {
                                            value: true,
                                            translation: "properties.on"
                                        },
                                        falseOption: {
                                            value: false,
                                            translation: "properties.off"
                                        }
                                    },
                                    minScale: {
                                        ref: "minScale",
                                        type: "number",
                                        label: "min. Scale Value",
                                        defaultValue: 0,
                                        expression: "optional",
                                        show: function (layout) {
                                            return layout.fixedScale;
                                        }
                                    },
                                    maxScale: {
                                        ref: "maxScale",
                                        type: "number",
                                        label: "max. Scale Value",
                                        defaultValue: 1,
                                        expression: "optional",
                                        show: function (layout) {
                                            return layout.fixedScale;
                                        }
                                    },
                                    meanScale: {
                                        ref: "meanScale",
                                        type: "number",
                                        label: "mean Scale Value",
                                        defaultValue: 0,
                                        expression: "optional",
                                        show: function (layout) {
                                            return layout.useMeanScale;
                                        }
                                    },
                                    showLegend: {
                                        type: "boolean",
                                        component: "switch",
                                        translation: "Show Legend",
                                        ref: "showLegend",
                                        defaultValue: true,
                                        trueOption: {
                                            value: true,
                                            translation: "properties.on"
                                        },
                                        falseOption: {
                                            value: false,
                                            translation: "properties.off"
                                        }
                                    },
                                    dim1LabelSize: {
                                        ref: "dim1LabelSize",
                                        type: "integer",
                                        label: "Dim1 Label Size (left)",
                                        defaultValue: 12
                                    },
                                    dim2LabelSize: {
                                        ref: "dim2LabelSize",
                                        type: "integer",
                                        label: "Dim2 Label Size (right/rotate left)",
                                        defaultValue: 2
                                    },
                                    dim2LabelRotation: {
                                        type: "boolean",
                                        component: "switch",
                                        translation: "Rotate Dim2 Labels by -90°",
                                        ref: "dim2LabelRotation",
                                        defaultValue: false,
                                        trueOption: {
                                            value: true,
                                            translation: "properties.on"
                                        },
                                        falseOption: {
                                            value: false,
                                            translation: "properties.off"
                                        },
                                        show: true
                                    },
                                    maxGridColums: {
                                        ref: "maxGridColums",
                                        type: "integer",
                                        label: "Max. Columns for Grid",
                                        defaultValue: 18,
                                        expression: "optional"
                                    },
                                    heightFactor: {
                                        ref: "heightFactor",
                                        type: "number",
                                        label: "Height Factor",
                                        defaultValue: 1,
                                        expression: "optional"
                                    },
                                    leastTiles: {
                                        ref: "leastTiles",
                                        type: "integer",
                                        label: "Least Tiles in Row",
                                        defaultValue: 1,
                                        expression: "optional"
                                    },
                                    tileBorder: {
                                        type: "boolean",
                                        component: "switch",
                                        translation: "Render Tiles w/ Border",
                                        ref: "tileBorder",
                                        defaultValue: true,
                                        trueOption: {
                                            value: true,
                                            translation: "properties.on"
                                        },
                                        falseOption: {
                                            value: false,
                                            translation: "properties.off"
                                        }
                                    },
                                    tileOpacity: {
                                        ref: "tileOpacity",
                                        type: "number",
                                        component: "slider",
                                        labelText: "Tile Opacity",
                                        label: panelSliderLabel,
                                        defaultValue: 1,
                                        min: 0,
                                        max: 1,
                                        step: 0.02
                                    },
                                    showNumbers: {
                                        type: "boolean",
                                        component: "switch",
                                        translation: "Show Number in Tiles",
                                        ref: "showNumbers",
                                        defaultValue: false,
                                        trueOption: {
                                            value: true,
                                            translation: "properties.on"
                                        },
                                        falseOption: {
                                            value: false,
                                            translation: "properties.off"
                                        }
                                    },
                                    lassoSelection: {
                                        type: "boolean",
                                        component: "switch",
                                        translation: "Lasso Selection",
                                        ref: "lassoSelection",
                                        defaultValue: true,
                                        trueOption: {
                                            value: true,
                                            translation: "properties.on"
                                        },
                                        falseOption: {
                                            value: false,
                                            translation: "properties.off"
                                        }
                                    },
                                    showCondition: {
                                        ref: "showCondition",
                                        type: "integer",
                                        label: "Show Condition",
                                        defaultValue: 1,
                                        expression: "optional"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            support: {
                export: true
            },
            snapshot: {
                canTakeSnapshot: true
            },
            paint: function ($element, layout) { // prevent multiple paint() calls
                //console.log("Paint", (new Date()).getTime());
                //console.log(layout);
                // Call irregularUtils to page the data for > 10000 points
                pageExtensionData(this, $element, layout, heatMap, [qlik, d3, lasso], qlik.navigation.getMode() === "analysis" ? 10 : 1);

                function heatMap($element, layout, fullMatrix, _this, ref) {

                    //$element.html("");
                    $element.empty();
                    
                    var qlik = ref[0],
                        d3 = ref[1],
                        lasso = [2];
                    var app = qlik.currApp();

                    // get qMatrix data array
                    var qMatrix = fullMatrix; // layout.qHyperCube.qDataPages[0].qMatrix;


                    // create a new array that contains the dimension labels
                    var dimensionLabels = layout.qHyperCube.qDimensionInfo.map(function (d) {
                        return d.qFallbackTitle;
                    });

                    // create a new array that contains the measure labels
                    var measureLabels = layout.qHyperCube.qMeasureInfo.map(function (d) {
                        return d.qFallbackTitle;
                    });

                    var measureMin = 0,
                        measureMax = 0;
                    var measurePercentage = false;
                    if (measureLabels.length > 0 && layout.qHyperCube.qMeasureInfo.length > 0) {
                        measureMin = layout.qHyperCube.qMeasureInfo[0].qMin;
                        measureMax = layout.qHyperCube.qMeasureInfo[0].qMax;
                        if (layout.qHyperCube.qMeasureInfo[0].qNumFormat.qFmt &&
                            layout.qHyperCube.qMeasureInfo[0].qNumFormat.qFmt.indexOf("%") != -1) {
                            measurePercentage = true;
                        }
                    }

                    //console.log(layout.qHyperCube.qDimensionInfo);
                    //console.log(layout.qHyperCube);
                    var qDimensionType = layout.qHyperCube.qDimensionInfo.map(function (d) {
                        if (d.qGroupFieldDefs[0].toLowerCase().indexOf("valueloop") >= 0) {
                            return "N";
                        } else {
                            return d.qDimensionType;
                        }
                    });

                    var qDimSort = layout.qHyperCube.qDimensionInfo.map(function (d) {
                        return d.qSortIndicator;
                    });

                    var qDimTags = layout.qHyperCube.qDimensionInfo.map(function (d) {
                        return d.qTags.join();
                    });

                    // Create a new array for our extension with a row for each row in the qMatrix
                    var data = qMatrix.map(function (d) {
                        //console.log()
                            // for each element in the matrix, create a new object that has a property
                            // for the grouping dimension(s), and the metric(s)
                        if (d.length > 3) {
                            return {
                                "Dim1": d[0].qText,
                                "Dim2": d[1].qText,
                                "Dim1Num": d[0].qNum,
                                "Dim2Num": d[1].qNum,
                                "Element1": d[0].qElemNumber,
                                "Element2": d[1].qElemNumber,
                                "Metric1": d[2].qNum,
                                "Metric1Text": d[2].qText,
                                "Metric2": d[3].qNum,
                                "Metric2Text": d[3].qText
                            }
                        } else {
                            return {
                                "Dim1": d[0].qText,
                                "Dim2": d[1].qText,
                                "Dim1Num": d[0].qNum,
                                "Dim2Num": d[1].qNum,
                                "Element1": d[0].qElemNumber,
                                "Element2": d[1].qElemNumber,
                                "Metric1": d[2].qNum,
                                "Metric1Text": d[2].qText
                            }
                        }
                    });
                    //console.log(data);

                    var colorpalette = layout.ColorSchema.split(", "),
                        dim1LabelSize = layout.dim1LabelSize,
                        dim2LabelSize = layout.dim2LabelSize,
                        dim2LabelRotation = layout.dim2LabelRotation,
                        maxGridColums = layout.maxGridColums,
                        heightFactor = layout.heightFactor,
                        leastTiles = layout.leastTiles,
                        showCondition = layout.showCondition,
                        showLegend = layout.showLegend,
                        tileBorder = layout.tileBorder,
                        tileOpacity = layout.tileOpacity,
                        showNumbers = layout.showNumbers,
                        fixedScale = layout.fixedScale,
                        minScale = layout.minScale,
                        maxScale = layout.maxScale,
                        meanScale = layout.meanScale,
                        useMeanScale = layout.useMeanScale,
                        labelColor = layout.labelColor,
                        lassoSelection = layout.lassoSelection;

                    if (fixedScale) {
                        measureMin = minScale;
                        measureMax = maxScale;
                    }

                    // Chart object width
                    var width = $element.width(); // space left for scrollbar
                    // Chart object height
                    var height = $element.height();
                    // Chart object id
                    var id = "container_" + layout.qInfo.qId;

                    // Check to see if the chart element has already been created
                    if (document.getElementById(id)) {
                        // if it has been created, empty it's contents so we can redraw it
                        $("#" + id).empty();
                    } else {
                        // if it hasn't been created, create it with the appropriate id and size
                        $element.append($('<div />').attr({
                            "id": id
                        }).css({
                            height: height,
                            width: width,
                            overflow: 'auto'
                        }))
                    }

                    var viz2DimHeatmap = function (_this, app, id, data, qDimensionType, qDimSort, width, height, colorpalette, dimensionLabels,
                        measureLabels, measurePercentage, measureMin, measureMax, meanScale, useMeanScale, dim1LabelSize, dim2LabelSize, dim2LabelRotation,
                        maxGridColums, heightFactor, leastTiles, showCondition, showLegend, showNumbers, labelColor, tileBorder, tileOpacity, lassoSelection) {

                        //console.log(data);
                        var formatLegend = function (n) {
                            return n.toLocaleString();
                        }

                        var rollup_dim1 = d3.nest()
                            .key(function (d) {
                                return d.Dim1;
                            })
                            .rollup(function (leaves) {
                                return {
                                    element: leaves[0].Element1,
                                    count: leaves.length,
                                    num: leaves[0].Dim1Num
                                };
                            })
                            .entries(data);
                        var rollup_dim2 = d3.nest()
                            .key(function (d) {
                                return d.Dim2;
                            })
                            .rollup(function (leaves) {
                                return {
                                    element: leaves[0].Element2,
                                    count: leaves.length,
                                    num: leaves[0].Dim2Num
                                };
                            })
                            .entries(data);

                        var dim1Lookup = [];
                        if (leastTiles > 1 && rollup_dim2.length >= leastTiles) {
                            // Filter rows with too few tiles:	
                            rollup_dim1 = rollup_dim1.filter(function (e) {
                                return e.values.count >= leastTiles;
                            });
                            dim1Lookup = rollup_dim1.map(function (e) {
                                return e.key;
                            });
                            data = data.filter(function (e) {
                                return $.inArray(e.Dim1, dim1Lookup) != -1;
                            });
                        }

                        var gridSize = -1,
                            legendElementWidth = -1,
                            buckets = 9,
                            colors = colorpalette,
                            dots = "..",
                            smallSize = 15;

                        var dim1keys = [],
                            dim2keys = [],
                            dim1LabelsShort = [],
                            dim1Obj = [],
                            dim2Obj = [],
                            dim2LabelsShort = [],
                            dim1Elements = [],
                            dim2Elements = [];

                        dim2Obj = rollup_dim2.map(function (e) {
                            return {
                                "dim2key": e.key,
                                "dim2LabelShort": (dim2LabelRotation ? (e.key.length > dim2LabelSize ? e.key.substr(0, dim2LabelSize -2) + (dim2LabelSize > 0 ? dots : "") : e.key) : e.key.substr(-dim2LabelSize)),
                                "dim2Element": e.values.element,
                                "dim2Num": e.values.num
                            };
                        });

                        //console.log("qDimensionType", qDimensionType);

                        // Sorting Dim2
                        if (qDimensionType[1] == "N" || qDimensionType[1] == "T" || qDimTags[1].indexOf("$numeric") >= 0) {
                            // Numeric or Timestamp
                            if (qDimSort[1] == "A") {
                                dim2Obj.sort(function (o1, o2) {
                                    return o1.dim2Num - o2.dim2Num;
                                });
                            } else {
                                dim2Obj.sort(function (o1, o2) {
                                    return o2.dim2Num - o1.dim2Num;
                                });
                            }
                        } else {
                            // Alphabetic
                            if (qDimSort[1] == "A") {
                                dim2Obj.sort(function (a, b) {
                                    var x = a.dim2key.toLowerCase(),
                                        y = b.dim2key.toLowerCase();
                                    return x < y ? -1 : x > y ? 1 : 0;
                                });
                            } else {
                                dim2Obj.sort(function (a, b) {
                                    var y = a.dim2key.toLowerCase(),
                                        x = b.dim2key.toLowerCase();
                                    return x < y ? -1 : x > y ? 1 : 0;
                                });
                            }
                        }
                        //console.log(dim2Obj);
                        dim2keys = dim2Obj.map(function (e) {
                            return e.dim2key;
                        });
                        dim2LabelsShort = dim2Obj.map(function (e) {
                            return e.dim2LabelShort;
                        });
                        dim2Elements = dim2Obj.map(function (e) {
                            return e.dim2Element;
                        });

                        var dim2RotationOffset = (dim2LabelRotation ? (dim2LabelSize * 5) : 0);
                        var marginLeft = function () {
                            return (dim1LabelSize * 7) + 10;
                        };
                        var margingRight = 10,
                            marginButton = 10;
                        var gridDivider = Math.max(maxGridColums * 1, dim2keys.length);

                        if (Math.floor((width - marginLeft() - margingRight) / gridDivider) < smallSize) {
                            dim1LabelSize = Math.min(3, dim1LabelSize);
                            dots = ".";
                        }

                        dim1Obj = rollup_dim1.map(function (e) {
                            return {
                                "dim1key": e.key,
                                "dim1LabelShort": e.key.length > dim1LabelSize ? e.key.substr(0, dim1LabelSize -2) + (dim1LabelSize > 0 ? dots : "") : e.key,
                                "dim1Element": e.values.element
                            };
                        });
                        dim1keys = dim1Obj.map(function (e) {
                            return e.dim1key;
                        });
                        dim1LabelsShort = dim1Obj.map(function (e) {
                            return e.dim1LabelShort;
                        });
                        dim1Elements = dim1Obj.map(function (e) {
                            return e.dim1Element;
                        });
                        var margin = {
                            top: 0,
                            right: margingRight,
                            bottom: marginButton,
                            left: marginLeft()
                        };
                        width = Math.max(150, width - 20); // space for scrollbar

                        var scaleDomain = [measureMin, measureMax];
//                        if (useMeanScale && data.length > 1) {
                        if (useMeanScale) {
                            if (fixedScale) {                          
                                if (meanScale == 0) {
                                    if (measureMin < 0 && measureMax > 0) {
                                        scaleDomain = [measureMin, 0, measureMax];
                                    }
                                } else {
                                    scaleDomain = [measureMin, meanScale, measureMax];
                                }
                            } else {
                                scaleDomain = [measureMin, d3.mean(data, function (d) {
                                    return +d.Metric1
                                }), measureMax];
                            }
                        }

                        var colorScale = d3.scale.quantile()
                            .domain(scaleDomain)
                            .range(colors);

                        gridSize = Math.floor((width - margin.left - margin.right) / gridDivider);
                        legendElementWidth = Math.floor((gridSize * gridDivider) / (colorScale.quantiles().length + 1));

                        if (gridSize < smallSize && dim2LabelRotation) {
                            dim2RotationOffset = (dim2LabelSize * 2);
                        }
                        margin.top = (showLegend ? 50 : 20) + dim2RotationOffset;

                        $("#" + id).css('cursor', 'default');

                        var svg = d3.select("#" + id).append("svg:svg")
                            .attr("width", width)
                            .attr("height", (showLegend ? 50 : 20) + dim2RotationOffset + (dim1keys.length * gridSize * heightFactor));

                        var svg_g = svg.append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                        // Adding lasso area
                        svg_g.append("rect")
                            .attr("width", dim2keys.length * gridSize)
                            .attr("height", dim1keys.length * gridSize * heightFactor)
                            .attr("class", "lassoable")
                            .style("opacity", 0);

                        var svg_g_lasso = svg_g.append("g");

                        // Lasso functions to execute while lassoing
                        var lasso_start = function () {
                            // keep mouse cursor arrow instead of text select (auto)
                            $("#" + id).css('cursor', 'default');

                            // clear all of the fills 
                            lasso.items()
                                .classed({
                                    "not-possible": true,
                                    "selected": false
                                }); // style as not possible
                        };

                        var lasso_draw = function () {
                            // Style the possible dots
                            lasso.items().filter(function (d) {
                                    return d.possible === true
                                })
                                .classed({
                                    "not-possible": false,
                                    "possible": true
                                });

                            // Style the not possible dot
                            lasso.items().filter(function (d) {
                                    return d.possible === false
                                })
                                .classed({
                                    "not-possible": true,
                                    "possible": false
                                });
                        };

                        var lasso_end = function (data) {
                            var selectedItems = lasso.items().filter(function (d) {
                                return d.selected === true
                            });
                            if (selectedItems[0].length > 0) {

                                // Set up an array to store the data points of selected tiles
                                var selectarray1 = [],
                                    selectarray2 = [];
                                for (var index = 0; index < selectedItems[0].length; index++) {
                                    if ($.inArray(selectedItems[0][index].__data__.Element1, selectarray1) === -1 && selectedItems[0][index].__data__.Element1 >= 0) {
                                        selectarray1.push(selectedItems[0][index].__data__.Element1);
                                    }
                                    if ($.inArray(selectedItems[0][index].__data__.Element2, selectarray2) === -1 && selectedItems[0][index].__data__.Element2 >= 0) {
                                        selectarray2.push(selectedItems[0][index].__data__.Element2);
                                    }
                                }
                                if (selectarray1.length > 0) _this.backendApi.selectValues(0, selectarray1, false);
                                if (selectarray2.length > 0) _this.backendApi.selectValues(1, selectarray2, false);
                            } else {
                                // switch tile classes back
                                lasso.items()
                                    .classed({
                                        "not-possible": false,
                                        "selected": false
                                    });

                                // select element (no lasso selection) since lasso blocks click event
                                var el = lasso.firstElement();
                                if (el) {
                                    el.dispatchEvent(new MouseEvent("click"));
                                }                            
                            }
                        };

                        var dim1Click = function (d, i) {};
                        var dim2Click = function (d, i) {};
                        var tileClick = function (d, i) {};
                        if (qlik.navigation.getMode() === "analysis") {
                            dim1Click = function (d, i) {
                                if (dim1Elements[i] >= 0)
                                    _this.backendApi.selectValues(0, [dim1Elements[i]], true);
                            };
                            dim2Click = function (d, i) {
                                if (dim2Elements[i] >= 0)
                                    _this.backendApi.selectValues(1, [dim2Elements[i]], true);
                            };
                            tileClick = function (d, i) {
                                if (dim1keys.length > 1 && d.Element1 >= 0) {
                                    _this.backendApi.selectValues(0, [d.Element1], false);
                                }
                                if (dim2keys.length > 1 && d.Element2 >= 0) {
                                    _this.backendApi.selectValues(1, [d.Element2], false);
                                }
                            };
                        }

                        var dim1Labels = svg_g.selectAll()
                            .data(dim1LabelsShort)
                            .enter().append("text")
                            .text(function (d) {
                                return d;
                            })
                            .attr("x", 0)
                            .attr("y", function (d, i) {
                                return i * gridSize * heightFactor;
                            })
                            .attr("dy", ".35em")
                            .style("text-anchor", "end")
                            .attr("transform", "translate(-6," + (gridSize * heightFactor/ 2) + ")")
                            .attr("class", function (d, i) {
                                return ("mono" + (gridSize * heightFactor < smallSize ? "-small" : "") + " axis-dim-a");
                            })
                            .style('fill', labelColor.color)
                            .on("click", dim1Click)
                            .on("mouseenter", function (d, i) {
                                d3.selectAll('[dim1="' + i + '"]')
                                    .attr("class", "borderedHover");
                            })
                            .on("mouseleave", function (d, i) {
                                d3.selectAll('[dim1="' + i + '"]')
                                    .attr("class", tileBorder ? "bordered" : "no-border");
                            })
                            .append("title").text(function (d, i) {
                                return dimensionLabels[0] + ": " + dim1keys[i]
                            });

                        if (dim2LabelRotation) {
                            var dim2Labels = svg_g.selectAll()
                                .data(dim2LabelsShort)
                                .enter().append("text")
                                .text(function (d) {
                                    return d;
                                })
                                .attr("x", 0)
                                .attr("y", function (d, i) {
                                    return i * gridSize;
                                })
                                .style("text-anchor", "left")
                                .attr("transform", "rotate(-90) translate(6, " + (4 + (gridSize / 2)) + ")")
                                .attr("class", function (d, i) {
                                    return ("mono" + (gridSize < smallSize ? "-small" : "") + " axis-dim-b");
                                })
                                .style('fill', labelColor.color)
                                .on("click", dim2Click)
                                .on("mouseenter", function (d, i) {
                                    d3.selectAll('[dim2="' + i + '"]')
                                        .attr("class", "borderedHover");
                                })
                                .on("mouseleave", function (d, i) {
                                    d3.selectAll('[dim2="' + i + '"]')
                                        .attr("class", tileBorder ? "bordered" : "no-border");
                                })
                                .append("title").text(function (d, i) {
                                    return dimensionLabels[1] + ": " + dim2keys[i]
                                });
                        } else {
                            var dim2Labels = svg_g.selectAll()
                                .data(dim2LabelsShort)
                                .enter().append("text")
                                .text(function (d) {
                                    return d;
                                })
                                .attr("x", function (d, i) {
                                    return i * gridSize;
                                })
                                .attr("y", 0)
                                .style("text-anchor", "middle")
                                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                                .attr("class", function (d, i) {
                                    return ("mono" + (gridSize < smallSize ? "-small" : "") + " axis-dim-b");
                                })
                                .style('fill', labelColor.color)
                                .on("click", dim2Click)
                                .on("mouseenter", function (d, i) {
                                    d3.selectAll('[dim2="' + i + '"]')
                                        .attr("class", "borderedHover");
                                })
                                .on("mouseleave", function (d, i) {
                                    d3.selectAll('[dim2="' + i + '"]')
                                        .attr("class", tileBorder ? "bordered" : "no-border");
                                })
                                .append("title").text(function (d, i) {
                                    return dimensionLabels[1] + ": " + dim2keys[i]
                                });
                        }
                        if (showCondition == 0) {
                            if (qlik.Promise) {
                                return qlik.Promise.resolve();
                            } else {
                                return;
                            }
                        }

                        var titleText = function (d) {
                            return dimensionLabels[0] + ": " + d.Dim1 + "\n" +
                                dimensionLabels[1] + ": " + d.Dim2 + "\n" +
                                measureLabels[0] + ": " + d.Metric1Text +
                                (d.hasOwnProperty('Metric2') ? "\n" + measureLabels[1] + ": " + d.Metric2Text : "");
                        };

                         // all rectangles
                        var heat = svg_g_lasso.selectAll()
                            .data(data)
                            .enter()
                            .append("rect")
                            //.attr("id", function(d) {  return id + "_" + d.Dim1 + "_" + d.Dim2; })  // use id_Dim1_Dim2 as Path ID
                            .attr("x", function (d) {
                                return $.inArray(d.Dim2, dim2keys) * gridSize;
                            })
                            .attr("dim2", function (d) {
                                return $.inArray(d.Dim2, dim2keys);
                            })
                            .attr("y", function (d) {
                                return $.inArray(d.Dim1, dim1keys) * gridSize * heightFactor;
                            })
                            .attr("dim1", function (d) {
                                return $.inArray(d.Dim1, dim1keys);
                            })
                            .attr("rx", 0)
                            .attr("ry", 0)
                            .attr("class", tileBorder ? "bordered" : "no-border")
                            .attr("width", gridSize)
                            .attr("height", gridSize * heightFactor)
                            .attr("fill", function (d) {
                                return (data.length > 1 || fixedScale) ? (!isNaN(d.Metric1)) ? colorScale(d.Metric1) : 'rgba(255, 255, 255, 0)' : colors[0];
                            })
                            .style("opacity", tileOpacity)
                            .on("click", tileClick) 
                            .on("mouseenter", function (d) {
                                d3.select(this)
                                    .attr("class", "borderedHover");
                            })
                            .on("mouseleave", function (d) {
                                d3.select(this)
                                    .attr("class", tileBorder ? "bordered" : "no-border");
                            })
                            .append("title").text(titleText);

                        if (showNumbers) {
                            // texts inside rectangles
    
                            heat = svg_g_lasso.selectAll()
                                .data(data)
                                .enter()
                                .append("text")
                                .attr("x", function (d) {
                                    return ($.inArray(d.Dim2, dim2keys) * gridSize);
                                })
                                .attr("y", function (d) {
                                    return ($.inArray(d.Dim1, dim1keys) * gridSize * heightFactor) + gridSize * heightFactor / 2;
                                })
                                .attr("dy", ".35em")
                                .style("text-anchor", "middle")
                                .attr("transform", "translate(" + gridSize / 2 + ", 0)")
                                .attr("class", function (d, i) {
                                    return ("label" + (d3.hsl(data.length > 1 || fixedScale ? colorScale(d.Metric1) : colors[0]).brighter(1) == "#ffffff" || tileOpacity < 0.3 
                                        ? "-darker" : "-brighter") + ((gridSize < (d.Metric1Text.length * 7)) ? "-small" : ""));
                                })
                                .attr("pointer-events", "none")
                                .text(function (d) {
                                    return d.Metric1Text;
                                })
                                .append("title").text(titleText);
                        }

                        if (showLegend) {
                            var legend = svg_g.selectAll()
                                .data(data.length > 1 || fixedScale ? [measureMin].concat(colorScale.quantiles()) : [measureMin], function (d) {
                                    return d;
                                })
                                .enter().append("g")
                                .attr("class", "legend");

                            legend.append("rect")
                                .attr("x", function (d, i) {
                                    return legendElementWidth * i;
                                })
                                .attr("y", -(38 + dim2RotationOffset)) //height
                                .attr("width", legendElementWidth)
                                .attr("height", 8)
                                .style("fill", function (d, i) {
                                    return colors[i];
                                })
                                .style("opacity", tileOpacity)
                                .on("mouseenter", function (d, i) {
                                    d3.selectAll('[fill="' + colors[i] + '"]')
                                        .attr("class", "borderedHover");
                                })
                                .on("mouseleave", function (d, i) {
                                    d3.selectAll('[fill="' + colors[i] + '"]')
                                        .attr("class", tileBorder ? "bordered" : "no-border");
                                });
                            legend.append("text")
                                .attr("class", "mono" + (gridSize < smallSize ? "-small" : ""))
                                .text(function (d) {
                                    //console.log("Legend:", d);
                                    return (gridSize < smallSize ? "" : "≥ ") + (measurePercentage ? formatLegend(Math.round(d * 1000) / 10) + "%" : formatLegend(d > 1 ? Math.round(d) : d));
                                })
                                .style('fill', labelColor.color)
                                .attr("x", function (d, i) {
                                    return legendElementWidth * i;
                                })
                                .attr("y", -(40 + dim2RotationOffset)) // height + gridSize
                                .on("mouseenter", function (d, i) {
                                    d3.selectAll('[fill="' + colors[i] + '"]')
                                        .attr("class", "borderedHover");
                                })
                                .on("mouseleave", function (d, i) {
                                    d3.selectAll('[fill="' + colors[i] + '"]')
                                        .attr("class", tileBorder ? "bordered" : "no-border");
                                });

                        }

                        if (qlik.navigation.getMode() === "analysis" && lassoSelection) {
                            // Create the area where the lasso event can be triggered
                            var lasso_area = svg_g_lasso; //d3.select("#" + id).selectAll(".lassoable");
                            
                            //-----------------------------------------------------
                            // Define the lasso
                            var lasso = d3.lasso()
                                .closePathDistance(75) // max distance for the lasso loop to be closed
                                .closePathSelect(true) // can items be selected by closing the path?
                                .hoverSelect(true) // can items by selected by hovering over them?
                                .area(lasso_area) // area where the lasso can be started
                                .on("start", lasso_start) // lasso start function
                                .on("draw", lasso_draw) // lasso draw function
                                .on("end", lasso_end); // lasso end function		  
                            //-----------------------------------------------------		

                            // Init the lasso on the svg:g that contains the dots	
                            lasso.items(d3.select("#" + id).selectAll(tileBorder ? ".bordered" : ".no-border"));
                            svg_g_lasso.call(lasso);
                        }
                    };

                    viz2DimHeatmap(
                        _this,
                        app,
                        id,
                        data,
                        qDimensionType,
                        qDimSort,
                        width,
                        height,
                        colorpalette,
                        dimensionLabels,
                        measureLabels,
                        measurePercentage,
                        measureMin,
                        measureMax,
                        meanScale,
                        useMeanScale,
                        dim1LabelSize,
                        dim2LabelSize,
                        dim2LabelRotation,
                        maxGridColums,
                        heightFactor,
                        leastTiles,
                        showCondition,
                        showLegend,
                        showNumbers,
                        labelColor,
                        tileBorder,
                        tileOpacity,
                        lassoSelection
                    );
                }
            }
        }
    });