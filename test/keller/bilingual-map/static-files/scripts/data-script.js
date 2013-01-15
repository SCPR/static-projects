var jqueryNoConflict = jQuery;
var map;

// begin main function
jqueryNoConflict(document).ready(function() {

    google.maps.event.addDomListener(window, 'load', createMap);

});
// end

// begin function
function createMap(){

    // add encrypted table id
    var bilingualSchoolTableId = '1gqAgWr7jCzf2T0xzgjyx6S6oaa4puFvdWjFyjMo';
    var locationColumn = 'location';
    var centerLosAngeles = new google.maps.LatLng(34.061841979429445, -118.26370239257812);

    map = new google.maps.Map(document.getElementById('data-map-canvas'), {
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

    // Initialize ft layer of new crosswalks
    var bilingualSchoolLayer = new google.maps.FusionTablesLayer({
        query: {
            select: locationColumn,
            from: bilingualSchoolTableId
        },
        map: map,
        suppressInfoWindows: true
    });

    google.maps.event.addListener(bilingualSchoolLayer, 'click', function(e) {

        var fusionTableObject = {
            school_name: e.row['school_name'].value,
            location: e.row['location'].value,
            school_phone: e.row['school_phone'].value,
            website: e.row['website'].value,
            contact_name: e.row['contact_name'].value,
            contact_phone: e.row['contact_phone'].value,
            contact_email: e.row['contact_email'].value,
            partner_language_1: e.row['partner_language_1'].value,
            partner_language_2: e.row['partner_language_2'].value,
            grade_K: e.row['K'].value,
            grade_1: e.row['1'].value,
            grade_2: e.row['2'].value,
            grade_3: e.row['3'].value,
            grade_4: e.row['4'].value,
            grade_5: e.row['5'].value,
            grade_6: e.row['6'].value,
            grade_7: e.row['7'].value,
            grade_8: e.row['8'].value,
            grade_9: e.row['9'].value,
            grade_10: e.row['10'].value,
            grade_11: e.row['11'].value,
            grade_12: e.row['12'].value,
            students_on_free_reduced_lunch: e.row['students_on_free_reduced_lunch'].value,
            third_language: e.row['third_language'].value,
            year_program_started: e.row['year_program_started'].value,
            program_model: e.row['program_model'].value,
            EL: e.row['EL'].value,
            IEP: e.row['IEP'].value,
            resource_1: e.row['resource_1'].value,
            cost_1: e.row['cost_1'].value,
            access_purchase_1: e.row['access_purchase_1'].value,
            resource_2: e.row['resource_2'].value,
            cost_2: e.row['cost_2'].value,
            access_purchase_2: e.row['access_purchase_2'].value,
            resource_3: e.row['resource_3'].value,
            cost_3: e.row['cost_3'].value,
            access_purchase_3: e.row['access_purchase_3'].value,
            resource_4: e.row['resource_4'].value,
            cost_4: e.row['cost_4'].value,
            access_purchase_4: e.row['access_purchase_4'].value,
            biliteracy_seal: e.row['biliteracy_seal'].value,
            since_when: e.row['since_when'].value,
            special_recognition: e.row['special_recognition'].value
        }

        renderMapDataDetailsTemplate(fusionTableObject);

    });

    google.maps.event.addDomListener(map, 'idle', function() {
      calculateCenter();
    });

    google.maps.event.addDomListener(window, 'resize', function() {
      map.setCenter(centerLosAngeles);
    });

};
// end

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
}
//end

// create projects content template
function renderMapDataDetailsTemplate(data){
    getTemplateAjax('static-files/templates/map-data-details.handlebars', function(template) {
        jqueryNoConflict('#map-data-details').html(template(data));
    })
};

// function to maintain center point of map
function calculateCenter(){
    center = map.getCenter();
};
// end

// embed function
function embedBox() {
    var embed_url = 'http://projects.scpr.org/static/maps/flu-clinics/iframe.html';

    jAlert('<strong>To embed this visualization your blog or site, just copy this code:<br></strong>&lt;iframe src=\"'+ embed_url +'\" width=\"540px\" height=\"600px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
}
// end