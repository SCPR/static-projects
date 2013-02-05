var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    retrieveKpccData();
    retrieveLatimesData();
});

// grab kpcc archived article data
function retrieveKpccData(data){
    var dataSource = 'http://www.scpr.org/api/content/?types=segmentsORnewsORentries&query=mahony&limit=20';
    jqueryNoConflict.getJSON(dataSource, renderKpccTemplate);
};

// render kpcc archived article template
function renderKpccTemplate(data){
    var kpccArticles = {
        'objects': data
        };
    renderHandlebarsTemplate('static-files/templates/kpcc-articles.handlebars', '#kpcc-articles', kpccArticles);
};

// grab la times flat file article data
function retrieveLatimesData(laTimesData){
    var dataSource = 'static-files/data/latimes-articles.json';
    jqueryNoConflict.getJSON(dataSource, renderLaTimesTemplate);
};

// render la times flat file article data
function renderLaTimesTemplate(laTimesData){
    renderHandlebarsTemplate('static-files/templates/latimes-articles.handlebars', '#latimes-articles', laTimesData);
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

// function to compile handlebars template
function renderHandlebarsTemplate(withTemplate,inElement,withData){
    getTemplateAjax(withTemplate, function(template) {
        handlebarsFormatDateForDisplay();
        jqueryNoConflict(inElement).html(template(withData));
    })
};

// begin dateFormatFunction
function handlebarsFormatDateForDisplay(){
    Handlebars.registerHelper('dateFormat', function(context, block) {
        if (window.moment) {
            return takeTime(context);
        }else{
            return context;
        };
    });
};

// format date/time
function takeTime(dateInput) {
    var dateFormat = 'MMMM Do, YYYY';
    var dateOutput = moment(dateInput).format(dateFormat);
    return dateOutput;
};