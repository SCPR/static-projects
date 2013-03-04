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
    fusionTableId:      "1fklwMa6VnObBCOrEo6SKLbVMW5uTJst2EmOwExg",

    // *New Fusion Tables Requirement* API key. found at https://code.google.com/apis/console/
    // *Important* this key is for demonstration purposes. please register your own.
    googleApiKey:       "AIzaSyAtS1OYyuRY0inb23BK0nuGId3FiOC6Rb8",

    // name of the location column in your Fusion Table.
    // NOTE: if your location column name has spaces in it, surround it with single quotes
    // example: locationColumn:     "'my location'",
    locationColumn:     "polling_place",

    // center that your map defaults to
    map_centroid:       new google.maps.LatLng(34.061841979429445, -118.26370239257812),

    // geographical area appended to all address searches
    locationScope:      "Los Angeles",

    // for showing number of results
    recordName:         "result",
    recordNamePlural:   "results",

    // in meters ~ 1/2 mile
    searchRadius:       8047,

    // zoom level when map is loaded (bigger is more zoomed in)
    defaultZoom:        10,
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

        map = new google.maps.Map($("#map_canvas")[0],myOptions);

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

    doSearch: function (location) {
        MapsLib.clearSearch();
        var address = $("#search_address").val();
        MapsLib.searchRadius = $("#search_radius").val();

        var whereClause = MapsLib.locationColumn + " not equal to ''";

        //-----custom filters-------
        var type_column = "describe_voting_experience";
        var tempWhereClause = [];
        if ( $("#cbType1").is(':checked')) tempWhereClause.push("Positive");
        if ( $("#cbType2").is(':checked')) tempWhereClause.push("Negative");
        whereClause += " AND " + type_column + " IN ('" + tempWhereClause.join('\',\'') + "')";
        //-------end of custom filters--------

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

    google.maps.event.addListener(MapsLib.searchrecords, 'click', function(e) {

        mapIntro();

        var fusionTableObject = {
            timestamp: e.row['timestamp'].value,
            polling_place: e.row['polling_place'].value,
            voting_experience_narrative: e.row['voting_experience_narrative'].value,
            full_name: e.row['full_name'].value,
            town_or_city: e.row['town_or_city'].value,
            email_address: e.row['email_address'].value,
            describe_voting_experience: e.row['describe_voting_experience'].value,
            map_marker: e.row['map_marker'].value
        }

        renderHandlebarsTemplate('static-files/templates/content-display.handlebars', '#content-display', fusionTableObject);

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
      var selectColumns = "describe_voting_experience";
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