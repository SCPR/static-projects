var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    retriveData();
});

// grab data
function retriveData() {
    var dataSource = 'static-files/data/ca_congressional_delegation.json';
    jqueryNoConflict.getJSON(dataSource, renderDataVisualsTemplate);
};

// render data visuals template
function renderDataVisualsTemplate(data){
    renderHandlebarsTemplate('static-files/templates/content-action-bar.handlebars', '#content-action-bar', data);
    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', data);
};

// scroll into view function
function scrollToRep(){
    var congressionalMember = jqueryNoConflict('#search-congressional-delegation').val();
    jqueryNoConflict.scrollTo(congressionalMember)
};

// embed function
function embedBox() {
    var embed_url = 'http://projects.scpr.org/static/maps/election-day-voting-issues/iframe.html';
    jAlert('<h4>Embed this on your site or blog</h4>' +
    '<span>Copy the code below and paste to source of your page: <br /><br /> &lt;iframe src=\"'+ embed_url +'\" width=\"620px\" height=\"820px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};
// end