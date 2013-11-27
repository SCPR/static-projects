App.Router = Backbone.Router.extend({

    routes: {
        '': 'index',
        'search?location=:urlParams': 'locationDetails',
        '&legislator?:bioguide_id': 'legislatorDetails'
    },

    index: function(){
        console.log('Index route has been called.');
    },

    locationDetails: function(urlParams){
        $('.data-visuals').empty();

        console.log('locationDetails: ' + urlParams);

        urlParams = urlParams.split(',');

        var latitude = parseFloat(urlParams[0]);
        var longitude = parseFloat(urlParams[1])

        var user = new App.Models.User({
            latitude: latitude,
            longitude: longitude,
        });

        var urlPrefix = 'http://congress.api.sunlightfoundation.com/legislators/locate?';
        var testValue = 'latitude=' + latitude + '&longitude=' + longitude;
        var urlSuffix = '&apikey=b717252e9bc44d4ea57321c49e7dd5e8&callback=?';
        var targetUrl = urlPrefix + testValue + urlSuffix;
        $.getJSON(targetUrl, this.setDataToCollection);
    },

    setDataToCollection: function(data){
        this.legislatorList = new App.Collections.Legislators();
        this.legislatorList.add(data.results);
        this.legislatorsView = new App.Views.Legislators({collection: this.legislatorList});
        $('.data-visuals').append(this.legislatorsView.render().el);
    },


    legislatorDetails: function(bioguide_id){
        console.log('legislatorDetails: ' + bioguide_id);

        console.log(this.legislatorList);

        /*
        var matchingModels = legislatorsCollection.where({
            'bioguide_id' : bioguide_id
        });
        */

        this.legislator = this.legislatorList.get(bioguide_id)
        this.legislatorView = new App.Views.Details({model:this.legislator});
        $('.data-visuals').html(this.legislatorView.render().el);
    }

});