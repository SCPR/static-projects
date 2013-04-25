var jqueryNoConflict = jQuery;

// make sure the spreadsheet is published to the web
var dataSpreadsheet = '0An8W63YKWOsxdC1DbjM0MVFUelFXcUFCY2xZWGtSZGc';

// the sheet being queried
var dataSheet = 'Presentation_inventory';

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
        objects: data.Presentation_inventory.elements
    };
    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', handlebarsData);
};
// end