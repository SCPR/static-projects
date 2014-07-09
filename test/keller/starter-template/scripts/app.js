    window.percentifyValue = function(value){
        var value = value * 100
        return parseFloat(value.toFixed(2));
    };

    window.toFixedPercent = function(part, whole){
        var targetValue = part / whole;
        var decimal = parseFloat(targetValue);
        return decimal
    };

    window.addCommas = function(nStr){
        nStr += "";
        x = nStr.split(".");
        x1 = x[0];
        x2 = x.length > 1 ? "." + x[1] : "";
            var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, "$1" + "," + "$2");
                }
            return x1 + x2;
    };

    String.prototype.truncateToGraf = function(){
        var lengthLimit = 900;
        if (this.length > lengthLimit){
            return this.substring(0, lengthLimit) + " ... ";
        } else {
            return this;
        }
    };

    String.prototype.toProperCase = function(){
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };


    App.Models.SafetyZone = Backbone.Model.extend({
        defaults: {
            gang_name: null,
            url_to_injunction: null,
            document_cloud_url: null,
            case_filed: null,
            date_of_injunction: null,
            year_of_injunction: null,
            trial_date: null,
            judges_name: null,
            case_number: null,
            number_originally_targeted: null,
            notes: null,
        },
    });

    App.Collections.SafetyZones = Backbone.Collection.extend({
        model: App.Models.SafetyZone,
        url: "data/data.json",
        comparator: function(model) {
            return model.get("NAME");
        }
    });

    App.Router = Backbone.Router.extend({
        initialize: function(){

        },

        routes: {
            "": "renderApplicationWrapper",
        },

        renderApplicationWrapper: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },
    });

    App.Views.MapApplication = Backbone.View.extend({

        //tagName: "div",

        //className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

        template: template("templates/data-visuals.html"),

        el: ".data-visuals",

        initialize: function(mapDataObject){

            this.mapDataObject = mapDataObject;

            this.stamenToner = new L.tileLayer(
                "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png", {
                    attribution: "Map tiles by <a href='http://stamen.com' target='_blank'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0' target='_blank'>CC BY 3.0</a> &mdash; Map data &copy; <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>",
                    minZoom: 6,
                    maxZoom: 14
            });

            this.center = new L.LatLng(34.061841979429445, -118.26370239257812);

/*
            this.geojsonLayer = L.geoJson(null, {
                filter: this.filterFeatures,
                style: this.styleFeatures,
                onEachFeature: this.onEachFeature
            });
    */


            this.geojsonLayer = L.geoJson(gangInjunctionData, {
                filter: this.filterFeatures,
                style: this.styleFeatures,
                onEachFeature: this.onEachFeature
            });


            this.render(this.mapDataObject);

            $("#animation-slider").slider({
                "value": 0,
                "min": 1999,
                "max": 2013,
                "step": 1,

                slide: function(event, ui) {
                    var increment = ui.value;
                    $("#slider-value").html("<h4>Year: " + increment + "</h4>");
                },

                change: function(event, ui) {
                    var increment = ui.value;
                    $("#slider-value").html("<h4>Year: " + increment + "</h4>");
                },

                start: function(event, ui) {
                    //$.doTimeout("slider_timer");
                }
            });

            $("#slider-value").html("<h4>Year: " + $("#animation-slider").slider("option", "min") + "</h4>");

        },

        events: {
            "click a#animation-backward": "moveIncrementBackward",
            "click a#animation-play": "playIncrementForward",
            "click a#animation-forward": "moveIncrementForward",
            "slidechange #animation-slider": "createIncrementLayer",
        },

        styleFeatures: function (feature) {
            return {
                color: 'green',
                weight: .8,
                opacity: .8,
                fillOpacity: .8,
                fillColor: "green"
            }
        },

        onEachFeature: function(feature, layer) {
            feature.selected = false;
            layer.on("click", function(e){
                $("#injunction-details").html(
                    "<h6>" + feature.properties.ZONE_NAME + "</h6>" +
                    "<p><strong>Targeted gang</strong>: " + feature.properties.NAME + "</p>" +

                    //"<p>" + feature.properties.AREA + "</p>" +

                    "<p><strong>Implemented in</strong>: " + feature.properties.year_of_i + "</p>" +
                    "<p><strong>Individuals targeted</strong>: " + feature.properties.number_or + "</p>" +
                    "<p><strong>Case number</strong>: " + feature.properties.case_numb + "</p>" +
                    "<p><strong>Case filed</strong>: " + feature.properties.case_file + "</p>" +
                    "<p><strong>Injunction approved</strong>: " + feature.properties.date_of_i + "</p>" +
                    "<p><strong>Issued by judge</strong>: " + feature.properties.judges_na + "</p>" +
                    "<p>" + feature.properties.document_ + "</p>"
                );
            });
        },

        moveIncrementBackward: function(){
            var comparisonValue = $("#animation-slider").slider("value");
            if (comparisonValue == $("#animation-slider").slider("option", "min")){
                return false;
            } else {
                var newValue = comparisonValue - 1
                $("#animation-slider").slider("value", newValue);
                this.loopThroughGeoJsonAddingData(newValue);
            }
        },

        playIncrementForward: function(e){
            e.preventDefault();
            if ($("a#animation-play").hasClass("active")){
                $("a#animation-play").removeClass("active").html("<h5><span class='glyphicon glyphicon-play'></span></h5>");
                $.doTimeout("slider_timer");
            } else {
                $("a#animation-play").addClass("active").html("<h5><span class='glyphicon glyphicon-pause'></span></h5>");
                if ($("#animation-slider").slider("option", "value") == $("#animation-slider").slider("option", "max")){
                    $("#animation-slider").slider("value", 0);
                }
                $.doTimeout("slider_timer", 1000, function(){
                    $("#animation-slider").slider("value", parseInt($("#animation-slider").slider("option", "value")) +1);
                    if ($("#animation-slider").slider("option", "value") == $("#animation-slider").slider("option", "max")){
                        $("a#animation-play").removeClass("active").html("<h5><span class='glyphicon glyphicon-play'></span></h5>");
                        return false;
                    }
                    return true;
                });
            }
        },

        moveIncrementForward: function(){
            var comparisonValue = $("#animation-slider").slider("value");
            if (comparisonValue == $("#animation-slider").slider("option", "max")){
                return false;
            } else {
                var newValue = comparisonValue + 1
                $("#animation-slider").slider("value", newValue);
                this.loopThroughGeoJsonAddingData(newValue);
            }
        },

        createIncrementLayer: function(){
            if ($("#injunction-details").length){
                $("#injunction-details").empty();
            }
            this.geojsonLayer.clearLayers();
            var comparisonValue = $("#animation-slider").slider("value");
            this.loopThroughGeoJsonAddingData(comparisonValue);
        },

        loopThroughGeoJsonAddingData: function(comparisonValue){

            console.log(comparisonValue);

            for(var i=0; i<gangInjunctionData.features.length; i++){
                var gangInjunctionYear = parseInt(gangInjunctionData.features[i].properties.year_of_i);
                if (gangInjunctionYear <= comparisonValue){
                    this.geojsonLayer.addData(gangInjunctionData.features[i]).addTo(this.map);
                    $("#injunction-details").html("<h6>overview of what happened in " + comparisonValue + "</h6>");
                };
            };
        },

        render: function(mapDataObject){
            $(mapDataObject.container).html(_.template(this.template));
            this.map = L.map("content-map-canvas", {
                scrollWheelZoom: false,
                zoomControl: false,
                minZoom: 6,
                maxZoom: 14
            }).setView(
                this.center, window.appConfig.initial_zoom
            ).addLayer(
                this.stamenToner
            ).addControl(L.control.zoom({
                position: "topright"
            }));
            mapDataObject.map = this.map;
            this.geojsonLayer.addTo(this.map);
        }

    });
