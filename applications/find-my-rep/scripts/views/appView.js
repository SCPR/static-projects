App.Views.AppView = Backbone.View.extend({

    initialize: function(){
        this.detailView = new App.Views.DetailView();
        $(".data-visuals").append(this.detailView.el);
        this.legislatorCollection = new App.Collections.Legislators();
        this.legislatorListView = new App.Views.Legislators({
            collection: this.legislatorCollection
        });
        //$("#legislator-list").append(this.legislatorListView.el);
        this.resetCollections();
    },

    events: {
        "keyup :input": "addressSearch",
        "click button#submit": "navigate",
        "click a.findMe": "findMe",
        "click a.searchMe": "searchMe"
    },

    addressSearch: function(e){
        $("input[id='addressSearch']").focus(function(){
            $("#representative-profile").empty();
        });

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

    findMe: function(){
        $("#form-controls").addClass("hidden");
        $(".findMe").css("font-weight", "700");
        $("img.findMe").css("opacity", "1.0");
        $(".searchMe").css("font-weight", "100");
        $("img.searchMe").css("opacity", "0.3");
        $("#representative-profile").empty();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                $("input[id='latitudeSearch']").val(position.coords.latitude);
                $("input[id='longitudeSearch']").val(position.coords.longitude);
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
        $("#representative-profile").empty();
        $("input[id='addressSearch']").val("");
        $("input[id='latitudeSearch']").val("");
        $("input[id='longitudeSearch']").val("");
    },

    navigate: function(locationParams){
        var latitude = $("input[id='latitudeSearch']").val();
        var longitude = $("input[id='longitudeSearch']").val();
        var locationParams = latitude + "," + longitude;
        window.app.navigate("#search/" + locationParams, {
            trigger: true,
            replace: false
        });
    },

    queryApiData: function(locationParams){
        $(".progress-list").removeClass("hidden");
        $("#legislator-list").empty();
        locationParams = locationParams.split(",");
        var latitude = parseFloat(locationParams[0]);
        var longitude = parseFloat(locationParams[1]);
        var urlPrefix = "http://congress.api.sunlightfoundation.com/legislators/locate?";
        var testValue = "latitude=" + latitude + "&longitude=" + longitude;
        var urlSuffix = "&apikey=1ca05f19ff1e4e6a87b32bdff29fee95&callback=?";
        var targetUrl = urlPrefix + testValue + urlSuffix;
        $.getJSON(targetUrl, this.fetchYourRepresentatives);
    },

    fetchYourRepresentatives: function(data){
        this.searchedDetailView = new App.Views.DetailView();
        $(".data-visuals").append(this.searchedDetailView.el);
        this.searchedCollection = new App.Collections.Legislators();
        for(var i=0; i<data.results.length; i++){
            var testModel = window.appView.legislatorCollection.where({"votesmart_id": data.results[i].votesmart_id});
            this.searchedCollection.add(testModel);
        };
        this.searchedLegislatorListView = new App.Views.Legislators({
            collection: this.searchedCollection
        });

        $("#legislator-list").append(this.searchedLegislatorListView.el);
        this.searchedCollection.reset(data.results);
    },

    resetCollections: function(){
        this.legislatorCollection.reset(items);
    }
});