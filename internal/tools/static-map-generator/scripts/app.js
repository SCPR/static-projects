    window.MapCreatorConfig = {
        mapType: null,
        sizeParams: "640x400"
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

            this.renderApplicationVisuals();

            var configObject = {
                route: "initial",
                container: ".content-map-data",
                mapDiv: "content-map-canvas",
                mapType: mapType,
                mapCenter: window.appConfig.map_center_los_angeles,
                mapZoomLevel: window.appConfig.initial_map_zoom,
                mapLayerId: "ROADMAP"
            };

            if (mapType === "point-map"){
                this.pointMapInstance = new App.Views.PointMapInstance(configObject);
                return this.pointMapInstance;
            } else if (mapType === "line-map"){
                this.lineMapInstance = new App.Views.LineMapInstance(configObject);
                return this.lineMapInstance;
            } else if (mapType === "polygon-map"){
                console.log("gonna learn to draw polygons");
                //this.polygonMapInstance = new App.Views.PolygonMapInstance(configObject);
                //return this.polygonMapInstance;
            }
        },

        renderCustomMapInstance: function(mapType, latitude, longitude, zoomLevel, layer){
            this.renderApplicationVisuals();

            var lat = parseFloat(latitude);
            var lng = parseFloat(longitude);

            var configObject = {
                route: "custom",
                container: ".content-map-data",
                mapDiv: "content-map-canvas",
                mapType: mapType,
                mapCenter: new google.maps.LatLng(lat,lng),
                mapZoomLevel: zoomLevel,
                mapLayerId: layer
            };

            if (mapType === "point-map"){
                this.customMapInstance = new App.Views.PointMapInstance(configObject);
                return this.customMapInstance;
            } else if (mapType === "line-map"){
                this.customMapInstance = new App.Views.LineMapInstance(configObject);
                return this.customMapInstance;
            } else if (mapType === "polygon-map"){
                console.log("gonna learn to draw polygons");
                //this.customMapInstance = new App.Views.PolygonMapInstance(configObject);
                //return this.customMapInstance;
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

            this.viewObject = viewObject;

            window.MapCreatorConfig.mapType = this.viewObject.mapType;

            $(this.viewObject.container).html(_.template(this.template));

            $("#" + this.viewObject.mapLayerId).prop("checked", true);

            this.render(this.viewObject);
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

            var latitude = $("input[id='latitudeSearch']").val();
            var longitude = $("input[id='longitudeSearch']").val();
            var layer = $('input[name=map-type]:checked').val();

            if(e.keyCode != 13) {
                return false;
            } else if (e.keyCode === 13 && latitude === '' && longitude === '') {
                return false;
            } else {
                this.generateImage();
                //this.updateMap(latitude, longitude, layer);
            }

        },

        changeRadio: function(e){
            var latitude = this.viewObject.mapCenter.k;
            var longitude = this.viewObject.mapCenter.B;
            var layer = e.target.value;
            this.updateMap(latitude, longitude, layer);
        },

        updateMap: function(latitude, longitude, layer){
            if (latitude != '' && longitude != ''){
                window.app.navigate("#map-creator/" + window.MapCreatorConfig.mapType + "?lat=" + latitude + "&lng=" + longitude + "&zoom=" + this.viewObject.mapZoomLevel + "&layer=" + layer, {
                    trigger: true,
                    replace: true,
                });
            }
        },

        generateImage: function(){
            $("input[id='latitudeSearch']").val(this.viewObject.mapCenter.k);
            $("input[id='longitudeSearch']").val(this.viewObject.mapCenter.B);
            var layer = $('input[name=map-type]:checked').val();
            this.updateMap(this.viewObject.mapCenter.k, this.viewObject.mapCenter.B, layer);
            var baseUrl = "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyCgh93OAbzooidV0OUpIOoc6kTxV5o69do";
            var mapCenter = "&center=" + this.viewObject.mapCenter.k + "," + this.viewObject.mapCenter.B;
            var mapZoom = "&zoom=" + this.viewObject.mapZoomLevel;
            var mapSize = "&size=" + window.MapCreatorConfig.sizeParams;
            var mapType = "&scale=2&maptype=" + this.viewObject.mapLayerId.toLowerCase();
            var mapMarker = "&markers=color:red%7Clabel:%7C" + this.viewObject.mapCenter.k + "," + this.viewObject.mapCenter.B;
            var imageUrl = baseUrl + mapCenter + mapZoom + mapSize + mapType + mapMarker;

            $("#content-map-image").html(
                "<img src='" + imageUrl + "' />"
            );

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

        render: function(viewObject){
            var mapDiv = document.getElementById(viewObject.mapDiv);

            var map = new google.maps.Map(mapDiv, {
                center: viewObject.mapCenter,
                zoom: parseInt(viewObject.mapZoomLevel),
                scrollwheel: false,
                draggable: true,
                mapTypeControl: false,
                navigationControl: true,
                streetViewControl: false,
                panControl: false,
                scaleControl: false,
                mapTypeId: google.maps.MapTypeId[viewObject.mapLayerId],
                navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL,
                position: google.maps.ControlPosition.RIGHT_TOP
                }
            });

            var marker = new google.maps.Marker({
                position: viewObject.mapCenter,
                draggable: true,
                map: map
            });

            this.mapZoomListener(map, this.viewObject);
            this.mapClickListener(map, this.viewObject);
            this.mapDragListener(marker, this.viewObject);

            /*
            google.maps.event.addDomListener(map, "idle", function() {
                center = map.getCenter();
            });

            google.maps.event.addDomListener(window, "resize", function() {
                map.setCenter(this.mapCenter);
            });
            */

            if (this.viewObject.route === "custom"){
                $("input[id='latitudeSearch']").val(viewObject.mapCenter.k);
                $("input[id='longitudeSearch']").val(viewObject.mapCenter.B);
            }

            $("#content-map-canvas").before(
                "<h6 class='live-link'>" + viewObject.mapType + "</h6>"
            );

        },

        mapZoomListener: function(map, viewObject){
            google.maps.event.addListener(map,'zoom_changed', function(){
                $(".image-link").empty();
                $("#content-map-image").empty();
                var newZoomLevel = map.getZoom();
                var newMapCenter = map.getCenter();
                var layer = $('input[name=map-type]:checked').val();
                window.app.navigate("#map-creator/" + window.MapCreatorConfig.mapType + "?lat=" + newMapCenter.k + "&lng=" + newMapCenter.B + "&zoom=" + newZoomLevel + "&layer=" + layer, {
                    trigger: true,
                    replace: true,
                });
            });
        },

        mapClickListener: function(map, viewObject){
            google.maps.event.addListener(map,'click', function(event){
                $(".image-link").empty();
                $("#content-map-image").empty();
                viewObject.mapZoomLevel = map.getZoom();
                viewObject.mapCenter = event.latLng;
                var layer = $('input[name=map-type]:checked').val();
                window.app.navigate("#map-creator/" + window.MapCreatorConfig.mapType + "?lat=" + viewObject.mapCenter.k + "&lng=" + viewObject.mapCenter.B + "&zoom=" + viewObject.mapZoomLevel + "&layer=" + layer, {
                    trigger: true,
                    replace: true,
                });
            });
        },

        mapDragListener: function (marker, viewObject){
            google.maps.event.addListener(marker, 'dragend', function(){
                $(".image-link").empty();
                $("#content-map-image").empty();
                var newMarkerPosition = marker.getPosition();
                viewObject.mapCenter = newMarkerPosition;
                var layer = $('input[name=map-type]:checked').val();
                window.app.navigate("#map-creator/" + window.MapCreatorConfig.mapType + "?lat=" + viewObject.mapCenter.k + "&lng=" + viewObject.mapCenter.B + "&zoom=" + viewObject.mapZoomLevel + "&layer=" + layer, {
                    trigger: true,
                    replace: true,
                });
            });
        }

    });

    App.Models.LineSegment = Backbone.Model.extend({
        defaults: {
            position: null,
            draggable: null,
            map: null,
            lat: null,
            lng: null
        }
    });

    App.Collections.LineSegments = Backbone.Collection.extend({
        model: App.Models.LineSegment
    });

    // renders the map to draw lines on
    App.Views.LineMapInstance = Backbone.View.extend({

        template: template("templates/line-map.html"),

        el: ".content-map-data",

        initialize: function(viewObject){

            $("#map-type-list option").each(function(){
                if ($(this).val() === viewObject.mapType){
                    this.selected = true;
                }
            });

            this.viewObject = viewObject;

            window.MapCreatorConfig.mapType = this.viewObject.mapType;

            $(this.viewObject.container).html(_.template(this.template));

            $("#" + this.viewObject.mapLayerId).prop("checked", true);

            this.render();
        },

        events: {
            "keyup :input": "addressSearch",
            "change input[type=radio]": "changeRadio",
            //"change input[type=checkbox]": "beginDrawing",
            "click button#submit": "generateImage",
        },

        addressSearch: function(e){

            $("input[id='addressSearch']").geocomplete({
                details: "form"
            });

            var latitude = $("input[id='latitudeSearch']").val();
            var longitude = $("input[id='longitudeSearch']").val();
            var layer = $('input[name=map-type]:checked').val();

            if(e.keyCode != 13) {
                return false;
            } else if (e.keyCode === 13 && latitude === '' && longitude === '') {
                return false;
            } else {
                this.updateMap(latitude, longitude, layer);
            }

        },

        changeRadio: function(e){
            var latitude = this.viewObject.mapCenter.k;
            var longitude = this.viewObject.mapCenter.B;
            var layer = e.target.value;
            this.updateMap(latitude, longitude, layer);
        },

        updateMap: function(latitude, longitude, layer){
            if (latitude != '' && longitude != ''){
                window.app.navigate("#map-creator/" + window.MapCreatorConfig.mapType + "?lat=" + latitude + "&lng=" + longitude + "&zoom=" + this.viewObject.mapZoomLevel + "&layer=" + layer, {
                    trigger: true,
                    replace: true,
                });
            }
        },

        beginDrawing: function(viewObject){

            var thatViewObject = viewObject;

            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        //google.maps.drawing.OverlayType.MARKER,
                        //google.maps.drawing.OverlayType.CIRCLE,
                        //google.maps.drawing.OverlayType.POLYGON,
                        google.maps.drawing.OverlayType.POLYLINE,
                        //google.maps.drawing.OverlayType.RECTANGLE
                    ]
                },
                circleOptions: {
                    fillColor: '#ffffff',
                    fillOpacity: 1,
                    strokeWeight: 5,
                    clickable: false,
                    editable: true,
                    zIndex: 1
                }
            });

            drawingManager.setMap(thatViewObject.map);

            thatViewObject.polylinePaths = [];

            google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
                var polylinePaths = event.overlay.getPath();
                thatViewObject.polylinePaths.push(polylinePaths.j);
            });

        },

        generateImage: function(){
            var baseUrl = "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyCgh93OAbzooidV0OUpIOoc6kTxV5o69do";
            var mapCenter = "&center=" + this.viewObject.mapCenter.k + "," + this.viewObject.mapCenter.B;
            var mapZoom = "&zoom=" + this.viewObject.mapZoomLevel;
            var mapSize = "&size=" + window.MapCreatorConfig.sizeParams;
            var mapType = "&scale=2&maptype=" + this.viewObject.mapLayerId.toLowerCase();
            var mapPolyline = "&path=color:0xff0000ff|weight:5";

            var pathArrays = this.viewObject.polylinePaths;


            //mapPolyline += "|" + lineArray[x].k + "," + lineArray[x].B;

            console.log(pathArrays);

            //var imageUrl = baseUrl + mapCenter + mapZoom + mapSize + mapType + mapPolyline;

            //console.log(imageUrl);

            /*
            $("#content-map-image").html(
                "<img src='" + imageUrl + "' />"
            );

            $("#content-map-image").before(
                "<h6 class='image-link'>Copy the <a href='" + imageUrl + "' target='blank'>url</a> for this image</h6>"
            );
            */

        },

        render: function(){

            var mapDiv = document.getElementById(this.viewObject.mapDiv);

            var map = new google.maps.Map(mapDiv, {
                center: this.viewObject.mapCenter,
                zoom: parseInt(this.viewObject.mapZoomLevel),
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

            /*
            var marker = new google.maps.Marker({
                position: this.viewObject.mapCenter,
                draggable: true,
                map: map
            });
            */


            //this.mapClickListener(map, this.viewObject);


            /*
            this.mapZoomListener(map, this.viewObject);

            this.mapDragListener(marker, this.viewObject);

            google.maps.event.addDomListener(map, "idle", function() {
                center = map.getCenter();
            });

            google.maps.event.addDomListener(window, "resize", function() {
                map.setCenter(this.mapCenter);
            });
            */

            this.beginDrawing(this.viewObject);

            if (this.viewObject.route === "custom"){
                $("input[id='latitudeSearch']").val(this.viewObject.mapCenter.k);
                $("input[id='longitudeSearch']").val(this.viewObject.mapCenter.B);
            }

            $("#content-map-canvas").before(
                "<h6 class='live-link'>" + this.viewObject.mapType + "</h6>"
            );

        },

    });
