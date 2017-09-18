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
        var newString = string.toLowerCase()
            //.replace(/&/g, "")
            //.replace(/\,\s/g, "")
            //.replace(/\//g, " ")
            .replace(/\W/g, " ")
            .replace(/\s\s/g, "")
            .split(" ")
            .join('-');
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
            majorgroup_slug: null,
        },
    });

    App.Models.BudgetCategory = Backbone.Model.extend({
        defaults: {
            majorgroup: null,
            majorgroup_slug: null,
        },
    });

    App.Models.SchoolBudgetItem = Backbone.Model.extend({
        defaults: {
            schoolname: null,
            programdescription: null,
            majorgroup: null,
            majorgroup_slug: null,
            unrestricted: null,
            restricted: null,
            other: null,
            grandtotal: null,
            line_item: null,
            line_item_total: null
        },
    });

    App.Models.SchoolBudgetAggregate = Backbone.Model.extend({
        defaults: {
            school_name: null,
            line_items: [],
        },
    });

    App.Models.BudgetCategoryAggregate = Backbone.Model.extend({
        defaults: {
            line_item: null,
            schools: [],
        },
    });

    App.Collections.SchoolInstances = Backbone.Collection.extend({
        model: App.Models.SchoolInstance,
        url: "data/school_instances.json",
        comparator: function(model) {
            return model.get('schoolname');
        }
    });

    App.Collections.BudgetCategories = Backbone.Collection.extend({
        model: App.Models.BudgetCategory,
        url: "data/budget_instances.json",
        comparator: function(model) {
            return model.get('majorgroup');
        }
    });

    App.Collections.SchoolBudgetItems = Backbone.Collection.extend({
        model: App.Models.SchoolBudgetItem,
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

            window.budgetItemsCollection = new App.Collections.BudgetCategories();
            window.budgetItemsCollection.fetch({
                async: false,
            });

            window.budgetItemsCollection.forEach(function(model, index) {
                model.set("majorgroup_slug", window.slugifyString(model.get("majorgroup")));
            });

            window.schoolBudgetCollection = new App.Collections.SchoolBudgetItems();
            window.schoolBudgetCollection.fetch({
                async: false,
            });

            window.schoolBudgetCollection.forEach(function(model, index) {
                model.set("majorgroup_slug", window.slugifyString(model.get("majorgroup")));
            });
        },

        routes: {
            "": "indexView",
            "school/:schoolSlug": "displayIndividualSchool",
            "line-item/:lineItem": "displayIndividualBudgetItem"
        },

        indexView: function(){
            this.createSchoolSelect(".data-visuals", "templates/school-select.html");
        },

        displayIndividualSchool: function(schoolSlug){

            this.createSchoolSelect(".data-visuals", "templates/school-select.html");

            $("#school-list").val(schoolSlug);

            var schoolBudget = window.schoolBudgetCollection.where({
                schoolslug: schoolSlug
            });

            var schoolInstance = new App.Models.SchoolBudgetAggregate();

            schoolInstance.set({
                school_name: schoolBudget[0].attributes.propername
            });

            var combinedBudgetGroups = _.groupBy(schoolBudget, function(model){
                return model.get("majorgroup");
            });

            var summedBudgetGroups = _.each(combinedBudgetGroups, function(group, key){
                var summed = 0;
                for (var i=0; i<group.length; i++) {
                    summed += parseInt(group[i].attributes.grandtotal);
                };
                schoolInstance.set({
                    line_items: schoolInstance.get("line_items").concat({
                        major_group: group[0].get("majorgroup"),
                        majorgroup_slug: group[0].get("majorgroup_slug"),
                        major_group_budget: summed,
                        major_group_percent: 10
                    })
                });
            });

            var aggregateArray = [];
            _.each(schoolInstance.attributes.line_items, function(item) {
                aggregateArray.push(item.major_group_budget);
            });

            var aggregateItemBudget = _.reduce(aggregateArray, function(memo, num){
                return memo + num;
            }, 0);

            schoolInstance.set({
                totalbudgeted: aggregateItemBudget
            });

            _.each(schoolInstance.attributes.line_items, function(item) {
                item.major_group_percent = window.percentifyValue(item.major_group_budget / schoolInstance.attributes.totalbudgeted);
            });

            this.schoolDetailsView = new App.Views.SchoolDetailsView({
                model: schoolInstance,
                container: "#school-details",
                template: "templates/school-results.html"
            });

        },

        displayIndividualBudgetItem: function(lineItem){

            this.createBudgetSelect(".data-visuals", "templates/budget-select.html");

            $("#budget-list").val(lineItem);

            var budgetCategories = window.schoolBudgetCollection.where({
                majorgroup_slug: lineItem
            });

            var categoryInstance = new App.Models.BudgetCategoryAggregate();

            categoryInstance.set({
                line_item: budgetCategories[0].attributes.majorgroup
            });

            var combinedSchools = _.groupBy(budgetCategories, function(model){
                return model.get("propername");
            });

            var summedBudgetSchools = _.each(combinedSchools, function(group, key){
                var summed = 0;
                for (var i=0; i<group.length; i++) {
                    summed += parseInt(group[i].attributes.grandtotal);
                };
                categoryInstance.set({
                    schools: categoryInstance.get("schools").concat({
                        school_name: group[0].get("propername"),
                        major_group_budget: summed
                    })
                });
            });

            var aggregateArray = [];
            _.each(categoryInstance.attributes.schools, function(budget) {
                aggregateArray.push(budget.major_group_budget);
            });

            var aggregateItemBudget = _.reduce(aggregateArray, function(memo, num){
                return memo + num;
            }, 0);

            var sortedSchools = _.sortBy(categoryInstance.attributes.schools, function(instance){
                return instance.major_group_budget;
            });

            categoryInstance.set({
                schools: sortedSchools.reverse(),
                totalbudgeted: aggregateItemBudget
            });

            this.budgetDetailsView = new App.Views.BudgetDetailsView({
                model: categoryInstance,
                container: "#school-details",
                template: "templates/budget-results.html"
            });
        },

        createBudgetSelect: function(container, template){
            if (this.budgetSelectView){
                this.budgetSelectView.remove();
            };
            this.budgetSelectView = new App.Views.BudgetSelectView({
                container: container,
                template: template
            });
            return this.budgetSelectView;
        },

        createSchoolSelect: function(container, template){
            if (this.visualsView){
                this.visualsView.remove();
            };
            this.visualsView = new App.Views.SchoolSelectView({
                container: container,
                template: template
            });
            return this.visualsView;
        }

    });

    App.Views.BudgetSelectView = Backbone.View.extend({

        tagName: "div",

        className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

        initialize: function(viewObject){
            this.dataTemplate = _.template(template(viewObject.template)),
            this.render(viewObject);
        },

        events: {
            "change #budget-list": "evalBudgetCategory",
        },

        evalBudgetCategory: function(e){
            e.preventDefault();
            var lineItem = $("#budget-list").val();
            window.router.navigate('#line-item/' + lineItem, {
                trigger: true,
                replace: false,
            });
        },

        render: function(viewObject){
            $(viewObject.container).html(this.$el.html(this.dataTemplate({
                collection: window.budgetItemsCollection.toJSON()
            })));
        }
    });

    App.Views.SchoolSelectView = Backbone.View.extend({

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

    App.Views.SchoolDetailsView = Backbone.View.extend({

        tagName: "div",

        className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

        initialize: function(viewObject){
            this.detailsTemplate = _.template(template(viewObject.template)),
            this.render(viewObject);
        },

        events: {
            "click li a": "evalBudgetCategory",
        },

        evalBudgetCategory: function(e){
            e.preventDefault();
            var lineItem = e.target.id;
            window.router.navigate('#line-item/' + lineItem, {
                trigger: true,
                replace: false,
            });
        },

        render: function(viewObject){
            $(viewObject.container).html(this.$el.html(this.detailsTemplate({
                collection: viewObject.model.toJSON()
            })));
        }
    });

    App.Views.BudgetDetailsView = Backbone.View.extend({

        tagName: "div",

        className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

        initialize: function(viewObject){
            this.detailsTemplate = _.template(template(viewObject.template)),
            this.render(viewObject);
        },

        events: {
            "click li a": "evaluateSelectedSchool",
        },

        evaluateSelectedSchool: function(e){
            e.preventDefault();
            var schoolslug = e.target.id;
            window.router.navigate('#school/' + schoolslug, {
                trigger: true,
                replace: false,
            });
        },

        render: function(viewObject){
            $(viewObject.container).html(this.$el.html(this.detailsTemplate({
                collection: viewObject.model.toJSON()
            })));
        }
    });

    window.appConfig = {
        openAboutThis: true,
        comments: true,
        embed_this: true,
        embed_url_root: 'https://projects.scpr.org/applications/lausd-2014-2015-school-by-school-budgets/?=embed/',
        embed_width: "100%",
        embed_height: "850px"
    };

    window.renderEmbedBox = function(){
        jAlert("<h4>Embed this on your site or blog</h4><span>Copy this code and paste to source of your page. You may need to adjust the height parameter.<br /><br /><textarea>&lt;iframe src='" + appConfig.embed_url_root + "' width='" + appConfig.embed_width + "' height='" + appConfig.embed_height + "' style='margin: 0 3% 0 3%;' frameborder='no'&gt;&lt;/iframe></textarea>");
    };

    $(function(){
        window.router = new App.Router();
        Backbone.history.start({
            root: 'https://projects.scpr.org/applications/lausd-2014-2015-school-by-school-budgets',
            pushState: false,
        });

        var urlLink = window.location.href;

        if (urlLink.indexOf("embed") > -1){
            window.appConfig.openAboutThis = false;
            window.appConfig.comments = false;
            $(".data-comments").remove();
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