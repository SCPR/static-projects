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

        /* fetchData: function(){
            var _this = this;
            var applicationCollection = new App.Collections.SixCaliforniaQuestion();
            applicationCollection.fetch({
                async: true
            });
            var checkExist = setInterval(function() {
                if (applicationCollection.length > 0){
                    clearInterval(checkExist);
                    _this.renderBeginningPage(applicationCollection);
                }
            }, 500); 
        }, */

   });

    var app_router = new App.Router;

    app_router.on('route:renderBeginningPage', function(actions) {
        alert("actions");
    })

    App.Views.BeginningPage = Backbone.View.extend({

        template: template("templates/data-visuals.html"),

        el: ".data-visuals",

        initialize: function(){
            console.log("hi");           

            this.render();

        },



        events: {
          "click button": "beginQuiz"
        },

                
        beginQuiz: function () {
            alert("Clicked!")
        },

        render: function(){

            this.$el.html(_.template(this.template));
           
            
        },


    });

    App.Views.QuizPage = Backbone.View.extend({

        template: template("templates/data-visuals-quiz.html"),

        el: ".data-visuals",

        


    });