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
            $("#results-display").html(
                "<h6>" + this.selectedMunicipality.municipality + " is under some kind of water restriction and you will find out below</h6>"
            );

            $("#details-display").html(
                "<p>The water agency for " + this.selectedMunicipality.municipality + " which purchases water from " + this.selectedMunicipality.wholesaler + "</p>."
            );

        } else {
            this.selectedRestriction = window.restrictionsCollection.where({
                localwateragency: this.selectedMunicipality.localwateragency
            });
            $("#results-display").html(
                "<h6>" + this.selectedMunicipality.municipality + " is under " + this.selectedRestriction[0].attributes.category + "</h6>"
            );

            $("#details-display").html(
                "<p>The water agency for " + this.selectedMunicipality.localwateragency + " which purchases water from " + this.selectedMunicipality.wholesaler + "</p>."
            );
        }

        this.displayRestrictions(this.selectedRestriction[0].attributes)
    },

    displayRestrictions: function(selectedRestriction){

        this.selectedRestriction = selectedRestriction;

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
    },

    render: function(viewObject){
        $(viewObject.container).html(this.$el.html(this.template({
            collection: window.municipalitiesCollection.toJSON()
        })));
    }
});