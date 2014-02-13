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

        console.log(this.model);

        if (this.model.category === ""){

            console.log("no restrictions listed");

        } else {

            console.log("restrictions listed");

            $("#results-display").html(
                "<h6 class='centered'>you are under " + this.model.category + " to reduce water consumption by up to 20 percent</h6>"
            );


            $("#icon-display").html(
                "<h6 class='centered'>You can help by...</h6>" +
                "<div class='row'>" +
                    "<div class='col-xs-12 col-sm-6 col-md-6 col-lg-3 text-center'>" +
                        "<img class='placemark' src='images/shower.png' />" +
                        "<p>Taking shorter showers</p>" +
                    "</div>" +
                    "<div class='col-xs-12 col-sm-6 col-md-6 col-lg-3 text-center'>" +
                        "<img class='placemark' src='images/leak.png' />" +
                        "<p>Fixing leaky faucets and hoses</p>" +
                    "</div>" +
                    "<div class='col-xs-12 col-sm-6 col-md-6 col-lg-3 text-center'>" +
                        "<img class='placemark' src='images/broom.png' />" +
                        "<p>Using a broom to clean the driveway or sidewalk</p>" +
                    "</div>" +
                    "<div class='col-xs-12 col-sm-6 col-md-6 col-lg-3 text-center'>" +
                        "<img class='placemark' src='images/clock.png' />" +
                        "<p>Watering before 8 a.m. or after 8 p.m.</p>" +
                    "</div>" +
                "</div>"
            );




        }







        /*


        if (this.selectedRestriction.category === "voluntary restrictions"){
            $("#icon-display").html(
                "<h6>You can do your part by...</h6>" +
                "<div class='row'>" +
                    "<div class='col-xs-12 col-sm-6 col-md-6 col-lg-3 text-center'>" +
                        "<img class='placemark' src='images/shower.png' />" +
                        "<p>Taking shorter showers</p>" +
                    "</div>" +
                    "<div class='col-xs-12 col-sm-6 col-md-6 col-lg-3 text-center'>" +
                        "<img class='placemark' src='images/leak.png' />" +
                        "<p>Fixing leaky faucets and hoses</p>" +
                    "</div>" +
                    "<div class='col-xs-12 col-sm-6 col-md-6 col-lg-3 text-center'>" +
                        "<img class='placemark' src='images/broom.png' />" +
                        "<p>Using a broom to clean the driveway or sidewalk</p>" +
                    "</div>" +
                    "<div class='col-xs-12 col-sm-6 col-md-6 col-lg-3 text-center'>" +
                        "<img class='placemark' src='images/clock.png' />" +
                        "<p>Watering before 8 a.m. or after 8 p.m.</p>" +
                    "</div>" +
                "</div>"
            );

        } else {
            $("#icon-display").html(
                "<p>" + this.selectedRestriction.category + "</p>"
            );
        }


        */


    },

    render: function(viewObject){
        $(viewObject.container).html(this.$el.html(this.template({
            collection: window.municipalitiesCollection.toJSON()
        })));
    }
});