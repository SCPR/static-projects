App.Router = Backbone.Router.extend({
    routes: {
        "": "index",
        "search/:locationParams": "searchLegislators",
        "legislator/:legiParams": "displayLegislator"
    },

    searchLegislators: function(locationParams){
        window.appView.queryApiData(locationParams);
    },

    displayLegislator: function(legiParams){
        legiParams = legiParams.split('-');
        votesmart_id = parseInt(legiParams[2]);
        this.model = window.appView.legislatorCollection.where({'votesmart_id': votesmart_id});
        window.appView.detailView.setModel(this.model);
    }
});