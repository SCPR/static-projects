var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    retriveData();
});

// grab data
function retriveData() {
    var dataSource = 'static-files/data/congressional_delegation_on_syria_handlebars.json';
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

// when user submit button is clicked
function showTerms(){
    jqueryNoConflict('#content-article-terms').toggle(function(){
        jqueryNoConflict('#showmodule').text(
            jqueryNoConflict(this).is(':visible') ? "Hide This" : "Learn the Terms"
        );
    });
};
// end