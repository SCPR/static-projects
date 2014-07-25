//
//  DataGridRenderer.js
//  Part of Mr-Data-Converter
//
//  Created by Shan Carter on 2010-10-18.
//


var DataGridRenderer = {
  //---------------------------------------
  // HTML Table
  //---------------------------------------

    html: function(
            dataGrid, headerNames, headerTypes, indent, newLine, id) {
    //inits...
    var commentLine = "<!--";
    var commentLineEnd = "-->";
    var outputText = "";
    var numRows = dataGrid.length;
    var numColumns = headerNames.length;

    //begin render loop
    //outputText += "<style type=\"text/css\">" + newLine;
    //outputText += "table.kpcc-table {font-family: \"proxima-nova\", \"helvetica neue\", helvetica, arial, sans-serif;}" + newLine;
    //outputText += "table.kpcc-table th, table.kpcc-table td {padding: 10px 10px 9px; line-height: 15.75px; text-align: left; vertical-align: middle; border-bottom: 1px solid #ddd; font-size: 15px; font-weight: 700; line-height: 20px; margin-top: 10px; margin-bottom: 10px;}" + newLine;
    //outputText += "table.kpcc-table th.kpcc-name {color: #B24401; text-transform: uppercase;}" + newLine;
    //outputText += "</style>" + newLine;
    outputText += "<table class=\"kpcc-table\">" + newLine;
    outputText += indent + "<thead>" + newLine;
    outputText += indent + indent + "<tr>" + newLine;

    for (var j = 0; j < numColumns; j++) {
        outputText += indent + indent + indent + '<th>';
        //outputText += indent + indent + indent + '<th class="kpcc-name ' + headerNames[j] + '-cell">';
        outputText += headerNames[j];
        outputText += '</th>' + newLine;
    };
    outputText += indent + indent + "</tr>" + newLine;
    outputText += indent + "</thead>" + newLine;
    outputText += indent + "<tbody>" + newLine;
    for (var i = 0; i < numRows; i++) {
        var row = dataGrid[i];
        var classes = [];
        if (i === numRows-1) {
            classes.push("lastRow");
        } else if (i === 0){
            classes.push("firstRow");
        }
        if (i % 2) {
            classes.push("even");
        } else {
            classes.push("odd");
        }
        var rowClassName = " class=\"";
        var classesLength = classes.length;
        for (j in classes) {
            rowClassName += classes[j];
            if (j == 0 && classesLength > 1) {
                rowClassName += " ";
            }
        }
        rowClassName += "\"";
        //outputText += indent + indent + "<tr" + rowClassName + ">" + newLine;
        outputText += indent + indent + "<tr>" + newLine;
        for (var j = 0; j < numColumns; j++) {
            //outputText += indent + indent + indent + '<td class="kpcc-value ' + headerNames[j] + '-cell">';
            outputText += indent + indent + indent + '<td>';
            outputText += row[j];
            outputText += '</td>' + newLine;
        };
        outputText += indent + indent + "</tr>" + newLine;
    };
    outputText += indent + "</tbody>" + newLine;
    outputText += "</table>";

    return outputText;
    },


}
