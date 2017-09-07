var jqueryNoConflict = jQuery;
var proxyPrefix = 'https://projects.scpr.org/static-files/templates/';

// begin main function
jqueryNoConflict(document).ready(function() {

    renderHandlebarsTemplate(proxyPrefix + 'kpcc-header.handlebars', '#kpcc-header');
    renderHandlebarsTemplate(proxyPrefix + 'kpcc-footer.handlebars', '#kpcc-footer');
    renderHandlebarsTemplate('static-files/templates/data-share.handlebars', '#data-share');
    renderHandlebarsTemplate('static-files/templates/data-details.handlebars', '#data-details');

/*
    renderHandlebarsTemplate('static-files/templates/content-action-bar.handlebars', '#content-action-bar');
    renderHandlebarsTemplate('static-files/templates/content-display.handlebars', '#content-display');
*/

    renderHandlebarsTemplate('static-files/templates/content-explainer.handlebars', '#content-explainer');
    renderHandlebarsTemplate('static-files/templates/data-footer.handlebars', '#data-footer');

});
