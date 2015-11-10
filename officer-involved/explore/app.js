
(function(){

    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {}
    };

    _.templateSettings = {
        interpolate: /\<\@\=(.+?)\@\>/gim,
        evaluate: /\<\@(.+?)\@\>/gim
    };

    window.template = function(id){
        return _.template( $('#' + id).html());
    };

    // helper functions
    window.percentify = function(value){
        var value = value * 100
        return parseFloat(value.toFixed(2));
    };

    window.create_groups = function(object, key){
        var output = object.groupBy(function(model){
            return model.get(key);
        });
        return output;
    };

    window.parse_year = function(date_time){
        var output = moment(date_time).locale("en").format("YYYY");
        output = parseInt(output);
        return output
    };

    String.prototype.toProperCase = function(){
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

    App.Models.Incident = Backbone.Model.extend({
        defaults: {
            url: null,
            district_attorney_file_number: null,
            district_attorney_county: null,
            district_attorney_prepared_report: null,
            general_location_of_incident: null,
            type_of_incident: null,
            officer_shots_fired: null,
            da_on_scene: null,
            da_investigator_on_scene: null,
            officer_name_and_badge_number: null,
            officer_police_agency: null,
            officer_special_unit: null,
            officer_charges_filed_yes_detail: null,
            date_of_incident: null,
            district_attorney_date_of_letter: null,
            multiple_officers: null,
            car_stop: null,
            fatal: null,
            case_relevant: null,
            officer_charges_filed: null,
            officer_self_defense: null,
            officer_defense_of_civillians: null,
            officer_defense_of_officers: null,
            civilian_witnesses: null,
            officer_injured: null,
            type_of_incident_number: null,
            led_to_response_category: null,
            peoples: [],
        },
    });

    App.Collections.Incidents = Backbone.Collection.extend({
        model: App.Models.Incident,
        comparator: function(model) {
            return model.get("district_attorney_file_number");
        },
        url: "data.json"
    });

    App.Models.People = Backbone.Model.extend({
        defaults: {
            district_attorney_file_number: null,
            person_name: null,
        },
    });

    App.Collections.Peoples = Backbone.Collection.extend({
        model: App.Models.People,
        comparator: function(model) {
            return model.get("district_attorney_file_number");
        },
    });

    App.Router = Backbone.Router.extend({

        routes: {
            "": "fetchData",
        },

        fetchData: function(){
            var _this = this;
            var incidents = new App.Collections.Incidents();
            incidents.fetch({
                async: true
            });
            var checkExist = setInterval(function() {
                if (incidents.length > 0){
                    clearInterval(checkExist);
                    _this.renderApplicationVisuals(incidents);
                }
            }, 500);
        },

        renderApplicationVisuals: function(incidents){
            if (this.applicationVisuals){
                this.applicationVisuals.remove();
            };
            var array_of_people = [];
            incidents.forEach(function(model, index){
                var _this = model.attributes;
                _this.peoples.forEach(function(item, index){
                    array_of_people.push(item);
                });
            });
            var peoples = new App.Collections.Peoples(array_of_people);
            this.applicationVisuals = new App.Views.ApplicationVisuals({
                total_incidents: incidents,
                total_peoples: peoples,
                container: ".data-display"
            });
            return this.applicationVisuals;
        },
    });

    App.Views.ApplicationVisuals = Backbone.View.extend({

        el: ".data-display",

        initialize: function(object){

            this.view_object = object;

            this.view_object.template = template("my_template");

            this.view_object.relevant_incidents = new App.Collections.Incidents(
                this.view_object.total_incidents.where({
                    case_relevant: true
                })
            );

            this.view_object.relevant_people = new App.Collections.Peoples(
               this.view_object.total_peoples.where({
                   case_relevant: true
               })
            );

            this.view_object = this.calculate_model_attributes(this.view_object);

            this.view_object.filters = [{
                type: "incidents",
                proper: "Incident",
                radio_buttons: [],
                checkboxes: [
                    {opt: "Officer Defense Of Civillians", opt_field: "officer_defense_of_civillians"},
                    {opt: "Car Stop", opt_field: "car_stop"},
                ]}, {
                type: "peoples",
                proper: "Person",
                radio_buttons: [
                    {
                        field_name: "fatal_non",
                        group_name: "Outcome",
                        buttons: [
                            {opt: "Fatal", opt_field: "fatal"},
                            {opt: "Non-fatal", opt_field: "nonfatal_calc"},
                        ]}, {
                        field_name: "armed_non",
                        group_name: "Weapon",
                        buttons: [
                            {opt: "Unarmed", opt_field: "person_unarmed"},
                            {opt: "Firearm", opt_field: "armed_with_firearm_calc"},
                            {opt: "Other Weapon", opt_field: "armed_with_other_calc"},
                        ]}, {
                        field_name: "gender",
                        group_name: "Gender",
                        buttons: [
                            {opt: "Female", opt_field: "person_female"},
                            {opt: "Male", opt_field: "person_male"},
                        ]
                    }
                ],
                checkboxes: [
                    {opt: "Officer Said Person Reached for Waistband", opt_field: "mention_of_waistband_in_report"},
                    {opt: "Officer Couldn't See Person's Hands", opt_field: "officer_couldnt_see_persons_hands"},
                    {opt: "Officer Said Person Grabbed For Service Firearm", opt_field: "grabbed_officers_weapon"},
                    {opt: "Officer Said Vehicle Used as Weapon", opt_field: "vehicle_as_weapon"},
                    {opt: "Chase or Pursuit Occurred", opt_field: "pursuit_occurred"},
                    {opt: "Signs of Drug/Alcohol Impairment", opt_field: "person_intoxicated"},
                    {opt: "Signs of Mental Illness", opt_field: "person_mentally_ill"},
                ]}
            ];
            this.render();
        },

        calculate_model_attributes: function(view_object){
            view_object.genders = [];
            view_object.ethnicities = [];
            view_object.relevant_people.forEach(function(model, index){
                var _this = model.attributes;
                model.set("year_of_incident", parse_year(_this.date_of_incident));
                // push gender to view object
                if (_this.person_gender != null || _this.person_gender != undefined){
                    if (_this.person_gender === "MALE"){
                        model.set("person_gender", "male");
                        model.set("person_male", true);
                        view_object.genders.push(_this.person_gender);
                    } else if (_this.person_gender === "FEMALE"){
                        model.set("person_gender", "female");
                        model.set("person_female", true);
                        view_object.genders.push(_this.person_gender);
                    } else {
                        model.set("person_gender", null);
                        model.set("person_male", false);
                        model.set("person_female", false);
                    };
                };
                // push ethnicities to view object
                if (_this.person_ethnicity != null || _this.person_ethnicity != undefined){
                    if (_this.person_ethnicity === "HISPANIC/LATIN AMERICAN"){
                        model.set("person_ethnicity", "hispanic");
                    } else if (_this.person_ethnicity === "MIDDLE EASTERN"){
                        model.set("person_ethnicity", "middle-eastern");
                    } else {
                        model.set("person_ethnicity", _this.person_ethnicity.toLowerCase());
                    };
                    view_object.ethnicities.push(_this.person_ethnicity);
                };
            });
            view_object.relevant_incidents.forEach(function(model, index){
                var _this = model.attributes;
                model.set("year_of_incident", parse_year(_this.date_of_incident));

                // var type_of_incident_position = _this.type_of_incident.indexOf("Shooting");
                // if (type_of_incident_position === 0){
                //     model.set("lethal_force_as_first_calc", true);
                //     model.set("other_force_as_first_calc", false);
                // } else {
                //     model.set("lethal_force_as_first_calc", false);
                //     model.set("other_force_as_first_calc", true);
                // };

            });
            view_object.people_years = _.uniq(view_object.relevant_people.pluck("year_of_incident")).sort();
            view_object.genders = _.uniq(view_object.genders).sort();
            view_object.ethnicities = _.uniq(view_object.ethnicities).sort();
            return view_object;
        },

        events: {
            "click [type='radio']": "construct_filtered_data",
            "click [type='checkbox']": "construct_filtered_data",
            "click #clear-filters": "clear_checkbox_filters",
        },

        render: function(){
            $(this.view_object.container).html(this.view_object.template(this.view_object));
            this.view_object.obj = {};
            this.view_object.obj.filtered = {};
            this.view_object.obj.init = {};
            this.view_object.obj.init.people = this.view_object.relevant_people;
            this.view_object.obj.init.yearly = create_groups(this.view_object.obj.init.people, "year_of_incident");
            this.view_object.obj.total = this.view_object.obj.init.people.length;
            this.display_data(this.view_object.obj, true);
        },

        display_data: function(obj, initial){
            $("td#relevant-people").html(this.view_object.obj.total);
            if (initial === true){
                this.chart_data(obj.init, this.view_object.obj.total);
            } else {
                this.chart_data(obj.filtered, this.view_object.obj.total);
            };
        },

        chart_data: function(obj, total){

            // display the overall figures
            var people_empty = _.isEmpty(obj.people.models);
            if (people_empty === false){
                $("td#filtered-people").html(obj.people.length + " / " + total + "<br />" + percentify(obj.people.length / total) + "%");
            } else {
                $("td#filtered-people").html("n/a" + "<br />" + "0.00%");
            };

            // display the year by year figures
            var yearly_empty = _.isEmpty(obj.yearly);
            if (yearly_empty === false){
                this.view_object.people_years.forEach(function(item, index, list){
                    var has_year_data = _.has(obj.yearly, item);
                    if (has_year_data === false){
                        obj.yearly[item] = [];
                    };
                });
                _.keys(obj.yearly).forEach(function(value){
                    var data = obj.yearly[value];
                    if (data.length > 0){
                        $("td#people_" + value).html(data.length + " / " + obj.people.length + "<br />" + percentify(data.length / obj.people.length) + "%");
                    } else {
                        $("td#people_" + value).html("n/a" + "<br />" + "0.00%");
                    };

                    // draw the initial charts
                    $("div#people_" + value).html(data.length);
                    var height = "height: " + percentify(data.length / 100) + "%"
                    $("li#people_" + value).attr("style", height);

                });
            } else {
                this.view_object.people_years.forEach(function(item, index, list){
                    var has_year_data = _.has(obj.yearly, item);
                    if (has_year_data === false){
                        obj.yearly[item] = [];
                    };
                });
                _.keys(obj.yearly).forEach(function(value){
                    var data = obj.yearly[value];
                    if (data.length > 0){
                        $("td#people_" + value).html(data.length + " / " + obj.people.length + "<br />" + percentify(data.length / obj.people.length) + "%");
                    } else {
                        $("td#people_" + value).html("n/a" + "<br />" + "0.00%");
                    };

                    // draw the filtered charts
                    $("div#people_" + value).html(data.length);
                    var height = "height: " + percentify(data.length / 100) + "%"
                    $("li#people_" + value).attr("style", height);

                });
            };
        },

        construct_filtered_data: function(){
            this.view_object.obj.active_checkboxes = this.get_selected_filters();
            var incident_filters = {};
            _.each(this.view_object.obj.active_checkboxes.incidents, function(item, index, list){
                return incident_filters[item] = true;
            });
            var people_filters = {};
            _.each(this.view_object.obj.active_checkboxes.peoples, function(item, index, list){
                return people_filters[item] = true;
            });
            this.view_object.obj.filtered.people = new App.Collections.Peoples();
            var people_filters_empty = _.isEmpty(people_filters);
            var incident_filters_empty = _.isEmpty(incident_filters);
            if (people_filters_empty === true && incident_filters_empty === true){
                this.view_object.obj.filtered.people = this.view_object.obj.init.people;
            } else if (people_filters_empty === false && incident_filters_empty === true){
                this.view_object.obj.filtered.people.add(this.view_object.obj.init.people.where(people_filters));
            } else if (people_filters_empty === true && incident_filters_empty === false){
                var people_via_incidents = new App.Collections.Incidents(
                    this.view_object.relevant_incidents.where(incident_filters)
                );
                this.view_object.obj.filtered.people.add(people_via_incidents.models);
            } else if (people_filters_empty === false && incident_filters_empty === false){
                var a = this.view_object.obj.init.people.where(people_filters);
                var b = this.view_object.relevant_incidents.where(incident_filters);

                // array for case ids where filter is true
                var case_ids = [];

                // get case ids where the incident is true
                b.forEach(function(model, index){
                    var _this = model.attributes;
                    case_ids.push(_this.district_attorney_file_number);
                });

                // get the incident filters to assign to people as boolean
                var incident_filters_to_assign = _.keys(incident_filters);

                // assign person model values for where the incident is true
                a.forEach(function(model, index){
                    var _this = model.attributes;
                    var test = _.contains(case_ids, _this.district_attorney_file_number);
                    if (test === true){
                        incident_filters_to_assign.forEach(function(item, index){
                            model.set(item, true);
                        });
                    } else {
                        incident_filters_to_assign.forEach(function(item, index){
                            model.set(item, false);
                        });
                    }
                });
                var selected_filters = _.extend(incident_filters, people_filters);
                this.view_object.obj.filtered.people.add(this.view_object.obj.init.people.where(selected_filters));
            };
            this.view_object.obj.filtered.yearly = create_groups(this.view_object.obj.filtered.people, "year_of_incident");
            this.display_data(this.view_object.obj, false);
        },

        get_selected_filters: function(){
            var filters = {};
            filters.incidents = [];
            filters.peoples = [];
            $("input:radio").each(function(){
                var $this = $(this);
                if($this.is(":checked")){
                    var filter_id = $this.attr("id");
                    var filter_type = $this.attr("class");
                    filters[filter_type].push(filter_id)
                };
            });
            $("input:checkbox").each(function(){
                var $this = $(this);
                if($this.is(":checked")){
                    var filter_id = $this.attr("id");
                    var filter_type = $this.attr("class");
                    filters[filter_type].push(filter_id)
                }
            });
            return filters;
        },

        clear_checkbox_filters: function(){
            $("input:radio").each(function(){
                $(this).attr("checked", false);
            });
            $("input:checkbox").each(function(){
                $(this).attr("checked", false);
            });
            this.render();
        },

    });

})();

$(function(){
    window.app = new App.Router();
    Backbone.history.stop();
    Backbone.history.start({
        root: "",
        pushState: false,
    });
});
