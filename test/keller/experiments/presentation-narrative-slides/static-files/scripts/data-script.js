var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    retriveData();
});

// grab data
function retriveData() {
    var dataSource = 'static-files/data/cdcr_suicide_data-handlebars.json';
    jqueryNoConflict.getJSON(dataSource, renderDataVisualsTemplate);
};

// render content display template
function renderDataVisualsTemplate(data){
    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', data);
};