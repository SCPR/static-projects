var jqueryNoConflict = jQuery;
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var html = '';

// begin main function
jqueryNoConflict(document).ready(function() {
    google.maps.event.addDomListener(window, 'load', createMap);
    retriveData();
});

// grab data
function retriveData() {
    var dataSource = 'https://www.publicinsightnetwork.org/air2/public/search?a=6f4d503616e1115157a64bd26b51aec7&q=query_uuid:5bf1fe369f0e&t=JSON';
    jqueryNoConflict.getJSON(dataSource, renderDataVisualsTemplate);
};

// render data visuals template
function renderDataVisualsTemplate(data){

    var handlebarsData = {
        objects: data.results
    };

    renderHandlebarsTemplate('static-files/templates/data-details.handlebars', '#data-details', handlebarsData);
    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', handlebarsData);
};

// create the map
function createMap(){

    var centerLosAngeles = new google.maps.LatLng(34.036054430724114, -118.26595796365973);
    map = new google.maps.Map(document.getElementById('content-map-canvas'), {
        center: centerLosAngeles,
        zoom: 10,
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

    // empty array for markers
    var markers = [];

    for (var i=0; i<data.results.length; i++) {






        console.log(typeof(data.results[i].primary_lat));




        var latLng = new google.maps.LatLng(data.results[i].primary_lat, data.results[i].primary_long);
        html = 'photo_id is ' + data.results[i].query_title + '<br />';

        marker = new google.maps.Marker({
            html: html,
            position: latLng,
            clickable: true
        });

        markers.push(marker), bindInfoWindow(marker, map, html);
    }

    // options for marker cluster
    var markerClusterOptions = {
        gridSize: 50,
        zoomOnClick: false,
        //maxZoom: 15,
        title: 'testing title'
    };

    // adds instance of marker cluster to map
    var markerCluster = new MarkerClusterer(map, markers, markerClusterOptions);

    // click event for marker cluster
    google.maps.event.addListener(markerCluster, 'clusterclick', function(cluster){
        var content ='';

        var clickedMarkers = cluster.getMarkers();

        for (var i=0; i<clickedMarkers.length; i++) {

            if (i==0){
                var markerPosition = clickedMarkers[i];
            }

            html = clickedMarkers[i].html;
            content +=html;
        }

        infowindow.setContent(content);
        infowindow.open(map, markerPosition);
    });

};
// end

// begin function to bind the infowindow to marker
function bindInfoWindow(marker, map, html) {
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(html);
        infowindow.open(map, marker);
    });
};
// end