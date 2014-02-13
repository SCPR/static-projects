App.Collections.WaterRestrictions = Backbone.Collection.extend({
    model: App.Models.WaterRestriction,
    url: "data/restrictions_by_district_handlebars.json",
    comparator: function(collection){
        return(collection.get('waterdistrict'));
    }
});