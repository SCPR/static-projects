var jqueryNoConflict = jQuery;

jqueryNoConflict(document).ready(function() {
    MapsLib.initialize();

    setTimeout(function(){
        buildMapDisplay();
    },1000);

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

    jqueryNoConflict('#search_radius').change(function(){
        MapsLib.doSearch();
    });

    jqueryNoConflict('#search').click(function(){
        MapsLib.doSearch();
    });

    jqueryNoConflict('#reset').click(function(){
        jqueryNoConflict.address.parameter('address','');
        MapsLib.initialize();
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

// embed function
function embedBox() {
    var embed_url = 'http://projects.scpr.org/static/maps/election-day-voting-issues/iframe.html';
    jAlert('<h4>Embed this on your site or blog</h4>' +
    '<span>Copy the code below and paste to source of your page: <br /><br /> &lt;iframe src=\"'+ embed_url +'\" width=\"620px\" height=\"820px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};
// end