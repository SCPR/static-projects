var jqueryNoConflict = jQuery;
var fn = fn || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    if (!window.console) console = {log: function() {}};
    fn.retrieveData();
});


// begin configuration object
var fn = {

    // API data source
    dataSource: 'https://www.publicinsightnetwork.org/air2/public/search?a=6f4d503616e1115157a64bd26b51aec7&q=query_uuid:5bf1fe369f0e&t=json',

    // pull back data from API
    retrieveData: function(){
        jqueryNoConflict.getJSON(fn.dataSource, fn.createMap);
    },

    // map options
    mapOptions: {
        center: new google.maps.LatLng(34.036054430724114, -118.26595796365973),
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
            style: google.maps.NavigationControlStyle.LARGE,
            position: google.maps.ControlPosition.RIGHT_TOP}
    },

    // function to maintain center point of map
    calculateCenter: function(){
        center = map.getCenter();
    },

    // write the map
    createMap: function(data){

        // set lower zoom on smartphone
        if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
            fn.mapOptions.zoom = 7;
        }

        map = new google.maps.Map(document.getElementById('content-map-canvas'), fn.mapOptions);

        google.maps.event.addDomListener(map, 'idle', function() {
            fn.calculateCenter();
        });

        google.maps.event.addDomListener(window, 'resize', function() {
            map.setCenter(fn.mapOptions.center);
        });

        fn.addMarkersToMap(data);

    },

    markerClusterOptions: {
        gridSize: 50,
        zoomOnClick: true,
        maxZoom: 12,
        title: 'Cluster Title'
    },

    addMarkersToMap: function(data){

        var markers = [], latLng, marker, html;
        var infowindow = new google.maps.InfoWindow();

        for (var i=0; i<data.results.length; i++) {

            var results = data.results[i];
            console.log(results);

            if (results.primary_lat && results.primary_long) {
                latLng = new google.maps.LatLng(results.primary_lat, results.primary_long);
            } else {
                latLng = new google.maps.LatLng(34.036054430724114, -118.26595796365973);
                //latLng = null
            }

            //console.log(results.responses.f6d5d1c2d738);

            html = '<h4>' + results.query_title + '</h4>' +
                '<p>' + results.src_first_name + ' ' + results.src_last_name +
                ' from ' + results.primary_city + ', ' + results.primary_state + ' said: </p>' +
                '<ul><p><li>' + results.responses['9200af1a79cb'] + '</li></p></ul>' +
                '<p class=\"data-instructions\">Submitted: ' + fn.takeTime(results.srs_date) + '</p>' +
                '<p><img src="http://projects.scpr.org/static/static-files/images/series-icons/dear_mayor.png" alt="place-holder-image" width="100%" /></p>';

            marker = new google.maps.Marker({
                id: i,
                html: html,
                position: latLng,
                clickable: true
            });

            markers.push(marker), fn.bindInfoWindow(marker, fn.createMap.map, html);

        }

        // adds instance of marker cluster to map
        var markerCluster = new MarkerClusterer(map, markers, fn.markerClusterOptions);

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
        });
    },

    takeTime: function(dateInput) {
        var dateFormat = 'ddd., MMM., D, YYYY, h:mm a';
        var dateOutput = moment(dateInput).format(dateFormat);
        return dateOutput;
    },

    bindInfoWindow: function(marker, map, html){
        google.maps.event.addListener(marker, 'click', function() {

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

            jqueryNoConflict('#content-background').css({'opacity' : '0.7'}).fadeIn('fast');
            jqueryNoConflict('#content-display').html('<p style=\"float: right\" id=\"close\"><strong>[X]</strong></p>' + html).center().fadeIn('slow');

    		jqueryNoConflict('#close').click(function(){
    		  jqueryNoConflict('#content-display').fadeOut('fast');
    		  jqueryNoConflict('#content-background').fadeOut('fast');
    		});

            //infowindow.setContent(html);
            //infowindow.open(map, marker);
        });
    },

}

jQuery.fn.center = function () {
	this.css('position','absolute');
	this.css('top', ( jqueryNoConflict(window).height() - this.height() ) / 4+jqueryNoConflict(window).scrollTop() + 'px');
	this.css('left', ( jqueryNoConflict(window).width() - this.width() ) / 2+jqueryNoConflict(window).scrollLeft() + 'px');
	return this;
}