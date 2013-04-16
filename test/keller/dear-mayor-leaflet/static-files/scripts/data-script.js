var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    retriveData();

    $mapper = $('#mapper').slideMapper({
        controlType: 'top',
        autoHeight: 'true',
        center: [34.036054430724114, -118.26595796365973],
        zoom: 10,
        maxZoom: 25,
        mapHeight: 600,
        leafPile: true,
        mapType: 'stamen-terrain',
        mapPosition: 'bottom'
    });

});

// grab data
function retriveData() {

/*
    var dataSource = 'https://www.publicinsightnetwork.org/air2/public/search?a=6f4d503616e1115157a64bd26b51aec7&q=query_uuid:5bf1fe369f0e&t=JSON';
*/

    var dataSource = 'static-files/data/dear_mayor_master_data_sheet-handlebars.json';
    jqueryNoConflict.getJSON(dataSource, processDataForMap);
};

// render data visuals template
function processDataForMap(data){
    var slide_objects = [];
    for (var i=0; i<data.objects.length; i++) {
        var data_results = data.objects[i];
        var marker_object = {
            icon: determineIconToUse(data_results.responsesf6d5d1c2d738),
            marker: [data_results.primarylat, data_results.primarylong],
            center: [data_results.primarylat, data_results.primarylong],
            html:
            '<div class="row-fluid">' +
                '<div class="span12">' +
                    '<h4 class="kicker">' + data_results.responsesf6d5d1c2d738 + '</h4>' +
                '</div>' +
            '</div>' +
            '<div class="row-fluid">' +
                '<div class="span2">' +
                    '<p><img src="' + determineIconToUse(data_results.responsesf6d5d1c2d738) + '" /></p>' +
                '</div>' +
                '<div class="span10">' +
                    '<p><strong>' + data_results.srcfirstname + ' ' + data_results.srclastname + '</strong> from ' + data_results.primarycity + ':<br />' +
                    '<ul>' +
                        '<li><strong>' + data_results.questions9200af1a79cbvalue + '</strong><br />' + data_results.responses9200af1a79cb + '</li>' +
                        '<br />' +
                        '<li><strong>' + data_results.questionsdb10ff019c5avalue + '</strong><br />' + data_results.responsesdb10ff019c5a + '</li>' +
                    '</ul>' +
                '</div>',
            //popup:  '<p>' + data_results.responsesf6d5d1c2d738 + '</p>'
        };

        slide_objects.push(marker_object);
    }
    map_slider_data(slide_objects);
};

function map_slider_data(dataSourceToDisplay) {
    $mapper.slideMapper('add', dataSourceToDisplay);
};

// function to evaluate topic and assign icon image
function determineIconToUse(element_to_evaluate){
    var icon;
    if (element_to_evaluate == 'Crime'){
        icon = 'static-files/images/crime.png';
    } else if (element_to_evaluate == 'Public health'){
        icon = 'static-files/images/health.png';
    } else if (element_to_evaluate == 'Taxes'){
        icon = 'static-files/images/taxes.png';
    } else if (element_to_evaluate == 'Environment'){
        icon = 'static-files/images/environment.png';
    } else if (element_to_evaluate == 'Education'){
        icon = 'static-files/images/education.png';
    } else if (element_to_evaluate == 'Transportation'){
        icon = 'static-files/images/transportation.png';
    } else if (element_to_evaluate == 'Politics'){
        icon = 'static-files/images/politics.png';
    } else {
        icon = 'static-files/images/other.png';
    }
    return icon;
};

// function to deal with IE's console error
function log(obj) {
    if (window.console && console.log) console.log(obj);
};