
var jqueryNoConflict = jQuery;
var map;

// begin main function
jqueryNoConflict(document).ready(function() {
    google.maps.event.addDomListener(window, 'load', createMap);
});

// begin function
function createMap(){

    // add encrypted table id
    var fusionTableId = '1HwblrqLu8SUckDPGVXH0lpTympVunuiXFMGtH6M';
    var locationColumn = 'col17';
    var centerLosAngeles = new google.maps.LatLng(34.036054430724114, -118.26595796365973);
    map = new google.maps.Map(document.getElementById('embedded-project-container-map-canvas'), {
        center: centerLosAngeles,
        zoom: 13,
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

    // Initialize ft layer of new crosswalks
    var downtownDevLayer = new google.maps.FusionTablesLayer({
        query: {
            select: locationColumn,
            from: fusionTableId
        },
        map: map,
        suppressInfoWindows: true

    });

    //click listener on fusion layer
    google.maps.event.addListener(downtownDevLayer, 'click', function(e) {
        $("#embedded-project-container-map-details").html(
            '<p><strong>' + e.row['project_name'].value + '</strong></p>' +
            '<p>' + e.row['project_address'].value + '</p>' +
            '<p>' + e.row['project_description'].value + '</p>' +
            '<p><a href="' + e.row['read_more'].value + '" target="_blank"><strong>Read more</strong></a></p>');
    });

    google.maps.event.addDomListener(map, 'idle', function() {
      calculateCenter();
    });

    google.maps.event.addDomListener(window, 'resize', function() {
      map.setCenter(centerLosAngeles);
    });

};

// function to maintain center point of map
function calculateCenter(){
    center = map.getCenter();
};