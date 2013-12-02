App.Router = Backbone.Router.extend({
    routes: {
        "": "index",
        "search/:locationParams": "search",
        "legislator/:votesmart_id": "show"
    },

    search: function(locationParams){
        window.appView.queryApiData(locationParams);
    },

    show: function(votesmart_id){
        votesmart_id = parseInt(votesmart_id);
        this.model = window.appView.legislatorCollection.where({'votesmart_id': votesmart_id});
        window.appView.detailView.setModel(this.model);
    }
});