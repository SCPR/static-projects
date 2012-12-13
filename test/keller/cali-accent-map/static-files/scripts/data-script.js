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
    var accentTableId = '15uGEmPSJfMKzwU8nV0eARKgrSBAy-F3CsTiv4ic';
    var locationColumn = 'location';
    var centerCalif = new google.maps.LatLng(37.335194502529724, -119.366455078125);

    map = new google.maps.Map(document.getElementById('data-map-canvas'), {
        center: centerCalif,
        zoom: 5,
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

        jqueryNoConflict('#data-audio-player').hide('fast');

        jqueryNoConflict('#data-description').html(
            '<p>Name: ' + e.row['name'].value +
            '<p>City: ' + e.row['location'].value);

        jqueryNoConflict('#data-audio-player').scPlayer({
          links: [{url: e.row['player_link'].value, title: e.row['player_link'].value}]
        });

        jqueryNoConflict('#data-audio-player').show('fast');

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

// render location screen template
function renderDataFooterTemplate(){
    getTemplateAjax('static-files/templates/data-footer.handlebars', function(template) {
        jqueryNoConflict('#data-footer').html(template());
    })
};