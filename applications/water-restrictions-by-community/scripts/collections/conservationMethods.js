App.Collections.ConservationMethods = Backbone.Collection.extend({
    model: App.Models.ConservationMethod,
    url: "data/conservation_methods.json"
});