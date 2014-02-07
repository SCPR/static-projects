App.Views.MapView = Backbone.View.extend({

    tagName: "div",

    className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

    initialize: function(viewConfig){
        console.log("map view rendered");
        this.template = _.template(template(viewConfig.template)),
        this.stamenToner = L.tileLayer("http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png", {
            attribution: "Map tiles by <a href='http://stamen.com' target='_blank'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0' target='_blank'>CC BY 3.0</a> &mdash; Map data &copy; <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>",
        	subdomains: "abcd",
        	minZoom: 6,
        	maxZoom: 14
        });

        if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
            this.initialZoom = 6;
        } else {
            this.initialZoom = viewConfig.initialZoom;
        }

        this.center = new L.LatLng(34.061841979429445, -118.26370239257812);

        this.injunctionLayerStyle = {
            "color": "green",
            "weight": 2,
            "opacity": 1,
            "fillColor": "green",
            "fillOpacity": 1
        };

        this.myLayer = L.geoJson(null, {
            style: this.injunctionLayerStyle,
            onEachFeature: function(feature, layer) {
                layer.on('click', function(e){
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
            }
        });

        this.render(viewConfig);

        $("#animation-slider").slider({
    		"value":0,
    		"min": 1999,
    		"max": 2014,
    		"step": 1,
        });

        $("#slider-value").html("<h4>" + $("#animation-slider").slider("value") + "</h4>");

    },

    events: {
        "click a#playMe": "createPlayableLayer",
        "slidechange #animation-slider": "createIncrementLayer",
    },

    createPlayableLayer: function(){

        $("a#playMe").removeClass("stopped");
        $("a#playMe").addClass("playing");
        $("a#playMe").addClass("hidden");


        /*
        if ($("a#playMe").hasClass("playing")){

        } else {
            $("a#playMe").text("Play Me");
        };
        */


        this.myLayer.clearLayers();
        var counterStart = $("#animation-slider").slider("option", "min");
        var counterEnd = $("#animation-slider").slider("option", "max");

        $.doTimeout(750, function(){
            $("#animation-slider").slider("value", ++counterStart);
            if (counterStart < counterEnd) {
                return true;
            };

            $("a#playMe").removeClass("playing");
            $("a#playMe").addClass("stopped");
            $("a#playMe").text("Play Again");
            $("a#playMe").removeClass("hidden");

        });
    },

    createIncrementLayer: function(){

        if ($("#injunction-details").length){
            $("#injunction-details").empty();
        }

        this.myLayer.clearLayers();
        var comparisonValue = $("#animation-slider").slider("value");
        $("#slider-value").html("<h4>" + comparisonValue + "</h4>");
        this.loopThroughGeoJsonAddingData(comparisonValue);
    },

    loopThroughGeoJsonAddingData: function(comparisonValue){

        //$("#injunction-details").empty();

        for(var i=0; i<gangData.features.length; i++){
            var gangInjunctionYear = parseInt(gangData.features[i].properties.year_of_i);
            if (gangInjunctionYear <= comparisonValue){
                this.myLayer.addData(gangData.features[i]).addTo(this.map);
            };
        };
    },

    render: function(viewConfig){
        $(viewConfig.container).html(this.$el.html(this.template()));
        this.map = L.map("content-map-canvas", {
            scrollWheelZoom: false,
            zoomControl: true,
            minZoom: 6,
        	maxZoom: 14
        }).setView(
            this.center, this.initialZoom
        ).addLayer(
            this.stamenToner
        );
    }
});