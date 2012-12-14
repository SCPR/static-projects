var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    renderStaticTemplates();
});
// end

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
}
//end

// render templates to page
function renderStaticTemplates(){
    renderKpccHeaderTemplate();
    renderDataDetailsTemplate();
    renderDataVisualsTemplate();
    renderDataFooterTemplate();
    renderKpccFooterTemplate();
};
// end

// prepare templates for page
function renderKpccHeaderTemplate(){
    getTemplateAjax('static-files/templates/kpcc-header.handlebars', function(template) {
        jqueryNoConflict('#kpcc-header').html(template());
    })
};

function renderDataDetailsTemplate(){
    getTemplateAjax('static-files/templates/data-details.handlebars', function(template) {
        jqueryNoConflict('#data-details').html(template());
    })
};

function renderDataVisualsTemplate(){
    getTemplateAjax('static-files/templates/data-visuals.handlebars', function(template) {
        jqueryNoConflict('#data-visuals').html(template());
    })
};

function renderDataFooterTemplate(){
    getTemplateAjax('static-files/templates/data-footer.handlebars', function(template) {
        jqueryNoConflict('#data-footer').html(template());
    })
};

function renderKpccFooterTemplate(){
    getTemplateAjax('static-files/templates/kpcc-footer.handlebars', function(template) {
        jqueryNoConflict('#kpcc-footer').html(template());
    })
};