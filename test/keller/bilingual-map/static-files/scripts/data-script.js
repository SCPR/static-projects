var jqueryNoConflict = jQuery;
var map;

// begin main function
jqueryNoConflict(document).ready(function() {

    createMap();

});
// end

// begin function
function createMap(){

    // add encrypted table id
    var bilingualSchoolTableId = '1gqAgWr7jCzf2T0xzgjyx6S6oaa4puFvdWjFyjMo';
    var locationColumn = 'location';
    var centerCalif = new google.maps.LatLng(37.335194502529724, -119.366455078125);

    map = new google.maps.Map(document.getElementById('data-map-canvas'), {
        center: centerCalif,
        zoom: 6,
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
    var cityCrosswalkLayer = new google.maps.FusionTablesLayer({
        query: {
            select: locationColumn,
            from: bilingualSchoolTableId
        },
        map: map,
        suppressInfoWindows: false
    });

    google.maps.event.addDomListener(map, 'idle', function() {
      calculateCenter();
    });

    google.maps.event.addDomListener(window, 'resize', function() {
      map.setCenter(centerLosAngeles);
    });

};
// end

// function to maintain center point of map
function calculateCenter(){
    center = map.getCenter();
};
// end
