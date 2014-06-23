(function(){

    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {}
    };

    // load external templates via ajax
    window.template = function(url){
        var data = "<h1> failed to load url : " + url + "</h1>";
        $.ajax({
            async: false,
            dataType: "text",
            url: url,
            success: function(response) {
                data = response;
            }
        });
        return data;
    };

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

    App.Models.Response = Backbone.Model.extend({});

    App.Models.Map = Backbone.Model.extend({});

    App.Models.Marker = Backbone.Model.extend({});

    App.Collections.Responses = Backbone.Collection.extend({
        model: App.Models.Response,
        parse: function(response){
            return response.results;
        }
    });

    App.Collections.Markers = Backbone.Collection.extend({
        model: App.Models.Marker
    });

    App.Router = Backbone.Router.extend({
        initialize: function(){
            $(".kpcc-header").html(_.template(template("http://projects.scpr.org/static/static-files/v3-dependencies/templates/kpcc-header.html")));
            $(".kpcc-footer").html(_.template(template("http://projects.scpr.org/static/static-files/v3-dependencies/templates/kpcc-footer.html")));
        },

        routes: {
            "": "createMap",
        },

        createMap: function(){
            if (this.mapView){
                this.mapView.remove();
            };

            this.mapView = new App.Views.MapApplication({
                collection: null,
                container: ".data-visuals",
                initialZoom: 6
            });

            return this.mapView;
        }
    });

    App.Views.MapApplication = Backbone.View.extend({
        template: template("templates/map-application.html"),
        el: ".data-visuals",
        initialize: function(mapDataObject){
            this.mapDataObject = mapDataObject;
            this.stamenToner = new L.tileLayer(
                "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png", {
                    attribution: "Map tiles by <a href='http://stamen.com' target='_blank'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0' target='_blank'>CC BY 3.0</a> &mdash; Map data &copy; <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>",
                    minZoom: 6,
                    maxZoom: 14
            });

            // set zoom for mobile devices
            if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
                initialZoom = 7;
            } else {
                initialZoom = 11;
            }

            this.center = new L.LatLng(34.15954545771161, -118.57177019119261);
            this.geojsonOne = L.geoJson(electionResults, {
                filter: this.filterFeatures,
                style: this.styleFeatures,
                onEachFeature: this.onEachFeature
            });
            this.render(this.mapDataObject);
        },

        events: {
            "click a.resetMap": "resetMap",
            "click a.kuehlPrecincts": "kuehlMap",
            "click a.shriverPrecincts": "shriverMap",
            "click .precinct-data": "thisPrecinct",
        },

        styleFeatures: function (feature) {
            var layerColor;
            var totalVotes = feature.properties.ballots;
            feature.properties.results = {
                registeredVoters: feature.properties.registrati,
                totalVotes: totalVotes,
                voterTurnout: window.toFixedPercent(totalVotes, feature.properties.registrati),
                precinctResults: [
                    {candidate: "Shriver", votes: feature.properties.shriver, percent: window.toFixedPercent(feature.properties.shriver, totalVotes)},
                    {candidate: "Kuehl", votes: feature.properties.kuehl, percent: window.toFixedPercent(feature.properties.kuehl, totalVotes)},
                    /*
                    {candidate: "Duran", votes: feature.properties.duran, percent: window.toFixedPercent(feature.properties.duran, totalVotes)},
                    {candidate: "Fay", votes: feature.properties.fay, percent: window.toFixedPercent(feature.properties.fay, totalVotes)},
                    {candidate: "Kremer", votes: feature.properties.kremer, percent: window.toFixedPercent(feature.properties.kremer, totalVotes)},
                    {candidate: "Melendez", votes: feature.properties.melendez, percent: window.toFixedPercent(feature.properties.melendez, totalVotes)},
                    {candidate: "Preven", votes: feature.properties.preven, percent: window.toFixedPercent(feature.properties.preven, totalVotes)},
                    {candidate: "Ulich", votes: feature.properties.ulich, percent: window.toFixedPercent(feature.properties.ulich, totalVotes)}
                    */
                ],
            };

            var maxValue = _.max(feature.properties.results.precinctResults, function(candidate){
                return candidate.percent;
            });

            var winners = _.filter(feature.properties.results.precinctResults, function(candidate){
                return candidate.percent == maxValue.percent;
            });

            feature.properties.winner = winners;

            if (winners.length === 1){
                if (winners[0].candidate === "Duran"){
                    layerColor = "rgb(127,201,127)";
                } else if (winners[0].candidate === "Fay"){
                    layerColor = "rgb(190,174,212)";
                } else if (winners[0].candidate === "Kremer"){
                    layerColor = "rgb(253,192,134)";
                } else if (winners[0].candidate === "Kuehl"){
                    layerColor = "#fbd341";
                } else if (winners[0].candidate === "Melendez"){
                    layerColor = "rgb(56,108,176)";
                } else if (winners[0].candidate === "Preven"){
                    layerColor = "rgb(240,2,127)";
                } else if (winners[0].candidate === "Shriver"){
                    layerColor = "#55cbdd";
                } else if (winners[0].candidate === "Ulich"){
                    layerColor = "rgb(102,102,102)";
                }
            } else {
                layerColor = "rgb(0,0,0)";
            }

            return {
                color: '#000000',
                weight: .8,
                opacity: .8,
                fillOpacity: .8,
                fillColor: layerColor
            }
        },

        onEachFeature: function(feature, layer) {

            feature.selected = false;

            layer.on("click", function (e) {

                var thisLat = e.latlng.lat;
                var thisLong = e.latlng.lng;
                //getCensusApiData(thisLat, thisLong);

                if (feature.selected === false){
                    this.setStyle({
                        weight: 2,
                        opacity: 2,
                        fillOpacity: 2,
                    });
                    $("#data-point-display").append(_.template(template("templates/featcherPrecinct.html"), feature.properties));
                    feature.selected = true;
                } else {
                    this.setStyle({
                        weight: .8,
                        opacity: .8,
                        fillOpacity: .8,
                    });
                    $("#data-point-display #precinct_" + feature.properties.june_2014_).remove();
                    feature.selected = false;
                }
            });
        },

        getCensusApiData: function(lat, lng){
            var apiPrefix = "http://api.censusreporter.org/1.0/geo/search?";
            var apiQuery = apiPrefix + "lat=" + lat + "&lon=" + lng;
            console.log(apiQuery);


        },

        kuehlMap: function(e){
            this.changeLayerStylesForWinner("Kuehl");
            $(e.currentTarget).css(
                "background", "rgba(0, 127, 166, .6)"
            );
            $("a.shriverPrecincts").css(
                "background", "rgba(0, 127, 166, 1)"
            );
        },

        shriverMap: function(e){
            this.changeLayerStylesForWinner("Shriver");
            $(e.currentTarget).css(
                "background", "rgba(0, 127, 166, .6)"
            );
            $("a.kuehlPrecincts").css(
                "background", "rgba(0, 127, 166, 1)"
            );
        },

        thisPrecinct: function(e){
            var precinctBoundingBox;
            _.each(this.map._layers, function(group, key){
                if ("feature" in group){
                    if (e.currentTarget.id === "precinct_" + group.feature.properties.june_2014_){
                        precinctBoundingBox = group.getBounds();
                        group.setStyle({
                            weight: 2,
                            opacity: 2,
                            fillOpacity: 2,
                        });
                        group.feature.selected = true;
                    } else {
                        group.setStyle({
                            weight: .3,
                            opacity: .3,
                            fillOpacity: .3,
                        });
                    }
                }
            });
            this.map.fitBounds(precinctBoundingBox);
        },

        changeLayerStylesForWinner: function(winnerName){
            $("#data-point-display").empty();
            _.each(this.map._layers, function(group, key){
                if ("feature" in group){
                    if (group.feature.properties.winner.length === 1){
                        var precinctWinner = group.feature.properties.winner[0].candidate;
                        if (precinctWinner === winnerName){
                            group.setStyle({
                                weight: 2,
                                opacity: 2,
                                fillOpacity: 2,
                            });
                            group.feature.selected = true;

                            $("#data-point-display").append(_.template(template("templates/featcherPrecinct.html"), group.feature.properties));

                        } else {
                            group.setStyle({
                                weight: .3,
                                opacity: .3,
                                fillOpacity: .3,
                            });
                        }
                    }
                }
            });
        },

        resetMap: function(){
            $("#data-point-display").empty();
            $("a.shriverPrecincts").css(
                "background", "rgba(0, 127, 166, 1)"
            );
            $("a.kuehlPrecincts").css(
                "background", "rgba(0, 127, 166, 1)"
            );
            _.each(this.map._layers, function(group, key){
                if ("feature" in group){
                    if (group.feature.selected === true){
                        group.feature.selected = false;
                    }
                    group.setStyle({
                        weight: .8,
                        opacity: .8,
                        fillOpacity: .8,
                    });
                }
            });
            this.map.setView(
                this.center, 11
            );
        },

        render: function(mapDataObject){
            $(mapDataObject.container).html(_.template(this.template));
            this.map = L.map("content-map-canvas", {
                scrollWheelZoom: false,
                zoomControl: false,
                minZoom: 6,
                maxZoom: 14
            }).setView(
                this.center, 11
            ).addLayer(
                this.stamenToner
            ).addControl(L.control.zoom({
                position: "topright"
            }));
            mapDataObject.map = this.map;
            this.geojsonOne.addTo(this.map);
        },
    });

    window.app = new App.Router();
    Backbone.history.start({
        root: "http://localhost:8880/2kpcc/static-projects/test/keller/la-county-district-3-results/",
        pushState: false,
    });
})();