var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {

});

// embed function
function embedBox() {
    var embed_url = 'https://projects.scpr.org/charts/lapd-helicopters/static-files/images/helicopter-info-graphic-KPCC.jpg';
    jAlert('<h4>Embed this on your site or blog</h4>' +
    '<span>Copy the code below and paste to source of your page: <br /><br /> &lt;img src=\"'+ embed_url +'\" width=\"100%\" alt=\"LAPD helicopter force by the numbers\" />', 'Share or Embed');
};
// end
