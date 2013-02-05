var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    loadDocViewer();
    retrieveKpccData();
});

// begin
function loadDocViewer(){

    dc.embed.load('http://www.documentcloud.org/search/embed/', {
        q: "projectid: 7784-la_clergy_files ",
        container: "#DC-search-projectid-7784-la_clergy_files",
        //title: "View the Documents",
        order: "title",
        per_page: 8,
        search_bar: true,
        organization: 97
    });

};

// create the bootrap modal
function clickModal(){
    jqueryNoConflict('#popupContent').modal('show');
};

function closeDialog () {
	jqueryNoConflict('#popupContent').modal('hide');
};

// begin remove article text
function alterDisplayDetails(){

    var $togglers = $('[data-toggle="collapse"]');
    $togglers.each(function() {
        var $this = $(this);
        var $collapsible = $($this.data('target'));
        $collapsible.on('hidden', function() {
            var text = $this.data('on-hidden');
            text && $this.text(text);
        }).on('shown', function() {
            var text = $this.data('on-active');
            text && $this.text(text);
            $('#content-display').empty();
        });
    });

    $('.collapse').collapse();
};


// grab data
function retrieveKpccData(data){
    var dataSource = 'http://www.scpr.org/api/content/?types=segmentsORnewsORentries&query=mahony&limit=20';
    jqueryNoConflict.getJSON(dataSource, renderKpccTemplate);
};

// render data visuals template
function renderKpccTemplate(data){
    var kpccArticles = {
        'objects': data
        };
    renderHandlebarsTemplate('static-files/templates/kpcc-articles.handlebars', '#kpcc-articles', kpccArticles);
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
    //var dateFormat = 'ddd., MMM., D, YYYY, h:mm a';
    var dateOutput = moment(dateInput).format(dateFormat);
    return dateOutput;
};

// embed function
function embedBox() {
    var embed_url = 'http://localhost:8880/2kpcc/static-projects/applications/la-archdiocese-personnel-files/iframe.html';

    jAlert('<h4>Embed this on your site or blog</h4>' +
    '<span>Copy the code below and paste to source of your page: <br /> &lt;iframe src=\"'+ embed_url +'\" width=\"540px\" height=\"750px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};