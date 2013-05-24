var jqueryNoConflict = jQuery;
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var html = '';

// begin main function
jqueryNoConflict(document).ready(function() {

    if (!window.console) console = {log: function() {}};

    retriveData();

    jqueryNoConflict('#content-background').click(function(){
		jqueryNoConflict('#content-background').fadeOut('slow');
		jqueryNoConflict('#content-display').fadeOut('slow');
	});

	jqueryNoConflict(document).keydown(function(e){
		if(e.keyCode==27) {
			jqueryNoConflict('#content-background').fadeOut('slow');
			jqueryNoConflict('#content-display').fadeOut('slow');
		}
	});
});

// grab data
function retriveData() {
    jqueryNoConflict.getJSON(dataSource, renderDataVisualsTemplate);
};

// render data visuals template
function renderDataVisualsTemplate(data){

    var handlebarsData = {
        objects: data.objects
    };

    google.maps.event.addDomListener(window, 'load', createMap(handlebarsData));
};

// create the map
function createMap(data){

    var initialZoom = 9;

    // set zoom for mobile devices
    if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
        initialZoom = 7;
    }

    var centerLosAngeles = new google.maps.LatLng(34.036054430724114, -118.26595796365973);
    map = new google.maps.Map(document.getElementById('content-map-canvas'), {
        center: centerLosAngeles,
        zoom: initialZoom,
        scrollwheel: false,
        draggable: true,
        mapTypeControl: false,
        navigationControl: true,
        streetViewControl: false,
        panControl: false,
        scaleControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.LARGE,
            position: google.maps.ControlPosition.RIGHT_TOP}
    });

    google.maps.event.addDomListener(map, 'idle', function() {
      calculateCenter();
    });

    google.maps.event.addDomListener(window, 'resize', function() {
      map.setCenter(centerLosAngeles);
    });

    // empty array for markers
    var markers = [];
    for (var i=0; i<data.objects.length; i++) {

        var dataResults = data.objects[i];
        var latLng = new google.maps.LatLng(dataResults.latitude, dataResults.longitude);

        if (dataResults.image && dataResults.narrative) {
            html =
                '<h4>Where do you find peace and quiet?</h4>' +
                '<img src="' + dataResults.image + '" alt="' + dataResults.firstname + dataResults.lastname + ' Submission" width="100%" />' +
                '<p><strong>' + dataResults.place + '</strong></p>' +
                '<p>' + dataResults.narrative + '</p>' +
                '<p>Submitted by <strong>' + dataResults.firstname + ' ' + dataResults.lastname + '</strong></p>'
        } else if (dataResults.image) {
            html =
                '<h4>Where do you find peace and quiet?</h4>' +
                '<img src="' + dataResults.image + '" alt="' + dataResults.firstname + dataResults.lastname + ' Submission" width="100%" />' +
                '<p><strong>' + dataResults.place + '</strong></p>' +
                '<p>Submitted by <strong>' + dataResults.firstname + ' ' + dataResults.lastname + '</strong></p>'
        } else {
            html =
                '<h4>Where do you find peace and quiet?</h4>' +
                '<p><strong>' + dataResults.place + '</strong></p>' +
                '<p>' + dataResults.narrative + '</p>' +
                '<p>Submitted by <strong>' + dataResults.firstname + ' ' + dataResults.lastname + '</strong></p>'
        }

        marker = new google.maps.Marker({
            id: i,
            html: html,
            position: latLng,
            clickable: true
        });

        markers.push(marker), bindInfoWindow(marker, map, html);
    }

    // options for marker cluster
    var markerClusterOptions = {
        gridSize: 50,
        zoomOnClick: true,
        maxZoom: 12,
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

        //infowindow.setContent(content);
        //infowindow.open(map, markerPosition);
    });

};
// end

// begin function to bind the infowindow to marker
function bindInfoWindow(marker, map, html) {
    google.maps.event.addListener(marker, 'click', function() {

        jqueryNoConflict('#content-background').css({'opacity' : '0.7'}).fadeIn('fast');
        jqueryNoConflict('#content-display').html('<p style=\"float: right\" id=\"close\"><strong>[X]</strong></p>' + html).center().fadeIn('slow');

		jqueryNoConflict('#close').click(function(){
		  jqueryNoConflict('#content-display').fadeOut('fast');
		  jqueryNoConflict('#content-background').fadeOut('fast');
		});

        //infowindow.setContent(html);
        //infowindow.open(map, marker);
    });
};
// end

jQuery.fn.center = function () {
	this.css('position','absolute');
	this.css('top', ( jqueryNoConflict(window).height() - this.height() ) / 2+jqueryNoConflict(window).scrollTop() + 'px');
	this.css('left', ( jqueryNoConflict(window).width() - this.width() ) / 2+jqueryNoConflict(window).scrollLeft() + 'px');
	return this;
}

// function to maintain center point of map
function calculateCenter(){
    center = map.getCenter();
};