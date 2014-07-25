var jqueryNoConflict = jQuery;
var proxyPrefix = 'http://projects.scpr.org/static/static-files/templates/';

// begin main function
jqueryNoConflict(document).ready(function() {
    renderStaticTemplates();
});

// render all the templates
function renderStaticTemplates(){
    renderHandlebarsTemplate(proxyPrefix + 'kpcc-header.handlebars', '#kpcc-header');
    renderHandlebarsTemplate('static-files/templates/data-details.handlebars', '#data-details');
    renderHandlebarsTemplate('static-files/templates/data-footer.handlebars', '#data-footer');
    renderHandlebarsTemplate(proxyPrefix + 'kpcc-footer.handlebars', '#kpcc-footer');
};
// end