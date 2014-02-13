App.Collections.Municipalities = Backbone.Collection.extend({
    model: App.Models.Municipality,
    url: "data/municipalities_by_water_district_handlebars.json",
    comparator: function(collection){
        return(collection.get('municipality'));
    }
});