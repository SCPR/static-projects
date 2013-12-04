App.Router = Backbone.Router.extend({
    routes: {
        "": "index",
        "search/:locationParams": "searchLegislators",
        "legislators/:legislatorParams": "displayIndividualLegislators"
        //"legislators/:legislatorParams": "displayLegislatorsByState"
    },

    searchLegislators: function(locationParams){
        window.appView.queryApiData(locationParams);
    },

    displayIndividualLegislators: function(legislatorParams){
        legislatorParams = legislatorParams.split('-');
        votesmart_id = parseInt(legislatorParams[4]);
        this.model = window.appView.legislatorCollection.where({'votesmart_id': votesmart_id});
        window.appView.detailView.setModel(this.model);
    },

    /*
    displayLegislatorsByState: function(legislatorParams){
        console.log(legislatorParams);
    }
    */
});