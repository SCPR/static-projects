App.Views.ProcessData = Backbone.View.extend({
    initialize: function(){
        this.render();
    },

    constructApiQuery: function(){
        var latitude = this.model.attributes.latitude;
        var longitude = this.model.attributes.longitude;
        var urlPrefix = 'http://congress.api.sunlightfoundation.com/legislators/locate?';
        var testValue = 'latitude=' + latitude + '&longitude=' + longitude;
        var urlSuffix = '&apikey=b717252e9bc44d4ea57321c49e7dd5e8&callback=?';
        var targetUrl = urlPrefix + testValue + urlSuffix;
        $.getJSON(targetUrl, this.setDataToCollection);
    },

    setDataToCollection: function(data){

        // initialize new collection
        var legislatorsCollection = new App.Collections.Legislators();

        // add array of instagram images
        legislatorsCollection.add(data.results);

        // set the collection to a view
        var legislatorsView = new App.Views.Legislators({collection: legislatorsCollection});

        // add the view to the page
        $('.data-visuals').append(legislatorsView.render().el);
    },

    render: function(){
        console.log('render');
    }
});