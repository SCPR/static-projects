$.ajaxSetup({
  async: false
});

App.Models.Legislator = Backbone.Model.extend({
    defaults: {
        fullreference: null,
        district: null,
        firstname: null,
        districtid: null,
        lastname: null,
        imageurl: null,
        bioguideid: null,
        party: null,
        position: null,
        fullname: null,
        commonreference: null,
        number: null,
        bioguide_id: null,
        speaker_first: null,
        speaker_last: null,
        speaker_party: null,
        title: null,
        origin_url: null,
        date: null,
        chamber: null,
        speaker_image_url: null,
        speaker_reference: null,
        speaking: null,
    },
});

App.Collections.Legislators = Backbone.Collection.extend({
    model: App.Models.Legislator,
    url: "data/ca_congressional_lookup.json",
});

App.Router = Backbone.Router.extend({
    initialize: function(){
        this.applicationWrapper = new App.Views.ApplicationWrapper();
        return this.applicationWrapper;
    },

    routes: {
        "": "indexView",
        ":phrase": "fetchData"
    },

    indexView: function(){
        this.fetchData(null);
    },

    fetchData: function(phrase){
        var _this = this;
        var legislators = new App.Collections.Legislators();
        legislators.fetch({
            async: false
        });
        var checkExist = setInterval(function() {
            if (legislators.length > 0){
                clearInterval(checkExist);
                _this.render_application_visuals(legislators, phrase);
            }
        }, 500);
    },

    render_application_visuals: function(legislators, phrase){
        if (this.application_visuals){
            this.application_visuals.remove();
        };
        this.application_visuals = new App.Views.ApplicationVisuals({
            data: legislators,
            phrase: phrase,
        });
        return this.application_visuals;
    },
});

App.Views.ApplicationVisuals = Backbone.View.extend({

    tagName: "div",

    className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

    template: template("templates/data-visuals.html"),

    el: ".data-visuals",

    initialize: function(object){
        this.view_object = object;
        if (this.view_object.phrase != null){
            this.view_object.api_urls = this.construct_capitol_words_query(this.view_object.phrase);
            this.view_object.data.phrases = this.return_json(this.view_object.api_urls.phrases);
            this.view_object.data.instances = this.return_json(this.view_object.api_urls.instances);
            this.render();
        };
    },

    // construct the url to query for data
    construct_capitol_words_query: function(phrase){
        var urlPhrasesPrefix = 'http://capitolwords.org/api/1/text.json?apikey=b717252e9bc44d4ea57321c49e7dd5e8';
        var urlInstancesPrefix = 'http://capitolwords.org/api/1/phrases/party.json?apikey=b717252e9bc44d4ea57321c49e7dd5e8';
        var urlStartDate = '&start_date=2015-08-01';
        var urlEndDate = '&end_date=2015-12-30';
        var urlState = '&state=CA';
        var urlPhrase = '&phrase=' + phrase;
        var urlCallback = '&callback=?';
        var target_phrases_url = urlPhrasesPrefix + urlStartDate + urlEndDate + urlState + urlPhrase;
        var target_instances_url = urlInstancesPrefix + urlStartDate + urlEndDate + urlState + urlPhrase;
        return {
            "phrases": target_phrases_url,
            "instances": target_instances_url
        };
    },

    events: {
        "keyup :input": "term_search",
        "click button#submit": "navigate",
    },

    term_search: function(e){
        var input_value = $("input[id='term_search']").val();
        this.view_object.phrase = input_value.slugifyString()

        // console.log(string.toProperCase());
        // console.log(string.slugifyString());
        // console.log(string.splitOnCapitalLetter());


        if(e.keyCode != 13) {
            return false;
        } else if (e.keyCode === 13 && this.view_object.phrase === "" || this.view_object.phrase === null) {
            return false;
        } else {
            this.navigate();
        }


    },

    navigate: function(){

        console.log(this.view_object);

        // window.app.navigate("#" + this.view_object.phrase, {
        //     trigger: true,
        //     replace: false,
        // });

    },

    return_json: function(url){
        var output = [];
        $.ajax({
            url: url,
            async: false,
            dataType: "json",
            success: function(data){
                output = data.results;
            }
        });
        return output;
    },


    render: function(){
        $(this.el).html(_.template(this.template));

        $("#total-overall-instances").empty();
        $("#total-democrat-instances").empty();
        $("#total-republican-instances").empty();

        var dems = _.where(this.view_object.data.instances, {party: "D"});
        if(dems.length === 0){
            dems[0] = {
                "count": 0,
                "party": "D"
            };
        };

        var gops = _.where(this.view_object.data.instances, {party: "R"});
        if(gops.length === 0){
            gops[0] = {
                "count": 0,
                "party": "R"
            };
        };

        var overall_instances = dems[0].count + gops[0].count;

        $("#total-overall-instances").html("Found " + overall_instances + " instances. ");
        $("#total-democrat-instances").html("Mentioned " + dems[0].count + " times by California Democrats. ");
        $("#total-republican-instances").html("Mentioned " + gops[0].count + " times by California Republicans.");
        $("#phrase-headline").html("<h1 class='centered'><span id='display-phrase'>" + this.view_object.phrase.phraseToProperCase() + "</span></h1>");


    },
});
