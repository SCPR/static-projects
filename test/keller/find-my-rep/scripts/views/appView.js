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
        'click button#submit': 'submitData',
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

    submitData: function(){
        //$('.progress').removeClass('hidden');
        $('#app').empty();
        var latitude = $("input[id='latitudeSearch']").val();
        var longitude = $("input[id='longitudeSearch']").val();
        var locationParams = latitude + ',' + longitude;
        var urlPrefix = 'http://congress.api.sunlightfoundation.com/legislators/locate?';
        var testValue = 'latitude=' + latitude + '&longitude=' + longitude;
        var urlSuffix = '&apikey=b717252e9bc44d4ea57321c49e7dd5e8&callback=?';
        var targetUrl = urlPrefix + testValue + urlSuffix;
        console.log(targetUrl);
        $.getJSON(targetUrl, this.fetchCollections);
    },

    fetchCollections: function(data){
        this.testDetailView = new App.Views.DetailView();
        $('#detail').append(this.testDetailView.el);
        this.testCollection = new App.Collections.Legislators();
        this.testLegislatorListView = new App.Views.Legislators({
            collection: this.testCollection
        });
        $('#app').append(this.testLegislatorListView.el);
        this.testCollection.reset(data.results);
    },

    resetCollections: function(){
        this.legislatorCollection.reset(items);
    }
});