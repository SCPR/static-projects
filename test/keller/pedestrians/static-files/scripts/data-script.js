var jqueryNoConflict = jQuery;
var map;

// begin main function
jqueryNoConflict(document).ready(function() {

    google.maps.event.addDomListener(window, 'load', createMap);

});
// end

// begin function
function createMap(){

    // add encrypted table id

    var cityCrosswalkTableId = '113boV0mDDfay8ngXn8REwwIplC_uEWogLf6aepw';
    var userContributedTableId = '1RvesiAIGe14Gw3w7zjQm_2NBlZLl5EBSstdvf6E';
    var locationColumn = 'Location';
    var centerLosAngeles = new google.maps.LatLng(34.061841979429445, -118.26370239257812);

    map = new google.maps.Map(document.getElementById('data-map-canvas'), {
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
    var cityCrosswalkLayer = new google.maps.FusionTablesLayer({
        query: {
            select: locationColumn,
            from: cityCrosswalkTableId
        },
        map: map,
        suppressInfoWindows: true
    });

    // click listener that writes to FT data to #my_map_data_div
    google.maps.event.addListener(cityCrosswalkLayer, 'click', function(e) {
        jqueryNoConflict('#toBeRemoved').html(
            '<span style="font-size: 10px; text-transform: uppercase; font-weight: bold;">SCHEDULED TO UPGRADED</span>' +
            '<h4>' + e.row['Intersection'].value + '</h4>' +
            '<p>Ranked No. ' + e.row['Rank'].value + ' on the city\'s list of ' +
            '\"High Pedestrian-Related Collision Intersections,\" the intersection '+
            'of <strong>' + e.row['Intersection'].value + '</strong> has had ' +
            e.row['Collisions'].value + ' vehicle/pedestrian accidents over the last five years, ' +
            'according to Los Angeles city officials.</p>');
    });

    // Initialize ft layer of user contributed issues
    var userContributedLayer = new google.maps.FusionTablesLayer({
        query: {
            select: locationColumn,
            from: userContributedTableId
        },
        map: map,
        suppressInfoWindows: true
    });

    // click listener that writes to FT data to #my_map_data_div
    google.maps.event.addListener(userContributedLayer, 'click', function(e) {
        jqueryNoConflict('#toBeRemoved').html(
            '<span style="font-size: 10px; text-transform: uppercase; font-weight: bold;">USER-SUBMITTED TROUBLESPOT</span>' +
            '<h4>' + e.row['What intersection or address is the trouble?'].value + '</h4>' +
            '<p>' + e.row['What\'s your name?'].value + ' said:</p>' +
            '<blockquote>"' + e.row['Tell us, in short, what the issue is there or your story.'].value +
            '"</blockquote>');
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

// when user submit button is clicked
function userSubmit(){
    jqueryNoConflict('#data-intro').hide();
    jqueryNoConflict('#data-user-submit').show();
};
// end

// return to main view
function mapIntro(){
    jqueryNoConflict('#data-intro').show();
    jqueryNoConflict('#data-user-submit').hide();
};
// end