var jqueryNoConflict = jQuery;

// make sure the spreadsheet is published to the web
var dataSpreadsheet = '0An8W63YKWOsxdHpnenVrbU1sRE9ScDZjWFB6OUF2a2c';

// the sheet being queried
var dataSheet = 'preCliff';

// begin main function
jqueryNoConflict(document).ready(function(){
    Tabletop.init({
        key: dataSpreadsheet,
        callback: showInfo,
        simpleSheet: false,
        debug: true
    });
});
// end

// display page template
function showInfo(data, tabletop){
    var handlebarsData = {
        objects: data.preCliff.elements
    };
    renderDataVisualsTemplate(handlebarsData);
};
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

// add handlebars debugger
function handlebarsDebugHelper(){
    Handlebars.registerHelper("debug", function(optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);
    });
};
// end

// create projects content template
function renderDataVisualsTemplate(data){
    getTemplateAjax('static-files/templates/data-details.handlebars', function(template) {
        //handlebarsDebugHelper();
        jqueryNoConflict('#data-details').html(template(data));
    })
};

// embed function
function embedBox() {
    var embed_url = '#/iframe.html';

    jAlert('<strong>To embed this on your blog or site, just copy this code:<br></strong>&lt;iframe src=\"'+ embed_url +'\" width=\"420px\" height=\"450px\" scrolling=\"no\" frameborder=\"0\"&gt;&lt;/iframe>', 'Share or Embed');
}
// end