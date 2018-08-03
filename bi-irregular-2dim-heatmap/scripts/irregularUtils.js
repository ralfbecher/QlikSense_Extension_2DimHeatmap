function dateFromQlikNumber(n) {
    // return: Date from QlikView number
    var d = new Date((n - 25569) * 86400 * 1000);
    // since date was created in UTC shift it to the local timezone
    d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
    return d;
}

function qlikNumberFromDate(d) {
    return d.getTime() / 86400000 + 25569;
}

function flattenPages(data) { // function to flatten out the paginated qHyperCube data into one large qMatrix
    var flat = [];
    $.each(data, function () {
        $.each(this.qMatrix, function () {
            flat.push(this);
        });
    });
    return flat;
}

function pageExtensionData(me, $el, layout, callback, ref, maxDataPages) { //(this, extension DOM element, layout object from Sense, your callback)
    console.log("maxDataPages:" + maxDataPages);
    maxDataPages = maxDataPages || 2;
    var lastrow = 0
        //get number of columns
    var colNums = layout.qHyperCube.qSize.qcx;
    //calculate how many rows to page. currently, you can't ask for more than 10,000 cells at a time, so the number of rows
    //needs to be 10,000 divided by number of columns
    console.log(layout.qHyperCube.qSize.qcy);
    var calcHeight = Math.floor(10000 / colNums);
    //loop through the rows we have and render

    me.backendApi.eachDataRow(function (rownum, row) {
        //simply by looping through each page, the qHyperCube is updated and will not have more than one page
        lastrow = rownum;
    });

    if (me.backendApi.getRowCount() > lastrow + 1 && layout.qHyperCube.qDataPages.length < maxDataPages) { //if we're not at the last row...
        //we havent got all the rows yet, so get some more.  we first create a new page request
        var requestPage = [{
            qTop: lastrow + 1,
            qLeft: 0,
            qWidth: colNums,
            //should be # of columns
            qHeight: Math.min(calcHeight, me.backendApi.getRowCount() - lastrow)
        }];
        console.log("requestPage", requestPage);
        me.backendApi.getData(requestPage).then(function (dataPages) {
            //when we get the result run the function again
            //console.log("dataPages", dataPages);
            pageExtensionData(me, $el, layout, callback, ref, maxDataPages);
        });
    } else { //if we are at the last row...
        var bigMatrix = [];
        //use flattenPages function to create large master qMatrix
        bigMatrix = flattenPages(layout.qHyperCube.qDataPages.slice(0, maxDataPages));
        //console.log("maxDataPages", maxDataPages);
        //console.log("bigMatrix", bigMatrix);
        //fire off the callback function
        callback($el, layout, bigMatrix, me, ref);
        //(DOM element, layout object, new flattened matrix, this)
    }
}

function toLocalFixedUnPadded(n, d) {
    return n.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: d
    });
}

function toLocalFixed(n, d) {
    return n.toLocaleString(undefined, {
        minimumFractionDigits: d,
        maximumFractionDigits: d
    });
}

function dataToString(data) {
    if (data.length > 0) {
        var datastr = "data:text/csv;charset=utf-8,";
        var noCols = data[0].length;
        var noRows = data.length;
        var encDelimiter = encodeURIComponent("\t");
        var encNewline = encodeURIComponent("\r\n");

        for (var c = 0; c < noCols; c++) {
            datastr += encodeURIComponent(data[0][c]);
            if (c < noCols - 1) {
                datastr += encDelimiter;
            } else {
                datastr += encNewline;
            }
        }
        for (var r = 1, noRows; r < noRows; r++) {
            for (var c = 0; c < noCols; c++) {
                datastr += encodeURIComponent(data[r][c]);
                if (c < noCols - 1) {
                    datastr += encDelimiter;
                } else {
                    datastr += encNewline;
                }
            }
        }
        console.log(datastr);
    };
    return datastr;
}

function arrayToTable(data, cssClass, width, align) {
    var table = $('<table />').attr({
            "class": cssClass
        }).css({
            "width": width
        }),
        rows = [],
        row,
        i,
        j;

    for (i = 0; i < data.length; i = i + 1) {
        row = $('<tr />');
        for (j = 0; j < data[i].length; j = j + 1) {
            if (i === 0) {
                row.append($('<th />').css("text-align", align[j]).html(data[i][j]));
            } else {
                row.append($('<td />').attr("align", align[j]).html(data[i][j]));
            }
        }
        rows.push(row);
    }

    thead = rows.shift();
    thead = $('<thead />').append(thead);
    table.append(thead);

    for (i = 0; i < rows.length; i = i + 1) {
        table.append(rows[i]);
    }

    return table;
}