App.Views.Legislator = Backbone.View.extend({
    tagName: "li",

    template: template('list-template'),

    events: {
        'click a': 'navigate'
    },

    navigate: function(e){
        e.preventDefault();
        window.app.navigate('#legislator/' + this.model.attributes.votesmart_id, {
            trigger: true,
            replace: false,
        });

        console.log(this.model.attributes.votesmart_id);

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


    /*
    initialize: function(){
        this.collection.on("reset", this.render, this);
    },

    render: function(){
        $('.progress').addClass('hidden');
        this.addAll();
    },

    addOne: function(item){
        var legislatorView = new App.Views.Legislator({
            model: item
        });
        this.$el.append(legislatorView.render().el);
    },

    addAll: function(){
        this.collection.forEach(this.addOne, this);
    }
    */


});