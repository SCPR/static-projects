var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    retriveData();

    $mapper = $('#mapper').slideMapper({
        controlType: 'top',
        autoHeight: 'true',
        center: [34.036054430724114, -118.26595796365973],
        zoom: 10,
        maxZoom: 13,
        mapHeight: 600,
        leafPile: true,
        mapType: 'google-maps',
        mapPosition: 'bottom'
    });

});

// function to deal with IE's console error
function log(obj) {
    if (window.console && console.log) console.log(obj);
};

// grab data
function retriveData() {
    var dataSource = 'https://www.publicinsightnetwork.org/air2/public/search?a=6f4d503616e1115157a64bd26b51aec7&q=query_uuid:5bf1fe369f0e&t=JSON';
    jqueryNoConflict.getJSON(dataSource, processDataForMap);
};

// render data visuals template
function processDataForMap(data){
    var slide_objects = [];
    for (var i=0; i<data.results.length; i++) {
        var data_results = data.results[i];
        var marker_object = {
            marker: [data_results.primary_lat, data_results.primary_long],
            center: [data_results.primary_lat, data_results.primary_long],
            html:
            '<div class="row-fluid">' +
                '<div class="span12">' +
                    '<h4 class="kicker">' + data_results.responses['f6d5d1c2d738'] + '</h4>' +
                '</div>' +
            '</div>' +
            '<div class="row-fluid">' +
                '<div class="span3">' +
                    '<p><img src="http://maps.googleapis.com/maps/api/staticmap?center=' + data_results.primary_lat + ',' + data_results.primary_long + '&zoom=12&size=300x300&maptype=roadmap&sensor=false" /></p>' +
                '</div>' +
                '<div class="span9">' +
                    '<p><strong>' + data_results.src_first_name + ' ' + data_results.src_last_name + '</strong> from ' + data_results.primary_city + ':<br />' +
                    '<ul>' +
                        '<li><strong>' + data_results.questions['9200af1a79cb'].value + '</strong><br />' + data_results.responses['9200af1a79cb'] + '</li>' +
                        '<br />' +
                        '<li><strong>' + data_results.questions['db10ff019c5a'].value + '</strong><br />' + data_results.responses['db10ff019c5a'] + '</li>' +
                    '</ul>' +
                '</div>',
            popup:  '<p>' + data_results.responses['f6d5d1c2d738'] + '</p>'
        };
        slide_objects.push(marker_object);
    }
    map_slider_data(slide_objects);
};

function map_slider_data(dataSourceToDisplay) {
    $mapper.slideMapper('add', dataSourceToDisplay);

};