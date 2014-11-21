    Backbone.View.prototype.scrollToElement = function (selector, time, verticalOffset) {
        var time = typeof(time) != "undefined" ? time: 200,
            verticalOffset = typeof(verticalOffset) != "undefined" ? verticalOffset: 0,
            element = $(selector),
            offset = element.offset(),
            offsetTop = offset.top + verticalOffset;
        $("html, body").animate({scrollTop: offsetTop}, time);
    };

    window.storage = Tabletop.init({
        key: "https://docs.google.com/spreadsheets/d/0Aq8qwSArzKP9dEJSRXZ6bDRTenY4RFJ0UlFCN2k1Q3c/pubhtml",
        wait: true
    });

    App.Models.RepresentativeStatement = Backbone.Model.extend({
        defaults: {
            commonreference: null,
            district: null,
            districtid: null,
            firstname: null,
            fullname: null,
            fullnameslug: null,
            fullreference: null,
            fullstatements: null,
            imageurl: null,
            lastname: null,
            party: null,
            position: null,
            reptrackerurl: null,
            source: null,
            sourceurl: null,
            updatedate: null,
            viewonexecutiveorder: null
        },
        tabletop: {
            instance: window.storage,
            sheet: "updates"
        },
        sync: Backbone.tabletopSync
    });

    App.Collections.RepresentativeStatements = Backbone.Collection.extend({
        model: App.Models.RepresentativeStatement,
        tabletop: {
            instance: window.storage,
            sheet: "updates"
        },
        sync: Backbone.tabletopSync
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
            var applicationCollection = new App.Collections.RepresentativeStatements();
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
            $(window).scroll(function(){
                var barWidth = $(".candidate-container").width();
                var aboveHeight;
                if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)){
                    aboveHeight = $("#content-action-bar").outerHeight();
                } else {
                    aboveHeight = $(".data-details").outerHeight() + 10;
                }
                //if scrolled down more than the varibles"s height
                if ($(window).scrollTop() > aboveHeight){
                    // if yes, add "fixed" class to the <nav>
                    // add padding top to the #content (value is same as the height of the nav)
                    $("#content-action-bar").addClass("fixed").css("width", barWidth);
                } else {
                    // when scroll up or less than aboveHeight, remove the "fixed" class, and the padding-top
                    $("#content-action-bar").removeClass("fixed").css("width", "width: 100%;");
                }
            });
            this.render(viewObject);
        },

        events: {
            "change #search-congressional-delegation": "scrollToRep",
        },

        render: function(viewObject){
            $(viewObject.container).html(this.template({
                collection: viewObject.collection.toJSON()
            }));
        },

        scrollToRep: function(){
            var congressionalMember = $("#search-congressional-delegation").val();
            this.scrollToElement(congressionalMember, 1000, -110);
        }

    });