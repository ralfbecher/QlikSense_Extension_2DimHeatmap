function setupPageExtensionData ({ $ }) {
  function flattenPages(data) { // function to flatten out the paginated qHyperCube data into one large qMatrix
    var flat = [];
    $.each(data, function () {
      $.each(this.qMatrix, function () {
        flat.push(this);
      });
    });
    return flat;
  }

  // (this, extension DOM element, layout object from Sense, your callback)
  return function pageExtensionData(me, $el, layout, callback, maxDataPages) {
    maxDataPages = maxDataPages || 2;
    var lastrow = 0;
    //get number of columns
    var colNums = layout.qHyperCube.qSize.qcx;
    //calculate how many rows to page. currently, you can't ask for more than 10,000 cells at a time,
    //so the number of rows needs to be 10,000 divided by number of columns
    var calcHeight = Math.floor(10000 / colNums);

    //loop through the rows we have and render
    me.backendApi.eachDataRow(function (rownum) {
      //simply by looping through each page, the qHyperCube is updated and will not have more than one page
      lastrow = rownum;
    });

    // if we're not at the last row...
    if (me.backendApi.getRowCount() > lastrow + 1 && layout.qHyperCube.qDataPages.length < maxDataPages) {
      //we havent got all the rows yet, so get some more.  we first create a new page request
      var requestPage = [{
        qTop: lastrow + 1,
        qLeft: 0,
        qWidth: colNums,
        //should be # of columns
        qHeight: Math.min(calcHeight, me.backendApi.getRowCount() - lastrow)
      }];
      me.backendApi.getData(requestPage).then(function () {
        //when we get the result run the function again
        pageExtensionData(me, $el, layout, callback, maxDataPages);
      });
    } else { //if we are at the last row...
      var bigMatrix = [];
      //use flattenPages function to create large master qMatrix
      bigMatrix = flattenPages(layout.qHyperCube.qDataPages.slice(0, maxDataPages));
      //fire off the callback function
      callback($el, layout, bigMatrix, me);
      //(DOM element, layout object, new flattened matrix, this)
    }
  };
}

export default setupPageExtensionData;
