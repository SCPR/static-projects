    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "renderApplicationVisuals",
        },

        renderApplicationVisuals: function(){
            if (this.applicationVisuals){
                this.applicationVisuals.remove();
            };
            this.applicationVisuals = new App.Views.ApplicationVisuals({
                container: ".data-visuals"
            });
            return this.applicationVisuals;
        }

    });

    App.Views.ApplicationVisuals = Backbone.View.extend({

        template: template("templates/data-visuals.html"),

        el: ".data-visuals",

        initialize: function(viewObject){
            window.viewObject = viewObject;
            $(viewObject.container).html(_.template(this.template));
        },

        events: {
            "keyup :input": "addressSearch",
            "click button#submit": "navigate",
        },

        addressSearch: function(e){
            $("input[id='addressSearch']").focus(function(){
                $("#representative-profile").empty();
            });

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
                this.navigate();
            }
        },

        navigate: function(){
            var latitude = $("input[id='latitudeSearch']").val();
            var longitude = $("input[id='longitudeSearch']").val();
            window.viewObject.latitude = latitude;
            window.viewObject.longitude = longitude;
            window.viewObject.center = new google.maps.LatLng(latitude, longitude);
            window.viewObject.sizeParams = "600x400";
            this.render(window.viewObject);
        },

        generateStaticMap: function(lat, lng, zoomLevel){
            $(".content-map-data").html(
                "<h3>Here's your image. Copy the <a href='http://maps.googleapis.com/maps/api/staticmap?center=" + window.viewObject.latitude + "," + window.viewObject.longitude + "&zoom=" + zoomLevel + "&size=" + window.viewObject.sizeParams + "&scale=2&markers=color:red%7Clabel:%7C" + window.viewObject.latitude + "," + window.viewObject.longitude + "' target='blank'>url</a> and upload into <a href='http://a.scpr.org/a/assets' target='blank'>AssetHost</a></h3>" +
                "<img src='http://maps.googleapis.com/maps/api/staticmap?center=" + window.viewObject.latitude + "," + window.viewObject.longitude + "&zoom=" + zoomLevel + "&size=" + window.viewObject.sizeParams + "&scale=2&markers=color:red%7Clabel:%7C" + window.viewObject.latitude + "," + window.viewObject.longitude + "' />"
            );
        },

        render: function(viewObject){

            console.log(viewObject);

            $(".map-container").html(
                "<h3>Here's your preview</h3>" +
                "<div id='content-map-canvas' class='initial'></div>"
            );

            google.maps.visualRefresh = true;

            var mapDiv = document.getElementById("content-map-canvas");

            if (window.appConfig.is_mobile){
                mapDiv.style.width = "100%";
                mapDiv.style.height = "400px";
            }

            var map = new google.maps.Map(mapDiv, {
                center: window.viewObject.center,
                zoom: window.appConfig.initial_map_zoom,
                scrollwheel: true,
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
            });

            var zoomLevel = map.getZoom();

            this.generateStaticMap(window.viewObject.latitude, window.viewObject.longitude, zoomLevel);

            google.maps.event.addDomListener(map, "idle", function() {
                center = map.getCenter();
            });

            google.maps.event.addDomListener(window, "resize", function() {
                map.setCenter(window.appConfig.map_center_los_angeles);
            });

            google.maps.event.addListener(map,'click', function(event){
                $(".content-map-data").empty();
                var zoomLevel = map.getZoom();

                window.viewObject.latitude = event.latLng.lat();
                window.viewObject.longitude = event.latLng.lng();

                $(".content-map-data").html(
                    "<h3>Here's your image. Copy the <a href='http://maps.googleapis.com/maps/api/staticmap?center=" + window.viewObject.latitude + "," + window.viewObject.longitude + "&zoom=" + zoomLevel + "&size=" + window.viewObject.sizeParams + "&scale=2&markers=color:red%7Clabel:%7C" + window.viewObject.latitude + "," + window.viewObject.longitude + "' target='blank'>url</a> and upload into <a href='http://a.scpr.org/a/assets' target='blank'>AssetHost</a></h3>" +
                    "<img src='http://maps.googleapis.com/maps/api/staticmap?center=" + window.viewObject.latitude + "," + window.viewObject.longitude + "&zoom=" + zoomLevel + "&size=" + window.viewObject.sizeParams + "&scale=2&markers=color:red%7Clabel:%7C" + window.viewObject.latitude + "," + window.viewObject.longitude + "' />"
                );

                $("input[id='addressSearch']").val("");
                $("input[id='latitudeSearch']").val(window.viewObject.latitude);
                $("input[id='longitudeSearch']").val(window.viewObject.longitude);
            });

            google.maps.event.addListener(map,'zoom_changed', function(){
                $(".content-map-data").empty();
                var zoomLevel = map.getZoom();
                var lat = window.viewObject.latitude;
                var lng = window.viewObject.longitude;

                $(".content-map-data").html(
                    "<h3>Here's your image. Copy the <a href='http://maps.googleapis.com/maps/api/staticmap?center=" + window.viewObject.latitude + "," + window.viewObject.longitude + "&zoom=" + zoomLevel + "&size=" + window.viewObject.sizeParams + "&scale=2&markers=color:red%7Clabel:%7C" + window.viewObject.latitude + "," + window.viewObject.longitude + "' target='blank'>url</a> and upload into <a href='http://a.scpr.org/a/assets' target='blank'>AssetHost</a></h3>" +
                    "<img src='http://maps.googleapis.com/maps/api/staticmap?center=" + window.viewObject.latitude + "," + window.viewObject.longitude + "&zoom=" + zoomLevel + "&size=" + window.viewObject.sizeParams + "&scale=2&markers=color:red%7Clabel:%7C" + window.viewObject.latitude + "," + window.viewObject.longitude + "' />"
                );

                $("input[id='addressSearch']").val("");
                $("input[id='latitudeSearch']").val(window.viewObject.latitude);
                $("input[id='longitudeSearch']").val(window.viewObject.longitude);
            });

        }

    });