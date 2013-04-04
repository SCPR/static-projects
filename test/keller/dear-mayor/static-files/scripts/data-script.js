var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    retriveData();
});

// grab data
function retriveData() {
    var dataSource = 'https://www.publicinsightnetwork.org/air2/public/search?a=6f4d503616e1115157a64bd26b51aec7&q=query_uuid:5bf1fe369f0e&t=JSON';
    jqueryNoConflict.getJSON(dataSource, renderDataVisualsTemplate);
};

// render data visuals template
function renderDataVisualsTemplate(data){

    var dataDetailsData = {
        objects: data.results
    };

    renderHandlebarsTemplate('static-files/templates/data-details.handlebars', '#data-details', dataDetailsData);

    var dataVisualsData = {
        objects: data.results
    };

    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', dataVisualsData);
};