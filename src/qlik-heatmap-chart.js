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

const global = window;
const defined = global.requirejs && global.requirejs.defined;
const define = (global && global.define) || define;

import definition from './definition';
import paintSetup from './paint';
import './styles/qlik-heatmap-chart.css';

const dependencies = [
  'module',
  'qlik',
  'jquery'
].map(dependency => {
  const isDefined = defined(dependency) || dependency === 'module';
  if (isDefined) {
    return dependency;
  } else {
    if(dependency === 'qlik' && defined('js/qlik')) {
      return 'js/qlik';
    } else {
      return null;
    }
  }
});

define(dependencies, function (module, qlik, $) {
  'use strict';

  const paint = paintSetup({ $, qlik });

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
    data:{
      dimensions: {
        uses: "dimensions",
        min: 2,
        max: 2
      },
      measures: {
        uses: "measures",
        min: 1,
        max: 2
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
