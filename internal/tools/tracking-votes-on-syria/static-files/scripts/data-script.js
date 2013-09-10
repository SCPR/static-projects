var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    Tabletop.init({
        key: '0Aq8qwSArzKP9dHN0WDllWENuV0pMcWZwRHhmal9zOXc',
        callback: retriveData,
        parseNumbers: true,
        simpleSheet: true,
        debug: false
    });
});
// end

// display data on template
function retriveData(data, tabletop) {
    var handlebarsData = {
        objects: data
    };
    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#table-display-data', handlebarsData);
};
// end