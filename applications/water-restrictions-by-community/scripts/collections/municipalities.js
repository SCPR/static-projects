App.Collections.Municipalities = Backbone.Collection.extend({
    model: App.Models.Municipality,
    url: "data/municipalities_by_water_district.json",
    comparator: function(model) {
        return model.get('municipality');
    }
});