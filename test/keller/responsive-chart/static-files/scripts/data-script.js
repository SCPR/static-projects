var jqueryNoConflict = jQuery;

// make sure the spreadsheet is published to the web
var dataSpreadsheet = '0Ark-PJD-Ze_DdGplNXRzVDFSVzVCVGsxdUVxLXRXdVE';

// the sheet being queried
var dataSheet = 'kids';

// begin main function
jqueryNoConflict(document).ready(function() {

    Tabletop.init({
        key: dataSpreadsheet,
        callback: retriveData,
        parseNumbers: true,
        simpleSheet: false,
        debug: false
    });

});
// end

// display data on template
function retriveData(data, tabletop) {

    var handlebarsData = {
        objects: data.kids.elements
    };

    handlebarsDebugHelper();
    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', handlebarsData);

};
// end

// embed function
function embedBox() {
    var embed_url = 'http://projects.scpr.org/static/maps/election-day-voting-issues/iframe.html';
    jAlert('<h4>Embed this on your site or blog</h4>' +
    '<span>Copy the code below and paste to source of your page: <br /><br /> &lt;iframe src=\"'+ embed_url +'\" width=\"620px\" height=\"820px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};
// end