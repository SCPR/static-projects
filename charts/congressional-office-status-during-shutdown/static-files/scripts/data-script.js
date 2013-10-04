var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    retriveData();
});

// grab data
function retriveData() {
    var dataSource = 'static-files/data/socal_congress_members_on_shutdown_handlebars.json';
    jqueryNoConflict.getJSON(dataSource, processDataForTemplate);
};

// render data visuals template
function processDataForTemplate(data){
    renderHandlebarsTemplate('static-files/templates/content-action-bar.handlebars', '#content-action-bar', data);
    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', data);
};

// scroll into view function
function scrollToRep(){
    var congressionalMember = jqueryNoConflict('#search-congressional-delegation').val();
    jqueryNoConflict.scrollTo(congressionalMember)
};
// end