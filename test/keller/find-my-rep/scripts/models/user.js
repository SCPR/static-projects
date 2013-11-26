// describes initial user location information
App.Models.User = Backbone.Model.extend({
    defaults: {
        latitude: null,
        longitude: null,
        congressionalRep: null,
        stateSenator: null,
        stateRep: null,
    }
});