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
            "map-creator/:mapType/": "renderPointMapInstance",
            "map-creator/:mapType?lat=:latitude&lng=:longitude&zoom=:zoomLevel&layer=:layer": "renderCustomMapInstance"
        },

        renderApplicationVisuals: function(){
            this.applicationVisuals = new App.Views.ApplicationVisuals({
                container: ".data-visuals"
            });
            return this.applicationVisuals;
        },

        renderPointMapInstance: function(mapType){
            this.renderApplicationVisuals();
            this.pointMapInstance = new App.Views.PointMapInstance({
                route: "initial",
                container: ".content-map-data",
                mapDiv: "content-map-canvas",
                mapType: mapType,
                mapCenter: window.appConfig.map_center_los_angeles,
                mapZoomLevel: window.appConfig.initial_map_zoom,
                mapLayerId: "ROADMAP"
            });
            return this.pointMapInstance;
        },

        renderCustomMapInstance: function(mapType, latitude, longitude, zoomLevel, layer){
            this.renderApplicationVisuals();
            var lat = parseFloat(latitude);
            var lng = parseFloat(longitude);
            this.customMapInstance = new App.Views.PointMapInstance({
                route: "custom",
                container: ".content-map-data",
                mapDiv: "content-map-canvas",
                mapType: mapType,
                mapCenter: new google.maps.LatLng(lat,lng),
                mapZoomLevel: zoomLevel,
                mapLayerId: layer
            });
            return this.customMapInstance;
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

    // renders the initial general map
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
                this.updateMap(latitude, longitude, layer);
            }

        },

        changeRadio: function(e){
            var latitude = $("input[id='latitudeSearch']").val();
            var longitude = $("input[id='longitudeSearch']").val();
            var layer = e.target.value;
            this.updateMap(latitude, longitude, layer);
        },

        updateMap: function(latitude, longitude, layer){

            var latitude = $("input[id='latitudeSearch']").val();
            var longitude = $("input[id='longitudeSearch']").val();
            var layer = $('input[name=map-type]:checked').val();

            if (latitude != '' && longitude != ''){
                window.app.navigate("#map-creator/" + window.MapCreatorConfig.mapType + "?lat=" + latitude + "&lng=" + longitude + "&zoom=" + window.appConfig.initial_map_zoom + "&layer=" + layer, {
                    trigger: true,
                    replace: true,
                });
            } else {
                alert("NO!");
                window.app.navigate("", {
                    trigger: true,
                    replace: true,
                });
            }

        },

        generateImage: function(){
            $("#content-map-image").html(
                "<img src='http://maps.googleapis.com/maps/api/staticmap?center=" +
                this.viewObject.mapCenter.k + "," + this.viewObject.mapCenter.B + "&zoom=" +
                this.viewObject.mapZoomLevel + "&size=" + window.MapCreatorConfig.sizeParams + "&scale=2&maptype=" +
                this.viewObject.mapLayerId.toLowerCase() + "&markers=color:red%7Clabel:%7C" +
                this.viewObject.mapCenter.k + "," + this.viewObject.mapCenter.B + "&key=AIzaSyCgh93OAbzooidV0OUpIOoc6kTxV5o69do' />"
            );

            $("#content-map-image").before(
                "<h6 class='image-link'>Copy the <a href='http://maps.googleapis.com/maps/api/staticmap?center=" +
                this.viewObject.mapCenter.k + "," + this.viewObject.mapCenter.B + "&zoom=" +
                this.viewObject.mapZoomLevel + "&size=" + window.MapCreatorConfig.sizeParams +
                "&scale=2&markers=color:red%7Clabel:%7C" + this.viewObject.mapCenter.k + "," + this.viewObject.mapCenter.B + "' target='blank'>url</a> for this image</h6>"
            );
        },

        render: function(viewObject){

            var mapDiv = document.getElementById(viewObject.mapDiv);

            var map = new google.maps.Map(mapDiv, {
                center: viewObject.mapCenter,
                zoom: parseInt(viewObject.mapZoomLevel),
                scrollwheel: false,
                draggable: false,
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
