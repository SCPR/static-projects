    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },
        routes: {
            "": "renderApplicationVisuals",
        },
        renderApplicationVisuals: function(){
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
            if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
                viewObject.initial_display = "grid";
                viewObject.initialZoom = 6;
            } else if (window.appConfig.windowSize < 620){
                viewObject.initial_display = "grid";
                viewObject.initialZoom = 6;
            } else {
                viewObject.initial_display = "grid";
                viewObject.initialZoom = 12;
            }

            viewObject.stamenToner = L.tileLayer("http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png", {
                attribution: "Map tiles by <a href='http://stamen.com' target='_blank'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0' target='_blank'>CC BY 3.0</a> &mdash; Map data &copy; <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>",
                subdomains: "abcd",
                minZoom: 6,
                maxZoom: 16
            });

            viewObject.center = new L.LatLng(34.061841979429445, -118.26370239257812);

            this.render(viewObject);

        },

        events: {
            //"click a.search": "getSearchTerm",
        },

        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));
            if (viewObject.initial_display === "grid"){
                $("#content-map-container").remove();
                this.buildGridDisplay(location_data);
            } else {
                this.map = L.map("content-map-canvas", {
                    scrollWheelZoom: false,
                    zoomControl: true,
                    minZoom: 6,
                    maxZoom: 16
                }).setView(viewObject.center, viewObject.initialZoom).addLayer(viewObject.stamenToner)
                this.addMarkers(location_data);
            }
        },

        buildGridDisplay: function(location_data){

            for(var i=0; i < location_data.length; i++){

                this.featcherSentence = _.template(
                    "<div class='submission row'>" +
                        "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                            "<% if (imagedisplay === 'both'){ %>" +
                                "<img class='double' src='<%= primaryimagelink %>' />" +
                                "<img class='double'src='<%= secondaryimagelink %>' />" +
                            "<% } else { %>" +
                                "<img class='double' src='<%= primaryimagelink %>' />" +
                            "<% }; %>" +
                        "</div>" +
                        "<div class='col-xs-6 col-sm-6 col-md-6 col-lg-6'>" +
                            "<div class='quote'>" +
                                "<h5 class='text-center'><%= name %><br /><br /><%= displaylocation %></h5>" +
                                "<p class='text-center'><%= about %></p>" +
                            "</div>" +
                        "</div>" +
                        "<div class='col-xs-6 col-sm-6 col-md-6 col-lg-6'>" +
                            "<img src='https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyCgh93OAbzooidV0OUpIOoc6kTxV5o69do&center=<%= latitude %>,<%= longitude %>&zoom=12&size=200x200&maptype=terrain&markers=color:yellow%7Clabel:%7C<%= latitude %>,<%= longitude %>' />" +
                        "</div>" +
                    "</div>", location_data[i]);

                $("#content-div")
                    .removeClass("col-xs-12 col-sm-12 col-md-12 col-lg-12")
                    .addClass("col-xs-12 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2")
                    .append(this.featcherSentence);
            };

        },

        addMarkers: function(location_data){
            for(var i=0; i < location_data.length; i++){
                this.marker = new L.CircleMarker([location_data[i].latitude, location_data[i].longitude], {
                    radius: 10,
                    color: "#732E00",
                    fillColor: "#fffdb6",
                    fillOpacity: 1.0,
                    opacity: 1.0,
                    weight: 2.0,
                    clickable: true
                });
                this.bindEvent(this.marker, location_data[i]);
                this.map.addLayer(this.marker);
            };
        },

        bindEvent: function(marker, location_data){

            this.featcherSentence = _.template(
                "<div class='submission row'>" +
                    "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
                        "<% if (imagedisplay === 'both'){ %>" +
                            "<img class='double' src='<%= primaryimagelink %>' />" +
                            "<img src='<%= secondaryimagelink %>' />" +
                        "<% } else { %>" +
                            "<img src='<%= primaryimagelink %>' />" +
                        "<% }; %>" +
                        "<div class='quote'>" +
                            "<p><%= about %></p>" +
                        "</div>" +
                    "</div>" +
                "</div>", location_data);

            this.popup = L.popup({
                minWidth: 500,
                maxWidth: 500
            }).setContent(this.featcherSentence);

            marker.bindPopup(this.popup);

        }

    });
