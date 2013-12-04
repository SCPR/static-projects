App.Router = Backbone.Router.extend({
    routes: {
        "": "index",
        "search/:locationParams": "searchLegislators",
        "legislators/:legiChamber/:legiStateName/:legislatorParams": "displayIndividualLegislators"
        //"legislators/:legislatorParams": "displayLegislatorsByState"
    },

    searchLegislators: function(locationParams){
        window.appView.queryApiData(locationParams);
    },

    displayIndividualLegislators: function(legiChamber, legiStateName, legislatorParams){
        legislatorParams = legislatorParams.split('-');
        console.log(legislatorParams);
        votesmart_id = parseInt(legislatorParams[0]);
        this.model = window.appView.legislatorCollection.where({'votesmart_id': votesmart_id});
        window.appView.detailView.setModel(this.model);
    },

    /*
    displayLegislatorsByState: function(legislatorParams){
        console.log(legislatorParams);
    }
    */
});