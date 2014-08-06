    // create a model for a question here
    App.Models.UserQuestion = Backbone.Model.extend({
        defaults: {
            question_text: null,
            answer_1: null,
            answer_2: null,
            answer_3: null,
            answer_4: null,
            answer_5: null,
            answer_6: null
        },
    });

    // create a collection for models here
    App.Collections.UserQuestions = Backbone.Collection.extend({
        model: App.Models.UserQuestion,
    });

    // router helps to manage the flow of things through routes
    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "fetchData",
        },

        // we'll use this when user hits the main page to
        // populate our models with data
        fetchData: function(){
            var _this = this;
            this.applicationCollection = new App.Collections.UserQuestions();
            applicationCollection.fetch({
                async: true
            });
            var checkExist = setInterval(function() {
                if (applicationCollection.length > 0){
                    clearInterval(checkExist);
                    _this.renderApplicationVisuals(applicationCollection);
                }
            }, 500);
        },

        // render our template where the user will interact
        renderApplicationVisuals: function(collection){
            if (this.applicationVisuals){
                this.applicationVisuals.remove();
            };
            this.applicationVisuals = new App.Views.ApplicationVisuals({
                collection: collection,
                container: ".data-visuals"
            });
            return this.applicationVisuals;
        },
    });

    // this is what will basically be our landing view
    // where the user can initiate the quiz
    // all our views will mimic this structure and
    // change out templates and element values
    App.Views.ApplicationVisuals = Backbone.View.extend({

        // specifies the template we'll use
        template: template("templates/data-visuals.html"),

        // specifies which element receives the template
        el: ".data-visuals",

        // initialize starts the ball rolling
        // accepts an object holding information about our app
        initialize: function(viewObject){
            console.log("hi");

            // passes the view object to a render
            // function that writes the template
            this.render(viewObject);

        },

        // controls actions on dom elements
        // helps organize the state of the application
        events: {
          "click button": "beginQuiz"
        },

        beginQuiz: function () {
            alert("Clicked!")
        },

        // renders the template
        // accepts an object holding information about our app
        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));
        },
    });