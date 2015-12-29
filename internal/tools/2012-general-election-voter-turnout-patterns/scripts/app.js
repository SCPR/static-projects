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

    window.getCensusApiData = function(lat, lng){
        var apiPrefix = "http://api.censusreporter.org/1.0/geo/search?";
        var apiQuery = apiPrefix + "lat=" + lat + "&lon=" + lng;
        console.log(apiQuery);
        var output = [];
        $.ajax({
            url: apiQuery,
            async: false,
            dataType: "json",
            success: function(data){
                output = data.results;
            }
        });
        console.log(output);
        for (var i=0; i<output.length; i++){
            if (output[i].sumlevel == "150"){
                return "http://censusreporter.org/profiles/" + output[i].full_geoid;
            };
        };
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


            this.mapquestUrl = new L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
                 attribution: 'Tiles, data, imagery and map information provided by <a href="http://www.mapquest.com" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and OpenStreetMap contributors.',
                 subdomains: ['otile1','otile2','otile3','otile4']
            });

            this.center = new L.LatLng(34.1980014782273, -118.261016969704);
            this.geojsonOne = L.geoJson(electionResults, {
                filter: this.filterFeatures,
                style: this.styleFeatures,
                onEachFeature: this.onEachFeature
            });
            this.render(this.mapDataObject);
        },

        events: {
            "click a.resetMap": "resetMap",
            "click a.lowTurnoutPrecincts": "lowTurnoutMap",
            "click a.highTurnoutPrecincts": "highTurnoutMap",
            "click .precinct-data": "thisPrecinct",
        },

        styleFeatures: function (feature){

            console.log(feature);

            var layerColor;

            // var totalVotes = feature.properties.ballots;

            // feature.properties.results = {
            //     registeredVoters: feature.properties.registrati,
            //     totalVotes: totalVotes,
            //     voterTurnout: window.toFixedPercent(totalVotes, feature.properties.registrati),
            // };

            // var maxValue = _.max(feature.properties.results.precinctResults, function(candidate){
            //     return candidate.percent;
            // });

            // var winners = _.filter(feature.properties.results.precinctResults, function(candidate){
            //     return candidate.percent == maxValue.percent;
            // });

            // feature.properties.winner = winners;

            if (feature.properties.turnout > 0 && feature.properties.turnout <= 33){
                layerColor = "rgba(200,61,45,0.8)";
                feature.properties.tier = "low";
            } else if (feature.properties.turnout > 33 && feature.properties.turnout <= 66){
                layerColor = "rgb(190,174,212)";
                feature.properties.tier = "middle";
            } else if (feature.properties.turnout > 66 && feature.properties.turnout <= 100){
                layerColor = "rgba(13,87,160,0.8)";
                feature.properties.tier = "high";
            } else {
                layerColor = "#ffffff";
                feature.properties.tier = null;
            };

            return {
                color: '#000000',
                weight: .8,
                opacity: .8,
                fillOpacity: .8,
                fillColor: layerColor
            }
        },

        onEachFeature: function(feature, layer) {

            var _this = this;

            feature.selected = false;
            layer.on("click", function (e) {
                var thisLat = e.latlng.lat;
                var thisLong = e.latlng.lng;
                // var this_profile = window.getCensusApiData(thisLat, thisLong);
                if (feature.selected === false){
                    this.setStyle({
                        weight: 2,
                        opacity: 2,
                        fillOpacity: 2,
                    });
                    $("#data-point-display").append(_.template(template("templates/featcher-precinct.html"), feature.properties));
                    // $("#census_profile").html("<h6><a target='_blank' href='" + this_profile + "'>View Census Profile</a></h6>");
                    feature.selected = true;
                } else {
                    this.setStyle({
                        weight: .8,
                        opacity: .8,
                        fillOpacity: .8,
                    });
                    $("#data-point-display #precinct_" + feature.properties.precinct).remove();
                    feature.selected = false;
                }
            });
        },

        lowTurnoutMap: function(e){
            this.changeLayerStylesForWinner("low");
            $(e.currentTarget).css(
                "background", "rgba(200,61,45,0.8)"
            );
            $("a.lowTurnoutPrecincts").css(
                "background", "rgba(200,61,45,0.8)"
            );
        },

        highTurnoutMap: function(e){
            this.changeLayerStylesForWinner("high");
            $(e.currentTarget).css(
                "background", "rgba(13,87,160,1)"
            );
            $("a.highTurnoutPrecincts").css(
                "background", "rgba(13,87,160,0.8)"
            );
        },

        thisPrecinct: function(e){
            var precinctBoundingBox;
            _.each(this.map._layers, function(group, key){
                if ("feature" in group){
                    if (e.currentTarget.id === "precinct_" + group.feature.properties.precinct){
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
                    var tier = group.feature.properties.tier;
                    if (tier === winnerName){
                        group.setStyle({
                            weight: 2,
                            opacity: 2,
                            fillOpacity: 2,
                        });
                        group.feature.selected = true;
                        $("#data-point-display").append(_.template(template("templates/featcher-precinct.html"), group.feature.properties));
                    } else {
                        group.setStyle({
                            weight: .3,
                            opacity: .3,
                            fillOpacity: .3,
                        });
                    }
                };
            });
        },

        resetMap: function(){
            $("#data-point-display").empty();
            $("a.lowTurnoutPrecincts").css(
                "background", "rgba(200,61,45,0.8)"
            );
            $("a.highTurnoutPrecincts").css(
                "background", "rgba(13,87,160,0.8)"
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
                this.center, window.appConfig.initial_zoom
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
                this.center, window.appConfig.initial_zoom
            ).addLayer(
                // this.stamenToner
                this.mapquestUrl
            ).addControl(L.control.zoom({
                position: "topright"
            }));
            mapDataObject.map = this.map;
            this.geojsonOne.addTo(this.map);
        },
    });
