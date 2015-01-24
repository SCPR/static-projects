    /*
    window.storage = Tabletop.init({
        key: "https://docs.google.com/spreadsheet/pub?key=0Aq8qwSArzKP9dEJNQjhYREtjU2lGLVcwYkNBRlQwMVE&output=html",
        wait: true
    });
    */

    App.Models.Nominee = Backbone.Model.extend({
        defaults: {
            awardswon: null,
            category: null,
            imdbpage: null,
            movie: null,
            movieimage: null,
            nominee: null,
            officialsite: null,
            prediction: null,
            predictionlink: null,
            predictionsource: null,
            rowNumber: null,
            slug: null,
            trailer: null
        },

        /*
        tabletop: {
            instance: window.storage,
            sheet: "live_data"
        },
        sync: Backbone.tabletopSync
        */

    });

    App.Collections.Nominees = Backbone.Collection.extend({
        model: App.Models.Nominee,

        url: window.appConfig.data_url,

        /*
        tabletop: {
            instance: window.storage,
            sheet: "live_data"
        },
        sync: Backbone.tabletopSync
        */

    });

    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "fetchData",
        },

        fetchData: function(){
            var _this = this;
            var applicationCollection = new App.Collections.Nominees();
            applicationCollection.fetch({
                async: true
            });
            var checkExist = setInterval(function() {
                if (applicationCollection.length > 0){
                    clearInterval(checkExist);
                    _this.renderApplicationVisuals(applicationCollection);
                }
            }, 1000);
        },

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

    App.Views.ApplicationVisuals = Backbone.View.extend({

        template: _.template(template("templates/data-visuals.html")),
        el: ".data-visuals",


        initialize: function(viewObject){
            this.render(viewObject);
        },

        getGroups: function(collection){
            return _.groupBy(collection.toJSON(), "category");
        },

        render: function(viewObject){
            var groupedCollection = this.getGroups(viewObject.collection);
            $(viewObject.container).html(this.template({
                collection: groupedCollection
            }));
            this.calculateHeights(groupedCollection);
        },

        calculateHeights: function(groupedCollection){
            var _this = this;
            var checkExist = setInterval(function() {
                if ($(".data-visuals").length) {
                    clearInterval(checkExist);
                    var categoryRows = [];
                    _.each(groupedCollection, function(item){
                        categoryRows.push(item[0].slug);
                    });
                    $.each(categoryRows, function(index, value){
                        var targetElementId = "#" + value;
                        var heightArray = _this.getHighestHeight(targetElementId);
                        var desiredHeight = 15 + Math.max.apply(Math, heightArray);
                        $(targetElementId + " .nominee-container").css("height", desiredHeight);
                    });
                }
            }, 1000);
        },

        getHighestHeight: function(targetElementId){
            var heights = [];
            $(targetElementId).children().each(function(){
                var new_height = $(this).outerHeight();
                heights.push(new_height)
            });
            return heights;
        }
    });