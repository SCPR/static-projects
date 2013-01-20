var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    renderStaticTemplates();
});

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

// render handlebars template function
function renderHandlebarsTemplate(withTemplate,inElement,withData){
    getTemplateAjax(withTemplate, function(template) {
        jqueryNoConflict(inElement).html(template(withData));
    })
};

// render all the templates
function renderStaticTemplates(){
    renderHandlebarsTemplate('static-files/templates/kpcc-header.handlebars', '#kpcc-header');
    renderHandlebarsTemplate('static-files/templates/kpcc-pencil-ad.handlebars', '#kpcc-pencil-ad');
    renderHandlebarsTemplate('static-files/templates/data-details.handlebars', '#data-details');
    renderHandlebarsTemplate('static-files/templates/content-explainer.handlebars', '#content-explainer');
    renderHandlebarsTemplate('static-files/templates/content-action-bar.handlebars', '#content-action-bar');
    //renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals');
    renderHandlebarsTemplate('static-files/templates/data-footer.handlebars', '#data-footer');
    renderHandlebarsTemplate('static-files/templates/kpcc-footer.handlebars', '#kpcc-footer');
};