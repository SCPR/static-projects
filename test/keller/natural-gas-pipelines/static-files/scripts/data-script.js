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