// create basic object to house application
(function(){

    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {}
    };

    // load external templates via ajax
    window.template = function(url){
        var data = "<h1> failed to load url : " + url + "</h1>";
        $.ajax({
            async: false,
            dataType: "text",
            url: url,
            success: function(response) {
                data = response;
            }
        });
        return data;
    };

    window.percentifyValue = function(value){
        var value = value * 100
        return parseFloat(value.toFixed(2));
    };

    window.toFixedPercent = function(part, whole){
        var targetValue = part / whole;
        var decimal = parseFloat(targetValue);
        return decimal
    };

    window.splitOnCapitalLetter = function(string){
        var newString = string.replace(/([a-z])([A-Z])/g, '$1 $2')
        return newString;
    };

    window.slugifyString = function(string){
        var newString = string.toLowerCase().split(' ').join('-');
        return newString;
    };

    window.createCurrency = function(nStr){
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
            return "$" + x1 + x2 + ".00";
    };

    String.prototype.truncateToGraf = function(){
        var lengthLimit = 900;
        if (this.length > lengthLimit){
            return this.substring(0, lengthLimit) + " ... ";
        } else {
            return this;
        }
    };

    String.prototype.toProperCase = function(){
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

    App.Models.SchoolInstance = Backbone.Model.extend({
        defaults: {
            schoolname: null,
        },
    });

    App.Models.SchoolBudget = Backbone.Model.extend({
        defaults: {
            schoolname: null,
            programdescription: null,
            majorgroup: null,
            unrestricted: null,
            restricted: null,
            other: null,
            grandtotal: null,
        },
    });

    App.Collections.SchoolInstances = Backbone.Collection.extend({
        model: App.Models.SchoolInstance,
        url: "data/school_instances.json",
        comparator: function(model) {
            return model.get('schoolname');
        }
    });

    App.Models.SchoolBudgets = Backbone.Collection.extend({
        model: App.Models.SchoolBudget,
        url: "data/school_budgets.json",
        comparator: function(model) {
            return model.get('schoolname');
        }
    });

    App.Router = Backbone.Router.extend({
        initialize: function(){
            $(".kpcc-header").html(_.template(template("templates/kpcc-header.html")));
            $(".data-details").html(_.template(template("templates/data-details.html")));
            $(".kpcc-footer").html(_.template(template("templates/kpcc-footer.html")));
            window.schoolsCollection = new App.Collections.SchoolInstances();
            window.schoolsCollection.fetch({
                async: false,
            });
            window.schoolBudgetCollection = new App.Models.SchoolBudgets();
            window.schoolBudgetCollection.fetch({
                async: false,
            });
        },

        routes: {
            "": "indexView",
            "school/:schoolname": "displayIndividualSchool"
        },

        indexView: function(){
            this.createVisuals(".data-visuals", "templates/data-visuals.html");
        },

        displayIndividualSchool: function(schoolslug){

            this.createVisuals(".data-visuals", "templates/data-visuals.html");

            this.schoolBudget = window.schoolBudgetCollection.where({
                schoolslug: schoolslug
            });

            $("#school-list").val(schoolslug);

            this.detailsView = new App.Views.DetailsView({
                schoolArray: this.schoolBudget,
                container: "#school-details",
                template: "templates/school-results.html"
            });
        },

        createVisuals: function(container, template){
            if (this.visualsView){
                this.visualsView.remove();
            };
            this.visualsView = new App.Views.VisualsView({
                container: container,
                template: template
            });
            return this.visualsView;
        }

    });

    App.Views.VisualsView = Backbone.View.extend({
        tagName: "div",

        className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

        initialize: function(viewObject){
            this.dataTemplate = _.template(template(viewObject.template)),
            this.render(viewObject);
        },

        events: {
            "change #school-list": "evaluateSelectedSchool",
        },

        evaluateSelectedSchool: function(e){
            e.preventDefault();
            var schoolslug = $("#school-list").val();
            window.router.navigate('#school/' + schoolslug, {
                trigger: true,
                replace: false,
            });
        },

        render: function(viewObject){
            $(viewObject.container).html(this.$el.html(this.dataTemplate({
                collection: window.schoolsCollection.toJSON()
            })));
        }
    });

    App.Views.DetailsView = Backbone.View.extend({

        tagName: "div",

        className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

        initialize: function(viewObject){
            this.detailsTemplate = _.template(template(viewObject.template)),
            this.render(viewObject);
        },

        render: function(viewObject){

            console.log(viewObject.schoolArray);

            this.navigatedCollection = new App.Models.SchoolBudgets();

            this.navigatedCollection.add(viewObject.schoolArray);

            var test = _.each(viewObject.schoolArray, function(item){
                console.log(item.attributes);
            });

            var sum = _.reduce([1, 2, 3], function(memo, num){
                return memo + num;
            }, 0);

            console.log(sum);

            $(viewObject.container).html(this.$el.html(this.detailsTemplate({
                schoolname: viewObject.schoolArray[0].attributes.propername,
                collection: this.navigatedCollection.toJSON()
            })));
        }
    });

    window.appConfig = {
        openAboutThis: true,
        comments: true,
        embed_this: true,
        embed_url_root: 'http://projects.scpr.org/static/applications/lausd-2014-2015-school-by-school-budgets/?=embed/',
        embed_width: "100%",
        embed_height: "850px"
    };

    window.renderEmbedBox = function(){
        jAlert("<h4>Embed this on your site or blog</h4><span>Copy this code and paste to source of your page. You may need to adjust the height parameter.<br /><br /><textarea>&lt;iframe src='" + appConfig.embed_url_root + "' width='" + appConfig.embed_width + "' height='" + appConfig.embed_height + "' style='margin: 0 3% 0 3%;' frameborder='no'&gt;&lt;/iframe></textarea>");
    };

    $(function(){
        window.router = new App.Router();
        Backbone.history.start({
            root: 'http://projects.scpr.org/static/applications/lausd-2014-2015-school-by-school-budgets',
            pushState: false,
        });

        var urlLink = window.location.href;

        if (urlLink.indexOf("embed") > -1){
            window.appConfig.openAboutThis = false;
        };

        if (window.appConfig.comments === true){
            var disqus_shortname = 'kpcc-projects';
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        };

        if (window.appConfig.embed_this === false){
            $('li.projects-embed').addClass('hidden');
        };

        if (window.appConfig.openAboutThis === true){
            $('.text').collapse('show');
        };

        $('.text').on('shown.bs.collapse', function(){
            $('span.text').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        });
        $('.text').on('hidden.bs.collapse', function(){
            $('span.text').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        });
        $('.about').on('shown.bs.collapse', function(){
            $('span.about').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        });
        $('.about').on('hidden.bs.collapse', function(){
            $('span.about').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        });

    });

})();