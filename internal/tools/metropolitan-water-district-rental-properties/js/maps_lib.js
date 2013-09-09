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

    // five_county_bridge_new
    fusionTableId: "1Tpw1Mr6Jj6I9LF_Vf7FiUmSKpW2g2-GhTobCLAY",

    // late night fix table
    //fusionTableId: "1TF6LDt6cD4cpdQTxMgAPRc9quGANq9mXJw5ldw8",

    googleApiKey: "AIzaSyCgh93OAbzooidV0OUpIOoc6kTxV5o69do",

    locationColumn: "latitude",

    // center on the L.A.
    map_centroid: new google.maps.LatLng(34.036054430724114, -118.26595796365973),

    // center on the state
    //map_centroid: new google.maps.LatLng(36.173326622799024, -120.025634765625),

    locationScope: "California",

    recordName: "property",

    recordNamePlural: "properties",

    searchRadius: 8047,

    addrMarkerImage: 'http://projects.scpr.org/static/static-files/images/maps-icons-collection/blue-pushpin.png',

    currentPinpoint: null,

    initialize: function() {

        $( "#result_count" ).html("");

        geocoder = new google.maps.Geocoder();

        // set zoom for mobile devices
        if (navigator.userAgent.match(/(iPhone)|(iPod)|(android)|(webOS)/i)) {
            defaultZoom = 6;
        } else {
            defaultZoom = 8;
        }

        var myOptions = {
            zoom: defaultZoom,
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

        if (loadRadius != ""){
            $("#search_radius").val(loadRadius);
        } else {
            $("#search_radius").val(MapsLib.searchRadius);
        }

        $("#rbTypeAll").attr("checked", "checked");

        $("#result_count").hide();


        /*
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
        */

        //run the default search
        MapsLib.doSearch();
    },

    doSearch: function(location) {
        MapsLib.clearSearch();
        var address = $("#search_address").val();
        MapsLib.searchRadius = $("#search_radius").val();
        var whereClause = MapsLib.locationColumn + " not equal to ''";

        /*

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
        whereClause += " AND 'avg_daily_traffic' >= '" + $("#adt-selected-start").html() + "'";
        whereClause += " AND 'avg_daily_traffic' <= '" + $("#adt-selected-end").html() + "'";

        // ntl slider filter
        //whereClause += " AND 'nbi_sufficiency_rating' >= '" + $("#ntl-selected-start").html() + "'";
        //whereClause += " AND 'nbi_sufficiency_rating' <= '" + $("#ntl-selected-end").html() + "'";

        // length slider filter
        //whereClause += " AND 'length' >= '" + $("#length-selected-start").html() + "'";
        //whereClause += " AND 'length' <= '" + $("#length-selected-end").html() + "'";

        // end custom filters

        */


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

    uncacheTiles: function() {
        $("img[src*='googleapis']").each(function(){
            $(this).attr("src",$(this).attr("src")+"&"+(new Date()).getTime());
            //console.log($(this).attr("src"));
        });
    },

    mapClickListener: function() {
        google.maps.event.addListener(MapsLib.searchrecords, 'click', function(e) {

            var fusionTableObject = {
                lessee: e.row['lessee'].value,
                general_use: e.row['general_use'].value,
                rl_type: e.row['rl_type'].value,
                status: e.row['status'].value,
                county: e.row['county'].value,
                start_date: e.row['start_date'].value,
                end_date: e.row['end_date'].value,
                acres: e.row['acres'].value,
                rent_1: e.row['rent_1'].value,
                frequency_1: e.row['frequency_1'].value,
                rent_2: e.row['rent_2'].value,
                frequency_2: e.row['frequency_2'].value,
                rent_3: e.row['rent_3'].value,
                frequency_3: e.row['frequency_3'].value,
                latitude: e.row['latitude'].value,
                longitude: e.row['longitude'].value,
            }

            var image = '<img src=\"https://maps.googleapis.com/maps/api/streetview?size=500x500&location=' + e.row['latitude'].value + ',%20' + e.row['longitude'].value + '&sensor=true\" />';

            var html = _.template(
                '<p style="float: right" id="close"><strong>[X]</strong></p>' +

                '<h4>Lessee: <%= lessee %></h4>' + image +
                '<p><a href="https://maps.google.com/maps?q=&layer=c&cbll=' + e.row['latitude'].value + ','+ e.row['longitude'].value + '&cbp=11,0,0,0,0" target="_blank">View in StreetView</a></p>' +

                '<table class="table table-bordered table-striped">' +
                    '<thead>' +
                        '<tr>' +
                            '<th>County</th>' +
                            '<th>Acres</th>' +
                            '<th>General Use</th>' +
                            '<th>Type</th>' +
                            '<th>Status</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                        '<tr>' +
                            '<td><%= county %></td>' +
                            '<td><%= acres %></td>' +
                            '<td><%= general_use %></td>' +
                            '<td><%= rl_type %></td>' +
                            '<td><%= status %></td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>' +
                '<ul>' +
                    '<li><strong>Start Date</strong>: <%= start_date %></li>' +
                    '<li><strong>End Date</strong>: <%= end_date %></li>' +
                    '<li><strong>Rent 1</strong>: <%= rent_1 %></li>' +
                    '<li><strong>Frequency 1</strong>: <%= frequency_1 %></li>' +
                '</ul>', fusionTableObject);

            jqueryNoConflict('#content-background').css({'opacity' : '0.7'}).fadeIn('fast');
            jqueryNoConflict('#content-display').html(html).center().fadeIn('slow');

            jqueryNoConflict('#close').click(function(){
                jqueryNoConflict('#content-display').fadeOut('fast');
                jqueryNoConflict('#content-background').fadeOut('fast');
            });

        });
    },


    /*

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
*/

}



jQuery.fn.center = function () {
	this.css('position','absolute');
	this.css('top', ( jqueryNoConflict(window).height() - this.height() ) / 4+jqueryNoConflict(window).scrollTop() + 'px');
	this.css('left', ( jqueryNoConflict(window).width() - this.width() ) / 2+jqueryNoConflict(window).scrollLeft() + 'px');
	return this;
}

function roundDecimal(string) {
    var workingData = parseFloat(string);
    workingData = workingData.toFixed(2)
    return workingData;
}