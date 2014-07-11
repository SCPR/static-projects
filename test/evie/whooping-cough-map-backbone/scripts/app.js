    window.storage = Tabletop.init({
        key: "https://docs.google.com/spreadsheets/d/1H6hFZQiolqW7fU5Zdruy0LWTPn8zqDN2gW4ZkQoFUaI/pubhtml",
        wait: true
    });

    App.Models.WhoopingCoughCurrent = Backbone.Model.extend({
        defaults: {
            county: null,
            countyproper: null,
            updated: null,
            cases: null,
            rate: null,
        },
        tabletop: {
            instance: window.storage,
            sheet: "data_6_24_2014"
        },
        sync: Backbone.tabletopSync
    });

    App.Models.WhoopingCoughHistorical = Backbone.Model.extend({
        defaults: {
            county: null,
            countyproper: null,
            updated: null,
            cases: null,
            rate: null,
        },
    });

    App.Collections.WhoopingCoughCurrents = Backbone.Collection.extend({
        model: App.Models.WhoopingCoughCurrent,
        tabletop: {
            instance: window.storage,
            sheet: "data_6_24_2014"
        },
        sync: Backbone.tabletopSync
    });

    App.Collections.WhoopingCoughHistoricals = Backbone.Collection.extend({
        model: App.Models.WhoopingCoughHistorical
    });

    App.Router = Backbone.Router.extend({

        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "fetchData",
        },

        fetchData: function(){
            var _this = this;
            var applicationCollection = new App.Collections.WhoopingCoughCurrents();
            applicationCollection.fetch({
                async: true
            });
            var checkExist = setInterval(function() {
                if (applicationCollection.length > 0){
                    clearInterval(checkExist);
                    _this.renderApplicationVisuals(applicationCollection);
                }
            }, 500);
        },

        renderApplicationVisuals: function(collection){
            if (this.applicationVisuals){
                this.applicationVisuals.remove();
            };

            this.applicationVisuals = new App.Views.ApplicationVisuals({
                collection: collection,
                container: ".data-visuals"
            });

            return this.applicationVisuals;

        },

    });

    App.Views.ApplicationVisuals = Backbone.View.extend({
        template: template("templates/data-visuals.html"),

        el: ".data-visuals",

        initialize: function(viewObject){

            $(window).bind('scroll', function(){
                var aboveHeight = $(".kpcc-header").outerHeight() + $(".data-details").outerHeight();
                var barWidth = $(".content-map-data").width();
                if ($(window).scrollTop() > aboveHeight){
                    $(".content-map-data").addClass("fixed").css("width", barWidth);
                } else {
                    $(".content-map-data").removeClass("fixed").css("width", "width: 100%;");
                }
            });

            this.render(viewObject);
        },

        styleFeatures: function (feature) {
            return {
                color: "black",
                weight: 0.7,
                opacity: 0.7,
                fillOpacity: 0.7,
                fillColor: feature.properties.layerColor
            }
        },

        onEachFeature: function(feature, layer) {

            var highlightedStyle = {
                weight: 3,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7,
                fillColor: 'black'
            };

            var unhighlightedStyle = {
                weight: 0.7,
                opacity: 0.7,
                fillOpacity: 0.7,
                fillColor: feature.properties.layerColor
            };

            // this is what is being written to the display div
            var featcherDetails = (
                "<div class='col-xs-12 col-sm-12 col-md-6 col-lg-6'>" +
                    "<h5><%= countyproper %></h5>" +
                    "<h6>Last updated: <%= moment(updated).format('MMMM D[th], YYYY') %></h6>" +
                "</div>" +
                "<div class='col-xs-12 col-sm-12 col-md-6 col-lg-6'>" +
                    "<h5><%= rate %> cases per 100,000 people</h5>" +
                    "<h6><%= cases %> total cases</h6>" +
                "</div>"
            );

            if (window.appConfig.isMobile === true){
                layer.on({
                    click: function(e){
                        var data = e.target.feature.properties;
                        $(".content-feature-data").html(_.template(featcherDetails, data));
                    }
                });
            } else {
                layer.on({
                    mouseover: function(e){
                        this.setStyle(highlightedStyle);
                        var data = e.target.feature.properties;
                        $(".content-feature-data").html(_.template(featcherDetails, data));
                    },

                    mouseout: function(e){
                        this.setStyle(unhighlightedStyle);
                        $(".content-feature-data").html(
                            "<div class='pull-left'>" +
                                "<h5>Hover over a county to see the latest whooping cough case rates in California</h5>" +
                                "<h6>&nbsp;</h6>" +
                            "</div>"
                        );
                    },
                });
            }
        },

        createNewBasemapLayer: function(collection, dataUrl){
            var collection = new App.Collections.WhoopingCoughHistoricals();
            collection.fetch({
                url: dataUrl,
                async: false
            });
            var baseLayer = this.combineCollectionWithShape(collection);
            return baseLayer;
        },

        combineCollectionWithShape: function(collection){

            var copyOfCountyShapes = $.extend(true, {}, californiaCounties);

            var equalIntervalArray = [];

            for (var i=0; i<copyOfCountyShapes.features.length; i++){
                var dataObject = collection.where({
                    "countyproper": copyOfCountyShapes.features[i].properties.name
                });
                equalIntervalArray.push(parseFloat(dataObject[0].attributes.rate));
                copyOfCountyShapes.features[i].properties.updated = dataObject[0].attributes.updated;
                copyOfCountyShapes.features[i].properties.cases = parseInt(dataObject[0].attributes.cases);
                copyOfCountyShapes.features[i].properties.rate = parseFloat(dataObject[0].attributes.rate);
                copyOfCountyShapes.features[i].properties.countyproper = dataObject[0].attributes.countyproper + " County";
            };

            for (var i=0; i<copyOfCountyShapes.features.length; i++){
                var comparitor = copyOfCountyShapes.features;
                if (comparitor[i].properties.rate >= 5 && comparitor[i].properties.rate < 10){
                    comparitor[i].properties.layerColor = "#FEB24C";
                } else if (comparitor[i].properties.rate >= 10 && comparitor[i].properties.rate < 15){
                    comparitor[i].properties.layerColor = "#FD8D3C";
                } else if (comparitor[i].properties.rate >= 15 && comparitor[i].properties.rate < 20){
                    comparitor[i].properties.layerColor = "#FC4E2A";
                } else if (comparitor[i].properties.rate >= 20 && comparitor[i].properties.rate < 25) {
                    comparitor[i].properties.layerColor = "#E31A1C";
                } else if (comparitor[i].properties.rate >= 25 && comparitor[i].properties.rate < 30){
                    comparitor[i].properties.layerColor = "#BD0026";
                } else if (comparitor[i].properties.rate >= 30){
                    comparitor[i].properties.layerColor = "#800026";
                } else {
                    comparitor[i].properties.layerColor = "#FFEDA0";
                }
            };

            var newGeoJsonLayer = L.geoJson(copyOfCountyShapes, {
                filter: this.filterFeatures,
                style: this.styleFeatures,
                onEachFeature: this.onEachFeature
            });

            return newGeoJsonLayer;
        },

        createLegend: function(){
            grades = [0, 5, 10, 15, 20, 25, 30];
            dataColor = ["#FFEDA0", "#FEB24C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#BD0026", "#800026"];
            for (var i=0; i<grades.length; i++){
                $("#legend-colors").append(
                    "<td style='background:" + dataColor[i] + "'>" + grades[i] + "</td>"
                );
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
                window.appConfig.map_center_california, window.appConfig.initial_map_zoom
            ).addLayer(
                this.stamenToner
            );

            var baseMaps = {
                "2014": this.combineCollectionWithShape(viewObject.collection),
                "2013": this.createNewBasemapLayer("data2013Collection", "data/data_2013.json"),
                "2012": this.createNewBasemapLayer("data2012Collection", "data/data_2012.json"),
                "2011": this.createNewBasemapLayer("data2011Collection", "data/data_2011.json"),
                "2010": this.createNewBasemapLayer("data2010Collection", "data/data_2010.json"),
            };

            var overlayMaps = {};

            var controlPanel = {
                "position": "topright",
                "collapsed": false
            };

            L.control.layers(
                baseMaps,
                overlayMaps,
                controlPanel
            ).addTo(this.map);

            L.control.zoom({
                position: "topright"
            }).addTo(this.map);

            baseMaps["2014"].addTo(this.map);

            this.createLegend();
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