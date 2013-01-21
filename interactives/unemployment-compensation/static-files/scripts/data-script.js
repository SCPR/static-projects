var jqueryNoConflict = jQuery;

//begin main function
jqueryNoConflict(document).ready(function(){
    retriveData();
});
//end main function

// grab data
function retriveData() {
    var dataSource = 'static-files/data/working-data-file.json';
    jqueryNoConflict.getJSON(dataSource, processDataFrom);
};

// display page template
function processDataFrom(data){
    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', data);
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

// render handlebars template function
function renderHandlebarsTemplate(withTemplate,inElement,withData){
    getTemplateAjax(withTemplate, function(template) {
        jqueryNoConflict(inElement).html(template(withData));
    })
};

// embed function
function embedBox() {
    var embed_url = '#/iframe.html';

    jAlert('<strong>To embed this on your blog or site, just copy this code:<br></strong>&lt;iframe src=\"'+ embed_url +'\" width=\"420px\" height=\"450px\" scrolling=\"no\" frameborder=\"0\"&gt;&lt;/iframe>', 'Share or Embed');
};