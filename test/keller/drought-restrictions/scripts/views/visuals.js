App.Views.VisualsView = Backbone.View.extend({

    tagName: "div",

    className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

    initialize: function(viewObject){
        this.template = _.template(template(viewObject.template)),
        this.render(viewObject);
    },

    events: {
        "change #municipality-list": "evaluateSelectedMunicipality",
    },

    evaluateSelectedMunicipality: function(){

        $("#results-display").empty();
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
            'category': this.selectedRestriction[0].attributes.category,
            'localwateragency': this.selectedRestriction[0].attributes.localwateragency,
            'mwdmember': this.selectedRestriction[0].attributes.mwdmember,
            'notes': this.selectedRestriction[0].attributes.notes,
            'urltoinformation': this.selectedRestriction[0].attributes.urltoinformation
        });

        this.displayRestrictionsData(this.selectedMunicipality)
    },

    displayRestrictionsData: function(selectedMunicipality){

        this.model = selectedMunicipality;

        if (this.model.category === ""){
            console.log("no restrictions listed");

            $("#results-display").html(
                "<h6 class='centered'>we don't have information for your water district</h6>"
            );

            $("#icon-display").html(_.template(template("templates/conservation-methods.html")));

        } else if (this.model.category === "voluntary restrictions"){

            $("#results-display").html(
                "<h6 class='centered'>you have been asked to reduce water consumption voluntarily by up to 20 percent</h6>"
            );

            $("#icon-display").html(_.template(template("templates/conservation-methods.html")));

        } else {

            console.log("restrictions listed but not voluntary");

        }
    },

    render: function(viewObject){
        $(viewObject.container).html(this.$el.html(this.template({
            collection: window.municipalitiesCollection.toJSON()
        })));
    }
});