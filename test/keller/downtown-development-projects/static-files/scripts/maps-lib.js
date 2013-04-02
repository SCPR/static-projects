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

    // Setup section - put your Fusion Table details here
    // Using the v1 Fusion Tables API.
    // See https://developers.google.com/fusiontables/docs/v1/migration_guide for more info

    // the encrypted Table ID of your Fusion Table (found under File => About)
    // NOTE: numeric IDs will be depricated soon
    fusionTableId:      "1HwblrqLu8SUckDPGVXH0lpTympVunuiXFMGtH6M",

    // *New Fusion Tables Requirement* API key. found at https://code.google.com/apis/console/
    // *Important* this key is for demonstration purposes. please register your own.
    googleApiKey:       "AIzaSyAtS1OYyuRY0inb23BK0nuGId3FiOC6Rb8",

    // name of the location column in your Fusion Table.
    // NOTE: if your location column name has spaces in it, surround it with single quotes
    // example: locationColumn:     "'my location'",
    locationColumn:     "geocoded_location",

    // center that your map defaults to
    map_centroid:       new google.maps.LatLng(34.047966,-118.250055),

    // geographical area appended to all address searches
    locationScope:      "los angeles",

    // for showing number of results
    recordName:         "result",
    recordNamePlural:   "results",

    // in meters ~ 1/2 mile
    searchRadius:       8047,

    // zoom level when map is loaded (bigger is more zoomed in)
    defaultZoom:        13,
    addrMarkerImage: 'http://projects.scpr.org/static/static-files/images/maps-icons-collection/blue-pushpin.png',
    currentPinpoint: null,

    // begin
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
                position: google.maps.ControlPosition.RIGHT_TOP}
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

        //$(":checkbox").attr("checked", "checked");
        $("#result_count").hide();

        // run the default search
        MapsLib.doSearch();
    },
    // end

    doSearch: function () {
        MapsLib.clearSearch();
        var address = $("#search_address").val();
        MapsLib.searchRadius = $("#search_radius").val();
        var whereClause = MapsLib.locationColumn + " not equal to ''";

        /* begin custom filters */


        /* end custom filters */

        if (address != "") {
            if (address.toLowerCase().indexOf(MapsLib.locationScope) == -1) address = address + " " + MapsLib.locationScope;

            geocoder.geocode({
                'address': address
                    }, function (results, status) {
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
                                title: address
                            });

                            whereClause += " AND ST_INTERSECTS(" + MapsLib.locationColumn + ", CIRCLE(LATLNG" + MapsLib.currentPinpoint.toString() + "," + MapsLib.searchRadius + "))";
                            MapsLib.drawSearchRadiusCircle(MapsLib.currentPinpoint);
                            MapsLib.submitSearch(whereClause, map, MapsLib.currentPinpoint);
                        } else {
                            alert("We could not find your address: " + status);
                        }
                    });
            } else { //search without geocoding callback
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
    MapsLib.getList(whereClause);

    //build click event object to display on handlebars template
    google.maps.event.addListener(MapsLib.searchrecords, 'click', function(e) {

        var fusionTableObject = {
            project_name: e.row['project_name'].value,
            project_type: e.row['project_type'].value,
            project_identifier: e.row['project_identifier'].value,
            project_type_marker: e.row['project_type_marker'].value,
            project_status: e.row['project_status'].value,
            status_type: e.row['status_type'].value,
            status_identifier: e.row['status_identifier'].value,
            estimated_completion: e.row['estimated_completion'].value,
            project_description: e.row['project_description'].value,
            read_more: e.row['read_more'].value,
            project_street: e.row['project_street'].value,
            project_city: e.row['project_city'].value,
            project_state: e.row['project_state'].value,
            project_zip_code: e.row['project_zip_code'].value,
            project_address: e.row['project_address'].value,
            latitude: e.row['latitude'].value,
            longitude: e.row['longitude'].value,
            geocoded_location: e.row['geocoded_location'].value,
            operating_hours: e.row['operating_hours'].value,
            project_cost: e.row['project_cost'].value,
            notes: e.row['notes'].value
        }

        renderHandlebarsTemplate('static-files/templates/content-details.handlebars', '#content-details', fusionTableObject);
    });

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

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        foundLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        MapsLib.addrFromLatLng(foundLocation);
      }, null);
    }
    else {
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

    getList: function(whereClause) {
      var selectColumns = "project_name";
      MapsLib.query(selectColumns, whereClause, "MapsLib.displayList");
    },

    displayList: function(json) {
      MapsLib.handleError(json);
      var data = json["rows"];
      var template = "";

      var results = $("#results_list");
      results.hide().empty(); //hide the existing list and empty it out first

      if (data == null) {
        //clear results list
        results.append("<li><span class='lead'>No results found</span></li>");
      }
      else {
        for (var row in data) {
          template = "\
            <div class='row-fluid item-list'>\
              <div class='span12'>\
                <strong>" + data[row][0] + "</strong>\
                <br />\
                " + data[row][1] + "\
                <br />\
                " + data[row][2] + "\
              </div>\
            </div>"
          results.append(template);
        }
      }
      results.fadeIn();
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
    }
}