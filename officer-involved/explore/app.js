
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

    App.Models.Person = Backbone.Model.extend({
        defaults: {
            person_name: null,
            district_attorney_file_number: null,
            incident_url: null,
            person_weapon: null,
            person_ethnicity: null,
            person_gender: null,
            person_age: null,
            person_signs_of_impairment: null,
            person_killed: null,
            person_wounded: null,
            armed_with_firearm: null,
            armed_with_weapon: null,
            used_vehicle_as_weapon: null,
            person_reached_for_waistband: null,
            person_fled_by_foot_or_vehicle: null,
            person_ignored_officer_commands: null,
            person_signs_of_mental_illness: null,
            person_fired_gun_at_officer: null,
            person_pointed_gun_at_officer: null,
            person_unarmed: null,
            person_armed: null,
            person_hid_hands_from_officer: null,
            person_grabbed_for_officers_weapon_holster: null,
            person_threatened_officer_with_weapon: null,
            person_weapon_recovered: null,
            used_vehicle_as_weapon: null,
            person_shot_in_back: null,
            person_shot_in_head: null,
            person_arrested: null,
            person_signs_of_gang_affiliation: null,
            incident: null,
        },
    });

    App.Collections.People = Backbone.Collection.extend({
        model: App.Models.Person,
        comparator: function(model) {
            return model.get("district_attorney_file_number");
        },
        url: "data.json",
    });

    App.Router = Backbone.Router.extend({

        routes: {
            "": "fetchData",
        },

        fetchData: function(){
            var _this = this;
            var people = new App.Collections.People();
            people.fetch({
                async: false
            });
            var checkExist = setInterval(function() {
                if (people.length > 0){
                    clearInterval(checkExist);
                    _this.renderApplicationVisuals(people);
                }
            }, 500);
        },

        renderApplicationVisuals: function(people){
            if (this.applicationVisuals){
                this.applicationVisuals.remove();
            };
            people.forEach(function(model, index){
                var _this = model.attributes;
                _.extend(_this, _this.incident);
                model.unset("incident");
            });
            this.applicationVisuals = new App.Views.ApplicationVisuals({
                total_people: people
            });
            return this.applicationVisuals;
        },
    });

    App.Views.ApplicationVisuals = Backbone.View.extend({

        el: ".data-display",

        initialize: function(object){

            this.view_object = object;

            this.view_object.template = template("my_template");

            this.view_object.relevant_people = this.view_object.total_people;

            this.view_object = this.calculate_model_attributes(this.view_object);

            this.view_object.filters = [{
                type: "incidents",
                proper: "Incident",
                radio_buttons: [],
                checkboxes: [
                    {opt: "Officer Self Defense", opt_field: "officer_self_defense"},
                    {opt: "Officer Defense Of Other Officers", opt_field: "officer_defense_of_officers"},
                    {opt: "Officer Defense Of Civilians", opt_field: "officer_defense_of_civilians"},
                    {opt: "Car Stop", opt_field: "car_stop"},
                ]}, {
                type: "peoples",
                proper: "Person",
                radio_buttons: [
                    {
                        field_name: "person_killed_non",
                        group_name: "Outcome",
                        buttons: [
                            {opt: "Fatal", opt_field: "person_killed"},
                            {opt: "Non-fatal", opt_field: "person_wounded"},
                        ]
                    }, {
                        field_name: "armed_non",
                        group_name: "Weapon",
                        buttons: [
                            {opt: "Unarmed", opt_field: "person_unarmed"},
                            {opt: "Firearm", opt_field: "armed_with_firearm"},
                            {opt: "Other Weapon", opt_field: "armed_with_weapon"},
                        ]
                    }, {
                        field_name: "gender",
                        group_name: "Gender",
                        buttons: [
                            {opt: "Female", opt_field: "person_female"},
                            {opt: "Male", opt_field: "person_male"},
                        ]
                    }, {
                        field_name: "person_ethnicity",
                        group_name: "Race/Ethnicity",
                        buttons: [
                            {opt: "Latino", opt_field: "latino"},
                            {opt: "Black", opt_field: "black"},
                            {opt: "White", opt_field: "caucasian"},
                            {opt: "Asian", opt_field: "asian"},
                            {opt: "Other", opt_field: "other"},
                        ]
                    }
                ],
                checkboxes: [
                    {opt: "Officer Said Person Reached for Waistband", opt_field: "person_reached_for_waistband"},
                    {opt: "Officer Couldn't See Person's Hands", opt_field: "person_hid_hands_from_officer"},
                    {opt: "Officer Said Person Grabbed For Service Firearm or Holster", opt_field: "person_grabbed_for_officers_weapon_holster"},
                    {opt: "Officer Said Vehicle Used as Weapon", opt_field: "used_vehicle_as_weapon"},
                    {opt: "Foot Chase or Vehicle Pursuit Occurred", opt_field: "person_fled_by_foot_or_vehicle"},
                    {opt: "Signs of Drug/Alcohol Impairment", opt_field: "person_signs_of_impairment"},
                    {opt: "Signs of Mental Illness", opt_field: "person_signs_of_mental_illness"},
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
                /* set gender data */
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
                model.set("no_ethnicity", true);
                if (_this.person_killed === true){
                    if (_this.person_ethnicity != null || _this.person_ethnicity != undefined){
                        if (_this.person_ethnicity === "BLACK"){
                            model.set("person_ethnicity", "black");
                            model.set("black", true);
                        } else if (_this.person_ethnicity === "HISPANIC/LATIN AMERICAN"){
                            model.set("person_ethnicity", "latino");
                            model.set("latino", true);
                        } else if (_this.person_ethnicity === "MIDDLE EASTERN"){
                            model.set("person_ethnicity", "middle-eastern");
                            model.set("other", true);
                        } else if (_this.person_ethnicity === "ASIAN"){
                            model.set("person_ethnicity", "asian");
                            model.set("asian", true);
                        } else if (_this.person_ethnicity === "CAUCASIAN"){
                            model.set("person_ethnicity", "caucasian");
                            model.set("caucasian", true);
                        } else {
                            model.set("person_ethnicity", _this.person_ethnicity.toLowerCase());
                            model.set("other", true);
                        };
                        view_object.ethnicities.push(_this.person_ethnicity);
                    } else {
                        model.set("person_ethnicity", "n/a");
                        model.set("other", true);
                    }
                };

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
            $(this.el).html(this.view_object.template(this.view_object));
            this.view_object.obj = {};
            this.view_object.obj.filtered = {};
            this.view_object.obj.init = {};
            this.view_object.obj.init.people = this.view_object.relevant_people;
            this.view_object.obj.init.yearly = create_groups(this.view_object.obj.init.people, "year_of_incident");
            this.view_object.obj.total = this.view_object.obj.init.people.length;
            this.display_data(this.view_object.obj, true);
        },

        display_data: function(obj, initial){
            if (initial === true){
                this.chart_data(obj.init, this.view_object.obj.total);
            } else {
                this.chart_data(obj.filtered, this.view_object.obj.total);
            };
        },

        chart_data: function(obj, total){
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
            var all_filters = {};
            _.each(this.view_object.obj.active_checkboxes, function(item, index, list){
                return all_filters[item] = true;
            });

            console.log(all_filters);

            this.view_object.obj.filtered.people = new App.Collections.People();
            var all_filters_empty = _.isEmpty(this.view_object.obj.active_checkboxes);
            if (all_filters_empty === true){
                this.view_object.obj.filtered.people = this.view_object.obj.init.people;
            } else {
                this.view_object.obj.filtered.people.add(this.view_object.obj.init.people.where(all_filters));
            }
            this.view_object.obj.filtered.yearly = create_groups(this.view_object.obj.filtered.people, "year_of_incident");


            console.log(this.view_object.obj);

            this.display_data(this.view_object.obj, false);
        },

        get_selected_filters: function(){
            var filters = [];
            // filters.incidents = [];
            // filters.peoples = [];
            $("input:radio").each(function(){
                var $this = $(this);
                if($this.is(":checked")){
                    var filter_id = $this.attr("id");
                    var filter_type = $this.attr("class").split(" ")[0];
                    if (filter_id === "person_killed"){
                        $("label.display-until-toggle").addClass("invisible");
                        $("span.hidden-until-toggle").removeClass("invisible");
                        filters.push(filter_id);
                        // filters[filter_type].push(filter_id);
                    } else if (filter_id === "person_wounded"){
                        $("span.hidden-until-toggle").addClass("invisible");
                        $("label.display-until-toggle").removeClass("invisible");
                        $("input:radio[name='person_ethnicity']").attr("checked", false);
                        // filters[filter_type].push(filter_id);
                        filters.push("no_ethnicity");
                        filters.push(filter_id);
                    } else {
                        // filters[filter_type].push(filter_id);
                        filters.push(filter_id);
                    };
                };
            });
            $("input:checkbox").each(function(){
                var $this = $(this);
                if($this.is(":checked")){
                    var filter_id = $this.attr("id");
                    var filter_type = $this.attr("class");
                    // filters[filter_type].push(filter_id);
                    filters.push(filter_id);
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
