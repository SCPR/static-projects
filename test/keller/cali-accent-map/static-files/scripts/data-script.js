var jqueryNoConflict = jQuery;
var map;

// begin main function
jqueryNoConflict(document).ready(function() {
    renderStaticTemplates();
    createMap();
});
// end

// render handlebars templates via ajax
function getTemplateAjax(path, callback){
    var source, template;
    jqueryNoConflict.ajax({
        url: path,
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);
            if (callback) callback(template);
        }
    });
}
//end

// begin
function renderStaticTemplates(){
    renderKpccHeaderTemplate();
    renderDataDetailsTemplate();
    renderDataFooterTemplate();
    renderKpccFooterTemplate();
};
// end

// create data footer template
function renderKpccHeaderTemplate(){
    getTemplateAjax('static-files/templates/kpcc-header.handlebars', function(template) {
        jqueryNoConflict('#kpcc-header').html(template());
    })
};

// create data details template
function renderDataDetailsTemplate(){
    getTemplateAjax('static-files/templates/data-details.handlebars', function(template) {
        jqueryNoConflict('#data-details').html(template());
    })
};

// create data footer template
function renderDataFooterTemplate(){
    getTemplateAjax('static-files/templates/data-footer.handlebars', function(template) {
        jqueryNoConflict('#data-footer').html(template());
    })
};

// create data footer template
function renderKpccFooterTemplate(){
    getTemplateAjax('static-files/templates/kpcc-footer.handlebars', function(template) {
        jqueryNoConflict('#kpcc-footer').html(template());
    })
};

// begin function
function createMap(){

    // add encrypted table id
    var accentTableId = '15uGEmPSJfMKzwU8nV0eARKgrSBAy-F3CsTiv4ic';
    var locationColumn = 'location';
    var centerCalif = new google.maps.LatLng(35.77174023870981, -119.6136474609375);

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

    var style = [
        {
          featureType: 'all',
          elementType: 'all',
          stylers: [
            { saturation: -39 }
          ]
        },
        {
          featureType: 'road.highway',
          elementType: 'all',
          stylers: [
            { visibility: 'off' }
          ]
        },
        {
          featureType: 'road.arterial',
          elementType: 'all',
          stylers: [
            { visibility: 'off' }
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
          featureType: 'administrative.neighborhood',
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

    // Initialize ft layer

    layer = new google.maps.FusionTablesLayer({
        query: {
            select: locationColumn,
            from: accentTableId
        },
        map: map,
        suppressInfoWindows: true
    });

    // click listener that writes to FT data to #my_map_data_div
    google.maps.event.addListener(layer, 'click', function(e) {

        var trackURL = e.row['player_link'].value;

        jqueryNoConflict('#data-description').html(
            '<p><strong>Name: </strong>' + e.row['name'].value +
            '<p><strong>City: </strong>' + e.row['location'].value);

        jqueryNoConflict('#data-audio-player').html(
            '<a class=\"soundcloud-player\" href=\" ' + trackURL + '\">Play</a>');

        jqueryNoConflict("a.soundcloud-player").scPlayer();

    });

    google.maps.event.addDomListener(map, 'idle', function() {
      calculateCenter();
    });

    google.maps.event.addDomListener(window, 'resize', function() {
      map.setCenter(centerCalif);
    });

};
// end function

// function to maintain center point of map
function calculateCenter(){
    center = map.getCenter();
};