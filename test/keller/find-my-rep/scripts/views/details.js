// view for a legislator
App.Views.Details = Backbone.View.extend({

    tagName: 'div',

    //className: 'legislator col-xs-12 col-sm-12 col-md-12 col-lg-12',

    //className: 'row',

    template: template('legislator-details-template'),

    initialize: function(){
        this.render();
    },

    render: function(){

        this.$el.html((this.template));
        return this;
    }

});