App.Router = Backbone.Router.extend({
    routes: {
        "": "index",
        "legislator/:votesmart_id": "show"
    },

    show: function(votesmart_id){
        votesmart_id = parseInt(votesmart_id);
        this.model = window.appView.legislatorCollection.where({'votesmart_id': votesmart_id});
        window.appView.detailView.setModel(this.model);
    }
});