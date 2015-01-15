App.Views.MapView = Backbone.View.extend({

    tagName: "div",

    className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

    initialize: function(viewConfig){

        console.log(viewConfig);

        this.template = _.template(template(viewConfig.template)),

        this.stamenToner = L.tileLayer("http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png", {
            attribution: "Map tiles by <a href='http://stamen.com' target='_blank'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0' target='_blank'>CC BY 3.0</a> &mdash; Map data &copy; <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>",
        	subdomains: "abcd",
        	minZoom: 6,
        	maxZoom: 16
        });

        if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
            this.initialZoom = 7;
        } else {
            this.initialZoom = viewConfig.initialZoom;
        }

        this.center = new L.LatLng(34.061841979429445, -118.26370239257812);

        this.geojsonLayer = L.geoJson(zipCodeRent, {

            filter: function(feature, layer) {
                if (feature.properties.normalized_zcta_five_county_data_rent_housing_units_pct > .5){
                    return feature.properties;
                } else {
                    return false;
                }
            },

            style: function (feature) {
                var layer_color;
                if (feature.properties){
                    layer_color = '#f07a30';
                }

                return {
                    color: '#000000',
                    weight: .8,
                    opacity: .8,
                    fillOpacity: .5,
                    fillColor: layer_color
                }
            },

            onEachFeature: function(feature, layer) {

                feature.selected = false;

                var featcherContent = _.template(
                    "<tr id='zip_<%= name %>'>" +
                    "<td><%= name %></td>" +
                    "<td><%= normalized_zcta_five_county_data_county_proper %></td>" +
                    "<td><%= normalized_zcta_five_county_data_total_housing_units %></td>" +
                    "<td><%= normalized_zcta_five_county_data_own_housing_units_total %></td>" +
                    "<td><%= normalized_zcta_five_county_data_rent_housing_units_total %></td>", feature.properties);

                layer.on('click', function (e) {

                    if (feature.selected === false){
                        this.setStyle({
                            weight: 2,
                            opacity: 2,
                            fillOpacity: 2,
                        });

                        $("#appendHere").append(featcherContent);

                        feature.selected = true;

                    } else {

                        this.setStyle({
                            weight: .8,
                            opacity: .8,
                            fillOpacity: .5,
                        });

                        $("table #appendHere #zip_" + feature.properties.name).remove();

                        feature.selected = false;

                    }

                });

            }

        });

        this.render(viewConfig);

    },

    events: {
        "click a.findMe": "findMe",
        "click a.searchMe": "searchMe",
        "keyup :input": "addressSearch",
        "click button#submit": "navigate",
        "click button#reset": "resetUserView"
    },

    findMe: function(){
        $("#form-controls").addClass("hidden");
        $(".findMe").css("font-weight", "700");
        $("img.findMe").css("opacity", "1.0");
        $(".searchMe").css("font-weight", "100");
        $("img.searchMe").css("opacity", "0.3");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                $("input[id='latitudeSearch']").val(position.coords.latitude);
                $("input[id='longitudeSearch']").val(position.coords.longitude);
                $("input[id='accuracySearch']").val(position.coords.accuracy);
                $("button#submit").trigger("click");
            }, null);
        } else {
            alert("Sorry, we could not find your location.");
        }
    },

    searchMe: function(){
        $("#form-controls").removeClass("hidden");
        $(".searchMe").css("font-weight", "700");
        $("img.searchMe").css("opacity", "1.0");
        $(".findMe").css("font-weight", "100");
        $("img.findMe").css("opacity", "0.3");
        $("input[id='addressSearch']").val("");
        $("input[id='latitudeSearch']").val("");
        $("input[id='longitudeSearch']").val("");
    },

    addressSearch: function(e){
        $("input[id='addressSearch']").geocomplete({
            details: "form"
        });

        var latitude = $("input[id='latitudeSearch']").val();
        var longitude = $("input[id='longitudeSearch']").val();

        if(e.keyCode != 13) {
            return false;
        } else if (e.keyCode === 13 && latitude === '' && longitude === '') {
            return false;
        } else {
            this.navigate();
        }
    },

    navigate: function(){
        $("#reset").removeClass("hidden");
        var latitude = $("input[id='latitudeSearch']").val();
        var longitude = $("input[id='longitudeSearch']").val();
        var accuracy = $("input[id='accuracySearch']").val();
        if (latitude === '' && longitude === ''){
            alert('Please enter an address or search by location')
        } else {
            if (this.map.hasLayer(this.userLayer)){
                this.map.removeLayer(this.userLayer);
                this.addUserLayerToMap(latitude, longitude, accuracy);
            } else {
                this.addUserLayerToMap(latitude, longitude, accuracy);
            }
        }
    },

    resetUserView: function(){
        $("#reset").addClass("hidden");
        $("#form-controls").addClass("hidden");
        $(".searchMe").css("font-weight", "700");
        $("img.searchMe").css("opacity", "1.0");
        $(".findMe").css("font-weight", "700");
        $("img.findMe").css("opacity", "1.0");
        if (this.map.hasLayer(this.userLayer)){
            this.map.removeLayer(this.userLayer);
        }
        $("input[id='addressSearch']").val('');
        $("input[id='latitudeSearch']").val('');
        $("input[id='latitudeSearch']").val('');
        $("input[id='longitudeSearch']").val('');
        $("input[id='accuracySearch']").val('');

        this.map.setView(this.center, this.initialZoom);
    },

    addUserLayerToMap: function(latitude, longitude, accuracy){
        this.userLocationCenter = new L.LatLng(latitude, longitude);
        this.userLocationMarker = L.userMarker([latitude, longitude], {
            pulsing: true,
            smallIcon: true,
            accuracy: accuracy
        });
        this.userRadius = L.circle([latitude, longitude], 20, {
            clickable: false,
            opacity: 0.3,
            weight: 1,
            color: '#ec792b',
            fillColor: '#ec792b',
            fillOpacity: 0.3
        });
        this.userLayer = new L.layerGroup();
        this.userLayer.addLayer(this.userLocationMarker);
        this.userLayer.addTo(this.map);
        this.map.fitBounds(this.userRadius.getBounds());
    },

    onMapClick: function(e){

        console.log(e.latlng.lat, e.latlng.lng);

        /*
        var popup = L.popup();
        popup
            .setLatLng(e.latlng)
            .setContent("</div>You clicked the map at " + e.latlng.toString())
            .openOn(this.map);
        */

        //$("#theform").show();

        //$("input[id='pin-q-15f9abb472d4']").val(e.latlng.lat);
        //$("input[id='pin-q-7defd64f7f1f']").val(e.latlng.lng);

        //formopen = true;

        //$("#form-name").focus();

    },

    render: function(viewConfig){
        $(viewConfig.container).html(this.$el.html(this.template()));

        this.map = L.map("content-map-canvas", {
            scrollWheelZoom: false,
            zoomControl: true,
            minZoom: 6,
        	maxZoom: 16
        })
            .setView(this.center, this.initialZoom)
            .addLayer(this.stamenToner)
            .addLayer(this.geojsonLayer);
    }
});
