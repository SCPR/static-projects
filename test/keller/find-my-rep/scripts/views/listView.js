App.Views.Legislator = Backbone.View.extend({
    tagName: "li",

    template: template('list-template'),

    events: {
        'click a': 'navigate'
    },

    navigate: function(e){
        e.preventDefault();
        var legiFirstName = this.model.attributes.first_name.toLowerCase();
        var legiLastName = this.model.attributes.last_name.toLowerCase();
        var legiId = this.model.attributes.votesmart_id;
        var legiParams = legiFirstName + '-' + legiLastName + '-' + legiId;
        window.app.navigate('#legislator/' + legiParams, {
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
    tagName: "ul",

    id: 'legislators-list',

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