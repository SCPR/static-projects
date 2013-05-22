var jqueryNoConflict = jQuery;
var map;

// begin main function
jqueryNoConflict(document).ready(function() {
    createMap();
    setTimeout(function(){
        jqueryNoConflict('#map_legend').removeClass('hidden');
    }, 2000);
});

// begin function
function createMap() {
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        center: new google.maps.LatLng(34.01862413631862, -118.4208233779297),
        zoom: 11,
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
            position: google.maps.ControlPosition.LEFT_TOP}
    });

    var style = [
    {
      featureType: 'all',
      elementType: 'all',
      stylers: [
        { saturation: -99 }
      ]
    },
    {
      featureType: 'road.local',
      elementType: 'all',
      stylers: [
        { visibility: 'off' }
      ]
    },
    {
      featureType: 'administrative.country',
      elementType: 'all',
      stylers: [
        { visibility: 'off' }
      ]
    },
    {
      featureType: 'administrative.province',
      elementType: 'all',
      stylers: [
        { visibility: 'off' }
      ]
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'all',
      stylers: [
        { visibility: 'off' }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'all',
      stylers: [
        { visibility: 'off' }
      ]
    },
    {
      featureType: 'transit',
      elementType: 'all',
      stylers: [
        { visibility: 'off' }
      ]
    }
    ];
    var styledMapType = new google.maps.StyledMapType(style, {
        map: map,
        name: 'Styled Map'
    });

  map.mapTypes.set('map-style', styledMapType);
  map.setMapTypeId('map-style');

    google.maps.event.addDomListener(map, 'idle', function() {
      calculateCenter();
    });

    google.maps.event.addDomListener(window, 'resize', function() {
      map.setCenter(center);
    });

    jqueryNoConflict.get('static-files/data/la_city_general_election.kml', function(data) {

        var mapColorArray = ["#EFF3FF", "#BDD7E7", "#6BAED6", "#2171B5"];

        var features = gmap.load_polygons({
            map: map,

            //required. all other params are optional
            data: data,

            data_type: "kml",

            getColor: function(data) {

                // runs in the scope of each feature. returns the color to set it to
                // has access to the data in this.fields
                var perc;

                if (data.percent_turnout <= 10) {
                    perc = 0;
                } else if (data.percent_turnout <= 20) {
                    perc = 1;
                } else if (data.percent_turnout <= 30) {
                    perc = 2;
                } else {
                    perc = 3;
                }

                return mapColorArray[perc];
            },

            unselected_opts: {
                "fillOpacity": .8
            },
            highlighted_opts: {
                strokeWeight: 2.0,
                strokeColor: "#c2c2c2"
            },
            selected_opts: {
                strokeWeight: 2.0,
                strokeColor: "#ffffff"
            },

            highlightCallback: function(e) {
                jqueryNoConflict('#map_legend').animate({height:'auto'}, 25000);
                var percentOfVote = (this.fields.winner_percent*100).toFixed(0)
                jqueryNoConflict('#map_data').html(
                    '<br /><p><strong>' + addCommas(this.fields.ballots_cast) + '</strong> ballots were cast in Los Angeles precinct <strong>' + this.id +
                    '</strong> out of <strong>' + addCommas(this.fields.registered_voters) + '</strong> registered voters for a <strong>' +
                    this.fields.percent_turnout + '%</strong> turnout.</p>' +
                    '<p><strong>' + this.fields.winner + '</strong> won the precinct with ' + percentOfVote + '% of the vote.</p>');
            },

            selectCallback: function(e) {
                jqueryNoConflict('#map_legend').animate({height:'auto'}, 25000);
                var percentOfVote = (this.fields.winner_percent*100).toFixed(0)
                jqueryNoConflict('#map_data').html(
                    '<br /><p><strong>' + addCommas(this.fields.ballots_cast) + '</strong> ballots were cast in Los Angeles precinct <strong>' + this.id +
                    '</strong> out of <strong>' + addCommas(this.fields.registered_voters) + '</strong> registered voters for a <strong>' +
                    this.fields.percent_turnout + '%</strong> turnout.</p>' +
                    '<p><strong>' + this.fields.winner + '</strong> won the precinct with ' + percentOfVote + '% of the vote.</p>');
            }
        });
    });
}

// add commas to data
function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';

    var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
    return x1 + x2;
}

// function to maintain center point of map
function calculateCenter(){
    center = map.getCenter();
};