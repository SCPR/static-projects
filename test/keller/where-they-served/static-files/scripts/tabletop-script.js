var jqueryNoConflict = jQuery;

// make sure the spreadsheet is published to the web
var dataSpreadsheet = '0An8W63YKWOsxdE0tVmg0aTVweGtoTF9HSUV3UWRDOVE';

// the sheet being queried
var dataSheet = 'version_march_2013_form_submit';

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
        objects: data.version_march_2013_form_submit.elements
    };

    handlebarsDebugHelper();
    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', handlebarsData);

};
// end