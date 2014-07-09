    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },
        routes: {
            "": "renderApplicationVisuals",
        },
        renderApplicationVisuals: function(collection){
            if (this.applicationVisuals){
                this.applicationVisuals.remove();
            };
            this.applicationVisuals = new App.Views.ApplicationVisuals({
                container: ".data-visuals"
            });
            return this.applicationVisuals;
        },
    });

    App.Views.ApplicationVisuals = Backbone.View.extend({
        template: template("templates/data-visuals.html"),
        el: ".data-visuals",
        initialize: function(viewObject){
            this.render(viewObject);
        },

        render: function(viewObject){

            $(viewObject.container).html(_.template(this.template));

            google.maps.visualRefresh = true;

            var isMobile = (navigator.userAgent.toLowerCase().indexOf('android') > -1) || (navigator.userAgent.match(/(iPod|iPhone|iPad|BlackBerry|Windows Phone|iemobile)/));

            if (isMobile) {
                var viewport = document.querySelector("meta[name=viewport]");
                viewport.setAttribute('content', 'initial-scale=1.0, user-scalable=no');
            };

            var mapDiv = document.getElementById('content-map-canvas');

            mapDiv.style.width = isMobile ? '100%' : '100%';
            mapDiv.style.height = isMobile ? '100%' : '680px';

            var map = new google.maps.Map(mapDiv, {
                center: new google.maps.LatLng(34.000304, -118.238039),
                zoom: window.appConfig.initial_map_zoom,
                scrollwheel: false,
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

            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('googft-legend-open'));
            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('googft-legend'));

            layer = new google.maps.FusionTablesLayer({
                map: map,
                suppressInfoWindows: true,
                heatmap: {
                    enabled: false
                },
                query: {
                    select: "col2\x3e\x3e1",
                    from: "1ie_VDS_mTkNJ9uOJHp9a3iuZoYxcSo70uTGGlXXT",
                    where: ""
                },
                options: {
                    styleId: 2,
                    templateId: 2
                }
            });

            google.maps.event.addListener(layer, 'click', function(e) {
                var fusionTableDataObject = {
                    install_zip_code: e.row.install_zip_code.value,
                    total_2008: e.row.total_2008.value,
                    total_2009: e.row.total_2009.value,
                    total_2010: e.row.total_2010.value,
                    total_2011: e.row.total_2011.value,
                    total_2012: e.row.total_2012.value,
                    total_2013: e.row.total_2013.value,
                    total_2014: e.row.total_2014.value,
                    total_overall: e.row.total_overall.value,
                    data_source: e.row.data_source.value,
                    incentive_program: e.row.incentive_program.value,
                    about_the_program: e.row.about_the_program.value
                }

                var dataDescription = _.template(
                    "<h4><%= install_zip_code %></h4>" +
                    "<p><strong>Total removed</strong>: <%= window.addCommas(total_overall) %></p>" +
                    "<p><%= window.addCommas(total_2014) %></p>" +
                    "<p><%= window.addCommas(total_2013) %></p>" +
                    "<p><%= window.addCommas(total_2012) %></p>" +
                    "<p><%= window.addCommas(total_2011) %></p>" +
                    "<p><%= window.addCommas(total_2010) %></p>" +
                    "<p><%= window.addCommas(total_2009) %></p>" +
                    "<p><%= window.addCommas(total_2008) %></p>" +
                    "<p><%= data_source %></p>" +
                    "<p><%= incentive_program %></p>" +
                    "<p class='small-writing'><strong>About the program</strong>: <%= about_the_program %></p>", fusionTableDataObject);
                $(".content-feature-data").html(dataDescription);
            });

            google.maps.event.addDomListener(map, 'idle', function() {
                center = map.getCenter();
            });

            google.maps.event.addDomListener(window, 'resize', function() {
                map.setCenter(center);
            });

            if (isMobile) {
                var legend = document.getElementById('googft-legend');
                var legendOpenButton = document.getElementById('googft-legend-open');
                var legendCloseButton = document.getElementById('googft-legend-close');
                legend.style.display = 'none';
                legendOpenButton.style.display = 'block';
                legendCloseButton.style.display = 'block';
                legendOpenButton.onclick = function() {
                    legend.style.display = 'block';
                    legendOpenButton.style.display = 'none';
                };

                legendCloseButton.onclick = function() {
                    legend.style.display = 'none';
                    legendOpenButton.style.display = 'block';
                };
            };

        }

    });

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
