var jqueryNoConflict = jQuery;

// make sure the spreadsheet is published to the web
var dataSpreadsheet = '0An8W63YKWOsxdC1DbjM0MVFUelFXcUFCY2xZWGtSZGc';

// the sheet being queried
var dataSheet = 'Presentation_inventory';

// begin main function
jqueryNoConflict(document).ready(function(){
    Tabletop.init({
        key: dataSpreadsheet,
        callback: showInfo,
        simpleSheet: false,
        debug: true
    });
});
// end

// display page template
function showInfo(data, tabletop){

    var handlebarsData = {
        objects: data.Presentation_inventory.elements
    };

    renderDataDetailsTemplate(handlebarsData);
    renderDataVisualsTemplate(handlebarsData);

};
// end

// render handlebars templates via ajax
function getTemplateAjax(path, callback) {
    var source, template;
    jqueryNoConflict.ajax({
        url: path,
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);
            if (callback) callback(template);
        }
    });
}
//end

// add handlebars debugger
function handlebarsDebugHelper(){
    Handlebars.registerHelper("debug", function(optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);
    });
};
// end

// create projects content template
function renderDataDetailsTemplate(data){
    getTemplateAjax('static-files/templates/data-details.handlebars', function(template) {
        handlebarsDebugHelper();
        jqueryNoConflict('#data-details').html(template(data));
    })
};

// create projects content template
function renderDataVisualsTemplate(data){
    getTemplateAjax('static-files/templates/data-visuals.handlebars', function(template) {
        handlebarsDebugHelper();
        jqueryNoConflict('#data-visuals').html(template(data));
    })
};