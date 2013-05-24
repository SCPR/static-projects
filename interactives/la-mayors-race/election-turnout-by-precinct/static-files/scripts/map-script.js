var jqueryNoConflict = jQuery;
var map;

// begin main function
jqueryNoConflict(document).ready(function() {
    createMap();
    setTimeout(function(){
        jqueryNoConflict('nav').removeClass('hidden');
    }, 2000);

    //Calculate the height of <header>
    //Use outerHeight() instead of height() if have padding
    var aboveHeight = jqueryNoConflict('header').height();

    // when scroll
    jqueryNoConflict(window).scroll(function(){

    	//if scrolled down more than the header's height
        if (jqueryNoConflict(window).scrollTop() > aboveHeight){

    		// if yes, add "fixed" class to the <nav>
    		// add padding top to the #content (value is same as the height of the nav)
            jqueryNoConflict('nav').addClass('fixed');

        } else {

    		// when scroll up or less than aboveHeight, remove the "fixed" class, and the padding-top
            jqueryNoConflict('nav').removeClass('fixed');
        }
    });
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
                } else if (data.percent_turnout <= 21) {
                    perc = 1;
                } else if (data.percent_turnout <= 31) {
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
                strokeColor: "#2b2b2b"
            },
            selected_opts: {
                strokeWeight: 2.0,
                strokeColor: "#2b2b2b"
            },

            highlightCallback: function(e) {
                jqueryNoConflict('#mouseover-hide').hide();
                jqueryNoConflict('nav').animate({height:'auto'}, 25000);
                var percentWinner;
                var totalVotes = this.fields.garcetti + this.fields.greuel;
                var percentGarcetti = ((this.fields.garcetti/totalVotes)*100).toFixed(2);
                var percentGreuel = ((this.fields.greuel/totalVotes)*100).toFixed(2);

                if (this.fields.winner === 'Eric Garcetti'){
                    percentWinner = percentGarcetti;
                } else {
                    percentWinner = percentGreuel;
                }

                var percentOfVote = (this.fields.winner_percent*100).toFixed(0)
                jqueryNoConflict('#map_data').html(
                    '<h4>Turnout for Los Angeles precinct ' + this.id + '</h4>' +
                    '<p><strong>' + addCommas(this.fields.ballots_cast) + '</strong> ballot(s) were cast in Los Angeles precinct <strong>' + this.id +
                    '</strong> out of <strong>' + addCommas(this.fields.registered_voters) + '</strong> registered voters for a <strong>' +
                    this.fields.percent_turnout + '%</strong> turnout.</p>' +
                    '<p><strong>' + this.fields.winner + '</strong> won the precinct with <strong>' + percentWinner + '%</strong> of the vote.</p>');
            },

            selectCallback: function(e) {
                jqueryNoConflict('#mouseover-hide').hide();
                jqueryNoConflict('nav').animate({height:'auto'}, 25000);
                var percentWinner;
                var totalVotes = this.fields.garcetti + this.fields.greuel;
                var percentGarcetti = ((this.fields.garcetti/totalVotes)*100).toFixed(2);
                var percentGreuel = ((this.fields.greuel/totalVotes)*100).toFixed(2);

                if (this.fields.winner === 'Eric Garcetti'){
                    percentWinner = percentGarcetti;
                } else {
                    percentWinner = percentGreuel;
                }

                var percentOfVote = (this.fields.winner_percent*100).toFixed(0)

                    jqueryNoConflict('#comparison_data').append(
                        '<li class="data-instructions">&bull; <strong>Precinct ' + this.id + '</strong> turnout was <strong> ' + this.fields.percent_turnout + '%.</strong> <strong>' + this.fields.winner + '</strong> won with <strong>' + percentWinner + '%</strong> of the vote.</li>');

                    jqueryNoConflict('#clear_comparison_data').html(
                        '<a class="data-instructions" style="cursor: pointer; text-decoration: underline;" onclick="gmap.Feature.prototype.clearComparisons();">Clear precinct comparisons</a>');
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