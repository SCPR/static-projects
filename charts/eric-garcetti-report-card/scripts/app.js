String.prototype.toProperCase = function(){
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

App.Models.Category = Backbone.Model.extend({});

App.Collections.Categories = Backbone.Collection.extend({
    model: App.Models.Category,
    url: "data/data.json",
    comparator: function(model) {
        return model.get("grade");
    }
});

App.Router = Backbone.Router.extend({
    initialize: function(){
        window.reportCardCollection = new App.Collections.Categories();
        window.reportCardCollection.fetch({
            async: false,
        });
    },

    routes: {
        "": "renderApplicationWrapper",
    },

    renderApplicationWrapper: function(){
        this.applicationWrapper = new App.Views.ApplicationWrapper();
        return this.applicationWrapper;
    },
});

App.Views.VisualsApplication = Backbone.View.extend({
    template: template("templates/data-visuals.html"),

    initialize: function(){
        this.render(window.reportCardCollection);
    },

    render: function(reportCardCollection){
        reportCardCollection = reportCardCollection.sort();
        $(".data-visuals").html(_.template(this.template, {
            collection: reportCardCollection.toJSON()
        }));
    }

});
