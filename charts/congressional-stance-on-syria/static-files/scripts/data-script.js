var jqueryNoConflict = jQuery;

// choose either Live or Static
// Live is pulling from spreadsheet; Static is baked to JSON
var dataStatus = 'Static';

// begin main function
jqueryNoConflict(document).ready(function() {

    if (dataStatus === 'Live') {
        Tabletop.init({
            key: '0Aq8qwSArzKP9dHN0WDllWENuV0pMcWZwRHhmal9zOXc',
            callback: retriveData,
            parseNumbers: true,
            simpleSheet: false,
            debug: false
        });

    } else {
        retriveData('static-files/data/congressional_delegation_on_syria_handlebars.json');
    }

});

// grab data
function retriveData(dataSource) {
    if (dataStatus === 'Live') {
        var handlebarsData = {
            objects: dataSource.working_sheet.elements
        };
        processDataForTemplate(handlebarsData)
    } else {
        jqueryNoConflict.getJSON(dataSource, processDataForTemplate);
    }
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