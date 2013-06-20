/*!
 * Searchable Map Template with Google Fusion Tables
 * http://derekeder.com/searchable_map_template/
 *
 * Copyright 2012, Derek Eder
 * Licensed under the MIT license.
 * https://github.com/derekeder/FusionTable-Map-Template/wiki/License
 *
 * Date: 12/10/2012
 *
 */

var MapsLib = MapsLib || {};

var MapsLib = {

    fusionTableId: "1IHw19kbHZ7RLJmFKITdyRbhKYJk0EDsFO7ZJA3o",

    googleApiKey: "AIzaSyCgh93OAbzooidV0OUpIOoc6kTxV5o69do",

    locationColumn: "latitude",

    // center on the L.A.
    map_centroid: new google.maps.LatLng(34.036054430724114, -118.26595796365973),

    // center on the state
    //map_centroid: new google.maps.LatLng(36.173326622799024, -120.025634765625),

    locationScope: "California",

    recordName: "bridge",

    recordNamePlural: "bridges",

    searchRadius: 8047,

    defaultZoom: 8,

    addrMarkerImage: 'http://projects.scpr.org/static/static-files/images/maps-icons-collection/blue-pushpin.png',

    currentPinpoint: null,

    initialize: function() {
        $( "#result_count" ).html("");

        geocoder = new google.maps.Geocoder();

        var myOptions = {
            zoom: MapsLib.defaultZoom,
            center: MapsLib.map_centroid,
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
            position: google.maps.ControlPosition.LEFT_TOP
            }
        };

        map = new google.maps.Map($("#content-map-canvas")[0],myOptions);

        // maintains map centerpoint for responsive design
        google.maps.event.addDomListener(map, 'idle', function() {
            MapsLib.calculateCenter();
        });

        google.maps.event.addDomListener(window, 'resize', function() {
            map.setCenter(MapsLib.map_centroid);
        });

        MapsLib.searchrecords = null;

        //reset filters
        $("#search_address").val(MapsLib.convertToPlainString($.address.parameter('address')));
        var loadRadius = MapsLib.convertToPlainString($.address.parameter('radius'));

        if (loadRadius != "") $("#search_radius").val(loadRadius);
        else $("#search_radius").val(MapsLib.searchRadius);
        $("#rbTypeAll").attr("checked", "checked");
        $("#result_count").hide();

        // begin custom initializers

        // minimum date to begin searching
        var minDate = moment("1890");

        // now
        var maxDate = moment();

        // now minus how much to open the filter range
        var startDate = moment().subtract('years', 124);

        // now
        var endDate = moment();
        MapsLib.initializeDateSlider(minDate, maxDate, startDate, endDate, "years", 1);

        $("#bhi-slider").slider({
            orientation: "horizontal",
            range: true,
            min: 0,
            max: 100,
            values: [0, 100],
            step: 1,
            slide: function (event, ui) {
                $("#bhi-selected-start").html(ui.values[0]);
                $("#bhi-selected-end").html(ui.values[1]);
            },
            stop: function(event, ui) {
                MapsLib.doSearch();
            }
        });

        $("#adt-slider").slider({
            orientation: "horizontal",
            range: true,
            min: 0,
            max: 100000,
            values: [0, 100000],
            step: 1,
            slide: function (event, ui) {
                $("#adt-selected-start").html(ui.values[0]);
                $("#adt-selected-end").html(ui.values[1]);
            },
            stop: function(event, ui) {
                MapsLib.doSearch();
            }
        });

        // end custom initializers

        //run the default search
        MapsLib.doSearch();
    },

    doSearch: function(location) {
        MapsLib.clearSearch();
        var address = $("#search_address").val();
        MapsLib.searchRadius = $("#search_radius").val();
        var whereClause = MapsLib.locationColumn + " not equal to ''";

        var status_column = "status";
        if ( $("#rbTypeSd").is(':checked')) whereClause += " AND " + status_column + "=1";
        if ( $("#rbTypeFo").is(':checked')) whereClause += " AND " + status_column + "=2";
        if ( $("#rbTypeNd").is(':checked')) whereClause += " AND " + status_column + "=0";

        var type_column = "fracture_critical_status";
        if ( $("#cbTypeFc").is(':checked')) whereClause += " AND " + type_column + "=1";

        // bhi slider filter
        whereClause += " AND 'cbhi_rating' >= '" + $("#bhi-selected-start").html() + "'";
        whereClause += " AND 'cbhi_rating' <= '" + $("#bhi-selected-end").html() + "'";

        // date slider filter
        whereClause += " AND 'year_built' >= '" + $('#startDate').html() + "'";
        whereClause += " AND 'year_built' <= '" + $('#endDate').html() + "'";

        // adt slider filter
        //whereClause += " AND 'avg_daily_traffic' >= '" + $("#adt-selected-start").html() + "'";
        //whereClause += " AND 'avg_daily_traffic' <= '" + $("#adt-selected-end").html() + "'";

        // ntl slider filter
        //whereClause += " AND 'nbi_sufficiency_rating' >= '" + $("#ntl-selected-start").html() + "'";
        //whereClause += " AND 'nbi_sufficiency_rating' <= '" + $("#ntl-selected-end").html() + "'";

        // length slider filter
        //whereClause += " AND 'length' >= '" + $("#length-selected-start").html() + "'";
        //whereClause += " AND 'length' <= '" + $("#length-selected-end").html() + "'";

        // end custom filters

        if (address != "") {
            if (address.toLowerCase().indexOf(MapsLib.locationScope) == -1)
            address = address + " " + MapsLib.locationScope;

            geocoder.geocode({'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    MapsLib.currentPinpoint = results[0].geometry.location;
                    $.address.parameter('address', encodeURIComponent(address));
                    $.address.parameter('radius', encodeURIComponent(MapsLib.searchRadius));
                    map.setCenter(MapsLib.currentPinpoint);
                    map.setZoom(12);

                    MapsLib.addrMarker = new google.maps.Marker({
                        position: MapsLib.currentPinpoint,
                        map: map,
                        icon: MapsLib.addrMarkerImage,
                        animation: google.maps.Animation.DROP,
                        title:address
                    });

                    whereClause += " AND ST_INTERSECTS(" + MapsLib.locationColumn + ", CIRCLE(LATLNG" + MapsLib.currentPinpoint.toString() + "," + MapsLib.searchRadius + "))";

                    MapsLib.drawSearchRadiusCircle(MapsLib.currentPinpoint);
                    MapsLib.submitSearch(whereClause, map, MapsLib.currentPinpoint);
                } else {
                    alert("We could not find your address: " + status);
                }
            });
        } else {
            //search without geocoding callback
            MapsLib.submitSearch(whereClause, map);
        }
    },

    submitSearch: function(whereClause, map, location) {
    //get using all filters
    //NOTE: styleId and templateId are recently added attributes to load custom marker styles and info windows
    //you can find your Ids inside the link generated by the 'Publish' option in Fusion Tables
    //for more details, see https://developers.google.com/fusiontables/docs/v1/using#WorkingStyles

        MapsLib.searchrecords = new google.maps.FusionTablesLayer({
            query: {
                from:   MapsLib.fusionTableId,
                select: MapsLib.locationColumn,
                where:  whereClause
            },
            suppressInfoWindows: true,
            styleId: 2,
            templateId: 2
        });
        MapsLib.searchrecords.setMap(map);
        MapsLib.getCount(whereClause);

        // creates lightwindow info box
        MapsLib.mapClickListener();

    },

    clearSearch: function() {
        if (MapsLib.searchrecords != null)
            MapsLib.searchrecords.setMap(null);
        if (MapsLib.addrMarker != null)
            MapsLib.addrMarker.setMap(null);
        if (MapsLib.searchRadiusCircle != null)
            MapsLib.searchRadiusCircle.setMap(null);
    },

    findMe: function() {
        // Try W3C Geolocation (Preferred)
        var foundLocation;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                foundLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                MapsLib.addrFromLatLng(foundLocation);
            }, null);
        } else {
            alert("Sorry, we could not find your location.");
        }
    },

    addrFromLatLng: function(latLngPoint) {
        geocoder.geocode({'latLng': latLngPoint}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    $('#search_address').val(results[1].formatted_address);
                    $('.hint').focus();
                    MapsLib.doSearch();
                }
            } else {
                alert("Geocoder failed due to: " + status);
            }
        });
    },

    drawSearchRadiusCircle: function(point) {
        var circleOptions = {
            strokeColor: "#4b58a6",
            strokeOpacity: 0.3,
            strokeWeight: 1,
            fillColor: "#4b58a6",
            fillOpacity: 0.05,
            map: map,
            center: point,
            clickable: false,
            zIndex: -1,
            radius: parseInt(MapsLib.searchRadius)
        };
        MapsLib.searchRadiusCircle = new google.maps.Circle(circleOptions);
    },

    query: function(selectColumns, whereClause, callback) {
        var queryStr = [];
        queryStr.push("SELECT " + selectColumns);
        queryStr.push(" FROM " + MapsLib.fusionTableId);
        queryStr.push(" WHERE " + whereClause);
        var sql = encodeURIComponent(queryStr.join(" "));
        $.ajax({url: "https://www.googleapis.com/fusiontables/v1/query?sql="+sql+"&callback="+callback+"&key="+MapsLib.googleApiKey, dataType: "jsonp"});
    },

    handleError: function(json) {
        if (json["error"] != undefined) {
            var error = json["error"]["errors"]
            console.log("Error in Fusion Table call!");

            for (var row in error) {
                console.log(" Domain: " + error[row]["domain"]);
                console.log(" Reason: " + error[row]["reason"]);
                console.log(" Message: " + error[row]["message"]);
            }
        }
    },

    getCount: function(whereClause) {
        var selectColumns = "Count()";
        MapsLib.query(selectColumns, whereClause,"MapsLib.displaySearchCount");
    },

    displaySearchCount: function(json) {
        MapsLib.handleError(json);
        var numRows = 0;

        if (json["rows"] != null)
            numRows = json["rows"][0];

        var name = MapsLib.recordNamePlural;
        if (numRows == 1)
            name = MapsLib.recordName;
        $( "#result_count" ).fadeOut(function() {
            $( "#result_count" ).html(MapsLib.addCommas(numRows) + " " + name + " found");
        });
        $( "#result_count" ).fadeIn();
    },

    addCommas: function(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },

    // maintains map centerpoint for responsive design
    calculateCenter: function() {
        center = map.getCenter();
    },

    //converts a slug or query string in to readable text
    convertToPlainString: function(text) {
        if (text == undefined) return '';
        return decodeURIComponent(text);
    },

    mapClickListener: function() {
        google.maps.event.addListener(MapsLib.searchrecords, 'click', function(e) {

            var fusionTableObject = {
                bridge_number: e.row['bridge_number'].value,
                county: e.row['county'].value,
                agency: e.row['agency'].value,
                latitude: e.row['latitude'].value,
                longitude: e.row['longitude'].value,
                facility_carried: e.row['facility_carried'].value,
                feature_intersected: e.row['feature_intersected'].value,
                natl_fracture_critical: e.row['natl_fracture_critical'].value,
                status: e.row['status'].value,
                nbi_sufficiency_rating: e.row['nbi_sufficiency_rating'].value,
                cbhi_rating: e.row['cbhi_rating'].value,
                year_built: e.row['year_built'].value,
                avg_daily_traffic: addCommas(e.row['avg_daily_traffic'].value),
                lanes: e.row['lanes'].value,
                width: roundDecimal(e.row['width'].value),
                length: roundDecimal(e.row['length'].value)
                //width: e.row['width'].value,
                //length: e.row['length'].value
            }

            console.log(fusionTableObject);

            //_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;

            var html = _.template(
                '<p style="float: right" id="close"><strong>[X]</strong></p>' +

                '<h4><%= facility_carried %> bridge</h4>' +

                '<ul class="chartlist">' +
                    '<li>' +
                        '<% if (cbhi_rating === "0" || cbhi_rating === "" || cbhi_rating === null) { %>' +
                            '<a href="javascript:void(0)">Ca. Bridge Health Index: n/a</a><span class="index california-bridges" style="width:0%"></span>' +
                        '<% } else { %>' +
                            '<a href="#">Ca. Bridge Health Index: <%= cbhi_rating %></a><span class="index california-bridges" style="width:<%= cbhi_rating %>%"></span>' +
                        '<% } %>' +
                    '</li>' +
                    '<li>' +
                        '<% if (nbi_sufficiency_rating === "0" || nbi_sufficiency_rating === "" || nbi_sufficiency_rating === null) { %>' +
                            '<a href="javascript:void(0)">FHWA Sufficiency Rating: n/a</a><span class="index national-bridges" style="width:0%"></span>' +
                        '<% } else { %>' +
                            '<a href="#">FHWA Sufficiency Rating: <%= nbi_sufficiency_rating %></a><span class="index national-bridges" style="width:<%= nbi_sufficiency_rating %>%"></span>' +
                        '<% } %>' +
                    '</li>' +
                '</ul>' +

                '<p>The <%= facility_carried %> bridge in <%= county %> was built in <%= year_built %>' +
                '<% if (avg_daily_traffic === "0" || avg_daily_traffic === "" || avg_daily_traffic === null || avg_daily_traffic === "NaN") { %>' +
                    ' and intersects ' +
                '<% } else { %>' +
                    ' and carries an average of <%= avg_daily_traffic %> motorists each day over ' +
                '<% } %>' +
                '<%= feature_intersected %>.</p>' +

                '<p>This bridge ' +
                    '<% if (lanes === "0" || lanes === "" || lanes === null || lanes === "NaN") { %>' +
                    '<% } else { %>' +
                        'has <%= lanes %> lanes, ' +
                    '<% } %>' +

                    '<% if (width === "0.00" || width === "" || width === null || width === "NaN") { %>' +
                    '<% } else { %>' +
                        'is <%= width %> feet wide, </li>' +
                    '<% } %>' +

                    '<% if (length === "0.00" || length === "" || length === null || length === "NaN") { %>' +
                    '<% } else { %>' +
                        'is <%= length %> feet in length, </li>' +
                    '<% } %>' +

                    '<% if (agency === "" || agency === null) { %>' +
                    '<% } else { %>' +
                        'and maintained by the <%= agency %>' +
                    '<% } %>' +
                '.</p>' +

                '<% if (status === "1") { %>' +
                    '<span><strong>&#8226; Structurally Deficient</strong></span> ' +
                '<% } else if (status === "2") { %>' +
                    '<span><strong>&#8226; Functionally Obsolete</strong></span> ' +
                '<% } else if (status === "0") { %>' +
                    '<span><strong>&#8226; Not Deficient</strong></span> ' +
                '<% } else { %>' +
                    '<span></span> ' +
                '<% } %>' +

                '<% if (natl_fracture_critical === "N") { %>' +
                    '<span></span> ' +
                '<% } else { %>' +
                    '<span><strong>&#8226; Fracture Critical</strong></span> ' +
                '<% } %>', fusionTableObject);

            jqueryNoConflict('#content-background').css({'opacity' : '0.7'}).fadeIn('fast');
            jqueryNoConflict('#content-display').html(html).center().fadeIn('slow');

            jqueryNoConflict('#close').click(function(){
                jqueryNoConflict('#content-display').fadeOut('fast');
                jqueryNoConflict('#content-background').fadeOut('fast');
            });

        });
    },

    initializeDateSlider: function(minDate, maxDate, startDate, endDate, stepType, step) {
        var interval = MapsLib.sliderInterval(stepType);

        $('#minDate').html(minDate.format('YYYY'));
        $('#maxDate').html(maxDate.format('YYYY'));

        $('#startDate').html(startDate.format('YYYY'));
        $('#endDate').html(endDate.format('YYYY'));

        $('#date-range').slider({
            range: true,
            step: step,
            values: [ Math.floor((startDate.valueOf() - minDate.valueOf()) / interval), Math.floor((maxDate.valueOf() - minDate.valueOf()) / interval) ],
            max: Math.floor((maxDate.valueOf() - minDate.valueOf()) / interval),
            slide: function(event, ui) {
                $('#startDate').html(minDate.clone().add(stepType, ui.values[0]).format('YYYY'));
                $('#endDate').html(minDate.clone().add(stepType, ui.values[1]).format('YYYY'));
            },
            stop: function(event, ui) {
                MapsLib.doSearch();
            }
        });
    },

    sliderInterval: function(interval) {
        if (interval == "years")
            return 365 * 24 * 3600 * 1000;
        if (interval == "quarters")
            return 3 * 30.4 * 24 * 3600 * 1000;
        if (interval == "months") //this is very hacky. months have different day counts, so our point interval is the average - 30.4
            return 30.4 * 24 * 3600 * 1000;
        if (interval == "weeks")
            return 7 * 24 * 3600 * 1000;
        if (interval == "days")
            return 24 * 3600 * 1000;
        if (interval == "hours")
            return 3600 * 1000;
        else
            return 1;
    }
}

jQuery.fn.center = function () {
	this.css('position','absolute');
	this.css('top', ( jqueryNoConflict(window).height() - this.height() ) / 4+jqueryNoConflict(window).scrollTop() + 'px');
	this.css('left', ( jqueryNoConflict(window).width() - this.width() ) / 2+jqueryNoConflict(window).scrollLeft() + 'px');
	return this;
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

function roundDecimal(string) {
    var workingData = parseFloat(string);
    workingData = workingData.toFixed(2)
    return workingData;
}

function glossaryTerms(){
    var glossaryHtml =
        '<p style="float: right" id="close"><strong>[X]</strong></p>' +
        '<h4>Explaining the Terms</h4>' +
        '<p><strong>Structurally Deficient</strong>: A bridge has a physical flaw of some kind. That could be something serious [such as?] - but in most cases it\'s just cracked pavement or peeling paint.</p>' +
        '<p><strong>Functionally Obsolete</strong>: A bridge isn\'t up to current building standards – that could mean the lanes are too narrow or there is no shoulder on the side of the bridge for stalled cars. [Could it also mean something serious? Example?]</p>' +
        '<p><strong>Fracture Critical</strong>: A bridge doesn\'t have a secondary support system to stop it from collapsing in case it is seriously overloaded or experiences a significant accident that impacts a vulnerable section. Both the bridge in Washington state and the one that fell in Minnesota in 2007 were Fracture Critical. Just because a bridge is Fracture Critical does not mean it is structurally unsound.</p>';

    jqueryNoConflict('#content-background').css({'opacity' : '0.7'}).fadeIn('fast');
    jqueryNoConflict('#content-display').html(glossaryHtml).center().fadeIn('slow');

    jqueryNoConflict('#close').click(function(){
        jqueryNoConflict('#content-display').fadeOut('fast');
        jqueryNoConflict('#content-background').fadeOut('fast');
    });
}