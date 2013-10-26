var jqueryNoConflict = jQuery;
var fn = fn || {};
var embed_url = 'http://projects.scpr.org/static/maps/election-day-voting-issues/';

// begin main function
jqueryNoConflict(document).ready(function() {
    fn.createMap();

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

// begin data configuration object
var fn = {
    createMap: function(){

        var initialZoom;

        // set zoom for mobile devices
        if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
            initialZoom = 7;
        } else {
            initialZoom = 8;
        }

        map = new L.map('content-map-canvas', {
            scrollWheelZoom: false,
            zoomControl: true
        });

        var center = new L.LatLng(36.388124,-118.023806);
        map.setView(center, initialZoom);

        googleLayer = L.tileLayer("http://{s}.google.com/vt/?hl=en&x={x}&y={y}&z={z}&s={s}", {
             attribution: 'Map data: Copyright Google, 2013',
             subdomains: ['mt0','mt1','mt2','mt3']
        });

        map.addLayer(googleLayer);

        L.geoJson(aqueductRoute, {
            style: function (feature) {
                return {
                    color: 'red',
                    weight: 5,
                    fillColor: '#f07a30',
                    opacity: .6,
                    fillOpacity: 1
                }
            },
        }).addTo(map);

        L.geoJson(aqueductFeatures, {
            style: function (feature) {
                return {
                    color: 'black',
                    weight: 5,
                    fillColor: '#f07a30',
                    opacity: .6,
                    fillOpacity: 1
                }
            },

            onEachFeature: function(feature, layer) {

                layer.on('click', function (e) {

                    if (feature.properties.imageUrl === null){
                        var imageUrl = 'http://maps.googleapis.com/maps/api/staticmap?center=' +
                            feature.geometry.coordinates[1] + ',' + feature.geometry.coordinates[0] +
                            '&zoom=13&size=1000x1000&maptype=satellite&sensor=false&key=AIzaSyAtS1OYyuRY0inb23BK0nuGId3FiOC6Rb8';
                        var imageCredit = '<strong>Copyright</strong> Google, 2013'

                    } else {
                        var imageUrl = feature.properties.imageUrl;
                        var imageCredit = '<strong>Photo by</strong> ' + feature.properties.imageCredit;
                    }

                    var html = "<h4>" + feature.properties.name + "</h4><img src='" + imageUrl + "' /><p>" + imageCredit + "</p>";

                    jqueryNoConflict('#content-background').css({'opacity' : '0.7'}).fadeIn('fast');
                    jqueryNoConflict('#content-display').html('<p style=\"float: right\" id=\"close\"><strong>[X]</strong></p>' + html).fadeIn('slow');

                    jqueryNoConflict('#close').click(function(){
                        jqueryNoConflict('#content-display').fadeOut('fast');
                        jqueryNoConflict('#content-background').fadeOut('fast');
                    });

                });
            }

        }).addTo(map);

    },

    embedBox: function(){
        var embed_url = embed_url + 'iframe.html';
        jAlert('<h4>Embed this on your site or blog</h4>' + '<span>Copy the code below and paste to source of your page: <br /><br /> &lt;iframe src=\"'+ embed_url +'\" width=\"100%\" height=\"850px\" style=\"margin: 0 auto;\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
    }

}
// end data configuration object