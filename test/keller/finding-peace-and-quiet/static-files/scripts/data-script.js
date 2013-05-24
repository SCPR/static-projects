var jqueryNoConflict = jQuery;
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var html = '';

function log(obj) {
    if (window.console && console.log) console.log(obj);
};

// begin main function
jqueryNoConflict(document).ready(function() {
    retriveData();


	jqueryNoConflict('#background').click(function(){
		jqueryNoConflict('#background').fadeOut('slow');
		jqueryNoConflict('#large').fadeOut('slow');
	});

	jqueryNoConflict(document).keydown(function(e){
		if(e.keyCode==27) {
			jqueryNoConflict('#background').fadeOut('slow');
			jqueryNoConflict('#large').fadeOut('slow');
		}
	});

});

// grab data
function retriveData() {
    var dataSource = 'static-files/data/peace_and_quiet-handlebars.json';
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
    for (var i=0; i<data.objects.length; i++) {

        var dataResults = data.objects[i];
        var latLng = new google.maps.LatLng(dataResults.latitude, dataResults.longitude);


        if (dataResults.image) {
            console.log(dataResults.image);
            html = '<p><strong>' + dataResults.firstname + ' ' + dataResults.lastname +
            '</strong> says: ' + dataResults.place + ':<br />' +
            '<ul><li><strong>' + dataResults.narrative + '</strong><br />' +
            '<img src="' + dataResults.image + '" alt="' + dataResults.firstname + dataResults.lastname + ' Submission" width="400px" style="margin: 0 auto 0 auto;" />'
        } else {
            html = '<p><strong>' + dataResults.firstname + ' ' + dataResults.lastname +
            '</strong> says: ' + dataResults.place + ':<br />' +
            '<ul><li><strong>' + dataResults.narrative + '</strong>'
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

        jqueryNoConflict('#background').css({'opacity' : '0.7'}).fadeIn('slow');
        jqueryNoConflict('#large').html('<p style=\"float: right\" id=\"close\"><strong>[X]</strong></p>' + html).center().fadeIn('slow');

		jqueryNoConflict('#close').click(function(){
		  jqueryNoConflict('#background').fadeOut('slow');
		  jqueryNoConflict('#large').fadeOut('slow');
		});

        //infowindow.setContent(html);
        //infowindow.open(map, marker);
    });
};
// end

jQuery.fn.center = function () {
	this.css("position","absolute");
	this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
	this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
	return this;
}