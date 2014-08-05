    window.MapCreatorConfig = {
        mapType: null
    };

    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {

            "": "renderApplicationVisuals",
            "map-creator/:mapType/": "renderGeneralMapInstance"

        },

        renderApplicationVisuals: function(){

            this.applicationVisuals = new App.Views.ApplicationVisuals({
                container: ".data-visuals"
            });

            return this.applicationVisuals;
        },

        renderGeneralMapInstance: function(mapType){

            this.renderApplicationVisuals();

            this.generalMapInstance = new App.Views.GeneralMapInstance({
                container: ".content-map-data",
                mapDiv: "content-map-canvas",
                mapType: mapType
            });

            return this.generalMapInstance;
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
            window.MapCreatorConfig.mapType = $("#map-type-list").val();
            window.app.navigate("#map-creator/" + window.MapCreatorConfig.mapType + "/", {
                trigger: true,
                replace: false,
            });
        }
    });

    App.Views.GeneralMapInstance = Backbone.View.extend({

        template: template("templates/general-map.html"),

        el: ".content-map-data",

        initialize: function(viewObject){

            $(viewObject.container).html(_.template(this.template, {
                value: viewObject.mapType
            }));

            this.render(viewObject);

        },

        render: function(viewObject){

            $("#map-type-list option").each(function(){
                if ($(this).val() === viewObject.mapType){
                    this.selected = true;
                }
            });

            var mapDiv = document.getElementById(viewObject.mapDiv);

            var map = new google.maps.Map(mapDiv, {
                center: window.appConfig.map_center_los_angeles,
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

            if (viewObject.mapType === "point-map"){
                this.pointMapInstance = new App.Views.PointMapInstance({
                    container: "#content-map-controls",
                });
                return this.pointMapInstance;
            }

        }

    });

    App.Views.PointMapInstance = Backbone.View.extend({

        template: template("templates/point-map.html"),

        el: "#content-map-controls",

        initialize: function(viewObject){

            $(viewObject.container).html(_.template(this.template));

            //this.render(viewObject);

        },

        events: {
            "keyup :input": "addressSearch",
            "click button#submit": "navigate",
        },

        addressSearch: function(e){
            /*
            $("input[id='addressSearch']").focus(function(){
                $("#representative-profile").empty();
            });
            */

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

            console.log(latitude);


            //window.viewObject.latitude = latitude;
            //window.viewObject.longitude = longitude;
            //window.viewObject.center = new google.maps.LatLng(latitude, longitude);
            //window.viewObject.sizeParams = "600x400";
            //this.render(window.viewObject);


        },





        render: function(viewObject){

            console.log(viewObject);

        }


    });