    window.percentifyValue = function(value){
        var value = value * 100
        return parseFloat(value.toFixed(2));
    };

    window.toFixedPercent = function(part, whole){
        var targetValue = part / whole;
        var decimal = parseFloat(targetValue);
        if (isNaN(decimal) === true){
            output = null;
        } else {
            output = decimal;
        }
        return output
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

    window.getCensusDataByTract = function(table, tract_id){
        var apiPrefix = "https://api.censusreporter.org/1.0/data/show/acs2014_5yr?table_ids=";
        var apiQuery = apiPrefix + table + "&geo_ids=" + tract_id;
        var output;
        $.ajax({
            url: apiQuery,
            async: true,
            dataType: "json",
            success: function(data){
                output = data.results;
            }
        });
        console.log(output);
        // for (var i=0; i<output.length; i++){
        //     if (output[i].sumlevel == "150"){
        //         return "http://censusreporter.org/profiles/" + output[i].full_geoid;
        //     };
        // };
    };

    window.getCensusApiDataByLoco = function(lat, lng){
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

    window.ifEmptyStringForTotal = function(value){
        var result;
        if (value === ""){
            result = "Total not available";
        } else {
            result = window.addCommas(value);
        }
        return result;
    };

    window.createCurrency = function(nStr){
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
            return "$" + x1 + x2 + ".00";
    };

    window.percentify = function(value){
        var value = value * 100
        return parseFloat(value.toFixed(2));
    };

    window.create_groups = function(object, key){
        var output = object.groupBy(function(model){
            return model.get(key);
        });
        return output;
    };

    window.string_equals_string = function(comparison, input){
        var result;
        if (input === comparison){
            result = true;
        } else {
            result = false;
        }
        return result;
    };

    window.parse_year = function(date_time){
        var output = moment(date_time).locale("en").format("YYYY");
        output = parseInt(output);
        return output
    };

    window.parse_month_of_year = function(date_time){
        var output = moment(date_time).locale("en").format("MMM");
        return output
    };

    window.parse_day_of_week = function(date_time){
        var output = moment(date_time).locale("en").format("dddd");
        return output
    };

    window.parse_time_of_day = function(date_time){
        var output;
        var moment_date = moment.utc(date_time).format("HH:mm:ss");
        var comparison_date = "2011-01-01 " + moment_date;
        if (Date.parse(comparison_date) >= Date.parse("2011-01-01 00:00:00") && Date.parse(comparison_date) <= Date.parse("2011-01-01 06:00:00")){
            output = "_midnight_to_6_am";
        } else if (Date.parse(comparison_date) >= Date.parse("2011-01-01 06:01:00") && Date.parse(comparison_date) <= Date.parse("2011-01-01 12:00:00")){
            output = "_6_am_to_noon";
        } else if (Date.parse(comparison_date) >= Date.parse("2011-01-01 12:01:00") && Date.parse(comparison_date) <= Date.parse("2011-01-01 18:00:00")){
            output = "_noon_to_6_pm";
        } else if (Date.parse(comparison_date) >= Date.parse("2011-01-01 18:01:00") && Date.parse(comparison_date) <= Date.parse("2011-01-01 23:59:59")){
            output = "_6_pm_to_midnight";
        } else {
            output = "outlier";
        };
        return output;
    };

    window.comma_values_to_array = function(comma_string){
        var array_of_strings = comma_string.split(",");
        return array_of_strings;
    };

    window.sum_values_in = function(array){
        return _.reduce(array, function(memo, num){
            return memo + num;
        }, 0);
    };

    window.create_models_from_comma_separated = function(array){
        var counts = {};
        _.each(array, function(value){
            counts[value] = counts[value] ? counts[value] + 1 : 1;
        });
        var array_of_models = [];
        _.each(counts, function(value, key, obj){
            var output = {
                name: key.replace(/^\s+|\s+$/gm, ""),
                quantity: value
            };
            array_of_models.push(output);
        });
        return array_of_models;
    };

    // string functions
    String.prototype.splitOnCapitalLetter = function(){
        var newString = this.replace(/([a-z])([A-Z])/g, "$1 $2")
        return newString;
    };

    // string functions
    String.prototype.splitOnCapitalLetter = function(){
        var newString = this.replace(/([a-z])([A-Z])/g, "$1 $2")
        return newString;
    };

    String.prototype.slugifyString = function(){
        var newString = this.toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
        return newString;
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

    String.prototype.phraseToProperCase = function(){
        return this.replace("+", " ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

    App.Router = Backbone.Router.extend({
        initialize: function(){
            window.config = {};
            window.config.collection = null;
            window.config.container = ".data-visuals";
            window.config.initial_zoom = window.appConfig.initial_zoom;
            L.TopoJSON = L.GeoJSON.extend({
                addData: function(jsonData){
                    if (jsonData.type === "Topology"){
                        for (key in jsonData.objects){
                            geojson = topojson.feature( jsonData, jsonData.objects[key]);
                            L.GeoJSON.prototype.addData.call(this, geojson);
                        }
                    } else {
                        L.GeoJSON.prototype.addData.call(this, jsonData);
                    }
                }
            });
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "fetchData",
        },

        fetchData: function(){
            $.getJSON("data/data.topojson", function(data){
                window.config.geo_data = data;
            });
            var _this = this;
            var checkExist = setInterval(function() {
                var my_data = _.has(window.config, "geo_data");
                if (my_data === true){
                    clearInterval(checkExist);
                    _this.render_application_visuals(window.config);
                }
            }, 500);
        },

        render_application_visuals: function(config){
            if (this.mapView){
                this.mapView.remove();
            };
            this.mapView = new App.Views.MapApplication(config);
            return this.mapView;
        }
    });

    App.Views.MapApplication = Backbone.View.extend({

        template: template("templates/data-visuals.html"),

        el: ".data-visuals",

        initialize: function(object){
            this.view_object = object;
            this.view_object.osmMap = new L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
                subdomains: ["a","b","c"],
                minZoom: 1,
                maxZoom: 20
            });
            if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
                this.view_object.initial_zoom = 8;
            } else {
                this.view_object.initial_zoom = this.view_object.initial_zoom;
            };
            this.view_object.center = new L.LatLng(window.appConfig.lat, window.appConfig.lng);
            this.render();
        },

        events: {
            "click a.resetMap": "resetMap",
            // "click a.clintonPrecincts": "clintonMap",
            // "click a.trumpPrecincts": "trumpMap",
            // "click .precinct-data": "thisPrecinct",
        },

        styleFeatures: function (feature){
            var layerColor;
            if (feature.properties.ballot_type === null){
                feature.properties.results = null
                feature.properties.precinct_totals = null;
                feature.properties.winner = null
            } else {
                feature.properties.results = {
                    registration: feature.properties.registration,
                    ballots_cast: feature.properties.ballots_cast,
                    turnout: window.toFixedPercent(feature.properties.ballots_cast, feature.properties.registration),
                };
                feature.properties.precinct_totals = [
                    {name: "Hillary Clinton", votes: feature.properties.clinton},
                    {name: "Donald Trump", votes: feature.properties.trump},
                    {name: "Gary Johnson", votes: feature.properties.johnson},
                    {name: "Jill Stein", votes: feature.properties.stein},
                    {name: "La Riva", votes: feature.properties.la_riva},
                ];
                _.max(feature.properties.precinct_totals, function(candidate){
                    candidate.slug = candidate.name.slugifyString();
                    candidate.pct_of_vote = candidate.votes/feature.properties.results.ballots_cast;
                    return candidate;
                });
                feature.properties.winner = _.max(feature.properties.precinct_totals, function(candidate){
                    return candidate.pct_of_vote;
                });
            };
            if (_.isEmpty(feature.properties.winner) === true){
                feature.properties.winner = null;
                layerColor = "#ffffff";
            } else {
                if (feature.properties.winner.slug === "hillary-clinton"){
                    layerColor = "rgba(241,163,64,0.8)";
                } else if (feature.properties.winner.slug === "donald-trump"){
                    layerColor = "rgba(153,142,195,0.8)";
                } else {
                    layerColor = "#000000";
                };
            };
            return {
                color: '#000000',
                weight: 0,
                opacity: 0,
                fillOpacity: .8,
                fillColor: layerColor
            };
        },

        onEachFeature: function(feature, layer){
            feature.selected = false;
            layer.on("click", function(e){
                var total_features = [];
                var aggs = {};
                aggs.assem_dist = feature.properties.dist_stass;
                _.each(e.target._map._layers, function(group, key){
                    if ("feature" in group){
                        if (group.feature.properties.dist_stass === feature.properties.dist_stass){
                            total_features.push(group.feature.properties);
                            group.setStyle({
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 1,
                            });
                            group.feature.selected = true;
                        } else {
                            group.setStyle({
                                weight: 0,
                                opacity: 0,
                                fillOpacity: .8,
                            });
                            feature.selected = false;
                        };
                    };
                });
                aggs.precinct_quantity = total_features.length;
                aggs.total = total_features.reduce(function(previousValue, currentValue){
                    return {
                        registration: previousValue.registration + currentValue.registration,
                        ballots_cast: previousValue.ballots_cast + currentValue.ballots_cast,
                        clinton: previousValue.clinton + currentValue.clinton,
                        trump: previousValue.trump + currentValue.trump,
                        stein: previousValue.stein + currentValue.stein,
                        johnson: previousValue.johnson + currentValue.johnson,
                        la_riva: previousValue.la_riva + currentValue.la_riva
                    }
                });
                aggs.total.turnout = window.toFixedPercent(aggs.total.ballots_cast, aggs.total.registration);
                aggs.winners = _.groupBy(total_features, function(value){
                    if (value.winner != null){
                        return value.winner.slug.replace("-", "_");
                    };
                });
                if (aggs.winners.donald_trump === undefined){
                    aggs.winners.donald_trump = [];
                };
                if (aggs.winners.hillary_clinton === undefined){
                    aggs.winners.hillary_clinton = [];
                };
                var table_id = "B03002";
                var assem_dist = "62000US060" + aggs.assem_dist;
                var apiPrefix = "https://api.censusreporter.org/1.0/data/show/acs2014_5yr?table_ids=";
                var apiQuery = apiPrefix + table_id + "&geo_ids=" + assem_dist;
                var mydata = null;
                $.ajax({
                    url: apiQuery,
                    async: false,
                    dataType: "json",
                    success: function(results){
                        mydata = results.data;
                    }
                });
                var target_data = _.values(mydata)[0][table_id]["estimate"];
                aggs.census_data = {};
                aggs.census_data.total = target_data.B03002001;
                aggs.census_data.white = target_data.B03002003;
                aggs.census_data.black = target_data.B03002004;
                aggs.census_data.asian = target_data.B03002006;
                aggs.census_data.hispanic_latino = target_data.B03002012;
                console.log(aggs);
                $("#data-point-display").html(_.template(template("templates/featcher-precinct.html"), aggs));
            });
        },

        // clintonMap: function(e){
        //     this.changeLayerStylesForWinner("hillary-clinton");
        //     $(e.currentTarget).css(
        //         "background", "rgba(200,61,45,0.8)"
        //     );
        //     $("a.lowTurnoutPrecincts").css(
        //         "background", "rgba(200,61,45,0.8)"
        //     );
        // },

        // trumpMap: function(e){
        //     this.changeLayerStylesForWinner("donald-trump");
        //     $(e.currentTarget).css(
        //         "background", "rgba(13,87,160,1)"
        //     );
        //     $("a.highTurnoutPrecincts").css(
        //         "background", "rgba(13,87,160,0.8)"
        //     );
        // },

        // thisPrecinct: function(e){
        //     var precinctBoundingBox;
        //     _.each(this.view_object.map._layers, function(group, key){
        //         if ("feature" in group){
        //             if (e.currentTarget.id === "precinct_" + group.feature.properties.precinct){
        //                 precinctBoundingBox = group.getBounds();
        //                 group.setStyle({
        //                     weight: 1,
        //                     opacity: 1,
        //                     fillOpacity: 1,
        //                 });
        //                 group.feature.selected = true;
        //             } else {
        //                 group.setStyle({
        //                     weight: 0,
        //                     opacity: 0,
        //                     fillOpacity: .8,
        //                 });
        //             }
        //         }
        //     });
        //     this.view_object.map.fitBounds(precinctBoundingBox);
        // },

        // changeLayerStylesForWinner: function(winnerName){
        //     $("#data-point-display").empty();
        //     _.each(this.view_object.map._layers, function(group, key){
        //         if ("feature" in group){
        //             if (group.feature.properties.winner != null){
        //                 var winner = group.feature.properties.winner.slug;
        //                 if (winner === winnerName){
        //                     group.setStyle({
        //                         fillOpacity: 1,
        //                     });
        //                     group.feature.selected = true;
        //                     $("#data-point-display").append(_.template(template("templates/featcher-precinct.html"), group.feature.properties));
        //                 } else {
        //                     group.setStyle({
        //                         fillOpacity: .5,
        //                     });
        //                 }
        //             }
        //         };
        //     });
        // },

        resetMap: function(){
            $("#data-point-display").empty();
            $("a.lowTurnoutPrecincts").css(
                "background", "rgba(200,61,45,0.8)"
            );
            $("a.highTurnoutPrecincts").css(
                "background", "rgba(13,87,160,0.8)"
            );
            _.each(this.view_object.map._layers, function(group, key){
                if ("feature" in group){
                    if (group.feature.selected === true){
                        group.feature.selected = false;
                    }
                    group.setStyle({
                        weight: 0,
                        opacity: 0,
                        fillOpacity: .8,
                    });
                }
            });
            this.view_object.map.setView(this.view_object.center, this.view_object.initial_zoom);
        },

        render: function(){
            $(this.el).html(this.template);
            this.view_object.map = L.map("content-map-canvas", {
                scrollWheelZoom: false,
                zoomControl: true,
                minZoom: 1,
                maxZoom: 20
            });
            this.view_object.map.setView(this.view_object.center, this.view_object.initial_zoom);
            this.view_object.map.addLayer(this.view_object.osmMap);
            this.set_topo_layer(this.view_object.geo_data)
        },

        set_topo_layer: function(geo_data){
            this.topoLayer = new L.TopoJSON(geo_data, {
                filter: this.filterFeatures,
                style: this.styleFeatures,
                onEachFeature: this.onEachFeature
            }).addTo(this.view_object.map);
        }
    });
