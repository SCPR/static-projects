    window.MapCreatorConfig = {
        mapType: null,
        sizeParams: "600x400"
    };

    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "renderApplicationVisuals",
            "map-creator/:mapType/": "renderGeneralMapInstance",
            "map-creator/:mapType?lat=:latitude&lng=:longitude&zoom=:zoomLevel": "renderCustomMapInstance"
        },

        renderApplicationVisuals: function(){
            this.applicationVisuals = new App.Views.ApplicationVisuals({
                container: ".data-visuals"
            });
            return this.applicationVisuals;
        },

        renderGeneralMapInstance: function(mapType){
            window.MapCreatorConfig.mapType = mapType;
            this.renderApplicationVisuals();
            this.generalMapInstance = new App.Views.GeneralMapInstance({
                container: ".content-map-data",
                mapDiv: "content-map-canvas",
                mapType: mapType
            });
            return this.generalMapInstance;
        },

        renderCustomMapInstance: function(mapType, latitude, longitude, zoomLevel){
            window.MapCreatorConfig.mapType = mapType;
            this.renderApplicationVisuals();
            this.customMapInstance = new App.Views.GeneralMapInstance({
                route: "custom",
                container: ".content-map-data",
                mapDiv: "content-map-canvas",
                mapType: mapType,
                latitude: latitude,
                longitude: longitude,
                zoomLevel: zoomLevel
            });
            return this.customMapInstance;
        }
    });









    // view for data-visuals
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
            window.MapCreatorConfig.mapType = $("#map-type-list").val();
            window.app.navigate("#map-creator/" + window.MapCreatorConfig.mapType + "/", {
                trigger: true,
                replace: false,
            });
        }
    });

    // renders the initial general map
    App.Views.GeneralMapInstance = Backbone.View.extend({

        template: template("templates/general-map.html"),

        el: ".content-map-data",

        initialize: function(viewObject){

            $(viewObject.container).html(_.template(this.template, {
                value: viewObject.mapType
            }));

            this.render(viewObject);
        },


        mapZoomListener: function(map, viewObject){

            // abstract this function out
            google.maps.event.addListener(map,'zoom_changed', function(){
                $(".image-link").empty();
                $("#content-map-image").empty();
                var newZoomLevel = map.getZoom();
                var newMapCenter = map.getCenter();
                viewObject.container = "#content-map-controls";
                viewObject.lat = newMapCenter.k;
                viewObject.lng = newMapCenter.B;
                viewObject.zoomLevel = newZoomLevel;
                this.pointMapInstance = new App.Views.PointMapInstance(viewObject);
                return this.pointMapInstance;
            });

        },


        render: function(viewObject){
            $("#map-type-list option").each(function(){
                if ($(this).val() === viewObject.mapType){
                    this.selected = true;
                }
            });

            var mapDiv = document.getElementById(viewObject.mapDiv);

            if (viewObject.route === "custom"){
                this.mapZoom = parseInt(viewObject.zoomLevel);
                this.mapCenter = new google.maps.LatLng(viewObject.latitude,viewObject.longitude);
            } else {
                this.mapZoom = window.appConfig.initial_map_zoom;
                this.mapCenter = window.appConfig.map_center_los_angeles;
            }

            var map = new google.maps.Map(mapDiv, {
                center: this.mapCenter,
                zoom: this.mapZoom,
                scrollwheel: false,
                draggable: false,
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
            });

            var marker = new google.maps.Marker({
                position: this.mapCenter,
                map: map
            });

            // changes map display on zoom
            this.mapZoomListener(map, viewObject);

            if (viewObject.mapType === "point-map"){
                viewObject.container = "#content-map-controls";
                viewObject.lat = this.mapCenter.k;
                viewObject.lng = this.mapCenter.B;
                viewObject.zoomLevel = this.mapZoom;
                this.pointMapInstance = new App.Views.PointMapInstance(viewObject);
                return this.pointMapInstance;
            }
        }
    });


    // handles the display of point maps
    App.Views.PointMapInstance = Backbone.View.extend({

        template: template("templates/point-map.html"),

        el: "#content-map-controls",

        initialize: function(viewObject){

            $("input[id='latitudeSearch']").val(viewObject.latitude);
            $("input[id='longitudeSearch']").val(viewObject.longitude);
            $("input[id='addressSearch']").val("");
            $(viewObject.container).html(_.template(this.template));
            this.render(viewObject);

        },

        events: {
            "keyup :input": "addressSearch",
            "click button#submit": "navigate",
        },

        addressSearch: function(e){
            $("input[id='addressSearch']").geocomplete({
                details: "form"
            });

            var latitude = $("input[id='latitudeSearch']").val();
            var longitude = $("input[id='longitudeSearch']").val();

            if(e.keyCode != 13) {
                return false;
            } else if (e.keyCode === 13 && latitude === '' && longitude === '') {
                return false;
            } else {
                this.navigate(latitude, longitude);
            }
        },

        navigate: function(latitude, longitude){
            var latitude = $("input[id='latitudeSearch']").val();
            var longitude = $("input[id='longitudeSearch']").val();

            window.app.navigate("#map-creator/" + window.MapCreatorConfig.mapType + "?lat=" + latitude + "&lng=" + longitude + "&zoom=" + 10, {
                trigger: true,
                replace: false,
            });

        },

        render: function(viewObject){
            $("#content-map-image").html(
                "<img src='http://maps.googleapis.com/maps/api/staticmap?center=" + viewObject.lat + "," + viewObject.lng + "&zoom=" + viewObject.zoomLevel + "&size=" + window.MapCreatorConfig.sizeParams + "&scale=2&markers=color:red%7Clabel:%7C" + viewObject.lat + "," + viewObject.lng + "' />"
            );
            $("#content-map-image").before(
                "<h1 class='image-link'>Here's your image. Copy the <a href='http://maps.googleapis.com/maps/api/staticmap?center=" + viewObject.lat + "," + viewObject.lng + "&zoom=" + viewObject.zoomLevel + "&size=" + window.MapCreatorConfig.sizeParams + "&scale=2&markers=color:red%7Clabel:%7C" + viewObject.lat + "," + viewObject.lng + "' target='blank'>url</a> and upload into <a href='http://a.scpr.org/a/assets' target='blank'>AssetHost</a></h1>"
            );
        }
    });