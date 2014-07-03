    window.storage = Tabletop.init({
        key: "https://docs.google.com/spreadsheets/d/1H6hFZQiolqW7fU5Zdruy0LWTPn8zqDN2gW4ZkQoFUaI/pubhtml",
        wait: true
    });

    App.Models.WhoopingCoughYear = Backbone.Model.extend({
        defaults: {
            county: null,
            countyproper: null,
            updated: null,
            cases: null,
            rate: null,
        },

        tabletop: {
            instance: window.storage,
            sheet: "data_2014"
        },

        sync: Backbone.tabletopSync
    });


    App.Collections.WhoopingCoughYears = Backbone.Collection.extend({
        model: App.Models.WhoopingCoughYear,

        //url: "data/data.json",

        tabletop: {
            instance: window.storage,
            sheet: "data_2014"
        },

        sync: Backbone.tabletopSync

    });


    App.Router = Backbone.Router.extend({

        initialize: function(){

            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;

        },

        routes: {
            "": "renderApplicationVisuals",
        },

        renderApplicationVisuals: function(){

            window.whoopingCollection = new App.Collections.WhoopingCoughYears();

            window.whoopingCollection.fetch();

            if (this.applicationVisuals){
                this.applicationVisuals.remove();
            };

            this.applicationVisuals = new App.Views.ApplicationVisuals({
                collection: window.whoopingCollection,
                container: ".data-visuals",
            });

            return this.applicationVisuals;
        },

    });

    App.Views.ApplicationVisuals = Backbone.View.extend({

        //tagName: "div",

        //className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

        template: template("templates/data-visuals.html"),

        el: ".data-visuals",

        initialize: function(viewObject){

            console.log(viewObject);

            this.viewObject = viewObject;

            this.stamenToner = new L.tileLayer(
                "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png", {
                    attribution: "Map tiles by <a href='http://stamen.com' target='_blank'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0' target='_blank'>CC BY 3.0</a> &mdash; Map data &copy; <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>",
                    minZoom: 6,
                    maxZoom: 14
            });

            this.geojsonLayer = L.geoJson(californiaCounties, {
                filter: this.filterFeatures,
                style: this.styleFeatures,
                onEachFeature: this.onEachFeature
            });

            this.render(this.viewObject);

            /*
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
            */

        },

        events: {
            "click a#animation-backward": "moveIncrementBackward",
            "click a#animation-play": "playIncrementForward",
            "click a#animation-forward": "moveIncrementForward",
            "slidechange #animation-slider": "createIncrementLayer",
        },

        styleFeatures: function (feature) {

            var layerColor;

            if (feature.properties.name === "Los Angeles"){
                layerColor = "red";
            } else {
                layerColor = "green";
            }

            return {
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: .5,
                fillColor: layerColor
            }
        },

        onEachFeature: function(feature, layer) {

            feature.selected = false;

            layer.on("click", function(e){

                console.log(feature);

                /*
                $("#injunction-details").html(
                    "<h6>" + feature.properties.ZONE_NAME + "</h6>" +
                    "<p><strong>Targeted gang</strong>: " + feature.properties.NAME + "</p>" +
                    "<p>" + feature.properties.AREA + "</p>" +
                    "<p><strong>Implemented in</strong>: " + feature.properties.year_of_i + "</p>" +
                    "<p><strong>Individuals targeted</strong>: " + feature.properties.number_or + "</p>" +
                    "<p><strong>Case number</strong>: " + feature.properties.case_numb + "</p>" +
                    "<p><strong>Case filed</strong>: " + feature.properties.case_file + "</p>" +
                    "<p><strong>Injunction approved</strong>: " + feature.properties.date_of_i + "</p>" +
                    "<p><strong>Issued by judge</strong>: " + feature.properties.judges_na + "</p>" +
                    "<p>" + feature.properties.document_ + "</p>"
                );
                */

            });

        },

        /*
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
        */

        render: function(mapDataObject){
            $(mapDataObject.container).html(_.template(this.template));
            this.map = L.map("content-map-canvas", {
                scrollWheelZoom: false,
                zoomControl: false,
                minZoom: 6,
                maxZoom: 14
            }).setView(
                window.appConfig.map_center_california, window.appConfig.initial_map_zoom
            ).addLayer(
                this.stamenToner
            ).addControl(L.control.zoom({
                position: "topright"
            }));
            mapDataObject.map = this.map;
            this.geojsonLayer.addTo(this.map);
        }

    });

    // helper functions
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