/* 
irregularUtils.js

Created by Ralf Becher - ralf.becher@web.de - (c) 2016 irregular.bi, Leipzig, Germany
Tested on Qlik Sense 2.2.4

irregular.bi takes no responsibility for any code.
Use at your own risk. */
function isEditMode(b){return b.$scope.$parent.$parent.editmode}function flattenPages(b){var a=[];$.each(b,function(){$.each(this.qMatrix,function(){a.push(this)})});return a}
function pageExtensionData(b,a,e,h,g,d){console.log("maxDataPages:"+d);d=d||2;var c=0,f=e.qHyperCube.qSize.qcx;console.log(e.qHyperCube.qSize.qcy);var k=Math.floor(1E4/f);b.backendApi.eachDataRow(function(a,b){c=a});b.backendApi.getRowCount()>c+1&&e.qHyperCube.qDataPages.length<d?(f=[{qTop:c+1,qLeft:0,qWidth:f,qHeight:Math.min(k,b.backendApi.getRowCount()-c)}],console.log("requestPage",f),b.backendApi.getData(f).then(function(c){pageExtensionData(b,a,e,h,g,d)})):(f=[],f=flattenPages(e.qHyperCube.qDataPages.slice(0,
d)),h(a,e,f,b,g))}function toLocalFixedUnPadded(b,a){return b.toLocaleString(void 0,{minimumFractionDigits:0,maximumFractionDigits:a})}function toLocalFixed(b,a){return b.toLocaleString(void 0,{minimumFractionDigits:a,maximumFractionDigits:a})}
function dataToString(b){if(0<b.length){for(var a="data:text/csv;charset=utf-8,",e=b[0].length,h=b.length,g=encodeURIComponent("\t"),d=encodeURIComponent("\r\n"),c=0;c<e;c++)a+=encodeURIComponent(b[0][c]),a=c<e-1?a+g:a+d;for(var f=1;f<h;f++)for(c=0;c<e;c++)a+=encodeURIComponent(b[f][c]),a=c<e-1?a+g:a+d;console.log(a)}return a}
function arrayToTable(b,a,e,h){a=$("<table />").attr({"class":a}).css({width:e});e=[];var g,d,c;for(d=0;d<b.length;d+=1){g=$("<tr />");for(c=0;c<b[d].length;c+=1)0===d?g.append($("<th />").css("text-align",h[c]).html(b[d][c])):g.append($("<td />").attr("align",h[c]).html(b[d][c]));e.push(g)}thead=e.shift();thead=$("<thead />").append(thead);a.append(thead);for(d=0;d<e.length;d+=1)a.append(e[d]);return a};