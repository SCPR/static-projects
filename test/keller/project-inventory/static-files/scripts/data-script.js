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

// display page template
function showInfo(data, tabletop){

    var handlebarsData = {
        objects: data.Presentation_inventory.elements
    };

    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', handlebarsData);
};

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
};

// render handlebars template function
function renderHandlebarsTemplate(withTemplate,inElement,withData){
    getTemplateAjax(withTemplate, function(template) {
        jqueryNoConflict(inElement).html(template(withData));
    })
};