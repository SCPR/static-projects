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
        bioguide_id = legislatorParams[0];
        this.model = window.appView.legislatorCollection.where({'bioguide_id': bioguide_id});
        window.appView.detailView.setModel(this.model);
    },

    /*
    displayLegislatorsByState: function(legislatorParams){
        console.log(legislatorParams);
    }
    */
});