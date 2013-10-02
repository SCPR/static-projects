var jqueryNoConflict = jQuery;

// make sure the spreadsheet is published to the web
var dataSpreadsheet = '0Ark-PJD-Ze_DdGplNXRzVDFSVzVCVGsxdUVxLXRXdVE';

// the sheet being queried
var dataSheet = 'kids';

// begin main function
jqueryNoConflict(document).ready(function() {

    Tabletop.init({
        key: dataSpreadsheet,
        callback: retriveData,
        parseNumbers: true,
        simpleSheet: false,
        debug: false
    });

});
// end

// display data on template
function retriveData(data, tabletop) {

    var handlebarsData = {
        objects: data.kids.elements
    };

    handlebarsDebugHelper();
    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', handlebarsData);

};
// end