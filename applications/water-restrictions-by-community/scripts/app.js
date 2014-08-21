    App.Models.Municipality = Backbone.Model.extend({
        defaults: {
            municipality: null,
            localwateragency: null,
            wholesaler: null,
        }
    });

    App.Collections.Municipalities = Backbone.Collection.extend({
        model: App.Models.Municipality,
        url: "data/municipalities_by_water_district.json",
        comparator: function(model) {
            return model.get("municipality");
        }
    });

    App.Models.WaterIncentive = Backbone.Model.extend({
        defaults: {
            incentivesdetails: null,
            incentiveslastupdated: null,
            incentivesoffered: null,
            incentivesurl: null,
            localwateragency: null,
            localwateragencyurl: null,
            mwdmember: null,
            turfrebatefigure: null,
            turfremovaldetails: null,
            turfremovaloffered: null,
            turfremovalurl: null,
        },
    });

    App.Collections.WaterIncentives = Backbone.Collection.extend({
        model: App.Models.WaterIncentive,
        url: "data/incentives_by_district.json",
        comparator: function(collection){
            return(collection.get("waterdistrict"));
        }
    });

    App.Models.WaterRestriction = Backbone.Model.extend({
        defaults: {
            currentstatus: null,
            currentstatusurl: null,
            fineforviolation: null,
            howenforcerestrictions: null,
            localwateragency: null,
            localwateragencyurl: null,
            mwdmember: null,
            previousstatus: null,
            restriction: null,
            restrictioncommon: null,
            restrictiondetails: null,
            restrictionslastupdated: null,
            restrictiontype: null
        },
    });

    App.Collections.WaterRestrictions = Backbone.Collection.extend({
        model: App.Models.WaterRestriction,
        url: "data/restrictions_by_district.json",
        comparator: function(collection){
            return(collection.get("waterdistrict"));
        }
    });

    App.Models.ConservationMethod = Backbone.Model.extend({
        defaults: {
            text: null,
            image_path: null,
        },
    });

    App.Collections.ConservationMethods = Backbone.Collection.extend({
        model: App.Models.ConservationMethod,
        url: "data/conservation_methods.json"
    });

    App.Router = Backbone.Router.extend({
        initialize: function(){

            window.municipalitiesCollection = new App.Collections.Municipalities();
            window.municipalitiesCollection.fetch({
                async: false,
            });

            window.restrictionsCollection = new App.Collections.WaterRestrictions();
            window.restrictionsCollection.fetch({
                async: false,
            });

            window.incentivesCollection = new App.Collections.WaterIncentives();
            window.incentivesCollection.fetch({
                async: false,
            });

            window.conservationCollection = new App.Collections.ConservationMethods();
            window.conservationCollection.fetch({
                async: false,
            });

            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "indexView",
            "municipality/:municipality/": "renderApplicationData",
        },

        indexView: function(){
            this.renderApplicationVisuals(".data-visuals");
        },

        renderApplicationVisuals: function(container){
            //if (this.applicationVisuals){
                //this.applicationVisuals.remove();
            //};
            this.applicationVisuals = new App.Views.ApplicationVisuals({
                container: container
            });
            return this.applicationVisuals;
        },

        renderApplicationData: function(municipality){
            this.renderApplicationVisuals(".data-visuals");
            var selectValue = municipality.replace(/-/g, ' ').toProperCase();
            $("#municipality-list").val(selectValue);
            if (this.applicationData){
                this.applicationData.remove();
            };
            this.applicationData = new App.Views.ApplicationData({
                container: "#details-display",
                municipality: selectValue
            });
            return this.applicationData;
        },
    });

    /* we're good here */
    App.Views.ApplicationVisuals = Backbone.View.extend({
        tagName: "div",
        className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",
        template: _.template(template("templates/municipal-select.html")),
        el: ".data-visuals",
        initialize: function(viewObject){
            this.render(viewObject);
        },
        events: {
            "change #municipality-list": "evaluateSelectedMunicipality",
        },
        evaluateSelectedMunicipality: function(e){
            e.preventDefault();
            var municipality = $("#municipality-list").val().toLowerCase().replace(/ /g, '-').replace(/,/g, '');
            window.app.navigate("#municipality/" + municipality + "/", {
                trigger: true,
                replace: false,
            });
        },
        render: function(viewObject){
            $(viewObject.container).html(this.template({
                collection: window.municipalitiesCollection.toJSON()
            }));
        }
    });

    App.Views.ApplicationData = Backbone.View.extend({

        tagName: "div",

        className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

        template: _.template(template("templates/municipal-results.html")),

        el: "#details-display",

        initialize: function(viewObject){
            this.render(viewObject);
        },

        render: function(viewObject){

            this.selectedMunicipality = window.municipalitiesCollection.where({
                municipality: viewObject.municipality
            });

            var model = this.selectedMunicipality[0].attributes;

            if (model.localwateragency === ""){
                this.selectedRestriction = window.restrictionsCollection.where({
                    localwateragency: model.municipality
                });

                this.selectedIncentive = window.incentivesCollection.where({
                    localwateragency: model.municipality
                });

            } else {
                this.selectedRestriction = window.restrictionsCollection.where({
                    localwateragency: model.localwateragency
                });

                this.selectedIncentive = window.incentivesCollection.where({
                    localwateragency: model.localwateragency
                });

            }

            var formattedRestrictionDetails = this.selectedRestriction[0].attributes.restrictiondetails.replace(/[\n\r]/g, "<br />");

            this.selectedMunicipality[0].set({
                "incentivesdetails": this.selectedIncentive[0].attributes.incentivesdetails,
                "incentivesoffered": this.selectedIncentive[0].attributes.incentivesoffered,
                "incentivesurl": this.selectedIncentive[0].attributes.incentivesurl,
                "incentiveslastupdated": moment(this.selectedIncentive[0].attributes.incentiveslastupdated).format("MMM. D, YYYY"),
                "turfrebatefigure": this.selectedIncentive[0].attributes.turfrebatefigure,
                "turfremovaldetails": this.selectedIncentive[0].attributes.turfremovaldetails,
                "turfremovaloffered": this.selectedIncentive[0].attributes.turfremovaloffered,
                "turfremovalurl": this.selectedIncentive[0].attributes.turfremovalurl,
                "currentstatus": this.selectedRestriction[0].attributes.currentstatus,
                "currentstatusurl": this.selectedRestriction[0].attributes.currentstatusurl,
                "fineforviolation": this.selectedRestriction[0].attributes.fineforviolation,
                "howenforcerestrictions": this.selectedRestriction[0].attributes.howenforcerestrictions,
                "localwateragency": this.selectedRestriction[0].attributes.localwateragency,
                "localwateragencyurl": this.selectedRestriction[0].attributes.localwateragencyurl,
                "mwdmember": this.selectedRestriction[0].attributes.mwdmember,
                "previousstatus": this.selectedRestriction[0].attributes.previousstatus,
                "restriction": this.selectedRestriction[0].attributes.restriction,
                "restrictioncommon": this.selectedRestriction[0].attributes.restrictioncommon,
                "restrictiondetails": formattedRestrictionDetails,
                "restrictionlastupdated": moment(this.selectedRestriction[0].attributes.lastupdated).format("MMM. D, YYYY"),
                "restrictiontype": this.selectedRestriction[0].attributes.restrictiontype
            });

            var displayData = this.selectedMunicipality[0].attributes;

            window.conservationCollection.models = window.conservationCollection.shuffle();

            if (displayData.currentstatus === "NULL"){
                var message = "We couldn't find updated information for";
            } else if (displayData.currentstatus === "state-mandated"){
                var message = "previously had conservation goals in place and now should be following state-wide water restrictions that took effect July 29, 2014.";
            } else if (displayData.currentstatus === "restrictions"){
                var message = "had restrictions in place prior to state-wide action that took effect July 29, 2014.";
            } else {
                console.log("outlier");
                var message = "We couldn't find updated information for";
            }

            $("#details-display").html(this.template({
                model: displayData,
                message: message
            }));

            this.conservationTemplate = _.template(template("templates/conservation-methods.html"));

            $("#icon-display").empty();

            $("#icon-display").html(this.conservationTemplate({
                collection: window.conservationCollection.toJSON()
            })).css("margin", "0 0 10px 0");

            $(".icons").css("margin", "25px 0 10px 0");

        }

    });