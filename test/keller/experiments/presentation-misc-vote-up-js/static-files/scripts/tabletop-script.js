var jqueryNoConflict = jQuery;

// make sure the spreadsheet is published to the web
var dataSpreadsheet = '0Aq8qwSArzKP9dGZnZ093M3FzS1ZwcnFTMDZ6X2cwZnc';

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
        objects: data.form_data.elements
    };

    console.log(handlebarsData);

    //handlebarsDebugHelper();
    //renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', handlebarsData);

};
// end