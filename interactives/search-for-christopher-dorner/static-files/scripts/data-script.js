var jqueryNoConflict = jQuery;
var map;

// begin main function
jqueryNoConflict(document).ready(function() {
    google.maps.event.addDomListener(window, 'load', createMap);
    retriveData();
});

// begin function
function createMap(){

    // add encrypted table id
    var cityCrosswalkTableId = '113boV0mDDfay8ngXn8REwwIplC_uEWogLf6aepw';
    var userContributedTableId = '1RvesiAIGe14Gw3w7zjQm_2NBlZLl5EBSstdvf6E';
    var locationColumn = 'Location';
    var centerLosAngeles = new google.maps.LatLng(34.061841979429445, -118.26370239257812);

    map = new google.maps.Map(document.getElementById('content-map-canvas'), {
        center: centerLosAngeles,
        zoom: 13,
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

    // Initialize ft layer of new crosswalks
    var cityCrosswalkLayer = new google.maps.FusionTablesLayer({
        query: {
            select: locationColumn,
            from: cityCrosswalkTableId
        },
        map: map,
        suppressInfoWindows: false
    });

    google.maps.event.addDomListener(map, 'idle', function() {
      calculateCenter();
    });

    google.maps.event.addDomListener(window, 'resize', function() {
      map.setCenter(centerLosAngeles);
    });

};

// function to maintain center point of map
function calculateCenter(){
    center = map.getCenter();
};

// grab data
function retriveData() {
    var dataSource = 'static-files/data/flat_data.json';
    jqueryNoConflict.getJSON(dataSource, renderDataVisualsTemplate);
};

// render data visuals template
function renderDataVisualsTemplate(data){
    renderHandlebarsTemplate('static-files/templates/content-display.handlebars', '#content-display', data);
};

// render handlebars templates via ajax
function getTemplateAjax(path, callback) {
    var source, template;
    jqueryNoConflict.ajax({
        url: path,
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);
            if (callback) callback(template);
        }
    });
};

// render handlebars template function
function renderHandlebarsTemplate(withTemplate,inElement,withData){
    getTemplateAjax(withTemplate, function(template) {
        jqueryNoConflict(inElement).html(template(withData));
    })
};

// add handlebars debugger
function handlebarsDebugHelper(){
    Handlebars.registerHelper("debug", function(optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);
    });
};

// embed function
function embedBox() {
    var embed_url = 'http://projects.scpr.org/static/maps/flu-clinics/iframe.html';

    jAlert('<strong>To embed this visualization your blog or site, just copy this code:<br></strong>&lt;iframe src=\"'+ embed_url +'\" width=\"540px\" height=\"600px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
};