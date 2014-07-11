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
            sheet: "data_7_8_2014"
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
            sheet: "data_7_8_2014"
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

            this.dataColor = ["#ffffff", "#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"];

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

        events: {
          "click input": "layerSwitch"
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
                if (comparitor[i].properties.rate <= 120 && comparitor[i].properties.rate >= 100){
                    comparitor[i].properties.layerColor = this.dataColor[5];
                } else if (comparitor[i].properties.rate <= 99 && comparitor[i].properties.rate >= 80){
                    comparitor[i].properties.layerColor = this.dataColor[4];
                } else if (comparitor[i].properties.rate <= 79 && comparitor[i].properties.rate >= 60){
                    comparitor[i].properties.layerColor = this.dataColor[3];
                } else if (comparitor[i].properties.rate <= 59 && comparitor[i].properties.rate >= 40){
                    comparitor[i].properties.layerColor = this.dataColor[2];
                } else if (comparitor[i].properties.rate <= 39 && comparitor[i].properties.rate >= 20){
                    comparitor[i].properties.layerColor = this.dataColor[1];
                } else if (comparitor[i].properties.rate <= 19 && comparitor[i].properties.rate >= 0){
                    comparitor[i].properties.layerColor = this.dataColor[0];
                } else {
                    comparitor[i].properties.layerColor = "#ffffff";
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
            var dataRanges = [
                "No cases reported",
                "Less than 20",
                "Less than 40",
                "Less than 60",
                "Less than 80",
                "Less than 100",
                "Less than 120"
            ];

            for (var i=0; i<this.dataColor.length; i++){
                $("#legend-colors").append(
                    "<td style='background:" + this.dataColor[i] + "'>" + dataRanges[i] + "</td>"
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

            this.baseMaps = {
                "layer2014": this.combineCollectionWithShape(viewObject.collection),
                "layer2013": this.createNewBasemapLayer("data2013Collection", "data/data_2013.json"),
                "layer2012": this.createNewBasemapLayer("data2012Collection", "data/data_2012.json"),
                "layer2011": this.createNewBasemapLayer("data2011Collection", "data/data_2011.json"),
                "layer2010": this.createNewBasemapLayer("data2010Collection", "data/data_2010.json"),
            };

            var overlayMaps = {};

            var controlPanel = {
                "position": "topright",
                "collapsed": false
            };

            /* L.control.layers(
                baseMaps,
                overlayMaps,
                controlPanel
            ).addTo(this.map); */

            L.control.zoom({
                position: "topright"
            }).addTo(this.map);

            this.dataLayer = new L.layerGroup();
            this.dataLayer.addLayer(this.baseMaps["layer2014"]);
            this.dataLayer.addTo(this.map);

            this.createLegend();

        },


       layerSwitch: function(ev){
                var layerName = ev.target.id;
                this.dataLayer.clearLayers();
                this.dataLayer.addLayer(this.baseMaps[layerName]);
                this.dataLayer.addTo(this.map);

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