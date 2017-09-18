var jqueryNoConflict = jQuery;

jqueryNoConflict(document).ready(function() {
    google.maps.event.addDomListener(window, 'load', buildMapDisplay);
});

function buildMapDisplay(){

    /*
        map library and search filtering from Derek Eder's Searchable Map Template
        find out more here: https://github.com/derekeder/FusionTable-Map-Template
    */

    MapsLib.initialize();
    jqueryNoConflict("#search_address").geocomplete();
    jqueryNoConflict(':checkbox').click(function(){
        MapsLib.doSearch();
    });

    jqueryNoConflict(':radio').click(function(){
        MapsLib.doSearch();
    });

    jqueryNoConflict('#search_radius').change(function(){
        MapsLib.doSearch();
    });

    jqueryNoConflict('#search').click(function(){
        MapsLib.doSearch();
    });

    jqueryNoConflict('#find_me').click(function(){
        MapsLib.findMe();
        return false;
    });

    jqueryNoConflict('#reset').click(function(){
        jqueryNoConflict.address.parameter('address','');
        MapsLib.initialize();
        jqueryNoConflict('#content-display').empty();
        return false;
    });

    jqueryNoConflict(":text").keydown(function(e){
        var key =  e.keyCode ? e.keyCode : e.which;
        if(key == 13) {
            jqueryNoConflict('#search').click();
            return false;
        }
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

// function to compile handlebars template
function renderHandlebarsTemplate(withTemplate,inElement,withData){
    getTemplateAjax(withTemplate, function(template) {
        jqueryNoConflict(inElement).html(template(withData));
    })
};

// when user submit button is clicked
function userSubmit(){
    jqueryNoConflict('#content-article-text').hide();
    jqueryNoConflict('#content-article-buttons').hide();
    jqueryNoConflict('#content-display').empty();
    jqueryNoConflict('#data-user-submit').show();
    renderHandlebarsTemplate('static-files/templates/data-user-submit.handlebars', '#data-user-submit');
};
// end

// return to main view
function mapIntro(){
    jqueryNoConflict('#content-article-text').show();
    jqueryNoConflict('#content-article-buttons').show();
    jqueryNoConflict('#content-display').empty();
    jqueryNoConflict('#data-user-submit').hide();
};
// end

// embed function
function embedBox() {
    var embed_url = 'https://projects.scpr.org/maps/election-day-voting-issues/iframe.html';
    jAlert('<h4>Embed this on your site or blog</h4>' +
    '<span>Copy the code below and paste to source of your page: <br /><br /> &lt;iframe src=\"'+ embed_url +'\" width=\"620px\" height=\"820px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};
// end
