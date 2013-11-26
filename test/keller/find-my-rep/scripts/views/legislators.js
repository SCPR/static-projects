// view for a legislator
App.Views.Legislator = Backbone.View.extend({

    tagName: 'div',

    //className: 'legislator col-xs-12 col-sm-12 col-md-12 col-lg-12',

    className: 'row',

    template: template('legislator-results-template'),

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }

});

// view for all legislators
App.Views.Legislators = Backbone.View.extend({

    tagName: 'div',

    id: 'legislators-container',

    render: function(){

        $('.progress').addClass('hidden');

        this.collection.each(function(legislator){
            var legislatorView = new App.Views.Legislator({model: legislator});
            this.$el.append(legislatorView.render().el);
        }, this);
        return this;
    }
});