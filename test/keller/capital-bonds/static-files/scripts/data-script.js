    var jqueryNoConflict = jQuery;
    var map;

    // begin main function
    jqueryNoConflict(document).ready(function(){
        createMap();

    });
    // end main function

    // begin function
    function createMap() {
        var locationColumn = 'geometry';
        var centerCalif = new google.maps.LatLng(34.29461534118775, -118.26919555664062);

        map = new google.maps.Map(document.getElementById('data-map-canvas'), {
            center: centerCalif,
            zoom: 8,
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

/*
        layer = new google.maps.FusionTablesLayer({
            query: {
                select: locationColumn,
                from: tableDiabetes
            },
            map: map,
            suppressInfoWindows: true
        });

*/
        google.maps.event.addDomListener(map, 'idle', function() {
          calculateCenter();
        });

        google.maps.event.addDomListener(window, 'resize', function() {
          map.setCenter(centerCalif);
        });

    };
    // end function


    // function to maintain center point of map
    function calculateCenter() {
        center = map.getCenter();
    };

    // function to generate iframe embed code
    function embedBox() {
        var embed_url = '#';

        jAlert('<strong>To embed this on your blog or site, just copy this code:<br></strong>&lt;iframe src=\"'+ embed_url +'\" width=\"420px\" height=\"450px\" scrolling=\"no\" frameborder=\"0\"&gt;&lt;/iframe>', 'Share or Embed');
    };
    // end