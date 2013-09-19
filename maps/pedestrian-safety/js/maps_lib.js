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
    googleApiKey: "AIzaSyCgh93OAbzooidV0OUpIOoc6kTxV5o69do",

    crossWalkTableId: "1vdWsizdohZnLO11PlAf1HRvcBa73EoRziHr_gi0",
    crossWalkLocation: "Lat",

    userContribTableId: "1RvesiAIGe14Gw3w7zjQm_2NBlZLl5EBSstdvf6E",
    userContribLocationColumn: "Location",

    //userContribTableId: "1L_k1wgUIDJFXX6-bLcCnj5eap1LT5QBNnc5qpmw",
    //userContribLocationColumn: "geocoded_location",

    // center on the L.A.
    map_centroid: new google.maps.LatLng(34.061841979429445, -118.26370239257812),

    locationScope: "California",

    recordName: "submission",

    recordNamePlural: "submissions",

    searchRadius: 8047,

    addrMarkerImage: 'http://projects.scpr.org/static/static-files/images/maps-icons-collection/blue-pushpin.png',

    currentPinpoint: null,

    initialize: function() {

        $( "#result_count" ).html("");

        geocoder = new google.maps.Geocoder();

        // set zoom for mobile devices
        if (navigator.userAgent.match(/(iPhone)|(iPod)|(android)|(webOS)/i)) {
            defaultZoom = 9;
        } else {
            defaultZoom = 11;
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
            position: google.maps.ControlPosition.RIGHT_TOP
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

        MapsLib.userContrib = null;

        //reset filters
        $("#search_address").val(MapsLib.convertToPlainString($.address.parameter('address')));
        var loadRadius = MapsLib.convertToPlainString($.address.parameter('radius'));

        if (loadRadius != ""){
            $("#search_radius").val(loadRadius);
        } else {
            $("#search_radius").val(MapsLib.searchRadius);
        }

        //$(":checkbox").attr("checked", "checked");

        $("#result_count").hide();

        //run the default search
        MapsLib.doSearch();
    },

    doSearch: function(location) {
        MapsLib.clearSearch();
        var address = $("#search_address").val();
        MapsLib.searchRadius = $("#search_radius").val();

        var whereClause = MapsLib.userContribLocationColumn + " not equal to ''";

        var type_column = "pedestrian_cyclist";
        var tempWhereClause = [];
        if ( $("#cbTypePedes").is(':checked')) tempWhereClause.push("Pedestrian");
        if ( $("#cbTypeCycle").is(':checked')) tempWhereClause.push("Cyclist");
        if ( $("#cbTypeBoth").is(':checked')) tempWhereClause.push("Both");
        whereClause += " AND " + type_column + " IN ('" + tempWhereClause.join('\',\'') + "')";

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

                    whereClause += " AND ST_INTERSECTS(" + MapsLib.userContribLocationColumn + ", CIRCLE(LATLNG" + MapsLib.currentPinpoint.toString() + "," + MapsLib.searchRadius + "))";

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

        MapsLib.userContrib = new google.maps.FusionTablesLayer({
            query: {
                from:   MapsLib.userContribTableId,
                select: MapsLib.userContribLocationColumn,
                where:  whereClause
            },
            suppressInfoWindows: true,
            styleId: 4,
            templateId: 2
        });

        MapsLib.cityCrosswalks = new google.maps.FusionTablesLayer({
            query: {
                from:   MapsLib.crossWalkTableId,
                select: MapsLib.crossWalkLocation
                //where:  whereClause
            },
            suppressInfoWindows: true,
            styleId: 1,
            templateId: 1
        });

        MapsLib.userContrib.setMap(map);
        MapsLib.cityCrosswalks.setMap(map);

        MapsLib.getCount(whereClause);

        // creates lightwindow info box
        MapsLib.userContribClickListener();
        MapsLib.crossWalkClickListener();
    },

    clearSearch: function() {
        if (MapsLib.userContrib != null)
            MapsLib.userContrib.setMap(null);
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

    query: function(selectColumns, table, whereClause, callback) {
        var queryStr = [];
        queryStr.push("SELECT " + selectColumns);
        queryStr.push(" FROM " + table);
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
        MapsLib.query(selectColumns, MapsLib.userContribTableId, whereClause, "MapsLib.displaySearchCount");
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
            $( "#result_count" ).html(MapsLib.addCommas(numRows) + " " + name);
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
        });
    },

    userContribClickListener: function() {
        google.maps.event.addListener(MapsLib.userContrib, 'click', function(e) {

            var fusionTableObject = {
                timestamp: e.row['Timestamp'].value,
                name: e.row['name'].value,
                pedestrian_cyclist: e.row['pedestrian_cyclist'].value,
                intersection: e.row['intersection'].value,
                issue_there: e.row['issue_there'].value,
                location: e.row['Location'].value
            }

            var image = '<img src=\"https://maps.googleapis.com/maps/api/streetview?size=500x500&location=' + e.row['Location'].value + '&sensor=true\" />';

            var html = _.template(
                '<p style="float: right" id="close"><strong>[X]</strong></p>' +
                '<span style="font-size: 10px; text-transform: uppercase; font-weight: bold;">Submitted by You</span>' +
                '<h4><%= intersection %></h4>' +
                '<p><%= name %> said:</p>' +
                '<blockquote><%= issue_there %></blockquote>' +
                '<img src=\"http://maps.googleapis.com/maps/api/streetview?size=500x500&location=' +
                e.row['Location'].value + '&fov=90&heading=235&pitch=10&sensor=false\" />' +
                '<p><a href="https://maps.google.com/maps?q=&layer=c&cbll=' + e.row['Location'].value + '&cbp=11,0,0,0,0" target="_blank">Explore in Google StreetView</a></p>', fusionTableObject);

            jqueryNoConflict('#content-background').css({'opacity' : '0.7'}).fadeIn('fast');
            jqueryNoConflict('#content-display').html(html).center().fadeIn('slow');

            jqueryNoConflict('#close').click(function(){
                jqueryNoConflict('#content-display').fadeOut('fast');
                jqueryNoConflict('#content-background').fadeOut('fast');
            });

        });
    },

    crossWalkClickListener: function() {
        google.maps.event.addListener(MapsLib.cityCrosswalks, 'click', function(e) {

            var fusionTableObject = {
                rank: e.row['Rank'].value,
                intersection: e.row['Intersection'].value,
                collisions: e.row['Collisions'].value,
                councilDistrict: e.row['Council_district'].value,
                location: e.row['Location'].value,
                lat: e.row['Lat'].value,
                lon: e.row['Long'].value
            }

            var image = '<img src=\"https://maps.googleapis.com/maps/api/streetview?size=500x500&location=' + e.row['Lat'].value + ',' + e.row['Long'].value + '&sensor=true\" />';

            var html = _.template(
                '<p style="float: right" id="close"><strong>[X]</strong></p>' +
                '<span style="font-size: 10px; text-transform: uppercase; font-weight: bold;">Scheduled for Makeover</span>' +
                '<h4><%= intersection %></h4>' +
                '<p>Ranked No. <%= rank %> on the city\'s list of \"High Pedestrian-Related Collision Intersections,\" the intersection '+
                'of <strong><%= intersection %></strong> has had <%= collisions %> vehicle/pedestrian accidents over the last five years*, ' +
                'according to Los Angeles city officials.</p>' +
                '<p class="data-instructions"><em>* Per Dec. 18, 2012 data.</em></p>' +

                '<img src=\"http://maps.googleapis.com/maps/api/streetview?size=500x500&location=' +
                e.row['Lat'].value + ',' + e.row['Long'].value + '&fov=90&heading=235&pitch=10&sensor=false\" />' +
                '<p><a href="https://maps.google.com/maps?q=&layer=c&cbll=' + e.row['Lat'].value + ',' + e.row['Long'].value + '&cbp=11,0,0,0,0" target="_blank">Explore in Google StreetView</a></p>', fusionTableObject);

            jqueryNoConflict('#content-background').css({'opacity' : '0.7'}).fadeIn('fast');
            jqueryNoConflict('#content-display').html(html).center().fadeIn('slow');

            jqueryNoConflict('#close').click(function(){
                jqueryNoConflict('#content-display').fadeOut('fast');
                jqueryNoConflict('#content-background').fadeOut('fast');
            });

        });
    },
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