var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {

});

// begin embed function
function embedBox() {
    var embed_url = 'http://projects.scpr.org/static/timelines/christopher-dorner-timeline/iframe.html';

    jAlert('<h4>Embed this on your site or blog</h4>' +
    '<span>Copy the code below and paste to source of your page: <br /> &lt;iframe src=\"'+ embed_url +'\" width=\"540px\" height=\"750px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};