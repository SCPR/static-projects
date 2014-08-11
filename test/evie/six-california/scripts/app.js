<<<<<<< HEAD
    /* window.storage = Tabletop.init({
        key: "https://docs.google.com/spreadsheets/d/1H6hFZQiolqW7fU5Zdruy0LWTPn8zqDN2gW4ZkQoFUaI/pubhtml",
        wait: true
    }); */

    /*App.Models.SixCaliforniaQuestion= Backbone.Model.extend({
        defaults: {
            county: null,
            countyproper: null,
            updated: null,
            cases: null,
            rate: null,
        },
        tabletop: {
            instance: window.storage,
            sheet: "data_7_8_2014"
        },
        sync: Backbone.tabletopSync
    }); */

    App.Models.SixCaliforniaQuestion = Backbone.Model.extend({
        defaults: {
            question: null,
            jefferson: null,
            north_california: null,
            south_california: null,
            west_california: null,
            central_california: null,
            silicon_valley: null,
        },
    });

    /* App.Collections.WhoopingCoughCurrents = Backbone.Collection.extend({
        model: App.Models.WhoopingCoughCurrent,
        tabletop: {
            instance: window.storage,
            sheet: "data_7_8_2014"
        },
        sync: Backbone.tabletopSync
    });*/

    App.Collections.SixCaliforniaQuestion = Backbone.Collection.extend({
        model: App.Models.SixCaliforniaQuestion,
    });

    var question1 = new App.Models.SixCaliforniaQuestion ({ 
            question: 1,
            jefferson: 2,
            north_california: 3,
            south_california: 4,
            west_california: 5,
            central_california: 6,
            silicon_valley: 7, 
        });
        
        var question2 = new App.Models.SixCaliforniaQuestion ({ 
            question: 8,
            jefferson: 9,
            north_california: 10,
            south_california: 11,
            west_california: 12,
            central_california: 13,
            silicon_valley: 14, 
        });
 

    var quizQuestions = new App.Collections.SixCaliforniaQuestion([ question1, question2]);
    
    console.log( quizQuestions.models[0].attributes); 

=======
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
>>>>>>> 5a838e6bf5bd64a258eb61a192864ec94306aa49
    App.Router = Backbone.Router.extend({
        //initialize: function(){
           //console.log("route");
            //this.applicationWrapper = new App.Views.ApplicationWrapper();
            //return this.applicationWrapper;

            //renderBeginningPage: function(){
            //if (this.BeginningPage){
                //this.BeginningPage.remove();
            //};

                //cosole.log("renderBeginningPage");

           // this.BeginningPage = new App.Views.BeginningPage({
                //container: ".data-visuals"
           // });

            //return this.BeginningPage;

        //}),


        routes: {
           "actions": "renderBeginningPage",
        }, 

<<<<<<< HEAD
        /* fetchData: function(){
            var _this = this;
            var applicationCollection = new App.Collections.SixCaliforniaQuestion();
=======
        // we'll use this when user hits the main page to
        // populate our models with data
        fetchData: function(){
            var _this = this;
            this.applicationCollection = new App.Collections.UserQuestions();
>>>>>>> 5a838e6bf5bd64a258eb61a192864ec94306aa49
            applicationCollection.fetch({
                async: true
            });
            var checkExist = setInterval(function() {
                if (applicationCollection.length > 0){
                    clearInterval(checkExist);
                    _this.renderBeginningPage(applicationCollection);
                }
<<<<<<< HEAD
            }, 500); 
        }, */

   });

    var app_router = new App.Router;

    app_router.on('route:renderBeginningPage', function(actions) {
        alert("actions");
    })

    App.Views.BeginningPage = Backbone.View.extend({
=======
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
>>>>>>> 5a838e6bf5bd64a258eb61a192864ec94306aa49

        // specifies the template we'll use
        template: template("templates/data-visuals.html"),

        // specifies which element receives the template
        el: ".data-visuals",

<<<<<<< HEAD
        initialize: function(){
            console.log("hi");           

            this.render();
=======
        // initialize starts the ball rolling
        // accepts an object holding information about our app
        initialize: function(viewObject){
            console.log("hi");

            // passes the view object to a render
            // function that writes the template
            this.render(viewObject);
>>>>>>> 5a838e6bf5bd64a258eb61a192864ec94306aa49

        },

        // controls actions on dom elements
        // helps organize the state of the application
        events: {
          "click button": "beginQuiz"
        },

        beginQuiz: function () {
            alert("Clicked!")
        },

<<<<<<< HEAD
        render: function(){

            this.$el.html(_.template(this.template));
           
            
        },


    });

    App.Views.QuizPage = Backbone.View.extend({

        template: template("templates/data-visuals-quiz.html"),

        el: ".data-visuals",

        


=======
        // renders the template
        // accepts an object holding information about our app
        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));
        },
>>>>>>> 5a838e6bf5bd64a258eb61a192864ec94306aa49
    });