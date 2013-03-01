var jqueryNoConflict = jQuery;
var proxyPrefix = 'http://projects.scpr.org/static/static-files/templates/';

// begin main function
jqueryNoConflict(document).ready(function() {
    renderStaticTemplates();
});
// end

// embed function
function embedBox() {
    var embed_url = 'http://projects.scpr.org/static/timelines/sequestration-cuts/iframe.html';
    jAlert('<h4>Embed this on your site or blog</h4>' +
    '<span>Copy the code below and paste to source of your page: <br /><br /> &lt;iframe src=\"'+ embed_url +'\" width=\"620px\" height=\"820px\" style=\"margin: 0 auto;\" scrolling=\"yes\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};

// render handlebars templates via ajax
function getTemplateAjax(path, callback) {
    var source, template;
    jqueryNoConflict.ajax({
        url: path,
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);
            if (callback) callback(template);
        }
    });
};
//end

// function to compile handlebars template
function renderHandlebarsTemplate(withTemplate,inElement,withData){
    getTemplateAjax(withTemplate, function(template) {
        jqueryNoConflict(inElement).html(template(withData));
    })
};

// render all the templates
function renderStaticTemplates(){
    //renderHandlebarsTemplate(proxyPrefix + 'kpcc-header.handlebars', '#kpcc-header');
    //renderHandlebarsTemplate(proxyPrefix + 'kpcc-footer.handlebars', '#kpcc-footer');

    renderHandlebarsTemplate('static-files/templates/kpcc-header.handlebars', '#kpcc-header');
    renderHandlebarsTemplate('static-files/templates/kpcc-footer.handlebars', '#kpcc-footer');
    renderHandlebarsTemplate('static-files/templates/data-share.handlebars', '#data-share');
    renderHandlebarsTemplate('static-files/templates/data-details.handlebars', '#data-details');
    renderHandlebarsTemplate('static-files/templates/data-footer.handlebars', '#data-footer');
};
// end