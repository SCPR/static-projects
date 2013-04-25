var jqueryNoConflict = jQuery;
var proxyPrefix = 'http://projects.scpr.org/static/static-files/templates/';

// begin main function
jqueryNoConflict(document).ready(function() {
    renderStaticTemplates();
    handlebarsLooperHelper();
});

// render all the templates
function renderStaticTemplates(){
    renderHandlebarsTemplate(proxyPrefix + 'kpcc-header.handlebars', '#kpcc-header');
    renderHandlebarsTemplate(proxyPrefix + 'kpcc-footer.handlebars', '#kpcc-footer');
    renderHandlebarsTemplate('static-files/templates/data-share.handlebars', '#data-share');
    renderHandlebarsTemplate('static-files/templates/data-details.handlebars', '#data-details');
    renderHandlebarsTemplate('static-files/templates/data-footer.handlebars', '#data-footer');
};
// end

// handlebars help function to set every nth element
function handlebarsLooperHelper(){
    Handlebars.registerHelper('everyNth', function(context, every, options) {
        var fn = options.fn, inverse = options.inverse;
        var ret = "";
        if(context && context.length > 0) {
            for(var i=0, j=context.length; i<j; i++) {
                var modZero = i % every === 0;
                ret = ret + fn(_.extend({}, context[i], {
                    isModZero: modZero,
                    isModZeroNotFirst: modZero && i > 0,
                    isLast: i === context.length - 1
                }));
            }
        } else {
            ret = inverse(this);
        }
        return ret;
    });
};