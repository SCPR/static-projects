App.Models.WaterRestriction = Backbone.Model.extend({
    defaults: {
        lastupdated: null,
        localwateragency: null,
        localwateragencyurl: null,
        currentstatus: null,
        currentstatusurl: null,
        voluntaryreduction: null,
        restriction: null,
        restrictiontype: null,
        restrictioncommon: null,
        restrictiondetails: null,
        incentivesoffered: null,
        incentivesdetails: null,
        incentivesurl: null,
        mwdmember: null
    },
});