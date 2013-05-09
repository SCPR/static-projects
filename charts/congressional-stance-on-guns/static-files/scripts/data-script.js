var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    retriveData();
});

// grab data
function retriveData() {
    var dataSource = 'static-files/data/ca_congressional_delegation-handlebars.json';
    jqueryNoConflict.getJSON(dataSource, renderDataVisualsTemplate);
};

// render data visuals template
function renderDataVisualsTemplate(data){
    renderHandlebarsTemplate('static-files/templates/content-action-bar.handlebars', '#content-action-bar', data);
    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', data);
};

// scroll into view function
function scrollToRep(){
    var congressionalMember = jqueryNoConflict('#search-congressional-delegation').val();
    jqueryNoConflict.scrollTo(congressionalMember)
};