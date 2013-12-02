App.Views.AppView = Backbone.View.extend({

    initialize: function(){
        this.detailView = new App.Views.DetailView();
        $('#detail').append(this.detailView.el);
        this.legislatorCollection = new App.Collections.Legislators();
        this.legislatorListView = new App.Views.Legislators({
            collection: this.legislatorCollection
        });
        $('#app').append(this.legislatorListView.el);
        this.resetCollections();
    },

    events: {
        'keyup :input': 'addressSearch',
        'click button#submit': 'navigate',
        'click a.findMe': 'findMe',
    },

    addressSearch: function(){
        $('input[id="addressSearch"]').geocomplete({
            details: 'form'
        });
    },

    findMe: function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                $("input[id='latitudeSearch']").attr('value', position.coords.latitude);
                $("input[id='longitudeSearch']").attr('value', position.coords.longitude);
                $('button#submit').trigger('click');
            }, null);
        } else {
            alert('Sorry, we could not find your location.');
        }
    },

    navigate: function(locationParams){
        var latitude = $("input[id='latitudeSearch']").val();
        var longitude = $("input[id='longitudeSearch']").val();
        var locationParams = latitude + ',' + longitude;
        window.app.navigate('#search/' + locationParams, {
            trigger: true,
            replace: false,
        });
    },

    queryApiData: function(locationParams){
        //$('.progress').removeClass('hidden');
        $('#app').empty();
        locationParams = locationParams.split(',');
        var latitude = parseFloat(locationParams[0]);
        var longitude = parseFloat(locationParams[1]);
        var urlPrefix = 'http://congress.api.sunlightfoundation.com/legislators/locate?';
        var testValue = 'latitude=' + latitude + '&longitude=' + longitude;
        var urlSuffix = '&apikey=b717252e9bc44d4ea57321c49e7dd5e8&callback=?';
        var targetUrl = urlPrefix + testValue + urlSuffix;
        console.log(targetUrl);
        $.getJSON(targetUrl, this.fetchYourRepresentatives);
    },

    fetchYourRepresentatives: function(data){
        this.searchedDetailView = new App.Views.DetailView();
        $('#detail').append(this.searchedDetailView.el);
        this.searchedCollection = new App.Collections.Legislators();
        for(var i=0; i<data.results.length; i++){
            var testModel = window.appView.legislatorCollection.where({'votesmart_id': data.results[i].votesmart_id});
            this.searchedCollection.add(testModel);
        }
        console.log(this.searchedCollection);
        this.testLegislatorListView = new App.Views.Legislators({
            collection: this.searchedCollection
        });
        $('#app').append(this.testLegislatorListView.el);
        this.searchedCollection.reset(data.results);
    },

    resetCollections: function(){
        this.legislatorCollection.reset(items);
    }
});