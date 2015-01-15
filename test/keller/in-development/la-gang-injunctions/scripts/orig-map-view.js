App.Views.ApplicationVisuals = Backbone.View.extend({

    template: template("templates/data-visuals.html"),

    el: ".data-visuals",

    initialize: function(viewObject){

        this.render(viewObject);

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
        //"click a#animation-backward": "moveIncrementBackward",
        //"click a#animation-play": "playIncrementForward",
        //"click a#animation-forward": "moveIncrementForward",
        //"slidechange #animation-slider": "createIncrementLayer",
    },

    styleFeatures: function (feature){
        return {
            color: "black",
            weight: 0.8,
            opacity: 0.8,
            fillOpacity: 0.8,
            fillColor: "green"
        }
    },

    onEachFeature: function(feature, layer){

        feature.selected = false;

        var featcherDetails = (
            "<h6><%= ZONE_NAME %></h6>" +
            "<p><strong>Targeted gang</strong>: <%= NAME %></p>" +
            "<p><strong>Implemented in</strong>: <%= year_of_i %></p>" +
            "<p><strong>Individuals targeted</strong>: <%= number_or %></p>" +
            "<p><strong>Case number</strong>: <%= case_numb %></p>" +
            "<p><strong>Case filed</strong>: <%= case_file %></p>" +
            "<p><strong>Injunction approved</strong>: <%= date_of_i %></p>" +
            "<p><strong>Issued by judge</strong>: <%= judges_na %></p>" +
            "<p>: <%= document_ %></p>"
        );

        layer.on("click", function(e){
            var data = e.target.feature.properties;
            $(".content-feature-data").html(_.template(featcherDetails, data));
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

    render: function(viewObject){
        $(viewObject.container).html(_.template(this.template));

        this.stamenToner = new L.tileLayer(
            "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png", {
                attribution: "Map tiles by <a href='http://stamen.com' target='_blank'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0' target='_blank'>CC BY 3.0</a> &mdash; Map data &copy; <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>",
                minZoom: 6,
                maxZoom: 14
        });

        this.map = L.map("content-map-canvas", {
            scrollWheelZoom: false,
            zoomControl: false,
            minZoom: 6,
            maxZoom: 14
        }).setView(
            window.appConfig.map_center_los_angeles, window.appConfig.initial_map_zoom
        ).addLayer(
            this.stamenToner
        ).addControl(L.control.zoom({
            position: "topright"
        }));



        this.geojsonLayer = L.geoJson(null, {
            filter: this.filterFeatures,
            style: this.styleFeatures,
            onEachFeature: this.onEachFeature
        });




    }

});