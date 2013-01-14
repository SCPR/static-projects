var jqueryNoConflict = jQuery;

//begin main function
jqueryNoConflict(document).ready(function(){
    retriveData();
});
//end main function

// grab data
function retriveData() {
    var dataSource = 'static-files/data/la_mayors_filings_2012.json';
    jqueryNoConflict.getJSON(dataSource, renderDataVisualsTemplate);
};

// create projects content template
function renderDataVisualsTemplate(data){
    getTemplateAjax('static-files/templates/data-visuals.handlebars', function(template) {
        handlebarsDebugHelper();
        jqueryNoConflict('#data-visuals').html(template(data));
    })
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
}
//end

// add handlebars debugger
function handlebarsDebugHelper(){
    Handlebars.registerHelper("debug", function(optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);
    });
};
// end