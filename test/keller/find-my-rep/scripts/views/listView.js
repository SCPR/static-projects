App.Views.Legislator = Backbone.View.extend({
    tagName: "div",

    className: "col-xs-12 col-sm-4 col-md-4 col-lg-4",

    template: template('list-template'),

    events: {
        'click a': 'navigate'
    },

    navigate: function(e){
        e.preventDefault();
        var legiChamber = this.model.attributes.chamber.toLowerCase();
        var legiStateName = this.model.attributes.state_name.replace(' ', '-').toLowerCase();
        var legiFirstName = this.model.attributes.first_name.toLowerCase();
        var legiLastName = this.model.attributes.last_name.toLowerCase();
        var legiId = this.model.attributes.votesmart_id;
        var legislatorParams = legiId + '-' + legiFirstName + '-' + legiLastName;
        window.app.navigate('#legislators/' + legiChamber + '/' + legiStateName + '/' + legislatorParams, {
            trigger: true,
            replace: false,
        });
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

App.Views.Legislators = Backbone.View.extend({
    tagName: "div",

    className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

    initialize: function(){
        this.collection.on("reset", this.render, this);
    },

    render: function(){
        $('.progress').addClass('hidden');
        this.collection.each(function(item){
            var legislatorView = new App.Views.Legislator({
                model: item
            });
            this.$el.append(legislatorView.render().el);
        }, this);
        return this;
    }
});