    window.selectedShape = null;

    window.ReturnMyCenter = function(map){
        var coords = {
            latitude: map.getCenter().lat(),
            longitude: map.getCenter().lng()
        };
        return coords;
    };

    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "renderApplicationVisuals",
            "map-creator/:mapType/": "renderMapApplication",
            "map-creator/:mapType?lat=:latitude&lng=:longitude&zoom=:zoomLevel&layer=:layer": "renderCustomMapInstance"
        },

        renderApplicationVisuals: function(){
            this.applicationVisuals = new App.Views.ApplicationVisuals({
                container: ".data-visuals"
            });
            return this.applicationVisuals;
        },

        renderMapApplication: function(mapType){
            window.appConfig.mapOptions.mapType = mapType;
            this.renderApplicationVisuals();
            if (mapType === "point-map"){
                this.pointMapInstance = new App.Views.PointMapInstance(window.appConfig.mapOptions);
                return this.pointMapInstance;
            } else if (mapType === "line-map"){
                this.lineMapInstance = new App.Views.LineMapInstance(window.appConfig.mapOptions);
                return this.lineMapInstance;
            }
        },

        renderCustomMapInstance: function(mapType, latitude, longitude, zoomLevel, layer){
            this.renderApplicationVisuals();
            window.appConfig.mapOptions.mapType = mapType;
            window.appConfig.mapOptions.route = "custom";
            window.appConfig.mapOptions.map_center_lat = parseFloat(latitude);
            window.appConfig.mapOptions.map_center_lng = parseFloat(longitude);
            window.appConfig.mapOptions.mapCenter = new google.maps.LatLng(
                window.appConfig.mapOptions.map_center_lat,
                window.appConfig.mapOptions.map_center_lng
            ),
            window.appConfig.mapOptions.initial_map_zoom = zoomLevel;
            window.appConfig.mapOptions.mapLayerId = layer;
            if (mapType === "point-map"){
                this.customMapInstance = new App.Views.PointMapInstance(window.appConfig.mapOptions);
                return this.customMapInstance;
            } else if (mapType === "line-map"){
                this.customMapInstance = new App.Views.LineMapInstance(window.appConfig.mapOptions);
                return this.customMapInstance;
            }
        }
    });

    App.Views.ApplicationVisuals = Backbone.View.extend({
        template: template("templates/data-visuals.html"),
        el: ".data-visuals",
        initialize: function(viewObject){
            $(viewObject.container).html(_.template(this.template));
        },
        events: {
            "change #map-type-list": "evaluateSelectedMap",
        },
        evaluateSelectedMap: function(){
            var mapType = $("#map-type-list").val();
            window.app.navigate("#map-creator/" + mapType + "/", {
                trigger: true,
                replace: false,
            });
        }
    });

    // renders point map
    App.Views.PointMapInstance = Backbone.View.extend({
        template: template("templates/point-map.html"),
        el: ".content-map-data",
        initialize: function(viewObject){
            $("#map-type-list option").each(function(){
                if ($(this).val() === viewObject.mapType){
                    this.selected = true;
                }
            });
            $(viewObject.container).html(_.template(this.template));
            $("#" + viewObject.mapLayerId).prop("checked", true);
            this.render(viewObject);
        },

        events: {
            "keyup :input": "addressSearch",
            "change input[type=radio]": "changeRadio",
            "click button#submit": "generateImage",
        },

        addressSearch: function(e){
            $("input[id='addressSearch']").geocomplete({
                details: "form"
            });
            var address = $("input[id='addressSearch']").val();
            var latitude = $("input[id='latitudeSearch']").val();
            var longitude = $("input[id='longitudeSearch']").val();
            var layer = $('input[name=map-type]:checked').val();
            if(e.keyCode != 13) {
                return false;
            } else if (e.keyCode === 13 && latitude === '' && longitude === '') {
                return false;
            } else {
                address = address.toLowerCase().replace(/ /g, '-').replace(/,/g, '');
                this.updateMap(latitude, longitude, layer, address);
            }
        },

        changeRadio: function(e){
            var address = $("input[id='addressSearch']").val();
            var coords = window.ReturnMyCenter(this.viewObject.map);
            var layer = e.target.value;
            this.updateMap(coords.latitude, coords.longitude, layer, address);
        },

        generateImage: function(){
            var address = $("input[id='addressSearch']").val();
            var latitude = $("input[id='latitudeSearch']").val();
            var longitude = $("input[id='longitudeSearch']").val();
            var layer = $('input[name=map-type]:checked').val();
            this.updateMap(latitude, longitude, layer, address);
            var baseUrl = "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyCgh93OAbzooidV0OUpIOoc6kTxV5o69do";
            var mapCenter = "&center=" + latitude + "," + longitude;
            var mapZoom = "&zoom=" + this.viewObject.initial_map_zoom;
            var mapSize = "&size=" + this.viewObject.sizeParams;
            var mapType = "&scale=2&maptype=" + this.viewObject.mapLayerId.toLowerCase();
            var mapMarker = "&markers=color:red%7Clabel:%7C" + latitude + "," + longitude;
            var imageUrl = baseUrl + mapCenter + mapZoom + mapSize + mapType + mapMarker;

            $("#content-map-image").html("<img src='" + imageUrl + "' />");

            if ($("h6.image-link").length){
                $("h6.image-link").empty();
            }

            $("#content-map-image").before(
                "<h6 class='image-link'>Copy the <a href='" + imageUrl + "' target='blank'>url</a> for this image</h6>"
            );

            var checkExist = setInterval(function() {
                if ($("#content-map-image").length) {
                    clearInterval(checkExist);
                    $("html, body").animate({
                       scrollTop: $("#content-map-image").offset().top
                    });
                }
            }, 500);
        },

        updateMap: function(latitude, longitude, layer, address){
            if (latitude != '' && longitude != ''){
                window.app.navigate("#map-creator/" + this.viewObject.mapType + "?lat=" + latitude + "&lng=" + longitude + "&zoom=" + this.viewObject.initial_map_zoom + "&layer=" + layer, {
                    trigger: true,
                    replace: true,
                });
            }
        },

        render: function(viewObject){
            this.viewObject = viewObject;
            $("input[id='latitudeSearch']").val(this.viewObject.map_center_lat);
            $("input[id='longitudeSearch']").val(this.viewObject.map_center_lng);
            var mapDiv = document.getElementById(this.viewObject.mapDiv);
            var my_center = new google.maps.LatLng(this.viewObject.map_center_lat,this.viewObject.map_center_lng);
            var map = new google.maps.Map(mapDiv, {
                center: my_center,
                zoom: parseInt(this.viewObject.initial_map_zoom),
                scrollwheel: false,
                draggable: true,
                mapTypeControl: false,
                navigationControl: true,
                streetViewControl: false,
                panControl: false,
                scaleControl: false,
                mapTypeId: google.maps.MapTypeId[this.viewObject.mapLayerId],
                navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL,
                position: google.maps.ControlPosition.RIGHT_TOP
                }
            });
            this.viewObject.map = map;
            this.viewObject.marker = new google.maps.Marker({
                position: my_center,
                draggable: true,
                map: this.viewObject.map
            });
            this.mapZoomListener(this.viewObject);
            this.mapClickListener(this.viewObject);
            this.mapDragListener(this.viewObject);
            /*
            google.maps.event.addDomListener(map, "idle", function() {
                center = map.getCenter();
            });
            google.maps.event.addDomListener(window, "resize", function() {
                map.setCenter(this.mapCenter);
            });
            */
            if (viewObject.route === "custom"){
                $("input[id='latitudeSearch']").val(this.viewObject.map_center_lat);
                $("input[id='longitudeSearch']").val(this.viewObject.map_center_lng);
            }
            $("#content-map-canvas").before(
                "<h6 class='live-link'>" + this.viewObject.mapType + "</h6>"
            );
        },

        mapZoomListener: function(viewObject){
            google.maps.event.addListener(viewObject.map,'zoom_changed', function(){
                $(".image-link").empty();
                $("#content-map-image").empty();
                viewObject.initial_map_zoom = viewObject.map.getZoom();
                viewObject.map_center_lat = viewObject.map.getCenter().lat();
                viewObject.map_center_lng = viewObject.map.getCenter().lng();
                viewObject.mapCenter = new google.maps.LatLng(viewObject.map_center_lat,viewObject.map_center_lng);
                var layer = $('input[name=map-type]:checked').val();
                window.app.navigate("#map-creator/" + viewObject.mapType + "?lat=" + viewObject.map_center_lat + "&lng=" + viewObject.map_center_lng + "&zoom=" + viewObject.initial_map_zoom + "&layer=" + layer, {
                    trigger: true,
                    replace: true,
                });
            });
        },

        mapClickListener: function(viewObject){
            google.maps.event.addListener(viewObject.map,'click', function(event){
                $(".image-link").empty();
                $("#content-map-image").empty();
                viewObject.initial_map_zoom = viewObject.map.getZoom();
                viewObject.map_center_lat = viewObject.map.getCenter().lat();
                viewObject.map_center_lng = viewObject.map.getCenter().lng();
                viewObject.mapCenter = new google.maps.LatLng(viewObject.map_center_lat,viewObject.map_center_lng);
                var layer = $('input[name=map-type]:checked').val();
                window.app.navigate("#map-creator/" + viewObject.mapType + "?lat=" + viewObject.map_center_lat + "&lng=" + viewObject.map_center_lng + "&zoom=" + viewObject.initial_map_zoom + "&layer=" + layer, {
                    trigger: true,
                    replace: true,
                });
            });
        },

        mapDragListener: function (viewObject){
            google.maps.event.addListener(viewObject.marker, 'dragend', function(){
                $(".image-link").empty();
                $("#content-map-image").empty();
                viewObject.initial_map_zoom = viewObject.map.getZoom();
                viewObject.map_center_lat = viewObject.marker.getPosition().lat();
                viewObject.map_center_lng = viewObject.marker.getPosition().lng();
                viewObject.mapCenter = viewObject.marker.getPosition();
                var layer = $('input[name=map-type]:checked').val();
                $("input[id='latitudeSearch']").val(viewObject.map_center_lat);
                $("input[id='longitudeSearch']").val(viewObject.map_center_lng);
                window.app.navigate("#map-creator/" + viewObject.mapType + "?lat=" + viewObject.map_center_lat + "&lng=" + viewObject.map_center_lng + "&zoom=" + viewObject.initial_map_zoom + "&layer=" + layer, {
                    trigger: true,
                    replace: true,
                });
            });
        }
    });

    // renders the map to draw lines on
    // poached from https://jsfiddle.net/geocodezip/y3w3nvbj/9/
    App.Views.LineMapInstance = Backbone.View.extend({
        template: template("templates/line-map.html"),
        el: ".content-map-data",
        initialize: function(viewObject){
            $("#map-type-list option").each(function(){
                if ($(this).val() === viewObject.mapType){
                    this.selected = true;
                }
            });
            $(viewObject.container).html(_.template(this.template));
            $("#" + viewObject.mapLayerId).prop("checked", true);
            this.render(viewObject);
        },

        events: {
            "keyup :input": "addressSearch",
            "change input[type=radio]": "changeRadio",
            "click button#submit": "generateImage",
        },

        addressSearch: function(e){
            $("input[id='addressSearch']").geocomplete({
                details: "form"
            });
            var address = $("input[id='addressSearch']").val();
            var latitude = $("input[id='latitudeSearch']").val();
            var longitude = $("input[id='longitudeSearch']").val();
            var layer = $('input[name=map-type]:checked').val();
            if(e.keyCode != 13) {
                return false;
            } else if (e.keyCode === 13 && latitude === '' && longitude === '') {
                return false;
            } else {
                address = address.toLowerCase().replace(/ /g, '-').replace(/,/g, '');
                this.updateMap(latitude, longitude, layer, address);
            }
        },

        changeRadio: function(e){
            var address = $("input[id='addressSearch']").val();
            var coords = window.ReturnMyCenter(this.viewObject.map);
            var layer = e.target.value;
            this.updateMap(coords.latitude, coords.longitude, layer, address);
        },

        updateMap: function(latitude, longitude, layer, address){
            if (latitude != '' && longitude != ''){
                window.app.navigate("#map-creator/" + this.viewObject.mapType + "?lat=" + latitude + "&lng=" + longitude + "&zoom=" + this.viewObject.initial_map_zoom + "&layer=" + layer, {
                    trigger: true,
                    replace: true,
                });
            }
        },

        beginDrawing: function(){
            var polyOptions = {
                fillColor: "#ffffff",
                fillOpacity: 1,
                strokeWeight: 1,
                clickable: true,
                editable: true,
                zIndex: 1
            };

            window.drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        google.maps.drawing.OverlayType.MARKER,
                        google.maps.drawing.OverlayType.POLYGON,
                        google.maps.drawing.OverlayType.POLYLINE,
                        // google.maps.drawing.OverlayType.CIRCLE,
                        // google.maps.drawing.OverlayType.RECTANGLE
                    ]
                },
                markerOptions: {
                    icon: "http://maps.google.com/mapfiles/ms/micons/blue.png",
                    draggable: true
                },
                polylineOptions: polyOptions,
                polygonOptions: polyOptions,
                circleOptions: polyOptions,
                rectangleOptions: polyOptions,
            });
            this.viewObject.polylinePaths = [];
            var _this = this;
            google.maps.event.addListener(window.drawingManager, "overlaycomplete", function(overlay){
                if (overlay.type != google.maps.drawing.OverlayType.MARKER){
                    // switch back to non-drawing mode after drawing a shape
                    window.drawingManager.setDrawingMode(null);
                    // add an event listener that selects the newly-drawn shape when the user mouses down on it.
                    var newShape = overlay.overlay;
                    newShape.type = overlay.type;
                    google.maps.event.addListener(newShape, "click", function(){
                        _this.setSelection(newShape);
                    });
                    _this.setSelection(newShape);
                }
                _this.viewObject.polylinePaths.push(overlay);
            });
            window.drawingManager.setMap(this.viewObject.map);
            this.buildColorPalette();
            // clear current selection when the drawing mode is changed, or when map is clicked
            google.maps.event.addListener(drawingManager, "drawingmode_changed", this.clearSelection);
            google.maps.event.addListener(this.viewObject.map, "click", this.clearSelection);
            google.maps.event.addDomListener(document.getElementById("delete-button"), "click", this.deleteSelectedShape);
        },

        buildColorPalette: function(){
            var colorPalette = document.getElementById("color-palette");
            for (var i = 0; i < this.viewObject.colors.length; ++i) {
                var currColor = this.viewObject.colors[i];
                var colorButton = this.makeColorButton(currColor);
                colorPalette.appendChild(colorButton);
                this.viewObject.colorButtons[currColor] = colorButton;
            };
            this.selectColor(this.viewObject.colors[0]);
        },

        makeColorButton: function(color){
            var button = document.createElement("span");
            button.className = "color-button";
            button.style.backgroundColor = color;
            var _this = this;
            google.maps.event.addDomListener(button, "click", function(){
                _this.selectColor(color);
                _this.setSelectedShapeColor(color);
            });
            return button;
        },

        setSelection: function(shape){
            if (window.selectedShape){
                window.selectedShape.setEditable(false);
                window.selectedShape = null;
            };
            window.selectedShape = shape;
            shape.setEditable(true);
            this.selectColor(shape.get("fillColor") || shape.get("strokeColor"));
        },

        clearSelection: function (){
            if (window.selectedShape){
                window.selectedShape.setEditable(false);
                window.selectedShape = null;
            };
        },

        deleteSelectedShape: function(){
            if (window.selectedShape){
                window.selectedShape.setMap(null);
            };
        },

        selectColor: function(color){
            selectedColor = color;
            for (var i = 0; i < this.viewObject.colors.length; ++i) {
                var currColor = this.viewObject.colors[i];
                this.viewObject.colorButtons[currColor].style.border = currColor == color ? "2px solid #789" : "2px solid #fff";
            }
            // retrieves options from drawing manager and replaces stroke or fill as appropriate
            var polylineOptions = window.drawingManager.get("polylineOptions");
            polylineOptions.strokeColor = color;
            window.drawingManager.set("polylineOptions", polylineOptions);
            // var rectangleOptions = window.drawingManager.get("rectangleOptions");
            // rectangleOptions.fillColor = color;
            // window.drawingManager.set("rectangleOptions", rectangleOptions);
            // var circleOptions = window.drawingManager.get("circleOptions");
            // circleOptions.fillColor = color;
            // window.drawingManager.set("circleOptions", circleOptions);
            var polygonOptions = window.drawingManager.get("polygonOptions");
            polygonOptions.fillColor = color;
            window.drawingManager.set("polygonOptions", polygonOptions);
        },

        setSelectedShapeColor: function(color){
            if (window.selectedShape){
                if (window.selectedShape.type == google.maps.drawing.OverlayType.POLYLINE){
                    window.selectedShape.set("strokeColor", color);
                } else {
                    window.selectedShape.set("fillColor", color);
                };
            };
        },

        generateImage: function(){
            var fillC = window.drawingManager.polylineOptions.fillColor;
            var strokeC = window.drawingManager.polylineOptions.strokeColor;
            var weight = window.drawingManager.polylineOptions.strokeWeight;
            var path;
            var coords = window.ReturnMyCenter(this.viewObject.map);
            var baseUrl = "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyCgh93OAbzooidV0OUpIOoc6kTxV5o69do";
            var mapCenter = "&center=" + coords.latitude + "," + coords.longitude;
            var mapZoom = "&zoom=" + this.viewObject.initial_map_zoom;
            var mapSize = "&size=" + this.viewObject.sizeParams;
            var mapType = "&scale=2&maptype=" + this.viewObject.mapLayerId.toLowerCase();
            var staticMap = baseUrl + mapCenter + mapZoom + mapSize + mapType;
            var overlays = this.viewObject.polylinePaths;
            for (var i=0; i<overlays.length; i++){
                path = encodeURIComponent(google.maps.geometry.encoding.encodePath(overlays[i].overlay.getPath()));
                if (overlays[i].type == google.maps.drawing.OverlayType.POLYGON || overlays){
                    fillC = overlays[i].overlay.get("fillColor");
                    strokeC = overlays[i].overlay.get("strokeColor");
                    weight = overlays[i].overlay.get("strokeWeight");
                    staticMap += "&path=";
                    if (typeof fillC != "undefined") staticMap += "fillcolor:" + fillC.replace(/#/, "0x");
                    if (typeof weight != "undefined") staticMap += "%7Cweight:" + weight;
                    else staticMap += "%7Cweight:0";
                    if (typeof strokeC != "undefined") staticMap += "%7Ccolor:" + strokeC.replace(/#/, "0x");
                    staticMap += "%7Cenc:" + path;
                } else if (overlays[i].type == google.maps.drawing.OverlayType.POLYLINE){
                    // fillC = overlays[i].overlay.get("fillColor");
                    strokeC = overlays[i].overlay.get("strokeColor");
                    weight = overlays[i].overlay.get("strokeWeight");
                    staticMap += "&path=";
                    if (typeof weight != "undefined") staticMap += "weight:" + weight;
                    else staticMap += "weight:2";
                    if (typeof strokeC != "undefined") staticMap += "%7Ccolor:" + strokeC.replace(/#/, "0x");
                    staticMap += "%7Cenc:" + path;
                } else if (overlays[i].type == google.maps.drawing.OverlayType.MARKER) {
                    staticMap += "&markers=color:blue|" + overlays[i].overlay.getPosition().toUrlValue(6);
                };
                // } else if (overlays[i].type == google.maps.drawing.OverlayType.RECTANGLE) {
                //     path = [];
                //     var north = overlays[i].overlay.getBounds().getNorthEast().lat();
                //     var east = overlays[i].overlay.getBounds().getNorthEast().lng();
                //     var south = overlays[i].overlay.getBounds().getSouthWest().lat();
                //     var west = overlays[i].overlay.getBounds().getSouthWest().lng();
                //     path.push(new google.maps.LatLng(north, east));
                //     path.push(new google.maps.LatLng(south, east));
                //     path.push(new google.maps.LatLng(south, west));
                //     path.push(new google.maps.LatLng(north, west));
                //     path.push(new google.maps.LatLng(north, east));
                //     path = encodeURIComponent(google.maps.geometry.encoding.encodePath(path));
                //     fillC = overlays[i].overlay.get("fillColor");
                //     strokeC = overlays[i].overlay.get("strokeColor");
                //     weight = overlays[i].overlay.get("strokeWeight");
                //     staticMap += "&path=";
                //     if (typeof fillC != "undefined") staticMap += "fillcolor:" + fillC.replace(/#/, "0x");
                //     else staticMap += "fillcolor:blue";
                //     if (typeof weight != "undefined") staticMap += "%7Cweight:" + weight;
                //     if (typeof strokeC != "undefined") staticMap += "%7Ccolor:" + strokeC.replace(/#/, "0x");
                //     staticMap += "%7Cenc:" + path;
                // } else if (overlays[i].type == google.maps.drawing.OverlayType.CIRCLE) {
                //     path = drawCircle(overlays[i].overlay.getCenter(),
                //         overlays[i].overlay.getRadius(), 1);
                //     path = encodeURIComponent(google.maps.geometry.encoding.encodePath(path));
                //     fillC = overlays[i].overlay.get("fillColor");
                //     strokeC = overlays[i].overlay.get("strokeColor");
                //     weight = overlays[i].overlay.get("strokeWeight");
                //     staticMap += "&path=";
                //     if (typeof fillC != "undefined") staticMap += "fillcolor:" + fillC.replace(/#/, "0x");
                //     else staticMap += "fillcolor:blue";
                //     if (typeof weight != "undefined") staticMap += "%7Cweight:" + weight;
                //     if (typeof strokeC != "undefined") staticMap += "%7Ccolor:" + strokeC.replace(/#/, "0x");
                //     staticMap += "%7Cenc:" + path;
                // };
            }

            // $("#image-link").empty();

            // $("#content-map-image").html("<img src='" + staticMap + "' />");

            // $("#content-map-image").before(
            //     "<div id='image-link'><h6 class='image-link'>Copy the <a href='" + staticMap + "' target='blank'>url</a> for this image</h6></div>"
            // );

            $("#content-map-image").html("<img src='" + staticMap + "' />");

            if ($("h6.image-link").length){
                $("h6.image-link").empty();
            }

            $("#content-map-image").before(
                "<h6 class='image-link'>Copy the <a href='" + staticMap + "' target='blank'>url</a> for this image</h6>"
            );

            var checkExist = setInterval(function() {
                if ($("#content-map-image").length) {
                    clearInterval(checkExist);
                    $("html, body").animate({
                       scrollTop: $("#content-map-image").offset().top
                    });
                }
            }, 500);

        },

        getPolygonBounds: function(polygon){
            var paths = polygon.getPaths();
            var bounds = new google.maps.LatLngBounds();
            paths.forEach(function(path) {
                var ar = path.getArray();
                for(var i = 0, l = ar.length;i < l; i++) {
                    bounds.extend(ar[i]);
                }
            });
            return bounds;
        },

        render: function(viewObject){
            this.viewObject = viewObject;
            $("input[id='latitudeSearch']").val(this.viewObject.map_center_lat);
            $("input[id='longitudeSearch']").val(this.viewObject.map_center_lng);
            var mapDiv = document.getElementById(this.viewObject.mapDiv);
            var my_center = new google.maps.LatLng(this.viewObject.map_center_lat,this.viewObject.map_center_lng);
            var map = new google.maps.Map(mapDiv, {
                center: my_center,
                zoom: parseInt(this.viewObject.initial_map_zoom),
                scrollwheel: false,
                draggable: true,
                mapTypeControl: false,
                navigationControl: true,
                streetViewControl: false,
                panControl: false,
                scaleControl: false,
                mapTypeId: google.maps.MapTypeId[this.viewObject.mapLayerId],
                navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL,
                position: google.maps.ControlPosition.RIGHT_TOP
                }
            });
            this.viewObject.map = map;
            this.viewObject.marker = null;
            this.mapZoomListener(this.viewObject);
            this.mapClickListener(this.viewObject);
            if (viewObject.route === "custom"){
                $("input[id='latitudeSearch']").val(this.viewObject.map_center_lat);
                $("input[id='longitudeSearch']").val(this.viewObject.map_center_lng);
            }
            $("#content-map-canvas").before(
                "<h6 class='live-link'>" + this.viewObject.mapType + "</h6>"
            );
            this.beginDrawing();
        },

        mapZoomListener: function(viewObject){
            google.maps.event.addListener(viewObject.map,'zoom_changed', function(){
                $(".image-link").empty();
                $("#content-map-image").empty();
                viewObject.initial_map_zoom = viewObject.map.getZoom();
                viewObject.map_center_lat = viewObject.map.getCenter().lat();
                viewObject.map_center_lng = viewObject.map.getCenter().lng();
                viewObject.mapCenter = new google.maps.LatLng(viewObject.map_center_lat,viewObject.map_center_lng);
                var layer = $('input[name=map-type]:checked').val();
                window.app.navigate("#map-creator/" + viewObject.mapType + "?lat=" + viewObject.map_center_lat + "&lng=" + viewObject.map_center_lng + "&zoom=" + viewObject.initial_map_zoom + "&layer=" + layer, {
                    trigger: true,
                    replace: true,
                });
            });
        },

        mapClickListener: function(viewObject){
            google.maps.event.addListener(viewObject.map,'click', function(event){
                $(".image-link").empty();
                $("#content-map-image").empty();
                viewObject.initial_map_zoom = viewObject.map.getZoom();
                viewObject.map_center_lat = viewObject.map.getCenter().lat();
                viewObject.map_center_lng = viewObject.map.getCenter().lng();
                viewObject.mapCenter = new google.maps.LatLng(viewObject.map_center_lat,viewObject.map_center_lng);
                var layer = $('input[name=map-type]:checked').val();
                window.app.navigate("#map-creator/" + viewObject.mapType + "?lat=" + viewObject.map_center_lat + "&lng=" + viewObject.map_center_lng + "&zoom=" + viewObject.initial_map_zoom + "&layer=" + layer, {
                    trigger: true,
                    replace: true,
                });
            });
        },
    });
