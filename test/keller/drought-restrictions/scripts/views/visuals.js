App.Views.VisualsView = Backbone.View.extend({

    tagName: "div",

    className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

    initialize: function(viewObject){
        this.dataTemplate = _.template(template(viewObject.template)),
        this.detailsTemplate = _.template(template("templates/municipal-results.html"));
        this.conservationTemplate = _.template(template("templates/conservation-methods.html")),
        this.render(viewObject);
    },

    events: {
        "change #municipality-list": "evaluateSelectedMunicipality",
    },

    evaluateSelectedMunicipality: function(){
        $("#icon-display").empty();

        this.selectedMunicipality = window.municipalitiesCollection.where({
            municipality: $("#municipality-list").val()
        });

        this.alignSelectedModels(this.selectedMunicipality);
    },

    alignSelectedModels: function(selectedMunicipality){
        this.selectedMunicipality = selectedMunicipality[0].attributes;
        if (this.selectedMunicipality.localwateragency === ""){
            this.selectedRestriction = window.restrictionsCollection.where({
                localwateragency: this.selectedMunicipality.municipality
            });
        } else {
            this.selectedRestriction = window.restrictionsCollection.where({
                localwateragency: this.selectedMunicipality.localwateragency
            });
        }

        selectedMunicipality[0].set({
            'currentstatus': this.selectedRestriction[0].attributes.currentstatus,
            'currentstatusurl': this.selectedRestriction[0].attributes.currentstatusurl,
            'incentivesdetails': this.selectedRestriction[0].attributes.incentivesdetails,
            'incentivesoffered': this.selectedRestriction[0].attributes.incentivesoffered,
            'incentivesurl': this.selectedRestriction[0].attributes.incentivesurl,
            'lastupdated': this.selectedRestriction[0].attributes.lastupdated,
            'localwateragency': this.selectedRestriction[0].attributes.localwateragency,
            'localwateragencyurl': this.selectedRestriction[0].attributes.localwateragencyurl,
            'mwdmember': this.selectedRestriction[0].attributes.mwdmember,
            'restriction': this.selectedRestriction[0].attributes.restriction,
            'restrictioncommon': this.selectedRestriction[0].attributes.restrictioncommon,
            'restrictiondetails': this.selectedRestriction[0].attributes.restrictiondetails,
            'restrictiontype': this.selectedRestriction[0].attributes.restrictiontype,
            'voluntaryreduction': this.selectedRestriction[0].attributes.voluntaryreduction
        });

        console.log(this.selectedMunicipality);

        this.displayConservationTips();

        this.displayRestrictionsData(this.selectedMunicipality)
    },

    displayRestrictionsData: function(selectedMunicipality){
        this.model = selectedMunicipality;
        window.conservationCollection.models = window.conservationCollection.shuffle();

        if (this.model.currentstatus === "NULL"){
            $("#details-display").html(this.detailsTemplate({
                model: this.model,
                message: "We couldn't find updated information for"
            }));

        } else if (this.model.currentstatus === "conservation goals"){
            $("#details-display").html(this.detailsTemplate({
                model: this.model,
                message: "has asked for a voluntary reduction of water use"
            }));

        } else if (this.model.currentstatus === "restrictions"){
            $("#details-display").html(this.detailsTemplate({
                model: this.model,
                message: "has the following restrictions"
            }));

        } else if (this.model.currentstatus === "both"){
            $("#details-display").html(this.detailsTemplate({
                model: this.model,
                message: "both non-voluntary restrictions and voluntary restrictions listed"
            }));

        } else {
            console.log("outlier" + this.model);
        }

    },

    displayConservationTips: function(){
        $("#icon-display").html(this.conservationTemplate({
            collection: window.conservationCollection.toJSON()
        })).css("margin", "25px 0 10px 0");

        $(".icons").css("margin", "25px 0 10px 0");
    },

    render: function(viewObject){
        $(viewObject.container).html(this.$el.html(this.dataTemplate({
            collection: window.municipalitiesCollection.toJSON()
        })));
    }
});