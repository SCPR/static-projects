App.Views.VisualsView = Backbone.View.extend({

    tagName: "div",

    className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

    initialize: function(viewObject){
        this.dataTemplate = _.template(template(viewObject.template)),
        this.conservationTemplate = _.template(template("templates/conservation-methods.html")),
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

        //console.log(this.model);

        window.conservationCollection.models = window.conservationCollection.shuffle();

        if (this.model.category === ""){
            if (this.model.municipality === this.model.localwateragency){
                $("#results-display").html(
                    "<h6 class='centered'>We couldn't find updated information from <a href='" +
                    this.model.urltoinformation + "' target='_blank'>" +
                    this.model.localwateragency + "</a></h6>"
                );
            } else {
                $("#results-display").html(
                    "<h6 class='centered'>We couldn't find updated information from the <a href='" +
                    this.model.urltoinformation + "' target='_blank'>" +
                    this.model.localwateragency + "</a></h6>"
                );
            }

            $("#icon-display").html(this.conservationTemplate({
                collection: window.conservationCollection.toJSON()
            })).css("margin", "25px 0 10px 0");

            $(".icons").css("margin", "25px 0 10px 0");

        } else if (this.model.category === "voluntary restrictions"){
            if (this.model.municipality === this.model.localwateragency){
                $("#results-display").html(
                    "<h6 class='centered'><a href='" + this.model.urltoinformation + "' target='_blank'>" + this.model.localwateragency + "</a> has asked for voluntary reductions of water use by up to 20 percent</h6>"
                );
            } else {
                $("#results-display").html(
                    "<h6 class='centered'>The <a href='" + this.model.urltoinformation + "' target='_blank'>" + this.model.localwateragency + "</a> has asked for voluntary reductions of water use by up to 20 percent</h6>"
                );
            }

            $("#icon-display").html(this.conservationTemplate({
                collection: window.conservationCollection.toJSON()
            })).css("margin", "25px 0 10px 0");

            $(".icons").css("margin", "25px 0 10px 0");

        } else {

            console.log("restrictions listed but not voluntary");

        }
    },

    render: function(viewObject){
        $(viewObject.container).html(this.$el.html(this.dataTemplate({
            collection: window.municipalitiesCollection.toJSON()
        })));
    }
});