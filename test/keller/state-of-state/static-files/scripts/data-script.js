var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    retriveWordCloud();
    retriveData();
});




// grab data from flat file
function retriveWordCloud() {
    var dataSource = 'static-files/data/word_frequency.json';
    jqueryNoConflict.getJSON(dataSource, renderWordCloudTemplate);
};



// render compiled handlebars template
function renderWordCloudTemplate(data){
    renderHandlebarsTemplate('static-files/templates/wordcloud-display.handlebars', '#htmltagcloud', data);
};











// grab data from flat file
function retriveData() {
    var dataSource = 'static-files/data/flat_data.json';
    jqueryNoConflict.getJSON(dataSource, processData);
};

// register this as a handlebars helper!!!!
// retrieve value from anchor that is clicked
function processData(data){
    var selected = data.objects;

    jqueryNoConflict('#htmltagcloud a').live('click', function() {
        var topicVariable = this.name;
        var selectedObjects = [];

        // begins loop
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].topic === topicVariable) {
                var queriedDataObject = {
                    topic: selected[i].topic,
                    instance: selected[i].instance,
                    text: selected[i].text
                };
                selectedObjects.push(queriedDataObject);
            }
            // close if statement

        }
        // close for loop

       var dataForHandlebars = {
            objects: selectedObjects
        };

    renderHandlebarsTemplate('static-files/templates/content-display.handlebars', '#content-display', dataForHandlebars);

    });
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

// add handlebars debugger
function handlebarsDebugHelper(){
    Handlebars.registerHelper("debug", function(optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);
    });
};

// embed function
function embedBox() {
    var embed_url = 'http://projects.scpr.org/static/maps/flu-clinics/iframe.html';

    jAlert('<strong>To embed this visualization your blog or site, just copy this code:<br></strong>&lt;iframe src=\"'+ embed_url +'\" width=\"540px\" height=\"600px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};