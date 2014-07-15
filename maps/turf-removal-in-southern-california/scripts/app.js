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

        var mapDiv = document.getElementById("content-map-canvas");

        if (window.appConfig.is_mobile){
            mapDiv.style.width = "100%";
            mapDiv.style.height = "400px";
        }

        var map = new google.maps.Map(mapDiv, {
            center: window.appConfig.map_center_los_angeles,
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

        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById("googft-legend-open"));
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById("googft-legend"));

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

        if (window.appConfig.is_mobile){
            layer.suppressInfoWindows = false;
        } else {
            google.maps.event.addListener(layer, "click", function(e) {
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
                    "<h6><%= window.addCommas(total_overall) %> square feet of turf has been removed in zip code <%= install_zip_code %></h6>" +
                    "<table class='table'>" +
                        "<thead>" +
                            "<tr>" +
                                "<th>Year</th>" +
                                "<th>Total</th>" +
                            "</tr>" +
                        "</thead>" +
                        "<tbody>" +
                            "<tr>" +
                                "<td>2014</td>" +
                                "<td><%= window.ifEmptyStringForTotal(total_2014) %></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>2013</td>" +
                                "<td><%= window.ifEmptyStringForTotal(total_2013) %></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>2012</td>" +
                                "<td><%= window.ifEmptyStringForTotal(total_2012) %></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>2011</td>" +
                                "<td><%= window.ifEmptyStringForTotal(total_2011) %></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>2010</td>" +
                                "<td><%= window.ifEmptyStringForTotal(total_2010) %></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>2009</td>" +
                                "<td><%= window.ifEmptyStringForTotal(total_2009) %></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>2008</td>" +
                                "<td><%= window.ifEmptyStringForTotal(total_2008) %></td>" +
                            "</tr>" +
                        "</tbody>" +
                    "<table>" +
                    "<p class='small-writing'><strong>About the program</strong>: <%= about_the_program %></p>" +
                    "<p class='small-writing'><strong>Data</strong>: <%= data_source %></p>", fusionTableDataObject);
                $(".content-feature-data").html(dataDescription);
            });
        };

        google.maps.event.addDomListener(map, "idle", function() {
            center = map.getCenter();
        });

        google.maps.event.addDomListener(window, "resize", function() {
            map.setCenter(window.appConfig.map_center_los_angeles);
        });

        if (window.appConfig.is_mobile) {
            var legend = document.getElementById("googft-legend");
            var legendOpenButton = document.getElementById("googft-legend-open");
            var legendCloseButton = document.getElementById("googft-legend-close");
            legend.style.display = "none";
            legendOpenButton.style.display = "block";
            legendCloseButton.style.display = "block";
            legendOpenButton.onclick = function() {
                legend.style.display = "block";
                legendOpenButton.style.display = "none";
            };
            legendCloseButton.onclick = function() {
                legend.style.display = "none";
                legendOpenButton.style.display = "block";
            };
        };
    }
});