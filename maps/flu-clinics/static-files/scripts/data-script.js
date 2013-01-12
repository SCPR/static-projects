var jqueryNoConflict = jQuery;
var map;
var tableID = '1aOgARAl4h_0vUgK2YDCOmGnFsUrcEMOYqm8saHo';
var locationColumn =  'location';
var layerl0;

// begin main function
jqueryNoConflict(document).ready(function() {

    createMap();

});
// end


    // begin function
    function createMap() {
        var centerCalif = new google.maps.LatLng(33.986608054508494, -118.16070556640625);
        map = new google.maps.Map(document.getElementById('data-map-canvas'), {
            center: centerCalif,
            zoom: 9,
            scrollwheel: false,
            draggable: true,
            mapTypeControl: false,
            navigationControl: true,
            streetViewControl: false,
            panControl: false,
            scaleControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL,
                position: google.maps.ControlPosition.RIGHT_TOP}
        });

        // Initialize ft layer
        layerl0 = new google.maps.FusionTablesLayer({
            query: {
                select: locationColumn,
                from: tableID
            },
            map: map,
            suppressInfoWindows: false,
            styleId: 2,
            templateId: 2
        });

        google.maps.event.addDomListener(map, 'idle', function() {
          calculateCenter();
        });

        google.maps.event.addDomListener(window, 'resize', function() {
          map.setCenter(centerCalif);
        });

    };
    // end function

    function changeMapl0() {
        var searchString = document.getElementById('search-string-l0').value.replace(/'/g, "\\'");
        layerl0.setOptions({
            query: {
                select: locationColumn,
                from: tableID,
                where: "'city' = '" + searchString + "'"
            }
        });
    };

    // function to maintain center point of map
    function calculateCenter(){
        center = map.getCenter();
    };
    // end

    // embed function
    function embedBox() {
        var embed_url = 'http://projects.scpr.org/static/maps/flu-clinics/iframe.html';

        jAlert('<strong>To embed this visualization your blog or site, just copy this code:<br></strong>&lt;iframe src=\"'+ embed_url +'\" width=\"540px\" height=\"600px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
    }
    // end