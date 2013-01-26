var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    retriveData('static-files/data/word_frequency.json', renderWordCloudTemplate)
    retriveData('static-files/data/word_context.json', processData)
});

// render compiled handlebars template
function renderWordCloudTemplate(data){
    renderHandlebarsTemplate('static-files/templates/wordcloud-display.handlebars', '#htmltagcloud', data);
};

// register this as a handlebars helper!!!!
// retrieve value from anchor that is clicked
function processData(data){
    var selected = data.objects;

    jqueryNoConflict('#htmltagcloud a').live('click', function() {

        //event.preventDefault();
        var topicVariable = this.name;
        var selectedObjects = [];

        // begins loop
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].topic === topicVariable) {
                var queriedDataObject = {
                    topic: selected[i].topic,
                    text: selected[i].text,
                    url: selected[i].url
                };
                selectedObjects.push(queriedDataObject);
            }
            // close if statement

        }
        // close for loop

       var dataForHandlebars = {
            objects: selectedObjects
        };

    focusOnDisplayDetails();
    renderHandlebarsTemplate('static-files/templates/content-display.handlebars', '#content-display', dataForHandlebars);
    jqueryNoConflict('#topic-display').html('<h4>In Thursday\'s State of the State address, Gov. Jerry Brown said <br /> the following about ' + topicVariable + '</h4>');
    jqueryNoConflict('#topic-target').scrollIntoView(true);
    });
};

// grab data from flat file
function retriveData(dataSource, functionToRun) {
    jqueryNoConflict.getJSON(dataSource, functionToRun);
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
        handlebarsDebugHelper();
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

// begin
function focusOnDisplayDetails(){
    jqueryNoConflict('#content-article-text').fadeOut('fast');
    jqueryNoConflict('#about-this-project').removeClass('hidden');
};
// end

// begin
function showDisplayDetails(){
    jqueryNoConflict('#content-article-text').fadeIn('fast');
    jqueryNoConflict('#content-display').empty();
    jqueryNoConflict('#about-this-project').addClass('hidden');
};
// end

// embed function
function embedBox() {
    var embed_url = 'http://projects.scpr.org/static/maps/flu-clinics/iframe.html';

    jAlert('<strong>To embed this visualization your blog or site, just copy this code:<br></strong>&lt;iframe src=\"'+ embed_url +'\" width=\"540px\" height=\"600px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};