// view for a legislator
App.Views.Legislator = Backbone.View.extend({

    tagName: 'div',

    className: 'row',

    template: template('legislator-results-template'),

    events: {
        'click a': 'getAnchorValue',
    },

    getAnchorValue: function(obj){
        var bioguide_id = $(obj.target).attr('id');
        var legislatorRouter = new App.Router();
        legislatorRouter.navigate('&legislator=' + bioguide_id, {
            trigger: true,
            replace: false
        });
    },

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