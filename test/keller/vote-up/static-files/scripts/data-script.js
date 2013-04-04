var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    retriveData();
});

// grab data
function retriveData() {
    var dataSource = 'static-files/data/flat_data.json';
    jqueryNoConflict.getJSON(dataSource, renderContentDisplayTemplate);
};

function renderContentDisplayTemplate(data){
    handlebarsDebugHelper();
    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', data);
    renderContentVotingTemplate();
};