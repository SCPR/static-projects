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

    //ranges for our slider
    var minDate = moment("Oct 1 2000"); // Jan 1st 2010
    var maxDate = moment(); //now

    //starting values
    var startDate = moment().subtract('months', 150); //past 3 months
    var endDate = moment(); //now

    MapsLib.initializeDateSlider(minDate, maxDate, startDate, endDate, "years", 1);

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

// embed function
function embedBox() {
    var embed_url = 'http://projects.scpr.org/static/maps/election-day-voting-issues/iframe.html';
    jAlert('<h4>Embed this on your site or blog</h4>' +
    '<span>Copy the code below and paste to source of your page: <br /><br /> &lt;iframe src=\"'+ embed_url +'\" width=\"620px\" height=\"820px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};
// end