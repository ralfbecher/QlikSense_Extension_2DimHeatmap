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
  "./definition",
  "./paint",
  "css!./styles/bi-irregular-2dim-heatmap.css",
], function (definition, paint) {
  'use strict';

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
    definition: definition,
    support: {
      export: true
    },
    snapshot: {
      canTakeSnapshot: true
    },
    paint: paint,
  };
});
